////////////////////////////////////////////////////////////
// Key pool (would be shipped with RV)
////////////////////////////////////////////////////////////

function createSimplePool() {
  const availableKeys = [];
  const inUseKeys = [];

  let previousCycle = null;
  let keyCounter = 0;

  function releaseKeys({ startIndex, stopIndex }) {
    if (previousCycle !== null) {
      const {
        startIndex: prevStartIndex,
        stopIndex: prevStopIndex
      } = previousCycle;

      let targetIndex = Math.min(prevStopIndex + 1, startIndex);
      for (let i = prevStartIndex; i < targetIndex; i++) {
        const key = inUseKeys[i];
        delete inUseKeys[i];
        if (key != null) {
          availableKeys.push(key);
        }
      }
      targetIndex = Math.max(prevStartIndex - 1, stopIndex);
      for (let i = prevStopIndex; i > stopIndex; i--) {
        const key = inUseKeys[i];
        delete inUseKeys[i];
        if (key != null) {
          availableKeys.push(key);
        }
      }
    }

    previousCycle = { startIndex, stopIndex };
  }

  function getKey(index) {
    let key;

    if (inUseKeys.hasOwnProperty(index)) {
      key = inUseKeys[index];
    } else if (availableKeys.length > 0) {
      key = availableKeys.pop();
    } else {
      key = keyCounter++;
    }

    inUseKeys[index] = key;

    return key;
  }

  return { releaseKeys, getKey };
}

function createCellKeyPool() {
  const columnPool = createSimplePool();
  const rowPool = createSimplePool();

  function onSectionRendered({
    columnOverscanStartIndex,
    columnOverscanStopIndex,
    rowOverscanStartIndex,
    rowOverscanStopIndex
  }) {
    columnPool.releaseKeys({
      startIndex: columnOverscanStartIndex,
      stopIndex: columnOverscanStopIndex
    });
    rowPool.releaseKeys({
      startIndex: rowOverscanStartIndex,
      stopIndex: rowOverscanStopIndex
    });
  }

  function cellKeyGetter({ columnIndex, rowIndex }) {
    return `${rowPool.getKey(rowIndex)}-${columnPool.getKey(columnIndex)}`;
  }

  return {
    cellKeyGetter,
    onSectionRendered
  };
}

////////////////////////////////////////////////////////////
// Debugging keys
////////////////////////////////////////////////////////////

function createTable(keys, globalKeyMap) {
  const keyMap = {};
  const rows = {};

  let maxCol = 0;
  let maxRow = 0;

  keys.forEach(key => {
    keyMap[key] = key;

    const [row, col] = key.split('-');

    if (!rows[row]) rows[row] = {};
    rows[row][col] = col;

    maxCol = Math.max(maxCol, col);
    maxRow = Math.max(maxRow, row);
  });

  const table = document.createElement('table');

  const tr = document.createElement('tr');
  table.appendChild(tr);
  for (let col = -1; col <= maxCol; col++) {
    const td = document.createElement('td');
    tr.appendChild(td);
    if (col >= 0) {
      td.innerText = col;
    }
  }

  for (let row = 0; row <= maxRow; row++) {
    const tr = document.createElement('tr');
    table.appendChild(tr);

    const td = document.createElement('td');
    td.innerText = row;
    tr.appendChild(td);

    for (let col = 0; col <= maxCol; col++) {
      const key = `${row}-${col}`;
      const td = document.createElement('td');
      td.title = key;
      tr.appendChild(td);

      if (keyMap[key] !== undefined) {
        td.style.backgroundColor = 'rgba(102, 255, 170, 0.5)';
      } else if (globalKeyMap[key] !== undefined) {
        //td.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
      } else {
        td.style.backgroundColor = 'rgba(255, 50, 100, 0.75)';
      }
    }
  }

  return table;
}

const printDebugInfo = (() => {
  let timeoutId;

  function printDebugInfo() {
    var availableKeys = [];

    Object.keys(keyMap).forEach(key => {
      if (inUseKeys[key] === undefined) {
        availableKeys.push(key);
      }
    });

    inUseKeysArray = Object.keys(inUseKeys);

    document.getElementById('inUseKeysCount').innerText = inUseKeysArray.length;
    document.getElementById('inUseKeysTable').innerHTML = '';
    document.getElementById('inUseKeysTable').appendChild(createTable(inUseKeysArray, keyMap));

    document.getElementById('availableKeysCount').innerText = keyCount;
    document.getElementById('availableKeysTable').innerHTML = '';
    document.getElementById('availableKeysTable').appendChild(createTable(availableKeys, keyMap));
  }

  function debouncedPrintDebugInfo() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(printDebugInfo, 1000);
  };

  return debouncedPrintDebugInfo;
})();

////////////////////////////////////////////////////////////
// RV Rendering
////////////////////////////////////////////////////////////

var REACT_VIRTUALIZED_BANNER = 'https://cloud.githubusercontent.com/assets/29597/11737732/0ca1e55e-9f91-11e5-97f3-098f2f8ed866.png'

var inUseKeys = {};
var keyMap = {};
var keyCount = 0;

class CellRenderer extends React.PureComponent {
  constructor(props) {
    super(props);

    this._renderCount = 0;
  }

  render() {
    const props = this.props;

    return React.createElement(
      'div',
      {
        className: 'cell',
        key: props.key,
        style: props.style,
      },
      [
        React.createElement('div', { key: 0 }, `indices: ${props.rowIndex}, ${props.columnIndex}`),
        React.createElement('div', { key: 1 }, `key: ${props.dataKey}`),
        React.createElement('div', { key: 2 }, `render: ${++this._renderCount}`)
      ]
    );
  }
}

function cellRenderer(params) {
  const key = cellKeyGetter({
    columnIndex: params.columnIndex,
    rowIndex: params.rowIndex
  });

  if (keyMap[key] === undefined) {
    keyMap[key] = key;
    keyCount++;
  }

  inUseKeys[key] = key;

  return React.createElement(CellRenderer, {
    columnIndex: params.columnIndex,
    dataKey: key,
    key: key,
    rowIndex: params.rowIndex,
    style: params.style
  });
}

const { cellKeyGetter, onSectionRendered } = createCellKeyPool();

function onSectionRenderedWrapper(params) {
  onSectionRendered(params);

  inUseKeys = {};

  printDebugInfo();
}

var App = function() {
  return React.createElement(
    ReactVirtualized.AutoSizer,
    null,
    function (params) {
      return React.createElement(
        ReactVirtualized.Grid,
        {
          columnCount: 1000,
          columnWidth: 100,
          height: params.height,
          overscanRowCount: 0,
          cellRenderer: cellRenderer,
          cellKeyGetter: cellKeyGetter,
          onSectionRendered: onSectionRenderedWrapper,
          overscanColumnCount: 0,
          overscanRowCount: 0,
          rowHeight: 40,
          rowCount: 1000,
          width: params.width,
        }
      )
    }
  )
};

ReactDOM.render(
  React.createElement(App),
  document.getElementById('mount')
);