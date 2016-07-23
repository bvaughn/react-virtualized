/* @flow */
import cn from 'classnames'
import React, { Component } from 'react'
import { ContentBox, ContentBoxHeader } from '../ContentBox'
import styles from './Wizard.css'

// @TODO Clean up this class; it's pretty hacky.
export default class Wizard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      cellsHaveKnownHeight: true,
      cellsHaveKnownWidth: true,
      cellsHaveUniformHeight: true,
      cellsHaveUniformWidth: true,
      collectionHasFixedHeight: false,
      collectionHasFixedWidth: false,
      doNotVirtualizeColumns: false,
      hasMultipleColumns: true,
      hasMultipleRows: true,
      nonCheckerboardPattern: false
    }
  }

  render () {
    const {
      cellsHaveKnownHeight,
      cellsHaveKnownWidth,
      cellsHaveUniformHeight,
      cellsHaveUniformWidth,
      collectionHasFixedHeight,
      collectionHasFixedWidth,
      doNotVirtualizeColumns,
      hasMultipleColumns,
      hasMultipleRows,
      nonCheckerboardPattern
    } = this._sanitizeState()

    // @TODO Use react-highlighter for markup

    return (
      <div>
        <ContentBox>
          <ContentBoxHeader text='Collection Layout and Sizing' />
          <Option
            checked={hasMultipleRows}
            label='Will your collection have more than 1 row of data?'
            onChange={(hasMultipleRows) => this.setState({ hasMultipleRows })}
          />
          <Option
            checked={hasMultipleColumns}
            label='Will your collection have more than 1 column of data?'
            onChange={(hasMultipleColumns) => this.setState({ hasMultipleColumns })}
          />
          <Option
            checked={doNotVirtualizeColumns}
            disabled={!hasMultipleColumns}
            label='Should all your columns be visible at once?'
            onChange={(doNotVirtualizeColumns) => this.setState({ doNotVirtualizeColumns })}
          />
          <Option
            checked={nonCheckerboardPattern}
            disabled={!hasMultipleColumns || !hasMultipleRows}
            label='Is your data scattered (not in a checkberboard pattern)?'
            onChange={(nonCheckerboardPattern) => this.setState({ nonCheckerboardPattern })}
          />
          <Option
            disabled={!hasMultipleRows && !hasMultipleColumns}
            checked={collectionHasFixedHeight}
            label='Does your collection have a fixed height?'
            onChange={(collectionHasFixedHeight) => this.setState({ collectionHasFixedHeight })}
          />
          <Option
            disabled={!hasMultipleRows && !hasMultipleColumns}
            checked={collectionHasFixedWidth}
            label='Does your collection have a fixed width?'
            onChange={(collectionHasFixedWidth) => this.setState({ collectionHasFixedWidth })}
          />
        </ContentBox>
        <ContentBox>
          <ContentBoxHeader text='Cell Sizing' />
          <Option
            disabled={nonCheckerboardPattern || !cellsHaveKnownWidth || (!hasMultipleRows && !hasMultipleColumns)}
            checked={cellsHaveKnownHeight && !nonCheckerboardPattern}
            label='Do you know the height of your rows ahead of time?'
            onChange={(cellsHaveKnownHeight) => this.setState({ cellsHaveKnownHeight })}
          />
          <Option
            disabled={nonCheckerboardPattern || !cellsHaveKnownHeight || (!hasMultipleRows && !hasMultipleColumns)}
            checked={cellsHaveKnownWidth && !nonCheckerboardPattern}
            label='Do you know the width of your columns ahead of time?'
            onChange={(cellsHaveKnownWidth) => this.setState({ cellsHaveKnownWidth })}
          />
          <Option
            checked={cellsHaveUniformHeight}
            disabled={!hasMultipleRows || nonCheckerboardPattern || !cellsHaveKnownHeight}
            label='Are all of your rows the same height?'
            onChange={(cellsHaveUniformHeight) => this.setState({ cellsHaveUniformHeight })}
          />
          <Option
            checked={cellsHaveUniformWidth}
            disabled={!hasMultipleColumns || nonCheckerboardPattern || !cellsHaveKnownWidth}
            label='Are all of your columns the same width?'
            onChange={(cellsHaveUniformWidth) => this.setState({ cellsHaveUniformWidth })}
          />
        </ContentBox>
        <ContentBox>
          <ContentBoxHeader text='Suggested Starting Point' />
          <pre>
            {this._generateMarkup()}
          </pre>
        </ContentBox>
      </div>
    )
  }

  _componentToString ({ component, indentation = 0 }) {
    const spaces = this._indentationToSpaces(indentation)
    const hasProps = Object.keys(component.props).length > 0
    const markup = []

    if (hasProps) {
      markup.push(`${spaces}<${component.name}`)
    } else {
      markup.push(`${spaces}<${component.name}>`)
    }

    if (hasProps) {
      markup.push(
        Object.keys(component.props).sort().map(
          (key) => `${spaces}  ${key}={${component.props[key]}}`
        ).join(`\n`)
      )
    }

    if (component.children) {
      if (hasProps) {
        markup.push(`${spaces}>`)
      }

      markup.push(component.children)
    }

    if (component.children) {
      markup.push(`${spaces}</${component.name}>`)
    } else if (hasProps) {
      markup.push(`${spaces}/>`)
    }

    return markup.join(`\n`)
  }

  _generateMarkup () {
    const {
      cellsHaveKnownHeight,
      cellsHaveKnownWidth,
      cellsHaveUniformHeight,
      cellsHaveUniformWidth,
      collectionHasFixedHeight,
      collectionHasFixedWidth,
      hasMultipleColumns,
      hasMultipleRows
    } = this._sanitizeState()

    if (!hasMultipleColumns && !hasMultipleRows) {
      return '<div>Looks like you don\'t need react-virtualized.</div>'
    }

    const baseComponent = this._getBaseComponent()
    const useAutoSizer = !collectionHasFixedHeight || !collectionHasFixedWidth
    const useCellMeasurer = !cellsHaveKnownWidth || !cellsHaveKnownHeight

    // TODO Share these with CellMeasurer?
    const heightValue = collectionHasFixedHeight ? 600 : 'height'
    const widthValue = collectionHasFixedWidth ? 800 : 'width'
    const columnWidthValue = hasMultipleColumns
      ? cellsHaveKnownWidth
        ? cellsHaveUniformWidth
          ? 100
          : '({ index }) => 100'
        : 'getColumnWidth'
      : widthValue
    const rowHeightValue = hasMultipleRows
      ? cellsHaveKnownHeight
        ? cellsHaveUniformHeight
          ? 50
          : '({ index }) => 50'
        : 'getRowHeight'
      : heightValue

    baseComponent.props.height = heightValue
    baseComponent.props.width = widthValue

    if (baseComponent.columnWidthProp) {
      baseComponent.props[baseComponent.columnWidthProp] = columnWidthValue
    }
    if (baseComponent.rowHeightProp) {
      baseComponent.props[baseComponent.rowHeightProp] = rowHeightValue
    }

    let component = baseComponent

    if (useCellMeasurer) {
      component = this._getCellMeasurer({
        child: component,
        indentation: useAutoSizer ? 4 : 0
      })
    }

    if (useAutoSizer) {
      component = this._getAutoSizer({
        child: component
      })
    }

    return this._componentToString({ component })
  }

  _getAutoSizer ({
    child
  }) {
    const {
      collectionHasFixedHeight,
      collectionHasFixedWidth
    } = this._sanitizeState()

    const props = {}

    if (collectionHasFixedHeight) {
      props.disableHeight = true
    }
    if (collectionHasFixedWidth) {
      props.disableWidth = true
    }

    let methodSignature = '({ height, width })'
    if (collectionHasFixedWidth) {
      methodSignature = '({ height })'
    } else if (collectionHasFixedHeight) {
      methodSignature = '({ width })'
    }

    const children = []
    children.push(`  ${methodSignature} => (`)
    children.push(this._componentToString({
      component: child,
      indentation: 4
    }))
    children.push('  )')

    return {
      name: 'AutoSizer',
      props,
      children: children.join(`\n`)
    }
  }

  _getBaseComponent () {
    const {
      doNotVirtualizeColumns,
      hasMultipleColumns,
      nonCheckerboardPattern
    } = this._sanitizeState()

    if (nonCheckerboardPattern) {
      return this._getCollectionMarkup()
    } else if (!hasMultipleColumns) {
      return this._getVirtualScrollMarkup()
    } else if (doNotVirtualizeColumns) {
      return this._getFlexTableMarkup()
    } else {
      return this._getGridMarkup()
    }
  }

  _getCellMeasurer ({
    child,
    indentation
  }) {
    const spaces = this._indentationToSpaces(indentation)

    const {
      cellsHaveUniformHeight,
      collectionHasFixedHeight,
      collectionHasFixedWidth
    } = this._sanitizeState()

    // TODO Share these with render()?
    const heightValue = collectionHasFixedHeight ? 600 : 'height'
    const widthValue = collectionHasFixedWidth ? 800 : 'width'

    const props = {
      cellRenderer: 'yourCellRenderer', // @TODO pass down?
      columnCount: 'numColumns',
      rowCount: 'numRows'
    }
    let methodSignature

    // @TODO CellMeasurer doesn't support both dynamic widths and heights. Warn about this.
    if (cellsHaveUniformHeight) {
      props.height = heightValue
      methodSignature = '({ getColumnWidth })'
    } else {
      props.width = widthValue
      methodSignature = '({ getRowHeight })'
    }

    const children = []
    children.push(`${spaces}  ${methodSignature} => (`)
    children.push(this._componentToString({
      component: child,
      indentation: indentation + 4
    }))
    children.push(`${spaces}  )`)

    return {
      name: 'CellMeasurer',
      props,
      children: children.join(`\n`)
    }
  }

  _getCollectionMarkup () {
    return {
      name: 'Collection',
      props: {
        cellCount: 'collection.size',
        cellRenderer: '({ index }) => collection.getIn([index, "name"])',
        cellSizeAndPositionGetter: '({ index, isScrolling  }) => ({ height, width, x, y })'
      }
    }
  }

  _getFlexTableMarkup () {
    return {
      name: 'FlexTable',
      props: {
        headerHeight: 30,
        rowCount: 'collection.size',
        rowGetter: '({ index }) => collection.get(index)'
      },
      rowHeightProp: 'rowHeight',
      children: '<!-- Insert FlexColumn children here -->' // @TODO
    }
  }

  _getGridMarkup () {
    return {
      name: 'Grid',
      props: {
        columnCount: 'numColumns',
        rowCount: 'numRows',
        cellRenderer: '({ columnIndex, isScrolling, rowIndex }) => <div/>'
      },
      columnWidthProp: 'columnWidth',
      rowHeightProp: 'rowHeight'
    }
  }

  _getVirtualScrollMarkup () {
    return {
      name: 'VirtualScroll',
      props: {
        rowCount: 'collection.size',
        rowRenderer: '({ index, isScrolling  }) => collection.getIn([index, "name"])'
      },
      rowHeightProp: 'rowHeight'
    }
  }

  _indentationToSpaces (indentation) {
    return Array.from(Array(indentation)).map(() => ' ').join('')
  }

  _sanitizeState () {
    const {
      cellsHaveKnownHeight,
      cellsHaveKnownWidth,
      cellsHaveUniformHeight,
      cellsHaveUniformWidth,
      collectionHasFixedHeight,
      collectionHasFixedWidth,
      doNotVirtualizeColumns,
      hasMultipleColumns,
      hasMultipleRows,
      nonCheckerboardPattern
    } = this.state

    return {
      cellsHaveKnownHeight,
      cellsHaveKnownWidth,
      cellsHaveUniformHeight: cellsHaveUniformHeight && hasMultipleRows && !nonCheckerboardPattern && cellsHaveKnownHeight,
      cellsHaveUniformWidth: cellsHaveUniformWidth && hasMultipleColumns && !nonCheckerboardPattern && cellsHaveKnownWidth,
      collectionHasFixedHeight,
      collectionHasFixedWidth,
      doNotVirtualizeColumns: doNotVirtualizeColumns && hasMultipleColumns,
      hasMultipleColumns,
      hasMultipleRows,
      nonCheckerboardPattern: nonCheckerboardPattern && hasMultipleColumns && hasMultipleRows
    }
  }
}

function Option ({
  checked,
  disabled = false,
  label,
  onChange
}) {
  return (
    <div
      className={cn(styles.Option, {
        [styles.OptionDisabled]: disabled
      })}
    >
      <label>
        <input
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          type='checkbox'
        />
        {label}
      </label>
    </div>
  )
}
