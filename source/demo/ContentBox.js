import React from 'react'
import cn from 'classnames'
import './ContentBox.less'

export function ContentBox ({ className, children }) {
  return (
    <div className={cn('ContentBox', className)}>
      {children}
    </div>
  )
}

export function ContentBoxHeader ({ text, link }) {
  return (
    <h1 className='ContentBoxHeader'>
      {text}

      <a
        className='ContentBoxHeader__link'
        href={link}
      >
        View Source
      < /a>
    </h1>
  )
}

export function ContentBoxParagraph ({ children }) {
  return (
    <div className='ContentBoxParagraph'>{children}</div>
  )
}
