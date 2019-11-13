import * as React from 'react';
import {findDOMNode} from 'react-dom';
import {render} from '../TestUtils';
import ScrollSync from './ScrollSync';

function ChildComponent({
  clientHeight,
  clientWidth,
  scrollHeight,
  scrollLeft,
  scrollTop,
  scrollWidth,
}) {
  return (
    <div>
      {`clientHeight:${clientHeight}`}
      {`clientWidth:${clientWidth}`}
      {`scrollHeight:${scrollHeight}`}
      {`scrollLeft:${scrollLeft}`}
      {`scrollTop:${scrollTop}`}
      {`scrollWidth:${scrollWidth}`}
    </div>
  );
}

function getMarkup({renderFn, ...props}) {
  return (
    <ScrollSync>
      {params => <div>{renderFn && renderFn(params)}</div>}
    </ScrollSync>
  );
}

describe('ScrollSync', () => {
  it('should pass through an initial value of 0 for :scrollLeft and :scrollTop', () => {
    const component = render(
      <ScrollSync>
        {({
          clientHeight,
          clientWidth,
          scrollHeight,
          scrollLeft,
          scrollTop,
          scrollWidth,
        }) => (
          <ChildComponent
            clientHeight={clientHeight}
            clientWidth={clientWidth}
            scrollHeight={scrollHeight}
            scrollLeft={scrollLeft}
            scrollTop={scrollTop}
            scrollWidth={scrollWidth}
          />
        )}
      </ScrollSync>,
    );
    expect(findDOMNode(component).textContent).toContain('clientHeight:0');
    expect(findDOMNode(component).textContent).toContain('clientWidth:0');
    expect(findDOMNode(component).textContent).toContain('scrollHeight:0');
    expect(findDOMNode(component).textContent).toContain('scrollLeft:0');
    expect(findDOMNode(component).textContent).toContain('scrollTop:0');
    expect(findDOMNode(component).textContent).toContain('scrollWidth:0');
  });

  it('should update :scrollLeft and :scrollTop when :onScroll is called', () => {
    let onScroll;
    const component = render(
      <ScrollSync>
        {params => {
          onScroll = params.onScroll;
          return <ChildComponent {...params} />;
        }}
      </ScrollSync>,
    );
    onScroll({
      clientHeight: 400,
      clientWidth: 200,
      scrollHeight: 1000,
      scrollLeft: 50,
      scrollTop: 100,
      scrollWidth: 500,
    });
    expect(findDOMNode(component).textContent).toContain('clientHeight:400');
    expect(findDOMNode(component).textContent).toContain('clientWidth:200');
    expect(findDOMNode(component).textContent).toContain('scrollHeight:1000');
    expect(findDOMNode(component).textContent).toContain('scrollLeft:50');
    expect(findDOMNode(component).textContent).toContain('scrollTop:100');
    expect(findDOMNode(component).textContent).toContain('scrollWidth:500');
  });

  it('should warn on passing null or component without scrollToPosition function in registerChild', () => {
    const warnFn = jest.spyOn(console, 'warn');
    const renderFn = jest.fn();

    render(getMarkup({renderFn}));

    renderFn.mock.calls[0][0].registerChild({scroll: () => null});
    renderFn.mock.calls[0][0].registerChild({scrollToPosition: () => null});
    renderFn.mock.calls[0][0].registerChild(null);

    expect(warnFn).toHaveBeenCalledTimes(2);

    warnFn.mockRestore();
  });

  it('should allow passing multiple child elements containing scrollToPosition function with registerChild of children function param', () => {
    const scrollToPosition1 = jest.fn();
    const scrollToPosition2 = jest.fn();
    const scrollToPosition3 = jest.fn();
    const renderFn = jest.fn();

    render(getMarkup({renderFn}));

    renderFn.mock.calls[0][0].registerChild({
      scrollToPosition: scrollToPosition1,
    });
    renderFn.mock.calls[0][0].registerChild({
      scrollToPosition: scrollToPosition2,
    });
    renderFn.mock.calls[0][0].registerChild({
      scroll: scrollToPosition3,
    });

    expect(scrollToPosition1).not.toHaveBeenCalled();
    expect(scrollToPosition2).not.toHaveBeenCalled();
    expect(scrollToPosition3).not.toHaveBeenCalled();

    renderFn.mock.calls[0][0].onScroll({
      scrollTop: 100,
      scrollLeft: 50,
    });

    expect(scrollToPosition1).toHaveBeenCalledTimes(1);
    expect(scrollToPosition1).toHaveBeenCalledWith({
      scrollTop: 100,
      scrollLeft: 50,
    });

    expect(scrollToPosition2).toHaveBeenCalledTimes(1);
    expect(scrollToPosition2).toHaveBeenCalledWith({
      scrollTop: 100,
      scrollLeft: 50,
    });

    expect(scrollToPosition3).not.toHaveBeenCalled();
  });
});
