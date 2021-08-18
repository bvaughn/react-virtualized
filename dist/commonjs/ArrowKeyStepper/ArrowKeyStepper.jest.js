"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _TestUtils = require("../TestUtils");

var _ArrowKeyStepper = _interopRequireDefault(require("./ArrowKeyStepper"));

var _testUtils = require("react-dom/test-utils");

function renderTextContent(scrollToColumn, scrollToRow) {
  return "scrollToColumn:".concat(scrollToColumn, ", scrollToRow:").concat(scrollToRow);
}

function ChildComponent(_ref) {
  var scrollToColumn = _ref.scrollToColumn,
      scrollToRow = _ref.scrollToRow;
  return React.createElement("div", null, renderTextContent(scrollToColumn, scrollToRow));
}

describe('ArrowKeyStepper', function () {
  function renderHelper() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var onSectionRenderedCallback;
    var component = (0, _TestUtils.render)(React.createElement(_ArrowKeyStepper["default"], (0, _extends2["default"])({
      columnCount: 10,
      mode: "edges",
      rowCount: 10
    }, props), function (_ref2) {
      var onSectionRendered = _ref2.onSectionRendered,
          scrollToColumn = _ref2.scrollToColumn,
          scrollToRow = _ref2.scrollToRow;
      onSectionRenderedCallback = onSectionRendered;
      return React.createElement(ChildComponent, {
        scrollToColumn: scrollToColumn,
        scrollToRow: scrollToRow
      });
    }));
    var node = (0, _reactDom.findDOMNode)(component);
    return {
      component: component,
      node: node,
      onSectionRendered: onSectionRenderedCallback
    };
  }

  function assertCurrentScrollTo(node, scrollToColumn, scrollToRow) {
    expect(node.textContent).toEqual(renderTextContent(scrollToColumn, scrollToRow));
  }

  it('should use a custom :className if one is specified', function () {
    var _renderHelper = renderHelper({
      className: 'foo'
    }),
        node = _renderHelper.node;

    expect(node.className).toEqual('foo');
  });
  it('should update :scrollToColumn and :scrollToRow in response to arrow keys', function () {
    var _renderHelper2 = renderHelper(),
        node = _renderHelper2.node;

    assertCurrentScrollTo(node, 0, 0);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowDown'
    });

    assertCurrentScrollTo(node, 0, 1);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowRight'
    });

    assertCurrentScrollTo(node, 1, 1);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowUp'
    });

    assertCurrentScrollTo(node, 1, 0);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowLeft'
    });

    assertCurrentScrollTo(node, 0, 0);
  });
  it('should not scroll past the row and column boundaries provided', function () {
    var _renderHelper3 = renderHelper({
      columnCount: 2,
      rowCount: 2
    }),
        node = _renderHelper3.node;

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowDown'
    });

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowDown'
    });

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowDown'
    });

    assertCurrentScrollTo(node, 0, 1);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowUp'
    });

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowUp'
    });

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowUp'
    });

    assertCurrentScrollTo(node, 0, 0);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowRight'
    });

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowRight'
    });

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowRight'
    });

    assertCurrentScrollTo(node, 1, 0);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowLeft'
    });

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowLeft'
    });

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowLeft'
    });

    assertCurrentScrollTo(node, 0, 0);
  });
  it('should accept initial :scrollToColumn and :scrollToRow values via props', function () {
    var _renderHelper4 = renderHelper({
      mode: 'cells',
      scrollToColumn: 2,
      scrollToRow: 4
    }),
        node = _renderHelper4.node;

    assertCurrentScrollTo(node, 2, 4);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowDown'
    });

    assertCurrentScrollTo(node, 2, 5);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowRight'
    });

    assertCurrentScrollTo(node, 3, 5);
  });
  it('should accept updated :scrollToColumn and :scrollToRow values via props', function () {
    var _renderHelper5 = renderHelper({
      mode: 'cells',
      scrollToColumn: 2,
      scrollToRow: 4
    }),
        node = _renderHelper5.node;

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowDown'
    });

    assertCurrentScrollTo(node, 2, 5);
    renderHelper({
      mode: 'cells',
      scrollToColumn: 1,
      scrollToRow: 1
    });

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowRight'
    });

    assertCurrentScrollTo(node, 2, 1);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowDown'
    });

    assertCurrentScrollTo(node, 2, 2);
  });
  it('should accept updated :scrollToColumn and :scrollToRow values via setScrollIndexes()', function () {
    var _renderHelper6 = renderHelper({
      mode: 'cells',
      scrollToColumn: 2,
      scrollToRow: 4
    }),
        component = _renderHelper6.component,
        node = _renderHelper6.node;

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowDown'
    });

    assertCurrentScrollTo(node, 2, 5);
    component.setScrollIndexes({
      scrollToColumn: 1,
      scrollToRow: 1
    });

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowRight'
    });

    assertCurrentScrollTo(node, 2, 1);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowDown'
    });

    assertCurrentScrollTo(node, 2, 2);
  });
  it('should not update :scrollToColumn or :scrollToRow when :disabled', function () {
    var _renderHelper7 = renderHelper({
      disabled: true
    }),
        node = _renderHelper7.node;

    assertCurrentScrollTo(node, 0, 0);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowDown'
    });

    assertCurrentScrollTo(node, 0, 0);

    _testUtils.Simulate.keyDown(node, {
      key: 'ArrowRight'
    });

    assertCurrentScrollTo(node, 0, 0);
  });
  it('should call :onScrollToChange for key down', function () {
    [true, false].forEach(function () {
      var onScrollToChange = jest.fn();

      var _renderHelper8 = renderHelper({
        isControlled: true,
        onScrollToChange: onScrollToChange
      }),
          node = _renderHelper8.node;

      expect(onScrollToChange.mock.calls).toHaveLength(0);

      _testUtils.Simulate.keyDown(node, {
        key: 'ArrowDown'
      });

      expect(onScrollToChange.mock.calls).toHaveLength(1);
      var _onScrollToChange$moc = onScrollToChange.mock.calls[0][0],
          scrollToColumn = _onScrollToChange$moc.scrollToColumn,
          scrollToRow = _onScrollToChange$moc.scrollToRow;
      expect(scrollToColumn).toEqual(0);
      expect(scrollToRow).toEqual(1);
    });
  });
  it('should not call :onScrollToChange for prop update', function () {
    var numCalls = 0;

    var onScrollToChange = function onScrollToChange() {
      numCalls++;
    };

    var _renderHelper9 = renderHelper({
      onScrollToChange: onScrollToChange,
      scrollToColumn: 0,
      scrollToRow: 0
    }),
        node = _renderHelper9.node;

    renderHelper({
      isControlled: true,
      onScrollToChange: onScrollToChange,
      node: node,
      scrollToColumn: 0,
      scrollToRow: 1
    });
    expect(numCalls).toEqual(0);
  });
  describe('mode === "edges"', function () {
    it('should update :scrollToColumn and :scrollToRow relative to the most recent :onSectionRendered event', function () {
      var _renderHelper10 = renderHelper(),
          node = _renderHelper10.node,
          onSectionRendered = _renderHelper10.onSectionRendered;

      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 0,
        columnStopIndex: 4,
        rowStartIndex: 4,
        rowStopIndex: 6
      });

      _testUtils.Simulate.keyDown(node, {
        key: 'ArrowDown'
      });

      assertCurrentScrollTo(node, 0, 7);
      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 5,
        columnStopIndex: 10,
        rowStartIndex: 2,
        rowStopIndex: 4
      });

      _testUtils.Simulate.keyDown(node, {
        key: 'ArrowUp'
      });

      assertCurrentScrollTo(node, 0, 1);
      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 4,
        columnStopIndex: 8,
        rowStartIndex: 5,
        rowStopIndex: 10
      });

      _testUtils.Simulate.keyDown(node, {
        key: 'ArrowRight'
      });

      assertCurrentScrollTo(node, 9, 1);
      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 2,
        columnStopIndex: 4,
        rowStartIndex: 2,
        rowStopIndex: 4
      });

      _testUtils.Simulate.keyDown(node, {
        key: 'ArrowLeft'
      });

      assertCurrentScrollTo(node, 1, 1);
    });
  });
  describe('mode === "cells"', function () {
    it('should update :scrollToColumn and :scrollToRow relative to the most recent :onSectionRendered event', function () {
      var _renderHelper11 = renderHelper({
        mode: 'cells',
        scrollToColumn: 5,
        scrollToRow: 5
      }),
          node = _renderHelper11.node,
          onSectionRendered = _renderHelper11.onSectionRendered;

      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 10,
        columnStopIndex: 10,
        rowStartIndex: 15,
        rowStopIndex: 15
      });

      _testUtils.Simulate.keyDown(node, {
        key: 'ArrowUp'
      });

      assertCurrentScrollTo(node, 5, 4);

      _testUtils.Simulate.keyDown(node, {
        key: 'ArrowDown'
      });

      assertCurrentScrollTo(node, 5, 5);
      onSectionRendered({
        // Simulate a scroll
        columnStartIndex: 10,
        columnStopIndex: 10,
        rowStartIndex: 15,
        rowStopIndex: 15
      });

      _testUtils.Simulate.keyDown(node, {
        key: 'ArrowRight'
      });

      assertCurrentScrollTo(node, 6, 5);

      _testUtils.Simulate.keyDown(node, {
        key: 'ArrowLeft'
      });

      assertCurrentScrollTo(node, 5, 5);
    });
  });
});