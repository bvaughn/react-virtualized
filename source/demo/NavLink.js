/** @flow */
import React from 'react'
import { Link } from 'react-router'
import styles from './NavLink.css'

export default function NavLink ({ children, href, to }) {
  let link

  if (to) {
    link = (
      <Link
        activeClassName={styles.ActiveNavLink}
        className={styles.NavLink}
        to={to}
      >
        {children}
      </Link>
    )
  } else {
    link = (
      <a
        className={styles.NavLink}
        href={href}
      >
        {children}
      </a>
    )
  }

  return (
    <li className={styles.NavListItem}>
      {link}
    </li>
  )
}
