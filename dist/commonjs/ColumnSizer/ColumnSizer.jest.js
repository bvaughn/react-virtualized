'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _TestUtils = require('../TestUtils');

var _ColumnSizer = require('./ColumnSizer');

var _ColumnSizer2 = _interopRequireDefault(_ColumnSizer);

var _Grid = require('../Grid');

var _Grid2 = _interopRequireDefault(_Grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('ColumnSizer', function () {
  function getMarkup() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$columnMinWidth = _ref.columnMinWidth,
        columnMinWidth = _ref$columnMinWidth === undefined ? undefined : _ref$columnMinWidth,
        _ref$columnMaxWidth = _ref.columnMaxWidth,
        columnMaxWidth = _ref$columnMaxWidth === undefined ? undefined : _ref$columnMaxWidth,
        _ref$columnCount = _ref.columnCount,
        columnCount = _ref$columnCount === undefined ? 10 : _ref$columnCount,
        _ref$width = _ref.width,
        width = _ref$width === undefined ? 200 : _ref$width;

    function cellRenderer(_ref2) {
      var columnIndex = _ref2.columnIndex,
          key = _ref2.key,
          rowIndex = _ref2.rowIndex,
          style = _ref2.style;

      return _react2.default.createElement(
        'div',
        { className: 'gridItem', key: key, style: style },
        'row:' + rowIndex + ', column:' + columnIndex
      );
    }

    return _react2.default.createElement(
      _ColumnSizer2.default,
      {
        columnMinWidth: columnMinWidth,
        columnMaxWidth: columnMaxWidth,
        columnCount: columnCount,
        width: width },
      function (_ref3) {
        var adjustedWidth = _ref3.adjustedWidth,
            columnWidth = _ref3.columnWidth,
            registerChild = _ref3.registerChild;
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_Grid2.default, {
            columnCount: columnCount,
            columnWidth: columnWidth,
            height: 50,
            ref: registerChild,
            cellRenderer: cellRenderer,
            rowHeight: 50,
            rowCount: 1,
            width: adjustedWidth
          }),
          _react2.default.createElement(
            'div',
            { className: 'debug' },
            'adjustedWidth:' + adjustedWidth + ' columnWidth:' + columnWidth
          )
        );
      }
    );
  }

  it('should distribute column widths evenly if no min/max boundaries have been set', function () {
    var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
    expect(rendered.querySelector('.debug').textContent).toContain('columnWidth:20');
  });

  it('should respect :columnMaxWidth if specified', function () {
    var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
      columnMaxWidth: 10
    })));
    expect(rendered.querySelector('.debug').textContent).toContain('columnWidth:10');
  });

  it('should respect :columnMinWidth if specified', function () {
    var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
      columnMinWidth: 30
    })));
    expect(rendered.querySelector('.debug').textContent).toContain('columnWidth:30');
  });

  describe('recomputeGridSize', function () {
    function helper(updatedProps, expectedTextContent) {
      var renderedA = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      expect(renderedA.querySelector('.debug').textContent).toContain('columnWidth:20');

      var renderedB = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup(updatedProps)));
      expect(renderedB.querySelector('.debug').textContent).toContain(expectedTextContent);
    }

    it('should recompute metadata sizes if :columnMinWidth changes', function () {
      helper({ columnMinWidth: 30 }, 'columnWidth:30');
    });

    it('should recompute metadata sizes if :columnMaxWidth changes', function () {
      helper({ columnMaxWidth: 15 }, 'columnWidth:15');
    });

    it('should recompute metadata sizes if :width changes', function () {
      helper({ width: 300 }, 'columnWidth:30');
    });

    it('should recompute metadata sizes if :columnCount changes', function () {
      helper({ columnCount: 2 }, 'columnWidth:100');
    });
  });

  it('should pass the :width as :adjustedWidth if columns require more than the :width to be displayed', function () {
    var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
      columnMinWidth: 30
    })));
    expect(rendered.querySelector('.debug').textContent).toContain('adjustedWidth:200');
  });

  it('should pass an :adjustedWidth if columns require less than the :width to be displayed', function () {
    var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
      columnMaxWidth: 10
    })));
    expect(rendered.querySelector('.debug').textContent).toContain('adjustedWidth:100');
  });

  it('should error if the registered child is not a Grid or a MultiGrid', function () {
    spyOn(console, 'error');

    expect(function () {
      (0, _TestUtils.render)(_react2.default.createElement(
        _ColumnSizer2.default,
        {
          columnMinWidth: 100,
          columnMaxWidth: 100,
          columnCount: 100,
          width: 100 },
        function (_ref4) {
          var registerChild = _ref4.registerChild;
          return _react2.default.createElement('div', { ref: registerChild });
        }
      ));
    }).toThrow();
  });
});