function loadStyle(source, callback) {
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', source);
  link.onload = callback;
  document.head.appendChild(link);
}

function loadScript(source) {
  var script = document.createElement('script');
  script.setAttribute('src', source);
  script.async = false;
  document.head.appendChild(script);
}

function loadScriptsAndStyles(source) {
  var baseDir = 'https://unpkg.com/react-virtualized/';
  var sourceParam = getUrlParam('source');

  if (sourceParam) {
    baseDir =
      sourceParam === 'local'
        ? '../'
        : `https://unpkg.com/react-virtualized@${sourceParam}/`;
  }

  var styleSource = baseDir + 'styles.css';
  var scriptSource = baseDir + 'dist/umd/react-virtualized.js';
  var appSource = source;

  loadStyle(styleSource, function() {
    loadScript(scriptSource);
    loadScript(appSource);
  });
}

function loadReact() {
  var baseDir = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2';
  var reactParam = getUrlParam('react');

  if (reactParam) {
    baseDir =
      reactParam === 'latest'
        ? 'http://react.zpao.com/builds/master/latest'
        : `https://cdnjs.cloudflare.com/ajax/libs/react/${reactParam}`;
  }

  loadScript(`${baseDir}/react.min.js`);
  loadScript(`${baseDir}/react-dom.min.js`);
}
