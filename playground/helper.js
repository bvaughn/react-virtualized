function loadScriptsAndStyles (source) {
  var matches = window.location.search.match('source=(.+)');
  var baseDir = 'https://npmcdn.com/react-virtualized/';

  if (matches) {
    baseDir = matches[1] === 'local'
      ? '../'
      : matches[1]
  }

  function loadStyle (source, callback) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', source);
    link.onload = callback
    document.head.appendChild(link);
  }

  function loadScript (source) {
    var script = document.createElement('script');
    script.setAttribute('src', source);
    script.async = false;
    document.head.appendChild(script);
  }

  var styleSource = baseDir + 'styles.css';
  var scriptSource = baseDir + 'dist/umd/react-virtualized.js';
  var appSource = source;

  loadStyle(styleSource, function() {
    loadScript(scriptSource);
    loadScript(appSource);
  });
}
