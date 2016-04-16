import createCallbackMemoizer from './createCallbackMemoizer'

describe('createCallbackMemoizer', () => {
  function OnRowsRendered () {
    let numCalls = 0
    let overscanStartIndex
    let overscanStopIndex
    let startIndex
    let stopIndex

    return {
      numCalls: () => numCalls,
      overscanStartIndex: () => overscanStartIndex,
      overscanStopIndex: () => overscanStopIndex,
      startIndex: () => startIndex,
      stopIndex: () => stopIndex,
      update: (params) => {
        overscanStartIndex = params.overscanStartIndex
        overscanStopIndex = params.overscanStopIndex
        startIndex = params.startIndex
        stopIndex = params.stopIndex
        numCalls++
      }
    }
  }

  it('should not call onRowsRendered if startIndex or stopIndex are invalid', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer()
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: undefined
      }
    })
    expect(util.numCalls()).toEqual(0)
    helper({
      callback: util.update,
      indices: {
        startIndex: undefined,
        stopIndex: 0
      }
    })
    expect(util.numCalls()).toEqual(0)
  })

  it('should call onRowsRendered if startIndex and stopIndex are valid', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer()
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
  })

  it('should call onRowsRendered if startIndex and stopIndex are invalid but :requireAllKeys is false', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer(false)
    helper({
      callback: util.update,
      indices: {
        startIndex: undefined,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(undefined)
    expect(util.stopIndex()).toEqual(1)
  })

  it('should not call onRowsRendered if startIndex or stopIndex have not changed', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer()
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
  })

  it('should not call onRowsRendered if startIndex or stopIndex have changed', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer()
    helper({
      callback: util.update,
      indices: {
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    helper({
      callback: util.update,
      indices: {
        startIndex: 1,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(2)
    expect(util.startIndex()).toEqual(1)
    expect(util.stopIndex()).toEqual(1)
    helper({
      callback: util.update,
      indices: {
        startIndex: 1,
        stopIndex: 2
      }
    })
    expect(util.numCalls()).toEqual(3)
    expect(util.startIndex()).toEqual(1)
    expect(util.stopIndex()).toEqual(2)
  })

  it('should call onRowsRendered if :overscanCellsCount changes', () => {
    const util = new OnRowsRendered()
    const helper = createCallbackMemoizer()
    helper({
      callback: util.update,
      indices: {
        overscanStartIndex: 0,
        overscanStopIndex: 2,
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(1)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    expect(util.overscanStartIndex()).toEqual(0)
    expect(util.overscanStopIndex()).toEqual(2)
    helper({
      callback: util.update,
      indices: {
        overscanStartIndex: 0,
        overscanStopIndex: 3,
        startIndex: 0,
        stopIndex: 1
      }
    })
    expect(util.numCalls()).toEqual(2)
    expect(util.startIndex()).toEqual(0)
    expect(util.stopIndex()).toEqual(1)
    expect(util.overscanStartIndex()).toEqual(0)
    expect(util.overscanStopIndex()).toEqual(3)
  })
})
