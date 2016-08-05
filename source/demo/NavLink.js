import React from 'react'
import cn from 'classnames'
import styles from './NavLink.css'

export default function NavLink ({ active, onClick, pathData, text, url }) {
  const classNames = cn(styles.NavLink, {
    [styles.ActiveNavLink]: active
  })

  return (
    <li className={styles.NavListItem}>
      <a
        className={classNames}
        href={url}
        onClick={onClick}
      >
        {text}
      </a>
    </li>
  )
}
