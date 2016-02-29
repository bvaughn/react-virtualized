var ROW_HEIGHT = 20
var data = []

for (var i = 0; i < 10000; i++) {
  var item = {
    children: [],
    expanded: false,
    name: 'Root ' + i
  }
  data.push(item)
  for (var j = 0; j < i % 4; j++) {
    item.children.push({
      name: 'Child ' + j
    })
  }
}

var VirtualScroll

function setRef (ref) {
  VirtualScroll = ref
}

function renderCell (index) {
  var item = data[index]
  var content = []

  var prefix = item.expanded
    ? '[-]'
    : item.children.length > 0
      ? '[+]'
      : ''

  content.push(
    React.DOM.div({
      className: 'root',
      key: 0,
      onClick: function () {
        if (item.children.length) {
          item.expanded = !item.expanded
          VirtualScroll.recomputeRowHeights()
        }
      },
    }, prefix + ' ' + item.name)
  )

  if (item.expanded) {
    item.children.forEach(
      function (child, index) {
        content.push(
          React.DOM.div({
            className: 'child',
            key: index + 1,
          }, child.name)
        )
      }
    )
  }

  return React.DOM.div(null, content)
}

function rowHeight (index) {
  var item = data[index]
  return item.expanded
    ? (item.children.length + 1) * ROW_HEIGHT
    : ROW_HEIGHT
}

var App = React.createClass({
  render: function() {
    return React.createElement(
      ReactVirtualized.AutoSizer,
      null,
      function (params) {
        return React.createElement(
          ReactVirtualized.VirtualScroll,
          {
            height: params.height,
            overscanRowsCount: 0,
            ref: setRef,
            rowHeight: rowHeight,
            rowRenderer: renderCell,
            rowsCount: data.length,
            width: params.width
          }
        )
      }
    )
  }
})

ReactDOM.render(
  React.createElement(App),
  document.querySelector('#mount')
)
