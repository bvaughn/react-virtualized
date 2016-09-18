const renameMap = {
  FlexColumn: 'Column',
  FlexTable: 'Table',
  VirtualScroll: 'List'
}

module.exports = function transformer (file, api) {
  const j = api.jscodeshift

  return j(file.source)
    .find(j.Identifier)
    .filter(
      identifier => !!renameMap[identifier.value.name]
    )
    .replaceWith(
      identifier => j.identifier(renameMap[identifier.node.name])
    )
    .toSource()
}
