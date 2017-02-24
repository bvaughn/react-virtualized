/** @flow */
import React from 'react'
import type { HeaderRendererParams, HeaderRowRendererParams } from './types'
import Column from './Column'

export default function defaultHeaderRowRenderer({
  className,
  style,
  height,
  width,
  scrollbarWidth,
  columns
}:HeaderRowRendererParams) {
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
