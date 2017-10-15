var App = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var cellRenderer = this._cellRenderer;

    return React.createElement(
      ReactVirtualized.AutoSizer,
      {
        ref: 'AutoSizer',
      },
      function(params) {
        return React.createElement(ReactVirtualized.Grid, {
          columnCount: 1000,
          columnWidth: 100,
          height: params.height,
          ref: 'Grid',
          cellRenderer: cellRenderer,
          rowHeight: 30,
          rowCount: 1000,
          width: params.width,
        });
      },
    );
  },

  _cellRenderer(params) {
    var columnIndex = params.columnIndex;
    var rowIndex = params.rowIndex;
    var key = `c:${columnIndex}, r:${rowIndex}`;
    var setState = this.setState.bind(this);
    var grid = this.refs.AutoSizer.refs.Grid;

    var className =
      columnIndex === this.state.hoveredColumnIndex ||
      rowIndex === this.state.hoveredRowIndex
        ? 'item hoveredItem'
        : 'item';

    return React.DOM.div(
      {
        className: className,
        key: params.key,
        onMouseOver: function() {
          setState({
            hoveredColumnIndex: columnIndex,
            hoveredRowIndex: rowIndex,
          });
          grid.forceUpdate();
        },
        style: params.style,
      },
      key,
    );
  },
});

ReactDOM.render(React.createElement(App), document.querySelector('#mount'));
