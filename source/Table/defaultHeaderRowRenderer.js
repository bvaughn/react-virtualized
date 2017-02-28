/** @flow */
import React from 'react'
import type { HeaderRowRendererParams } from './types'

export default function defaultHeaderRowRenderer ({
  className,
  style,
  height,
  width,
  scrollbarWidth,
  columns
}: HeaderRowRendererParams) {
  return <div
    className={className}
    style={{
      ...style,
      height: height,
      overflow: 'hidden',
      paddingRight: scrollbarWidth,
      width: width
    }}
  >
    {columns}
  </div>
}
