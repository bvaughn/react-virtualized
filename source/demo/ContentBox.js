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
  const links = []

  if (sourceLink) {
    links.push(
      <a
        className={styles.Link}
        href={sourceLink}
        key='sourceLink'
      >
        Source
      </a>
    )
  }

  if (sourceLink && docsLink) {
    links.push(
      <span key='separator'> | </span>
    )
  }

  if (docsLink) {
    links.push(
      <a
        className={styles.Link}
        href={docsLink}
        key='docsLink'
      >
        Docs
      </a>
    )
  }

  return (
    <h1
      className={styles.Header}
      {...props}
    >
      {text}

      {links.length > 0 && (
        <small className={styles.Small}>
          {links}
        </small>
      )}
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
