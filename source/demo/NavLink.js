/** @flow */
import React from 'react'
import { Link } from 'react-router'
import Icon from './Icon'
import styles from './NavLink.css'

export default function NavLink ({ children, href, iconType, to }) {
  let link
  let icon

  if (iconType) {
    icon = (
      <Icon
        className={styles.Icon}
        type={iconType}
      /> 
    )
  }

  if (to) {
    link = (
      <Link
        activeClassName={styles.ActiveNavLink}
        className={styles.NavLink}
        to={to}
      > 
        {icon} {children}
      </Link>
    )
  } else {
    link = (
      <a
        className={styles.NavLink}
        href={href}
      > 
        {icon} {children}
      </a>
    )
  }

  return (
    <li className={styles.NavListItem}>
      {link}
    </li>
  )
}
