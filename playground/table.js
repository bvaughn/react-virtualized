const NUM_COLUMNS = 40

function rowGetter (params) {
  return new Array(NUM_COLUMNS).fill('').map(
    function (_, index) {
      return index
    })
}

var App = React.createClass({
  render: function() {
    const flexColumns = []

    for (var i = 0; i < NUM_COLUMNS; i++) {
      flexColumns.push(
        React.createElement(
          ReactVirtualized.FlexColumn,
          {
            dataKey: i,
            flexGrow: 1,
            key: i,
            width: 50
          }
        )
      )
    }

    return React.createElement(
      ReactVirtualized.AutoSizer,
      null,
      function (params) {
        return React.createElement(
          ReactVirtualized.FlexTable,
          {
            height: params.height,
            overscanRowCount: 0,
            rowGetter,
            rowHeight: 30,
            rowCount: 100000,
            width: params.width
          },
          null,
          flexColumns
        )
      }
    )
  }
})

ReactDOM.render(
  React.createElement(App),
  document.querySelector('#mount')
)

/** Tests a specific use case- scrolling a large FlexTable */
function testCase (completedCallback) {
  const flexTable = document.querySelector('.FlexTable__Grid')
  flexTable.scrollTop = 0

  const maxScrollTop = flexTable.scrollHeight

  var interval = 1
  var scrollTop = 0

  function incrementScrollTop () {
    if (!testRunner.isRunning) {
      return
    }

    interval *= 1.1
    scrollTop = Math.min(scrollTop + interval, maxScrollTop)

    flexTable.scrollTop = scrollTop

    if (scrollTop < maxScrollTop) {
      requestAnimationFrame(incrementScrollTop)
    } else {
      completedCallback()
    }
  }

  incrementScrollTop()
}

const testRunner = new TestRunner(testCase)

document.body.addEventListener('click',
  function () {
    if (testRunner.isRunning) {
      testRunner.stop()
    } else {
      testRunner.start()
    }
  })
