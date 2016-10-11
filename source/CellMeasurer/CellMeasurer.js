/** @flow */
import invariant from 'invariant';
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import ReactDOM from 'react-dom'
import CellSizeCache from './defaultCellSizeCache'

type CellRenderer = (pos: {columnIndex: number; rowIndex: number}) => React.Element<any>

type CellMeasurerCallback = (params: {
  getColumnWidth: (loc: { index: number }) => ?number;
  getRowHeight: (loc: { index: number }) => ?number;
  resetMeasurements: () => void;
  resetMeasurementForColumn: (columnIndex: number) => void;
  resetMeasurementForRow: (rowIndex: number) => void;
}) => React.Element<any>;

type CellMeasurerProps = {
  cellRenderer: CellRenderer;
  cellSizeCache?: Object;
  children: CellMeasurerCallback;
  width?: number;
  height?: number;
  container: HTMLElement | (() => HTMLElement);
  columnCount: number;
  rowCount: number;
};

/**
 * Measures a Grid cell's contents by rendering them in a way that is not visible to the user.
 * Either a fixed width or height may be provided if it is desirable to measure only in one direction.
 */
export default class CellMeasurer extends Component<*, CellMeasurerProps, *> {

  _div: ?HTMLElement;
  _divHeight: number;
  _divWidth: number;
  _containerNode: ?HTMLElement;
  _cellSizeCache: CellSizeCache;

  static propTypes = {
    /**
     * Renders a cell given its indices.
     * Should implement the following interface: ({ columnIndex: number, rowIndex: number }): PropTypes.node
     */
    cellRenderer: PropTypes.func.isRequired,

    /**
     * Optional, custom caching strategy for cell sizes.
     */
    cellSizeCache: PropTypes.object,

    /**
     * Function responsible for rendering a virtualized component.
     * This function should implement the following signature:
     * ({ getColumnWidth, getRowHeight, resetMeasurements }) => PropTypes.element
     */
    children: PropTypes.func.isRequired,

    /**
     * Number of columns in grid.
     */
    columnCount: PropTypes.number.isRequired,

    /**
     * A Node, Component instance, or function that returns either.
     * If this property is not specified the document body will be used.
     */
    container: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.node
    ]),

    /**
     * Assign a fixed :height in order to measure dynamic text :width only.
     */
    height: PropTypes.number,

    /**
     * Number of rows in grid.
     */
    rowCount: PropTypes.number.isRequired,

    /**
     * Assign a fixed :width in order to measure dynamic text :height only.
     */
    width: PropTypes.number
  };

  constructor (props: CellMeasurerProps) {
    super(props)

    this._cellSizeCache = props.cellSizeCache || new CellSizeCache()
  }

  getColumnWidth = ({ index }: { index: number }) => {
    if (this._cellSizeCache.hasColumnWidth(index)) {
      return this._cellSizeCache.getColumnWidth(index)
    }

    const { rowCount } = this.props

    let maxWidth = 0

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      let { width } = this._measureCell({
        clientWidth: true,
        columnIndex: index,
        rowIndex
      })

      maxWidth = Math.max(maxWidth, width)
    }

    this._cellSizeCache.setColumnWidth(index, maxWidth)

    return maxWidth
  }

  getRowHeight = ({ index }: { index: number }) => {
    if (this._cellSizeCache.hasRowHeight(index)) {
      return this._cellSizeCache.getRowHeight(index)
    }

    const { columnCount } = this.props

    let maxHeight = 0

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
      let { height } = this._measureCell({
        clientHeight: true,
        columnIndex,
        rowIndex: index
      })

      maxHeight = Math.max(maxHeight, height)
    }

    this._cellSizeCache.setRowHeight(index, maxHeight)

    return maxHeight
  }

  resetMeasurementForColumn = (columnIndex: number) => {
    this._cellSizeCache.clearColumnWidth(columnIndex)
  }

  resetMeasurementForRow = (rowIndex: number) => {
    this._cellSizeCache.clearRowHeight(rowIndex)
  }

  resetMeasurements = () => {
    this._cellSizeCache.clearAllColumnWidths()
    this._cellSizeCache.clearAllRowHeights()
  }

  componentDidMount () {
    this._renderAndMount()
  }

  componentWillReceiveProps (nextProps: CellMeasurerProps) {
    const { cellSizeCache } = this.props

    if (cellSizeCache !== nextProps.cellSizeCache && nextProps.cellSizeCache != null) {
      this._cellSizeCache = nextProps.cellSizeCache
    }

    this._updateDivDimensions(nextProps)
  }

  componentWillUnmount () {
    this._unmountContainer()
  }

  render () {
    const { children } = this.props

    return children({
      getColumnWidth: this.getColumnWidth,
      getRowHeight: this.getRowHeight,
      resetMeasurements: this.resetMeasurements,
      resetMeasurementForColumn: this.resetMeasurementForColumn,
      resetMeasurementForRow: this.resetMeasurementForRow
    })
  }

  shouldComponentUpdate (nextProps: CellMeasurerProps) {
    return shallowCompare(this, nextProps, this.state)
  }

  _getContainerNode (props: CellMeasurerProps) {
    const { container } = props

    if (container) {
      return ReactDOM.findDOMNode(
        typeof container === 'function'
          ? container()
          : container
      )
    } else {
      return document.body
    }
  }

  _measureCell ({
    clientHeight = false,
    clientWidth = true,
    columnIndex,
    rowIndex
  }: {
    clientHeight?: boolean;
    clientWidth?: boolean;
    columnIndex: number;
    rowIndex: number;
  }) {
    const { cellRenderer } = this.props

    const rendered = cellRenderer({
      columnIndex,
      rowIndex
    })

    // Handle edge case where this method is called before the CellMeasurer has completed its initial render (and mounted).
    this._renderAndMount()

    // @TODO Keep an eye on this for future React updates as the interface may change:
    // https://twitter.com/soprano/status/737316379712331776
    ReactDOM.unstable_renderSubtreeIntoContainer(this, rendered, this._div)

    invariant(this._div != null, 'Missing element');

    const measurements = {
      height: clientHeight ? this._div.clientHeight : 0,
      width: clientWidth ? this._div.clientWidth : 0,
    }

    ReactDOM.unmountComponentAtNode(this._div)

    return measurements
  }

  _renderAndMount () {
    if (!this._div) {
      this._div = document.createElement('div')
      this._div.style.display = 'inline-block'
      this._div.style.position = 'absolute'
      this._div.style.visibility = 'hidden'
      this._div.style.zIndex = '-1'

      this._updateDivDimensions(this.props)

      this._containerNode = this._getContainerNode(this.props)
      invariant(this._div != null, 'Missing element');
      this._containerNode.appendChild(this._div)
    }
  }

  _unmountContainer () {
    if (this._div && this._containerNode) {
      this._containerNode.removeChild(this._div)

      this._div = null
    }

    this._containerNode = null
  }

  _updateDivDimensions (props: CellMeasurerProps) {
    invariant(this._div != null, 'Missing element');
    const { height, width } = props

    if (
      height &&
      height !== this._divHeight
    ) {
      this._divHeight = height
      this._div.style.height = `${height}px`
    }

    if (
      width &&
      width !== this._divWidth
    ) {
      this._divWidth = width
      this._div.style.width = `${width}px`
    }
  }
}
