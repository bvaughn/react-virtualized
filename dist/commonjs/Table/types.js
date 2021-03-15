'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.bpfrpt_proptype_RowRendererParams = exports.bpfrpt_proptype_HeaderRendererParams = exports.bpfrpt_proptype_HeaderRowRendererParams = exports.bpfrpt_proptype_CellRendererParams = exports.bpfrpt_proptype_CellDataGetterParams = void 0;

var _propTypes = _interopRequireDefault(require('prop-types'));

var bpfrpt_proptype_CellDataGetterParams =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        columnData: _propTypes['default'].any,
        dataKey: _propTypes['default'].string.isRequired,
        rowData: function rowData(props, propName, componentName) {
          if (!Object.prototype.hasOwnProperty.call(props, propName)) {
            throw new Error(
              'Prop `'
                .concat(
                  propName,
                  "` has type 'any' or 'mixed', but was not provided to `",
                )
                .concat(componentName, '`. Pass undefined or any other value.'),
            );
          }
        },
      };
exports.bpfrpt_proptype_CellDataGetterParams = bpfrpt_proptype_CellDataGetterParams;
var bpfrpt_proptype_CellRendererParams =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        cellData: _propTypes['default'].any,
        columnData: _propTypes['default'].any,
        dataKey: _propTypes['default'].string.isRequired,
        rowData: function rowData(props, propName, componentName) {
          if (!Object.prototype.hasOwnProperty.call(props, propName)) {
            throw new Error(
              'Prop `'
                .concat(
                  propName,
                  "` has type 'any' or 'mixed', but was not provided to `",
                )
                .concat(componentName, '`. Pass undefined or any other value.'),
            );
          }
        },
        rowIndex: _propTypes['default'].number.isRequired,
      };
exports.bpfrpt_proptype_CellRendererParams = bpfrpt_proptype_CellRendererParams;
var bpfrpt_proptype_HeaderRowRendererParams =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        className: _propTypes['default'].string.isRequired,
        columns: _propTypes['default'].arrayOf(function(
          props,
          propName,
          componentName,
        ) {
          if (!Object.prototype.hasOwnProperty.call(props, propName)) {
            throw new Error(
              'Prop `'
                .concat(
                  propName,
                  "` has type 'any' or 'mixed', but was not provided to `",
                )
                .concat(componentName, '`. Pass undefined or any other value.'),
            );
          }
        }).isRequired,
        style: function style(props, propName, componentName) {
          if (!Object.prototype.hasOwnProperty.call(props, propName)) {
            throw new Error(
              'Prop `'
                .concat(
                  propName,
                  "` has type 'any' or 'mixed', but was not provided to `",
                )
                .concat(componentName, '`. Pass undefined or any other value.'),
            );
          }
        },
      };
exports.bpfrpt_proptype_HeaderRowRendererParams = bpfrpt_proptype_HeaderRowRendererParams;
var bpfrpt_proptype_HeaderRendererParams =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        columnData: _propTypes['default'].any,
        dataKey: _propTypes['default'].string.isRequired,
        disableSort: _propTypes['default'].bool,
        label: _propTypes['default'].any,
        sortBy: _propTypes['default'].string,
        sortDirection: _propTypes['default'].string,
      };
exports.bpfrpt_proptype_HeaderRendererParams = bpfrpt_proptype_HeaderRendererParams;
var bpfrpt_proptype_RowRendererParams =
  process.env.NODE_ENV === 'production'
    ? null
    : {
        className: _propTypes['default'].string.isRequired,
        columns: _propTypes['default'].arrayOf(function(
          props,
          propName,
          componentName,
        ) {
          if (!Object.prototype.hasOwnProperty.call(props, propName)) {
            throw new Error(
              'Prop `'
                .concat(
                  propName,
                  "` has type 'any' or 'mixed', but was not provided to `",
                )
                .concat(componentName, '`. Pass undefined or any other value.'),
            );
          }
        }).isRequired,
        index: _propTypes['default'].number.isRequired,
        isScrolling: _propTypes['default'].bool.isRequired,
        onRowClick: _propTypes['default'].func,
        onRowDoubleClick: _propTypes['default'].func,
        onRowMouseOver: _propTypes['default'].func,
        onRowMouseOut: _propTypes['default'].func,
        rowData: function rowData(props, propName, componentName) {
          if (!Object.prototype.hasOwnProperty.call(props, propName)) {
            throw new Error(
              'Prop `'
                .concat(
                  propName,
                  "` has type 'any' or 'mixed', but was not provided to `",
                )
                .concat(componentName, '`. Pass undefined or any other value.'),
            );
          }
        },
        style: function style(props, propName, componentName) {
          if (!Object.prototype.hasOwnProperty.call(props, propName)) {
            throw new Error(
              'Prop `'
                .concat(
                  propName,
                  "` has type 'any' or 'mixed', but was not provided to `",
                )
                .concat(componentName, '`. Pass undefined or any other value.'),
            );
          }
        },
        key: _propTypes['default'].string.isRequired,
      };
exports.bpfrpt_proptype_RowRendererParams = bpfrpt_proptype_RowRendererParams;
