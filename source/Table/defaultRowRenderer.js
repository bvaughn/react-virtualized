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
  onRowMouseOver,
  onRowMouseOut,
  rowData,
  style
}: RowRendererParams) {
  const a11yProps = {}

  if (
    onRowClick ||
    onRowDoubleClick ||
    onRowMouseOver ||
    onRowMouseOut
  ) {
    a11yProps['aria-label'] = 'row'
    a11yProps.role = 'row'
    a11yProps.tabIndex = 0

    if (onRowClick) {
      a11yProps.onClick = (evt) => onRowClick({ evt, index, rowData })
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = (evt) => onRowDoubleClick({ evt, index, rowData })
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = (evt) => onRowMouseOut({ evt, index, rowData })
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = (evt) => onRowMouseOver({ evt, index, rowData })
    }
  }

  return (
    <div
      {...a11yProps}
      className={className}
      key={key}
      style={style}
    >
      {columns}
    </div>
  )
}
