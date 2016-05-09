'use strict'

// Renames react-virtualized version 6.x properties to be version-7 compatible
module.exports = function transformer (file, api) {
  const jscodeshift = api.jscodeshift

  let source = file.source

  // Rename variable references
  for (var property in propertyRenameMap) {
    source = jscodeshift(source)
      .findVariableDeclarators(property)
      .renameTo(propertyRenameMap[property])
      .toSource()
  }

  // Rename JSX attributes
  source = jscodeshift(source)
    .find(jscodeshift.JSXAttribute)
    .filter(shouldAttributeBeRenamed)
    .replaceWith(renameReactVirtualizedAttribute)
    .toSource()

  return source
}

const reactVirtualizedElementNames = [
  'ArrowKeyStepper',
  'AutoSizer',
  'Collection',
  'ColumnSizer',
  'FlexTable',
  'Grid',
  'ScrollSync',
  'VirtualScroll'
]

// @param path jscodeshift.JSXAttribute
const attributeBelongsToReactVirtualizedElement = path => reactVirtualizedElementNames.includes(path.parent.value.name.name)

// See https://github.com/bvaughn/react-virtualized/wiki/Version-7-Roadmap#clean-up-property-names
const propertyRenameMap = {
  cellClassName: 'className',
  columnsCount: 'columnCount',
  overscanColumnsCount: 'overscanColumnCount',
  overscanRowsCount: 'overscanRowCount',
  renderCell: 'cellRenderer',
  renderCellRanges: 'cellRangeRenderer',
  rowsCount: 'rowCount'
}

// @param path jscodeshift.JSXAttribute
const shouldAttributeBeRenamed = path => attributeBelongsToReactVirtualizedElement(path) && isAttributeInPropertyRenameMap(path)

// @param path jscodeshift.JSXAttribute
const isAttributeInPropertyRenameMap = path => propertyRenameMap.hasOwnProperty(path.value.name.name)

// @param path jscodeshift.JSXAttribute
const renameReactVirtualizedAttribute = path => {
  path.value.name.name = propertyRenameMap[path.value.name.name] || path.value.name.name

  return path.node
}
