'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _defaultCellDataGetter = require('./defaultCellDataGetter');

var _defaultCellDataGetter2 = _interopRequireDefault(_defaultCellDataGetter);

var _defaultCellRenderer = require('./defaultCellRenderer');

var _defaultCellRenderer2 = _interopRequireDefault(_defaultCellRenderer);

var _defaultHeaderRenderer = require('./defaultHeaderRenderer');

var _defaultHeaderRenderer2 = _interopRequireDefault(_defaultHeaderRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Column', function () {
  var rowData = _immutable2.default.Map({
    foo: 'Foo',
    bar: 1
  });

  describe('defaultCellDataGetter', function () {
    it('should return a value for specified attributes', function () {
      expect((0, _defaultCellDataGetter2.default)({
        dataKey: 'foo',
        rowData: rowData
      })).toEqual('Foo');
      expect((0, _defaultCellDataGetter2.default)({
        dataKey: 'bar',
        rowData: rowData
      })).toEqual(1);
    });

    it('should return undefined for missing attributes', function () {
      expect((0, _defaultCellDataGetter2.default)({
        dataKey: 'baz',
        rowData: rowData
      })).toEqual(undefined);
    });
  });

  describe('defaultCellRenderer', function () {
    it('should render a value for specified attributes', function () {
      expect((0, _defaultCellRenderer2.default)({
        cellData: 'Foo',
        dataKey: 'foo',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('Foo');
      expect((0, _defaultCellRenderer2.default)({
        cellData: 1,
        dataKey: 'bar',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('1');
    });

    it('should render empty string for null or missing attributes', function () {
      expect((0, _defaultCellRenderer2.default)({
        cellData: null,
        dataKey: 'baz',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('');
      expect((0, _defaultCellRenderer2.default)({
        cellData: undefined,
        dataKey: 'baz',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('');
    });
  });

  describe('defaultHeaderRenderer', function () {
    it('should render a value for specified attributes', function () {
      expect((0, _defaultHeaderRenderer2.default)({
        dataKey: 'foo',
        label: 'squirrel'
      })[0].props.children).toEqual('squirrel');

      var label = _react2.default.createElement(
        'div',
        { className: 'rabbit' },
        'Rabbit'
      );
      expect((0, _defaultHeaderRenderer2.default)({
        dataKey: 'bar',
        label: label
      })[0].props.children).toEqual(label);
    });

    it('should render empty string for null or missing attributes', function () {
      expect((0, _defaultHeaderRenderer2.default)({
        dataKey: 'foo',
        label: null
      })[0].props.children).toBeNull();
      expect((0, _defaultHeaderRenderer2.default)({
        dataKey: 'bar',
        label: undefined
      })[0].props.children).toBeUndefined();
    });
  });
});