var ROW_HEIGHT = 20;
var RANDOM_WORDS = [
  'abstrusity',
  'advertisable',
  'bellwood',
  'benzole',
  'boreum',
  'brenda',
  'cassiopeian',
  'chansonnier',
  'cleric',
  'conclusional',
  'conventicle',
  'copalm',
  'cornopion',
  'crossbar',
  'disputative',
  'djilas',
  'ebracteate',
  'ephemerally',
  'epidemical',
  'evasive',
  'eyeglasses',
  'farragut',
  'fenny',
  'ferryman',
  'fluently',
  'foreigner',
  'genseng',
  'glaiket',
  'haunch',
  'histogeny',
  'illocution',
  'imprescriptible',
  'inapproachable',
  'incisory',
  'intrusiveness',
  'isoceraunic',
  'japygid',
  'juiciest',
  'jump',
  'kananga',
  'leavening',
  'legerdemain',
  'licence',
  'licia',
  'luanda',
  'malaga',
  'mathewson',
  'nonhumus',
  'nonsailor',
  'nummary',
  'nyregyhza',
  'onanist',
  'opis',
  'orphrey',
  'paganising',
  'pebbling',
  'penchi',
  'photopia',
  'pinocle',
  'principally',
  'prosector.',
  'radiosensitive',
  'redbrick',
  'reexposure',
  'revived',
  'subexternal',
  'sukarnapura',
  'supersphenoid',
  'tabularizing',
  'territorialism',
  'tester',
  'thalassography',
  'tuberculise',
  'uncranked',
  'undersawyer',
  'unimpartible',
  'unsubdivided',
  'untwining',
  'unwaived',
  'webfoot',
  'wedeling',
  'wellingborough',
  'whiffet',
  'whipstall',
  'wot',
  'yonkersite',
  'zonary',
];
var data = createRandomizedData();

function renderItem(item, keyPrefix) {
  var onClick = function(event) {
    event.stopPropagation();
    item.expanded = !item.expanded;
    List.recomputeRowHeights();
    List.forceUpdate();
  };

  var props = {key: keyPrefix};
  var children = [];
  var itemText;

  if (item.expanded) {
    props.onClick = onClick;
    itemText = '[-] ' + item.name;
    children = item.children.map(function(child, index) {
      return renderItem(child, keyPrefix + '-' + index);
    });
  } else if (item.children.length) {
    props.onClick = onClick;
    itemText = '[+] ' + item.name;
  } else {
    itemText = '    ' + item.name;
  }

  children.unshift(
    React.DOM.div(
      {
        className: 'item',
        key: 'label',
        style: {
          cursor: item.children.length ? 'pointer' : 'auto',
        },
      },
      itemText,
    ),
  );

  return React.DOM.ul(null, React.DOM.li(props, children));
}

function getExpandedItemCount(item) {
  var count = 1;

  if (item.expanded) {
    count += item.children
      .map(getExpandedItemCount)
      .reduce(function(total, count) {
        return total + count;
      }, 0);
  }

  return count;
}

var List;
function setRef(ref) {
  List = ref;
}

function cellRenderer(params) {
  var renderedCell = renderItem(data[params.index], params.index);

  return React.DOM.ul(
    {
      key: params.key,
      style: params.style,
    },
    renderedCell,
  );
}

function rowHeight(params) {
  return getExpandedItemCount(data[params.index]) * ROW_HEIGHT;
}

var App = React.createClass({
  render: function() {
    return React.createElement(ReactVirtualized.AutoSizer, null, function(
      params,
    ) {
      return React.createElement(ReactVirtualized.List, {
        height: params.height,
        overscanRowCount: 10,
        ref: setRef,
        rowHeight: rowHeight,
        rowRenderer: cellRenderer,
        rowCount: data.length,
        width: params.width,
      });
    });
  },
});

ReactDOM.render(React.createElement(App), document.querySelector('#mount'));

function createRandomizedData() {
  var data = [];

  for (var i = 0; i < 10000; i++) {
    data.push(createRandomizedItem(0));
  }

  return data;
}

function createRandomizedItem(depth) {
  var item = {};
  item.children = [];
  item.name = RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];

  var numChildren = depth < 3 ? Math.floor(Math.random() * 5) : 0;
  for (var i = 0; i < numChildren; i++) {
    item.children.push(createRandomizedItem(depth + 1));
  }

  item.expanded = numChildren > 0 && Math.random() < 0.25;

  return item;
}
