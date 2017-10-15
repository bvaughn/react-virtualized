import React from 'react';
import {NavLink} from 'react-router-dom';
import styles from './ComponentLink.css';

export default function ComponentLink({children, to}) {
  return (
    <li className={styles.NavListItem}>
      <NavLink
        activeClassName={styles.ActiveComponentLink}
        className={styles.ComponentLink}
        to={to}>
        {children}
      </NavLink>
    </li>
  );
}
