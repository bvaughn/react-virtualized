function getUrlParams() {
  var search = window.location.search;

  return search.length
    ? search
        .substr(1)
        .split('&')
        .reduce(function(reduced, value) {
          var matches = value.split('=');
          reduced[matches[0]] = matches[1];
          return reduced;
        }, {})
    : {};
}

function getUrlParam(key) {
  return getUrlParams()[key];
}
