import createCallbackMemoizer from './createCallbackMemoizer';
describe('createCallbackMemoizer', function () {
  function OnRowsRendered() {
    var _numCalls = 0;

    var _overscanStartIndex;

    var _overscanStopIndex;

    var _startIndex;

    var _stopIndex;

    return {
      numCalls: function numCalls() {
        return _numCalls;
      },
      overscanStartIndex: function overscanStartIndex() {
        return _overscanStartIndex;
      },
      overscanStopIndex: function overscanStopIndex() {
        return _overscanStopIndex;
      },
      startIndex: function startIndex() {
        return _startIndex;
      },
      stopIndex: function stopIndex() {
        return _stopIndex;
      },
      update: function update(params) {
        _overscanStartIndex = params.overscanStartIndex;
        _overscanStopIndex = params.overscanStopIndex;
        _startIndex = params.startIndex;
        _stopIndex = params.stopIndex;
        _numCalls++;
      }
    };
  }

  it('should not call onRowsRendered if startIndex or stopIndex are invalid', function () {
    var util = new OnRowsRendered();
    var helper = createCallbackMemoizer();
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: undefined
      }
    });
    expect(util.numCalls()).toEqual(0);
    helper({
      callback: util.update,
      indices: {
        startIndex: undefined,
        stopIndex: 0
      }
    });
    expect(util.numCalls()).toEqual(0);
  });
  it('should call onRowsRendered if startIndex and stopIndex are valid', function () {
    var util = new OnRowsRendered();
    var helper = createCallbackMemoizer();
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    });
    expect(util.numCalls()).toEqual(1);
    expect(util.startIndex()).toEqual(0);
    expect(util.stopIndex()).toEqual(1);
  });
  it('should call onRowsRendered if startIndex and stopIndex are invalid but :requireAllKeys is false', function () {
    var util = new OnRowsRendered();
    var helper = createCallbackMemoizer(false);
    helper({
      callback: util.update,
      indices: {
        startIndex: undefined,
        stopIndex: 1
      }
    });
    expect(util.numCalls()).toEqual(1);
    expect(util.startIndex()).toEqual(undefined);
    expect(util.stopIndex()).toEqual(1);
  });
  it('should not call onRowsRendered if startIndex or stopIndex have not changed', function () {
    var util = new OnRowsRendered();
    var helper = createCallbackMemoizer();
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    });
    expect(util.numCalls()).toEqual(1);
    expect(util.startIndex()).toEqual(0);
    expect(util.stopIndex()).toEqual(1);
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    });
    expect(util.numCalls()).toEqual(1);
  });
  it('should not call onRowsRendered if startIndex or stopIndex have changed', function () {
    var util = new OnRowsRendered();
    var helper = createCallbackMemoizer();
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    });
    expect(util.numCalls()).toEqual(1);
    expect(util.startIndex()).toEqual(0);
    expect(util.stopIndex()).toEqual(1);
    helper({
      callback: util.update,
      indices: {
        startIndex: 1,
        stopIndex: 1
      }
    });
    expect(util.numCalls()).toEqual(2);
    expect(util.startIndex()).toEqual(1);
    expect(util.stopIndex()).toEqual(1);
    helper({
      callback: util.update,
      indices: {
        startIndex: 1,
        stopIndex: 2
      }
    });
    expect(util.numCalls()).toEqual(3);
    expect(util.startIndex()).toEqual(1);
    expect(util.stopIndex()).toEqual(2);
  });
  it('should call onRowsRendered if :overscanCellsCount changes', function () {
    var util = new OnRowsRendered();
    var helper = createCallbackMemoizer();
    helper({
      callback: util.update,
      indices: {
        overscanStartIndex: 0,
        overscanStopIndex: 2,
        startIndex: 0,
        stopIndex: 1
      }
    });
    expect(util.numCalls()).toEqual(1);
    expect(util.startIndex()).toEqual(0);
    expect(util.stopIndex()).toEqual(1);
    expect(util.overscanStartIndex()).toEqual(0);
    expect(util.overscanStopIndex()).toEqual(2);
    helper({
      callback: util.update,
      indices: {
        overscanStartIndex: 0,
        overscanStopIndex: 3,
        startIndex: 0,
        stopIndex: 1
      }
    });
    expect(util.numCalls()).toEqual(2);
    expect(util.startIndex()).toEqual(0);
    expect(util.stopIndex()).toEqual(1);
    expect(util.overscanStartIndex()).toEqual(0);
    expect(util.overscanStopIndex()).toEqual(3);
  });
  it('should support an array of indices', function () {
    var numCalls = 0;
    var indices;

    var callback = function callback(params) {
      indices = params;
      numCalls++;
    };

    var helper = createCallbackMemoizer();
    helper({
      callback: callback,
      indices: [0, 1, 2]
    });
    expect(numCalls).toEqual(1);
    expect(indices).toEqual([0, 1, 2]);
    helper({
      callback: callback,
      indices: [0, 1]
    });
    expect(numCalls).toEqual(2);
    expect(indices).toEqual([0, 1]);
  });
  it('should support an attribute containing an array of indices', function () {
    var numCalls = 0;
    var indices;

    var callback = function callback(params) {
      indices = params.indices;
      numCalls++;
    };

    var helper = createCallbackMemoizer();
    helper({
      callback: callback,
      indices: {
        indices: [0, 1, 2]
      }
    });
    expect(numCalls).toEqual(1);
    expect(indices).toEqual([0, 1, 2]);
    helper({
      callback: callback,
      indices: {
        indices: [0, 1]
      }
    });
    expect(numCalls).toEqual(2);
    expect(indices).toEqual([0, 1]);
  });
});