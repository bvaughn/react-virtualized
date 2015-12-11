import React from 'react'
import styles from './NavLink.css'

export default function NavLink ({ pathData, text, url }) {
  return (
    <li className={styles.NavListItem}>
      <a
        className={styles.NavLink}
        href={url}
      >
        <Icon/>
        {text}
      </a>
    </li>
  )
}

function Icon () {
  return (
    <svg
      className={styles.NavLinkIcon}
      width='20'
      height='20'
      viewBox='0 0 50 50'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g>
        <circle r='25' cy='25' cx='25'/>
        <g fill='#37474f'>
          <circle r='6' cy='9' cx='25'/>
          <circle r='6' cy='41' cx='25'/>
          <circle r='6' cy='17' cx='11'/>
          <circle r='6' cy='17' cx='39'/>
          <circle r='6' cy='33' cx='11'/>
          <circle r='6' cy='33' cx='39'/>
        </g>
      </g>
    </svg>
  )
}
