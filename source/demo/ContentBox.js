import React from 'react'
import cn from 'classnames'
import styles from './ContentBox.css'

export function ContentBox ({ className, children, ...props }) {
  return (
    <div
      className={cn(styles.ContentBox, className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ContentBoxHeader ({ text, sourceLink, docsLink, ...props }) {
  return (
    <h1
      className={styles.Header}
      {...props}
    >
      {text}

      <small className={styles.Small}>
        <a
          className={styles.Link}
          href={sourceLink}
        >
          Source
        </a>
        <span> | </span>
        <a
          className={styles.Link}
          href={docsLink}
        >
          Docs
        </a>
      </small>
    </h1>
  )
}

export function ContentBoxParagraph ({ children, ...props }) {
  return (
    <div
      className={styles.Paragraph}
      {...props}
    >
      {children}
    </div>
  )
}
