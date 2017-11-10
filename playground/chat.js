var cache = new ReactVirtualized.CellMeasurerCache({
  fixedWidth: true,
});

var list;
var mostRecentWidth;

function rowRenderer(params) {
  var datum = chatHistory[params.index];

  return React.createElement(
    ReactVirtualized.CellMeasurer,
    {
      cache: cache,
      columnIndex: 0,
      key: params.key,
      parent: params.parent,
      rowIndex: params.index,
      width: mostRecentWidth,
    },
    React.createElement(
      'div',
      {
        className: 'item',
        key: params.key,
        style: params.style,
      },
      React.createElement('strong', null, datum.name),
      ':',
      datum.text,
    ),
  );
}

function cellRenderer(params) {
  params.index = params.rowIndex;

  return rowRenderer(params);
}

var App = React.createClass({
  render: function() {
    return React.createElement(
      'div',
      {
        className: 'container',
      },
      React.createElement(ReactVirtualized.AutoSizer, {}, function(
        autoSizerParams,
      ) {
        if (mostRecentWidth && mostRecentWidth !== autoSizerParams.width) {
          cache.clearAll();
          list.recomputeRowHeights();
        }

        mostRecentWidth = autoSizerParams.width;

        return React.createElement(ReactVirtualized.List, {
          className: 'chat',
          deferredMeasurementCache: cache,
          height: autoSizerParams.height,
          ref: function(ref) {
            list = ref;
          },
          rowCount: chatHistory.length,
          rowHeight: cache.rowHeight,
          rowRenderer: rowRenderer,
          width: autoSizerParams.width,
        });
      }),
    );
  },
});

var NAMES = [
  'Peter Brimer',
  'Tera Gaona',
  'Kandy Liston',
  'Lonna Wrede',
  'Kristie Yard',
  'Raul Host',
  'Yukiko Binger',
  'Velvet Natera',
  'Donette Ponton',
  'Loraine Grim',
  'Shyla Mable',
  'Marhta Sing',
  'Alene Munden',
  'Holley Pagel',
  'Randell Tolman',
  'Wilfred Juneau',
  'Naida Madson',
  'Marine Amison',
  'Glinda Palazzo',
  'Lupe Island',
  'Cordelia Trotta',
  'Samara Berrier',
  'Era Stepp',
  'Malka Spradlin',
  'Edward Haner',
  'Clemencia Feather',
  'Loretta Rasnake',
  'Dana Hasbrouck',
  'Sanda Nery',
  'Soo Reiling',
  'Apolonia Volk',
  'Liliana Cacho',
  'Angel Couchman',
  'Yvonne Adam',
  'Jonas Curci',
  'Tran Cesar',
  'Buddy Panos',
  'Rosita Ells',
  'Rosalind Tavares',
  'Renae Keehn',
  'Deandrea Bester',
  'Kelvin Lemmon',
  'Guadalupe Mccullar',
  'Zelma Mayers',
  'Laurel Stcyr',
  'Edyth Everette',
  'Marylin Shevlin',
  'Hsiu Blackwelder',
  'Mark Ferguson',
  'Winford Noggle',
  'Shizuko Gilchrist',
  'Roslyn Cress',
  'Nilsa Lesniak',
  'Agustin Grant',
  'Earlie Jester',
  'Libby Daigle',
  'Shanna Maloy',
  'Brendan Wilken',
  'Windy Knittel',
  'Alice Curren',
  'Eden Lumsden',
  'Klara Morfin',
  'Sherryl Noack',
  'Gala Munsey',
  'Stephani Frew',
  'Twana Anthony',
  'Mauro Matlock',
  'Claudie Meisner',
  'Adrienne Petrarca',
  'Pearlene Shurtleff',
  'Rachelle Piro',
  'Louis Cocco',
  'Susann Mcsweeney',
  'Mandi Kempker',
  'Ola Moller',
  'Leif Mcgahan',
  'Tisha Wurster',
  'Hector Pinkett',
  'Benita Jemison',
  'Kaley Findley',
  'Jim Torkelson',
  'Freda Okafor',
  'Rafaela Markert',
  'Stasia Carwile',
  'Evia Kahler',
  'Rocky Almon',
  'Sonja Beals',
  'Dee Fomby',
  'Damon Eatman',
  'Alma Grieve',
  'Linsey Bollig',
  'Stefan Cloninger',
  'Giovanna Blind',
  'Myrtis Remy',
  'Marguerita Dostal',
  'Junior Baranowski',
  'Allene Seto',
  'Margery Caves',
  'Nelly Moudy',
  'Felix Sailer',
];
var SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Phasellus vulputate odio commodo tortor sodales, et vehicula ipsum viverra.',
  'In et mollis velit, accumsan volutpat libero.',
  'Nulla rutrum tellus ipsum, eget fermentum sem dictum quis.',
  'Suspendisse eget vehicula elit.',
  'Proin ut lacus lacus.',
  'Aliquam erat volutpat.',
  'Vivamus ac suscipit est, et elementum lectus.',
  'Cras tincidunt nisi in urna molestie varius.',
  'Integer in magna eu nibh imperdiet tristique.',
  'Curabitur eu pellentesque nisl.',
  'Etiam non consequat est.',
  'Duis mi massa, feugiat nec molestie sit amet, suscipit et metus.',
  'Curabitur ac enim dictum arcu varius fermentum vel sodales dui.',
  'Ut tristique augue at congue molestie.',
  'Integer semper sem lorem, scelerisque suscipit lacus consequat nec.',
  'Etiam euismod efficitur magna nec dignissim.',
  'Morbi vel neque lectus.',
  'Etiam ac accumsan elit, et pharetra ex.',
  'Suspendisse vitae gravida mauris.',
  'Pellentesque sed laoreet erat.',
  'Nam aliquet purus quis massa eleifend, et efficitur felis aliquam.',
  'Fusce faucibus diam erat, sed consectetur urna auctor at.',
  'Praesent et nulla velit.',
  'Cras eget enim nec odio feugiat tristique eu quis ante.',
  'Morbi blandit diam vitae odio sollicitudin finibus.',
  'Integer ac ante fermentum, placerat orci vel, fermentum lacus.',
  'Maecenas est elit, semper ut posuere et, congue ut orci.',
  'Phasellus eget enim vitae nunc luctus sodales a eu erat.',
  'Curabitur dapibus nisi sed nisi dictum, in imperdiet urna posuere.',
  'Vivamus commodo odio metus, tincidunt facilisis augue dictum quis.',
  'Curabitur sagittis a lectus ac sodales.',
  'Nam eget eros purus.',
  'Nam scelerisque et ante in porta.',
  'Proin vitae augue tristique, malesuada nisl ut, fermentum nisl.',
  'Nulla bibendum quam id velit blandit dictum.',
  'Cras tempus ac dolor ut convallis.',
  'Sed vel ipsum est.',
  'Nulla ut leo vestibulum, ultricies sapien ac, pellentesque dolor.',
  'Etiam ultricies maximus tempus.',
  'Donec dignissim mi ac libero feugiat, vitae lacinia odio viverra.',
  'Curabitur condimentum tellus sit amet neque posuere, condimentum tempus purus eleifend.',
  'Donec tempus, augue id hendrerit pretium, mauris leo congue nulla, ac iaculis erat nunc in dolor.',
  'Praesent vel lectus venenatis, elementum mauris vitae, ullamcorper nulla.',
  'Maecenas non diam cursus, imperdiet massa eget, pellentesque ex.',
  'Vestibulum luctus risus vel augue auctor blandit.',
  'Nullam augue diam, pulvinar sed sapien et, hendrerit venenatis risus.',
  'Quisque sollicitudin nulla nec tellus feugiat hendrerit.',
  'Vestibulum a eros accumsan, lacinia eros non, pretium diam.',
  'Aenean iaculis augue sit amet scelerisque aliquam.',
  'Donec ornare felis et dui hendrerit, eget bibendum nibh interdum.',
  'Maecenas tellus magna, tristique vitae orci vel, auctor tincidunt nisi.',
  'Fusce non libero quis velit porttitor maximus at eget enim.',
  'Sed in aliquet tellus.',
  'Etiam a tortor erat.',
  'Donec nec diam vel tellus egestas lobortis.',
  'Vivamus dictum erat nulla, sit amet accumsan dolor scelerisque eu.',
  'In nec eleifend ex, pellentesque dapibus sapien.',
  'Duis a mollis nisi.',
  'Sed ornare nisl sit amet dolor pellentesque, eu fermentum leo interdum.',
  'Sed eget mauris condimentum, molestie justo eu, feugiat felis.',
  'Nunc suscipit leo non dui blandit, ac malesuada ex consequat.',
  'Morbi varius placerat congue.',
  'Praesent id velit in nunc elementum aliquet.',
  'Sed luctus justo vitae nibh bibendum blandit.',
  'Sed et sapien turpis.',
  'Nulla ac eros vestibulum, mollis ante eu, rutrum nulla.',
  'Sed cursus magna ut vehicula rutrum.',
  'Ut consectetur feugiat consectetur.',
  'Nulla nec ligula posuere neque sollicitudin rutrum a a dui.',
  'Nulla ut quam odio.',
  'Integer dignissim sapien et orci sodales volutpat.',
  'Nullam a sapien leo.',
  'Praesent cursus semper purus, vitae gravida risus dapibus mattis.',
  'Sed pellentesque nulla lorem, in commodo arcu feugiat sed.',
  'Phasellus blandit arcu non diam varius ornare.',
];
var chatHistory = [];

for (var i = 0; i < 1000; i++) {
  var name = NAMES[Math.floor(Math.random() * NAMES.length)];
  var sentences = Math.ceil(Math.random() * 5);
  var texts = [];

  for (var x = 0; x < sentences; x++) {
    texts.push(SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
  }

  chatHistory.push({
    name,
    text: texts.join(' '),
  });
}

const container = document.getElementById('mount');

ReactDOM.render(React.createElement(App), container);

document.body.addEventListener('click', function() {
  const bodyWidth = document.body.getBoundingClientRect().width;
  const minWidth = 300;

  container.style.display = 'inline-block';
  container.style.maxWidth = `${minWidth +
    Math.round(Math.random() * (bodyWidth - minWidth))}px`;
});
