/** @noflow */
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
      a11yProps.onClick = () => onRowClick({ index })
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = () => onRowDoubleClick({ index })
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = () => onRowMouseOut({ index })
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = () => onRowMouseOver({ index })
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
