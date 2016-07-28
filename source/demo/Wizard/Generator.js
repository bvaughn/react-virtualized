export default function Generator ({
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
}) {
  if (!hasMultipleColumns && !hasMultipleRows) {
    return '<div>Looks like you don\'t need react-virtualized.</div>'
  }

  const baseComponent = getBaseComponent({
    doNotVirtualizeColumns,
    hasMultipleColumns,
    nonCheckerboardPattern
  })
  const useAutoSizer = !collectionHasFixedHeight || !collectionHasFixedWidth
  const useCellMeasurer = (
    !cellsHaveKnownHeight ||
    !cellsHaveKnownWidth && !doNotVirtualizeColumns
  )

  // TODO Share these with CellMeasurer?
  const heightValue = collectionHasFixedHeight ? 600 : 'height'
  const widthValue = collectionHasFixedWidth ? 800 : 'width'

  baseComponent.props.height = heightValue
  baseComponent.props.width = widthValue

  if (baseComponent.columnWidthProp) {
    baseComponent.props[baseComponent.columnWidthProp] =
      hasMultipleColumns
        ? cellsHaveKnownWidth
          ? cellsHaveUniformWidth
            ? 100
            : '({ index }) => 100'
          : 'getColumnWidth'
        : widthValue
  }
  if (baseComponent.rowHeightProp) {
    baseComponent.props[baseComponent.rowHeightProp] =
      hasMultipleRows
        ? cellsHaveKnownHeight
          ? cellsHaveUniformHeight
            ? 50
            : '({ index }) => 50'
          : 'getRowHeight'
        : heightValue
  }

  if (baseComponent.columnCountProp) {
    baseComponent.props[baseComponent.columnCountProp] =
      hasMultipleColumns
        ? 'numColumns'
        : '1'
  }
  if (baseComponent.rowCountProp) {
    baseComponent.props[baseComponent.rowCountProp] =
      hasMultipleRows
        ? hasMultipleColumns
          ? 'numRows'
          : 'collection.size'
        : '1'
  }

  let component = baseComponent

  if (useCellMeasurer) {
    component = getCellMeasurer({
      cellsHaveKnownHeight,
      collectionHasFixedHeight,
      collectionHasFixedWidth,
      child: component,
      indentation: useAutoSizer ? 4 : 0
    })
  }

  if (useAutoSizer) {
    component = getAutoSizer({
      child: component
    })
  }

  return componentToString({ component })
}

function componentToString ({
  component,
  indentation = 0
}) {
  const spaces = indentationToSpaces(indentation)
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

function getAutoSizer ({
  child,
  collectionHasFixedHeight,
  collectionHasFixedWidth
}) {
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
  children.push(componentToString({
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

function getBaseComponent ({
  doNotVirtualizeColumns,
  hasMultipleColumns,
  nonCheckerboardPattern
}) {
  if (nonCheckerboardPattern) {
    return getCollectionMarkup()
  } else if (!hasMultipleColumns) {
    return getVirtualScrollMarkup()
  } else if (doNotVirtualizeColumns) {
    return getFlexTableMarkup()
  } else {
    return getGridMarkup()
  }
}

function getCellMeasurer ({
  cellsHaveKnownHeight,
  collectionHasFixedHeight,
  collectionHasFixedWidth,
  child,
  indentation
}) {
  const spaces = indentationToSpaces(indentation)

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
  if (cellsHaveKnownHeight) {
    props.height = heightValue
    methodSignature = '({ getColumnWidth })'
  } else {
    props.width = widthValue
    methodSignature = '({ getRowHeight })'
  }

  const children = []
  children.push(`${spaces}  ${methodSignature} => (`)
  children.push(componentToString({
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

function getCollectionMarkup () {
  return {
    name: 'Collection',
    props: {
      cellCount: 'collection.size',
      cellRenderer: '({ index }) => collection.getIn([index, "name"])',
      cellSizeAndPositionGetter: '({ index, isScrolling  }) => ({ height, width, x, y })'
    }
  }
}

function getFlexTableMarkup () {
  return {
    name: 'FlexTable',
    props: {
      headerHeight: 30,
      rowGetter: '({ index }) => collection.get(index)'
    },
    rowCountProp: 'rowCount',
    rowHeightProp: 'rowHeight',
    children: '<!-- Insert FlexColumn children here -->' // @TODO
  }
}

function getGridMarkup () {
  return {
    name: 'Grid',
    props: {
      cellRenderer: '({ columnIndex, isScrolling, rowIndex }) => <div/>'
    },
    columnCountProp: 'columnCount',
    columnWidthProp: 'columnWidth',
    rowCountProp: 'rowCount',
    rowHeightProp: 'rowHeight'
  }
}

function getVirtualScrollMarkup () {
  return {
    name: 'VirtualScroll',
    props: {
      rowRenderer: '({ index, isScrolling  }) => collection.getIn([index, "name"])'
    },
    rowHeightProp: 'rowHeight'
  }
}

function indentationToSpaces (indentation) {
  return Array.from(Array(indentation)).map(() => ' ').join('')
}
