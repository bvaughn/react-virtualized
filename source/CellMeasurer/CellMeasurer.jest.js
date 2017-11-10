/* global Element */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {render} from '../TestUtils';
import CellMeasurer from './CellMeasurer';
import CellMeasurerCache, {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
} from './CellMeasurerCache';

// Accounts for the fact that JSDom doesn't support measurements.
function mockClientWidthAndHeight({height, width}) {
  Object.defineProperty(Element.prototype, 'offsetHeight', {
    configurable: true,
    get: jest.fn().mockReturnValue(height),
  });

  Object.defineProperty(Element.prototype, 'offsetWidth', {
    configurable: true,
    get: jest.fn().mockReturnValue(width),
  });
}

function createParent({cache, invalidateCellSizeAfterRender = jest.fn()} = {}) {
  return {
    invalidateCellSizeAfterRender,
    props: {
      deferredMeasurementCache: cache,
    },
  };
}

function renderHelper(
  {
    cache = new CellMeasurerCache({
      fixedWidth: true,
    }),
    children = <div />,
    parent,
  } = {},
) {
  render(
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      parent={parent}
      rowIndex={0}
      style={{}}>
      {children}
    </CellMeasurer>,
  );
}

describe('CellMeasurer', () => {
  it('componentDidMount() should measure content that is not already in the cache', () => {
    const cache = new CellMeasurerCache({
      fixedWidth: true,
    });
    const parent = createParent({cache});

    mockClientWidthAndHeight({
      height: 20,
      width: 100,
    });

    const offsetHeightMock = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'offsetHeight',
    ).get;
    const offsetWidthMock = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'offsetWidth',
    ).get;

    expect(offsetHeightMock.mock.calls).toHaveLength(0);
    expect(offsetWidthMock.mock.calls).toHaveLength(0);
    expect(cache.has(0, 0)).toBe(false);

    renderHelper({cache, parent});

    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalled();
    expect(offsetHeightMock.mock.calls).toHaveLength(1);
    expect(offsetWidthMock.mock.calls).toHaveLength(1);
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
  });

  it('componentDidMount() should not measure content that is already in the cache', () => {
    const cache = new CellMeasurerCache({
      fixedWidth: true,
    });
    cache.set(0, 0, 100, 20);

    const parent = createParent({cache});

    mockClientWidthAndHeight({
      height: 20,
      width: 100,
    });

    expect(cache.has(0, 0)).toBe(true);

    renderHelper({cache, parent});

    const offsetHeightMock = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'offsetHeight',
    ).get;
    const offsetWidthMock = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'offsetWidth',
    ).get;

    expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
    expect(offsetHeightMock.mock.calls).toHaveLength(0);
    expect(offsetWidthMock.mock.calls).toHaveLength(0);
  });

  it('componentDidUpdate() should measure content that is not already in the cache', () => {
    const cache = new CellMeasurerCache({
      fixedWidth: true,
    });
    const parent = createParent({cache});

    renderHelper({cache, parent});

    cache.clear(0, 0);
    parent.invalidateCellSizeAfterRender.mockReset();

    expect(cache.has(0, 0)).toBe(false);
    expect(cache.getWidth(0, 0)).toBe(DEFAULT_WIDTH);
    expect(cache.getHeight(0, 0)).toBe(DEFAULT_HEIGHT);

    mockClientWidthAndHeight({
      height: 20,
      width: 100,
    });

    const offsetHeightMock = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'offsetHeight',
    ).get;
    const offsetWidthMock = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'offsetWidth',
    ).get;

    renderHelper({cache, parent});

    expect(cache.has(0, 0)).toBe(true);

    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalled();
    expect(offsetHeightMock.mock.calls).toHaveLength(1);
    expect(offsetWidthMock.mock.calls).toHaveLength(1);
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
  });

  it('componentDidUpdate() should not measure content that is already in the cache', () => {
    const cache = new CellMeasurerCache({
      fixedWidth: true,
    });
    cache.set(0, 0, 100, 20);

    const parent = createParent({cache});

    expect(cache.has(0, 0)).toBe(true);

    mockClientWidthAndHeight({
      height: 20,
      width: 100,
    });

    renderHelper({cache, parent});
    renderHelper({cache, parent});

    const offsetHeightMock = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'offsetHeight',
    ).get;
    const offsetWidthMock = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'offsetWidth',
    ).get;

    expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
    expect(offsetHeightMock.mock.calls).toHaveLength(0);
    expect(offsetWidthMock.mock.calls).toHaveLength(0);
  });

  it('componentDidUpdate() should pass a :measure param to a function child', () => {
    const cache = new CellMeasurerCache({
      fixedWidth: true,
    });

    const children = jest.fn();
    children.mockReturnValue(<div />);

    renderHelper({cache, children});

    expect(children).toHaveBeenCalled();

    const params = children.mock.calls[0][0];

    expect(typeof params.measure === 'function').toBe(true);
  });

  it('should still update cache without a parent Grid', () => {
    spyOn(console, 'warn');

    mockClientWidthAndHeight({
      height: 20,
      width: 100,
    });

    const cache = new CellMeasurerCache({
      fixedWidth: true,
    });

    renderHelper({cache}); // No parent Grid

    expect(cache.has(0, 0)).toBe(true);

    expect(console.warn).not.toHaveBeenCalled();
  });

  // See issue #593
  it('should explicitly set width/height style to "auto" before re-measuring', () => {
    const cache = new CellMeasurerCache({
      fixedWidth: true,
    });
    const parent = createParent({cache});
    const child = jest.fn();
    child.mockImplementation(() => <div style={{width: 100, height: 30}} />);

    let measurer;
    const node = findDOMNode(
      render(
        <CellMeasurer
          ref={ref => {
            measurer = ref;
          }}
          cache={cache}
          columnIndex={0}
          parent={parent}
          rowIndex={0}
          style={{}}>
          {child}
        </CellMeasurer>,
      ),
    );

    const styleHeights = [30];
    const styleWidths = [100];
    Object.defineProperties(node.style, {
      height: {
        get: () => styleHeights[styleHeights.length - 1],
        set: value => styleHeights.push(value),
      },
      width: {
        get: () => styleWidths[styleWidths.length - 1],
        set: value => styleWidths.push(value),
      },
    });

    const {height, width} = measurer._getCellMeasurements(node);
    expect(height).toBeGreaterThan(0);
    expect(width).toBeGreaterThan(0);
    expect(styleHeights).toEqual([30, 'auto', 30]);
    expect(styleWidths).toEqual([100, 100]);
  });

  // See issue #660
  it('should reset width/height style values after measuring with style "auto"', () => {
    const cache = new CellMeasurerCache({
      fixedHeight: true,
    });
    const parent = createParent({cache});
    const child = jest.fn();
    child.mockImplementation(() => <div style={{width: 100, height: 30}} />);

    const node = findDOMNode(
      render(
        <CellMeasurer
          cache={cache}
          columnIndex={0}
          parent={parent}
          rowIndex={0}
          style={{}}>
          {child}
        </CellMeasurer>,
      ),
    );

    node.style.width = 200;
    node.style.height = 60;

    child.mock.calls[0][0].measure();

    expect(node.style.height).toBe('30px');
    expect(node.style.width).toBe('100px');
  });
});
