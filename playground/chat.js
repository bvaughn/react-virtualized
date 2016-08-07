function rowRenderer (params) {
  var datum = chatHistory[params.index]

  return React.createElement(
    'div',
    {
      className: 'item'
    },
    React.createElement(
      'strong',
      null,
      datum.name
    ),
    ':',
    datum.text
  )
}

function cellRenderer (params) {
  return rowRenderer({
    index: params.rowIndex
  })
}

var cellMeasurer
var virtualScroll
var mostRecentWidth

var App = React.createClass({
  render: function () {
    return React.createElement(
      'div',
      {
        className: 'container'
      },
      React.createElement(
        ReactVirtualized.AutoSizer,
        {},
        function (autoSizerParams) {
          if (mostRecentWidth && mostRecentWidth !== autoSizerParams.width) {
            cellMeasurer.resetMeasurements()
            virtualScroll.recomputeRowHeights()
          }

          mostRecentWidth = autoSizerParams.width

          return React.createElement(
            ReactVirtualized.CellMeasurer,
            {
              cellRenderer: cellRenderer,
              columnCount: 1,
              ref: function (ref) {
                cellMeasurer = ref
              },
              rowCount: chatHistory.length,
              width: autoSizerParams.width
            },
            function (cellMeasurerParams) {
              return React.createElement(
                ReactVirtualized.VirtualScroll,
                {
                  className: 'chat',
                  height: autoSizerParams.height,
                  ref: function (ref) {
                    virtualScroll = ref
                  },
                  rowCount: chatHistory.length,
                  rowHeight: cellMeasurerParams.getRowHeight,
                  rowRenderer: rowRenderer,
                  width: autoSizerParams.width
                }
              )
            }
          )
        }
      )
    )
  }
})

var NAMES = ['Peter Brimer', 'Tera Gaona', 'Kandy Liston', 'Lonna Wrede', 'Kristie Yard', 'Raul Host', 'Yukiko Binger', 'Velvet Natera', 'Donette Ponton', 'Loraine Grim', 'Shyla Mable', 'Marhta Sing', 'Alene Munden', 'Holley Pagel', 'Randell Tolman', 'Wilfred Juneau', 'Naida Madson', 'Marine Amison', 'Glinda Palazzo', 'Lupe Island', 'Cordelia Trotta', 'Samara Berrier', 'Era Stepp', 'Malka Spradlin', 'Edward Haner', 'Clemencia Feather', 'Loretta Rasnake', 'Dana Hasbrouck', 'Sanda Nery', 'Soo Reiling', 'Apolonia Volk', 'Liliana Cacho', 'Angel Couchman', 'Yvonne Adam', 'Jonas Curci', 'Tran Cesar', 'Buddy Panos', 'Rosita Ells', 'Rosalind Tavares', 'Renae Keehn', 'Deandrea Bester', 'Kelvin Lemmon', 'Guadalupe Mccullar', 'Zelma Mayers', 'Laurel Stcyr', 'Edyth Everette', 'Marylin Shevlin', 'Hsiu Blackwelder', 'Mark Ferguson', 'Winford Noggle', 'Shizuko Gilchrist', 'Roslyn Cress', 'Nilsa Lesniak', 'Agustin Grant', 'Earlie Jester', 'Libby Daigle', 'Shanna Maloy', 'Brendan Wilken', 'Windy Knittel', 'Alice Curren', 'Eden Lumsden', 'Klara Morfin', 'Sherryl Noack', 'Gala Munsey', 'Stephani Frew', 'Twana Anthony', 'Mauro Matlock', 'Claudie Meisner', 'Adrienne Petrarca', 'Pearlene Shurtleff', 'Rachelle Piro', 'Louis Cocco', 'Susann Mcsweeney', 'Mandi Kempker', 'Ola Moller', 'Leif Mcgahan', 'Tisha Wurster', 'Hector Pinkett', 'Benita Jemison', 'Kaley Findley', 'Jim Torkelson', 'Freda Okafor', 'Rafaela Markert', 'Stasia Carwile', 'Evia Kahler', 'Rocky Almon', 'Sonja Beals', 'Dee Fomby', 'Damon Eatman', 'Alma Grieve', 'Linsey Bollig', 'Stefan Cloninger', 'Giovanna Blind', 'Myrtis Remy', 'Marguerita Dostal', 'Junior Baranowski', 'Allene Seto', 'Margery Caves', 'Nelly Moudy', 'Felix Sailer']
var SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Phasellus vulputate odio commodo tortor sodales, et vehicula ipsum viverra.',
  'Cras tincidunt nisi in urna molestie varius.',
  'Curabitur ac enim dictum arcu varius fermentum vel sodales dui.',
  'Ut tristique augue at congue molestie.',
  'Cras eget enim nec odio feugiat tristique eu quis ante.',
  'Phasellus eget enim vitae nunc luctus sodales a eu erat.',
  'Nulla bibendum quam id velit blandit dictum.',
  'Donec dignissim mi ac libero feugiat, vitae lacinia odio viverra.',
  'Praesent vel lectus venenatis, elementum mauris vitae, ullamcorper nulla.',
  'Quisque sollicitudin nulla nec tellus feugiat hendrerit.',
  'Vestibulum a eros accumsan, lacinia eros non, pretium diam.',
  'Donec ornare felis et dui hendrerit, eget bibendum nibh interdum.',
  'Donec nec diam vel tellus egestas lobortis.',
  'Sed ornare nisl sit amet dolor pellentesque, eu fermentum leo interdum.',
  'Sed eget mauris condimentum, molestie justo eu, feugiat felis.',
  'Sed luctus justo vitae nibh bibendum blandit.',
  'Nulla ac eros vestibulum, mollis ante eu, rutrum nulla.',
  'Sed cursus magna ut vehicula rutrum.'
]

var chatHistory = []

for (var i = 0; i < 1000; i++) {
  var name = NAMES[Math.floor(Math.random() * NAMES.length)]
  var sentences = Math.ceil(Math.random() * 5)
  var texts = []

  for (var x = 0; x < sentences; x++) {
    texts.push(SENTENCES[Math.floor(Math.random() * SENTENCES.length)])
  }

  chatHistory.push({
    name,
    text: texts.join(' ')
  })
}

const mount = document.querySelector('#mount')

ReactDOM.render(
  React.createElement(App),
  mount
)

document.body.addEventListener('click', function () {
  const bodyWidth = document.body.getBoundingClientRect().width
  const minWidth = 300

  mount.style.display = 'inline-block'
  mount.style.maxWidth = `${minWidth + Math.round(Math.random() * (bodyWidth - minWidth))}px`
})
