function cellRenderer(params) {
  return React.createElement(
    'div',
    {
      className: 'item',
      key: params.key,
      style: params.style,
    },
    params.columnIndex,
  );
}

var App = React.createClass({
  render: function() {
    return React.createElement(ReactVirtualized.AutoSizer, null, function(
      autoSizerParams,
    ) {
      return React.createElement(ReactVirtualized.ScrollSync, null, function(
        scrollSyncParams,
      ) {
        return React.createElement(
          'div',
          {
            style: {
              height: autoSizerParams.height,
              width: autoSizerParams.width,
            },
          },
          React.createElement(ReactVirtualized.Grid, {
            cellRenderer: cellRenderer,
            columnCount: 1000,
            columnWidth: 35,
            height: autoSizerParams.height / 2,
            key: 0,
            overscanRowCount: 0,
            rowHeight: 30,
            rowCount: 5000,
            scrollLeft: scrollSyncParams.scrollLeft,
            width: autoSizerParams.width,
          }),
          React.createElement(ReactVirtualized.Grid, {
            cellRenderer: cellRenderer,
            columnCount: 1000,
            columnWidth: 35,
            height: autoSizerParams.height / 2,
            key: 1,
            overscanRowCount: 0,
            onScroll: scrollSyncParams.onScroll,
            rowHeight: 30,
            rowCount: 5000,
            width: autoSizerParams.width,
          }),
        );
      });
    });
  },
});

ReactDOM.render(React.createElement(App), document.querySelector('#mount'));
