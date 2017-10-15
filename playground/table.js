const NUM_COLUMNS = 40;

function rowGetter(params) {
  return new Array(NUM_COLUMNS).fill('').map(function(_, index) {
    return index;
  });
}

var App = React.createClass({
  render: function() {
    const flexColumns = [];

    for (var i = 0; i < NUM_COLUMNS; i++) {
      flexColumns.push(
        React.createElement(ReactVirtualized.Column, {
          dataKey: i,
          flexGrow: 1,
          key: i,
          width: 50,
        }),
      );
    }

    return React.createElement(ReactVirtualized.AutoSizer, null, function(
      params,
    ) {
      return React.createElement(
        ReactVirtualized.Table,
        {
          height: params.height,
          overscanRowCount: 0,
          rowGetter,
          rowHeight: 30,
          rowCount: 1000,
          width: params.width,
        },
        null,
        flexColumns,
      );
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
