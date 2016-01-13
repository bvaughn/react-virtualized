import React from 'react'
import cn from 'classnames'
import styles from './NavLink.css'

export default function NavLink ({ pathData, text, url }) {
  const classNames = cn(styles.NavLink, {
    [styles.ActiveNavLink]: !url
  })

  return (
    <li className={styles.NavListItem}>
      <a
        className={classNames}
        href={url}
      >
        {text}
      </a>
    </li>
  )
}
