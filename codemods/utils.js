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
export const attributeBelongsToReactVirtualizedElement = path => reactVirtualizedElementNames.includes(path.parent.value.name.name)

// @param path jscodeshift.JSXIdentifier
export const isReactVirtualizedElement = path => reactVirtualizedElementNames.includes(path.value.name)
