/** @flow */
import FlexTable from '../FlexTable'
import React, { Component, PropTypes } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'
import VirtualScroll from '../VirtualScroll'

/**
 * Higher-order component that manages lazy-loading for "infinite" data.
 * This component decorates a FlexTable or VirtualScroll and prefetches rows as a user scrolls to J.I.T. load data.
 * It is intended as a convenience component; fork it if you'd like finer-grained control over data-loading.
 */
export default class InfiniteLoader extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    /** Children must be either FlexTable or VirtualScroll */
    children (props, propName, componentName) {
      let error
      React.Children.forEach(props.children, child => {
        if (!(child.type === FlexTable || child.type === VirtualScroll)) {
          error = new Error(`InfiniteLoader only accepts children of types FlexTable or VirtualScroll not ${child.type}`)
        }
      })
      return error
    },
    /**
     * Height to be passed through to child component.
     */
    height: PropTypes.number,
    /**
     * Function responsible for tracking the loaded state of each row.
     * It should implement the following signature: (index: number): boolean
     */
    isRowLoaded: PropTypes.func.isRequired,
    /**
     * Callback to be invoked when more rows must be loaded.
     * It should implement the following signature: ({ startIndex, stopIndex }): Promise
     * The returned Promise should be resolved once row data has finished loading.
     * It will be used to determine when to refresh the list with the newly-loaded data.
     * This callback may be called multiple times in reaction to a single scroll event.
     */
    loadMoreRows: PropTypes.func.isRequired,
    /**
     * Number of rows in list; can be arbitrary high number if actual number is unknown.
     */
    rowsCount: PropTypes.number.isRequired,
    /**
     * Threshold at which to pre-fetch data.
     * A threshold X means that data will start loading when a user scrolls within X rows.
     * This value defaults to 15.
     */
    threshold: PropTypes.number.isRequired,
    /**
     * Width to be passed through to child component.
     */
    width: PropTypes.number
  }

  static defaultProps = {
    rowsCount: 0,
    threshold: 15
  }

  constructor (props) {
    super(props)

    this._onRowsRendered = this._onRowsRendered.bind(this)
  }

  componentDidReceiveProps (previousProps) {
    const { children } = this.props
    if (previousProps.children !== children) {
      let child = React.Children.only(children)
      this._originalOnRowsRendered = child.props.onRowsRendered
    }
  }

  componentWillMount () {
    const { children } = this.props
    let child = React.Children.only(children)
    this._originalOnRowsRendered = child.props.onRowsRendered
  }

  render () {
    const { children, height, width, ...props } = this.props

    let child = React.Children.only(children)

    const childProps = {
      ref: 'Child',
      onRowsRendered: this._onRowsRendered
    }

    if (height >= 0) {
      childProps.height = height
    }

    if (width >= 0) {
      childProps.width = width
    }

    return React.cloneElement(child, childProps)
  }

  _onRowsRendered ({ startIndex, stopIndex }) {
    const { isRowLoaded, loadMoreRows, rowsCount, threshold } = this.props

    this._lastRenderedStartIndex = startIndex
    this._lastRenderedStopIndex = stopIndex

    const unloadedRanges = scanForUnloadedRanges({
      isRowLoaded,
      startIndex: Math.max(0, startIndex - threshold),
      stopIndex: Math.min(rowsCount, stopIndex + threshold)
    })

    unloadedRanges.forEach(unloadedRange => {
      let promise = loadMoreRows(unloadedRange)
      if (promise) {
        promise.then(() => {
          // Refresh the visible rows if any of them have just been loaded
          if (
            isRangeVisible({
              lastRenderedStartIndex: this._lastRenderedStartIndex,
              lastRenderedStopIndex: this._lastRenderedStopIndex,
              startIndex: unloadedRange.startIndex,
              stopIndex: unloadedRange.stopIndex
            })
          ) {
            // In case the component has been unmounted since the range was loaded
            if (this.refs.Child) {
              this.refs.Child.forceUpdate()
            }
          }
        })
      }
    })

    if (this._originalOnRowsRendered) {
      this._originalOnRowsRendered({ startIndex, stopIndex })
    }
  }
}

/**
 * Determines if the specified start/stop range is visible based on the most recently rendered range.
 */
export function isRangeVisible ({
  lastRenderedStartIndex,
  lastRenderedStopIndex,
  startIndex,
  stopIndex
}) {
  return !(startIndex > lastRenderedStopIndex || stopIndex < lastRenderedStartIndex)
}

/**
 * Returns all of the ranges within a larger range that contain unloaded rows.
 */
export function scanForUnloadedRanges ({ isRowLoaded, startIndex, stopIndex }) {
  const unloadedRanges = []
  let rangeStartIndex = null
  let rangeStopIndex = null

  for (let i = startIndex; i <= stopIndex; i++) {
    let loaded = isRowLoaded(i)

    if (!loaded) {
      rangeStopIndex = i
      if (rangeStartIndex === null) {
        rangeStartIndex = i
      }
    } else if (rangeStopIndex !== null) {
      unloadedRanges.push({
        startIndex: rangeStartIndex,
        stopIndex: rangeStopIndex
      })

      rangeStartIndex = rangeStopIndex = null
    }
  }

  if (rangeStopIndex !== null) {
    unloadedRanges.push({
      startIndex: rangeStartIndex,
      stopIndex: rangeStopIndex
    })
  }

  return unloadedRanges
}
