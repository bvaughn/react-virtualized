var REACT_VIRTUALIZED_BANNER =
  'https://cloud.githubusercontent.com/assets/29597/11737732/0ca1e55e-9f91-11e5-97f3-098f2f8ed866.png';

function getColumnWidth(params) {
  switch (params.index % 3) {
    case 0:
      return 65;
    case 1:
      return 65;
    case 2:
      return 100;
  }
}

function cellRenderer(params) {
  var key = `c:${params.columnIndex}, r:${params.rowIndex}`;
  switch (params.columnIndex % 3) {
    case 0:
      return React.DOM.input({
        className: 'input',
        defaultValue: key,
        key: params.key,
        onChange: function() {},
        style: params.style,
      });
    case 1:
      return React.DOM.button(
        {
          className: 'button',
          key: params.key,
          style: params.style,
        },
        key,
      );
    case 2:
      return React.DOM.img({
        className: 'image',
        key: params.key,
        src: REACT_VIRTUALIZED_BANNER,
        style: params.style,
      });
  }
}

var App = React.createClass({
  render: function() {
    return React.createElement(ReactVirtualized.AutoSizer, null, function(
      params,
    ) {
      return React.createElement(ReactVirtualized.Grid, {
        columnCount: 1000,
        columnWidth: getColumnWidth,
        height: params.height,
        overscanRowCount: 0,
        cellRenderer: cellRenderer,
        rowHeight: 30,
        rowCount: 1000,
        width: params.width,
      });
    });
  },
});

ReactDOM.render(React.createElement(App), document.querySelector('#mount'));
