/** @flow */
import React from 'react'
import { Link } from 'react-router'
import styles from './ComponentLink.css'

export default function ComponentLink ({ children, to }) {
  return (
    <li className={styles.NavListItem}>
      <Link
        activeClassName={styles.ActiveComponentLink}
        className={styles.ComponentLink}
        to={to}
      >
        {children}
      </Link>
    </li>
  )
}
