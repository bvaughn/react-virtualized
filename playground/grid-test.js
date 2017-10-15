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
      params,
    ) {
      return React.createElement(ReactVirtualized.Grid, {
        columnCount: 1000,
        columnWidth: 35,
        height: params.height,
        overscanRowCount: 0,
        cellRenderer: cellRenderer,
        rowHeight: 30,
        rowCount: 5000,
        width: params.width,
      });
    });
  },
});

ReactDOM.render(React.createElement(App), document.querySelector('#mount'));

const testCase = createScrollingTestCase(
  document.querySelector('.ReactVirtualized__Grid'),
);
const TestRunner = FpsMeasurer.TestRunner;
const testRunner = new TestRunner(testCase, 5);

document.body.addEventListener('click', function(event) {
  if (testRunner.isRunning()) {
    testRunner.stop();
  } else {
    testRunner.start();
  }
});
