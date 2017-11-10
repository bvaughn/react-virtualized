import React from 'react';
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
});
