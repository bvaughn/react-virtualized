/** @flow */
import React from 'react'
import type { RowRendererParams } from './types'

/**
 * Default row renderer for Table.
 */
export default function defaultRowRenderer ({
  className,
  columns,
  index,
  isScrolling,
  key,
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  onRowMouseOver,
  onRowMouseOut,
  rowData,
  style
}: RowRendererParams) {
  const a11yProps = {}

  if (
    onRowClick ||
    onRowDoubleClick ||
    onRowContextMenu ||
    onRowMouseOver ||
    onRowMouseOut
  ) {
    a11yProps['aria-label'] = 'row'
    a11yProps.tabIndex = 0

    if (onRowClick) {
      a11yProps.onClick = (event) => onRowClick({ event, index, rowData })
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = (event) => onRowDoubleClick({ event, index, rowData })
    }
    if (onRowContextMenu) {
      a11yProps.onContextMenu = (event) => onRowContextMenu({ event, index, rowData })
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = (event) => onRowMouseOut({ event, index, rowData })
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = (event) => onRowMouseOver({ event, index, rowData })
    }
  }

  return (
    <div
      {...a11yProps}
      className={className}
      key={key}
      role='row'
      style={style}
    >
      {columns}
    </div>
  )
}
