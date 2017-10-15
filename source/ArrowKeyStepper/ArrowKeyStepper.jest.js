import React from 'react';
import {findDOMNode} from 'react-dom';
import {render} from '../TestUtils';
import ArrowKeyStepper from './ArrowKeyStepper';
import {Simulate} from 'react-dom/test-utils';

function renderTextContent(scrollToColumn, scrollToRow) {
  return `scrollToColumn:${scrollToColumn}, scrollToRow:${scrollToRow}`;
}

function ChildComponent({scrollToColumn, scrollToRow}) {
  return <div>{renderTextContent(scrollToColumn, scrollToRow)}</div>;
}

describe('ArrowKeyStepper', () => {
  function renderHelper(props = {}) {
    let onSectionRenderedCallback;

    const component = render(
      <ArrowKeyStepper columnCount={10} mode="edges" rowCount={10} {...props}>
        {({onSectionRendered, scrollToColumn, scrollToRow}) => {
          onSectionRenderedCallback = onSectionRendered;

          return (
            <ChildComponent
              scrollToColumn={scrollToColumn}
              scrollToRow={scrollToRow}
            />
          );
        }}
      </ArrowKeyStepper>,
    );
    const node = findDOMNode(component);

    return {
      component,
      node,
      onSectionRendered: onSectionRenderedCallback,
    };
  }

  function assertCurrentScrollTo(node, scrollToColumn, scrollToRow) {
    expect(node.textContent).toEqual(
      renderTextContent(scrollToColumn, scrollToRow),
    );
  }

  it('should use a custom :className if one is specified', () => {
    const {node} = renderHelper({className: 'foo'});
    expect(node.className).toEqual('foo');
  });

  it('should update :scrollToColumn and :scrollToRow in response to arrow keys', () => {
    const {node} = renderHelper();
    assertCurrentScrollTo(node, 0, 0);
    Simulate.keyDown(node, {key: 'ArrowDown'});
    assertCurrentScrollTo(node, 0, 1);
    Simulate.keyDown(node, {key: 'ArrowRight'});
    assertCurrentScrollTo(node, 1, 1);
    Simulate.keyDown(node, {key: 'ArrowUp'});
    assertCurrentScrollTo(node, 1, 0);
    Simulate.keyDown(node, {key: 'ArrowLeft'});
    assertCurrentScrollTo(node, 0, 0);
  });

  it('should not scroll past the row and column boundaries provided', () => {
    const {node} = renderHelper({
      columnCount: 2,
      rowCount: 2,
    });
    Simulate.keyDown(node, {key: 'ArrowDown'});
    Simulate.keyDown(node, {key: 'ArrowDown'});
    Simulate.keyDown(node, {key: 'ArrowDown'});
    assertCurrentScrollTo(node, 0, 1);
    Simulate.keyDown(node, {key: 'ArrowUp'});
    Simulate.keyDown(node, {key: 'ArrowUp'});
    Simulate.keyDown(node, {key: 'ArrowUp'});
    assertCurrentScrollTo(node, 0, 0);
    Simulate.keyDown(node, {key: 'ArrowRight'});
    Simulate.keyDown(node, {key: 'ArrowRight'});
    Simulate.keyDown(node, {key: 'ArrowRight'});
    assertCurrentScrollTo(node, 1, 0);
    Simulate.keyDown(node, {key: 'ArrowLeft'});
    Simulate.keyDown(node, {key: 'ArrowLeft'});
    Simulate.keyDown(node, {key: 'ArrowLeft'});
    assertCurrentScrollTo(node, 0, 0);
  });

  it('should accept initial :scrollToColumn and :scrollToRow values via props', () => {
    const {node} = renderHelper({
      mode: 'cells',
      scrollToColumn: 2,
      scrollToRow: 4,
    });
    assertCurrentScrollTo(node, 2, 4);
    Simulate.keyDown(node, {key: 'ArrowDown'});
    assertCurrentScrollTo(node, 2, 5);
    Simulate.keyDown(node, {key: 'ArrowRight'});
    assertCurrentScrollTo(node, 3, 5);
  });

  it('should accept updated :scrollToColumn and :scrollToRow values via props', () => {
    const {node} = renderHelper({
      mode: 'cells',
      scrollToColumn: 2,
      scrollToRow: 4,
    });
    Simulate.keyDown(node, {key: 'ArrowDown'});
    assertCurrentScrollTo(node, 2, 5);
    renderHelper({
      mode: 'cells',
      scrollToColumn: 1,
      scrollToRow: 1,
    });
    Simulate.keyDown(node, {key: 'ArrowRight'});
    assertCurrentScrollTo(node, 2, 1);
    Simulate.keyDown(node, {key: 'ArrowDown'});
    assertCurrentScrollTo(node, 2, 2);
  });

  it('should accept updated :scrollToColumn and :scrollToRow values via setScrollIndexes()', () => {
    const {component, node} = renderHelper({
      mode: 'cells',
      scrollToColumn: 2,
      scrollToRow: 4,
    });
    Simulate.keyDown(node, {key: 'ArrowDown'});
    assertCurrentScrollTo(node, 2, 5);
    component.setScrollIndexes({
      scrollToColumn: 1,
      scrollToRow: 1,
    });
    Simulate.keyDown(node, {key: 'ArrowRight'});
    assertCurrentScrollTo(node, 2, 1);
    Simulate.keyDown(node, {key: 'ArrowDown'});
    assertCurrentScrollTo(node, 2, 2);
  });

  it('should not update :scrollToColumn or :scrollToRow when :disabled', () => {
    const {node} = renderHelper({
      disabled: true,
    });
    assertCurrentScrollTo(node, 0, 0);
    Simulate.keyDown(node, {key: 'ArrowDown'});
    assertCurrentScrollTo(node, 0, 0);
    Simulate.keyDown(node, {key: 'ArrowRight'});
    assertCurrentScrollTo(node, 0, 0);
  });

  it('should call :onScrollToChange for key down', () => {
    [true, false].forEach(() => {
      const onScrollToChange = jest.fn();
      const {node} = renderHelper({
        isControlled: true,
        onScrollToChange,
      });

      expect(onScrollToChange.mock.calls).toHaveLength(0);

      Simulate.keyDown(node, {key: 'ArrowDown'});

      expect(onScrollToChange.mock.calls).toHaveLength(1);

      const {scrollToColumn, scrollToRow} = onScrollToChange.mock.calls[0][0];
      expect(scrollToColumn).toEqual(0);
      expect(scrollToRow).toEqual(1);
    });
  });

  it('should not call :onScrollToChange for prop update', () => {
    let numCalls = 0;
    const onScrollToChange = () => {
      numCalls++;
    };
    const {node} = renderHelper({
      onScrollToChange,
      scrollToColumn: 0,
      scrollToRow: 0,
    });

    renderHelper({
      isControlled: true,
      onScrollToChange,
      node,
      scrollToColumn: 0,
      scrollToRow: 1,
    });
    expect(numCalls).toEqual(0);
  });

  describe('mode === "edges"', () => {
    it('should update :scrollToColumn and :scrollToRow relative to the most recent :onSectionRendered event', () => {
      const {node, onSectionRendered} = renderHelper();
      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 0,
        columnStopIndex: 4,
        rowStartIndex: 4,
        rowStopIndex: 6,
      });
      Simulate.keyDown(node, {key: 'ArrowDown'});
      assertCurrentScrollTo(node, 0, 7);

      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 5,
        columnStopIndex: 10,
        rowStartIndex: 2,
        rowStopIndex: 4,
      });
      Simulate.keyDown(node, {key: 'ArrowUp'});
      assertCurrentScrollTo(node, 0, 1);

      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 4,
        columnStopIndex: 8,
        rowStartIndex: 5,
        rowStopIndex: 10,
      });
      Simulate.keyDown(node, {key: 'ArrowRight'});
      assertCurrentScrollTo(node, 9, 1);

      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 2,
        columnStopIndex: 4,
        rowStartIndex: 2,
        rowStopIndex: 4,
      });
      Simulate.keyDown(node, {key: 'ArrowLeft'});
      assertCurrentScrollTo(node, 1, 1);
    });
  });

  describe('mode === "cells"', () => {
    it('should update :scrollToColumn and :scrollToRow relative to the most recent :onSectionRendered event', () => {
      const {node, onSectionRendered} = renderHelper({
        mode: 'cells',
        scrollToColumn: 5,
        scrollToRow: 5,
      });

      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 10,
        columnStopIndex: 10,
        rowStartIndex: 15,
        rowStopIndex: 15,
      });
      Simulate.keyDown(node, {key: 'ArrowUp'});
      assertCurrentScrollTo(node, 5, 4);
      Simulate.keyDown(node, {key: 'ArrowDown'});
      assertCurrentScrollTo(node, 5, 5);

      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 10,
        columnStopIndex: 10,
        rowStartIndex: 15,
        rowStopIndex: 15,
      });
      Simulate.keyDown(node, {key: 'ArrowRight'});
      assertCurrentScrollTo(node, 6, 5);
      Simulate.keyDown(node, {key: 'ArrowLeft'});
      assertCurrentScrollTo(node, 5, 5);
    });
  });
});
