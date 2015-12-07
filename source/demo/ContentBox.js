import React from 'react'
import cn from 'classnames'
import styles from './ContentBox.css'

export function ContentBox ({ className, children }) {
  return (
    <div className={cn(styles.ContentBox, className)}>
      {children}
    </div>
  )
}

export function ContentBoxHeader ({ text, sourceLink, docsLink }) {
  return (
    <h1 className={styles.Header}>
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

export function ContentBoxParagraph ({ children }) {
  return (
    <div className={styles.Paragraph}>{children}</div>
  )
}
