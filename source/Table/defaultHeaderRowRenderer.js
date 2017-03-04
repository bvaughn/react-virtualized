/** @flow */
import React from 'react'
import type { HeaderRowRendererParams } from './types'

export default function defaultHeaderRowRenderer ({
  className,
  columns,
  style
}: HeaderRowRendererParams) {
  return <div
    className={className}
    style={style}
  >
    {columns}
  </div>
}
