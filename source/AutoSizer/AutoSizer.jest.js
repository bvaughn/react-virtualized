/* global Element, Event */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {render} from '../TestUtils';
import AutoSizer from './AutoSizer';

function DefaultChildComponent({height, width, foo, bar}) {
  return (
    <div>{`width:${width}, height:${height}, foo:${foo}, bar:${bar}`}</div>
  );
}

describe('AutoSizer', () => {
  function getMarkup({
    bar = 123,
    ChildComponent = DefaultChildComponent,
    className = undefined,
    defaultHeight = undefined,
    defaultWidth = undefined,
    disableHeight = false,
    disableWidth = false,
    foo = 456,
    height = 100,
    onResize,
    paddingBottom = 0,
    paddingLeft = 0,
    paddingRight = 0,
    paddingTop = 0,
    style = undefined,
    width = 200,
  } = {}) {
    const wrapperStyle = {
      boxSizing: 'border-box',
      height,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      width,
    };

    mockOffsetSize(width, height);

    return (
      <div style={wrapperStyle}>
        <AutoSizer
          className={className}
          defaultHeight={defaultHeight}
          defaultWidth={defaultWidth}
          disableHeight={disableHeight}
          disableWidth={disableWidth}
          onResize={onResize}
          style={style}>
          {({height, width}) => (
            <ChildComponent
              width={disableWidth ? undefined : width}
              height={disableHeight ? undefined : height}
              bar={bar}
              foo={foo}
            />
          )}
        </AutoSizer>
      </div>
    );
  }

  // AutoSizer uses offsetWidth and offsetHeight.
  // Jest runs in JSDom which doesn't support measurements APIs.
  function mockOffsetSize(width, height) {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: height,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: width,
    });
  }

  it('should relay properties to ChildComponent or React child', () => {
    const rendered = findDOMNode(render(getMarkup()));
    expect(rendered.textContent).toContain('foo:456');
    expect(rendered.textContent).toContain('bar:123');
  });

  it('should set the correct initial width and height of ChildComponent or React child', () => {
    const rendered = findDOMNode(render(getMarkup()));
    expect(rendered.textContent).toContain('height:100');
    expect(rendered.textContent).toContain('width:200');
  });

  it('should account for padding when calculating the available width and height', () => {
    const rendered = findDOMNode(
      render(
        getMarkup({
          paddingBottom: 10,
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 15,
        }),
      ),
    );
    expect(rendered.textContent).toContain('height:75');
    expect(rendered.textContent).toContain('width:192');
  });

  it('should not update :width if :disableWidth is true', () => {
    const rendered = findDOMNode(render(getMarkup({disableWidth: true})));
    expect(rendered.textContent).toContain('height:100');
    expect(rendered.textContent).toContain('width:undefined');
  });

  it('should not update :height if :disableHeight is true', () => {
    const rendered = findDOMNode(render(getMarkup({disableHeight: true})));
    expect(rendered.textContent).toContain('height:undefined');
    expect(rendered.textContent).toContain('width:200');
  });

  async function simulateResize({element, height, width}) {
    mockOffsetSize(width, height);

    // Trigger detectElementResize library by faking a scroll event
    // TestUtils Simulate doesn't work here in JSDom so we manually dispatch
    const trigger = element.querySelector('.contract-trigger');
    trigger.dispatchEvent(new Event('scroll'));

    // Allow requestAnimationFrame to be invoked before continuing
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  it('should update :height after a resize event', async done => {
    const rendered = findDOMNode(
      render(
        getMarkup({
          height: 100,
          width: 200,
        }),
      ),
    );
    expect(rendered.textContent).toContain('height:100');
    expect(rendered.textContent).toContain('width:200');
    await simulateResize({element: rendered, height: 400, width: 300});
    expect(rendered.textContent).toContain('height:400');
    expect(rendered.textContent).toContain('width:300');
    done();
  });

  describe('onResize and (re)render', () => {
    it('should trigger when size changes', async done => {
      const onResize = jest.fn();
      const ChildComponent = jest
        .fn()
        .mockImplementation(DefaultChildComponent);
      const rendered = findDOMNode(
        render(
          getMarkup({
            ChildComponent,
            height: 100,
            onResize,
            width: 200,
          }),
        ),
      );
      ChildComponent.mockClear(); // TODO Improve initial check in version 10; see AutoSizer render()
      expect(onResize).toHaveBeenCalledTimes(1);
      await simulateResize({element: rendered, height: 400, width: 300});
      expect(ChildComponent).toHaveBeenCalledTimes(1);
      expect(onResize).toHaveBeenCalledTimes(2);
      done();
    });

    it('should only trigger when height changes for disableWidth == true', async done => {
      const onResize = jest.fn();
      const ChildComponent = jest
        .fn()
        .mockImplementation(DefaultChildComponent);
      const rendered = findDOMNode(
        render(
          getMarkup({
            ChildComponent,
            disableWidth: true,
            height: 100,
            onResize,
            width: 200,
          }),
        ),
      );
      ChildComponent.mockClear(); // TODO Improve initial check in version 10; see AutoSizer render()
      expect(onResize).toHaveBeenCalledTimes(1);
      await simulateResize({element: rendered, height: 100, width: 300});
      expect(ChildComponent).toHaveBeenCalledTimes(0);
      expect(onResize).toHaveBeenCalledTimes(1);
      await simulateResize({element: rendered, height: 200, width: 300});
      expect(ChildComponent).toHaveBeenCalledTimes(1);
      expect(onResize).toHaveBeenCalledTimes(2);
      done();
    });

    it('should only trigger when width changes for disableHeight == true', async done => {
      const onResize = jest.fn();
      const ChildComponent = jest
        .fn()
        .mockImplementation(DefaultChildComponent);
      const rendered = findDOMNode(
        render(
          getMarkup({
            ChildComponent,
            disableHeight: true,
            height: 100,
            onResize,
            width: 200,
          }),
        ),
      );
      ChildComponent.mockClear(); // TODO Improve initial check in version 10; see AutoSizer render()
      expect(onResize).toHaveBeenCalledTimes(1);
      await simulateResize({element: rendered, height: 200, width: 200});
      expect(ChildComponent).toHaveBeenCalledTimes(0);
      expect(onResize).toHaveBeenCalledTimes(1);
      await simulateResize({element: rendered, height: 200, width: 300});
      expect(ChildComponent).toHaveBeenCalledTimes(1);
      expect(onResize).toHaveBeenCalledTimes(2);
      done();
    });
  });

  describe('className and style', () => {
    it('should use a custom :className if specified', () => {
      const rendered = findDOMNode(render(getMarkup({className: 'foo'})));
      expect(rendered.firstChild.className).toContain('foo');
    });

    it('should use a custom :style if specified', () => {
      const style = {backgroundColor: 'red'};
      const rendered = findDOMNode(render(getMarkup({style})));
      expect(rendered.firstChild.style.backgroundColor).toEqual('red');
    });
  });
});
