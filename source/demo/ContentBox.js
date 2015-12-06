import React from 'react'
import cn from 'classnames'
import './ContentBox.css'

export function ContentBox ({ className, children }) {
  return (
    <div className={cn('ContentBox', className)}>
      {children}
    </div>
  )
}

export function ContentBoxHeader ({ text, sourceLink, docsLink }) {
  return (
    <h1 className='ContentBoxHeader'>
      {text}

      <small className='ContentBoxHeader__small'>
        <a
          className='ContentBoxHeader__link'
          href={sourceLink}
        >
          Source
        </a>
        <span> | </span>
        <a
          className='ContentBoxHeader__link'
          href={docsLink}
        >
          Docs
        </a>
      </small>
    </h1>
  )
}

export function ContentBoxParagraph ({ children }) {
  return (
    <div className='ContentBoxParagraph'>{children}</div>
  )
}
