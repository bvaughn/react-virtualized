import React from 'react'
import cn from 'classnames'
import styles from './ComponentLink.css'

export default function ComponentLink ({ activeComponent, component, disabled, setActiveComponent }) {
  const classNames = cn(styles.ComponentLink, {
    [styles.ActiveComponentLink]: activeComponent === component,
    [styles.DisabledComponentLink]: disabled
  })

  return (
    <button
      className={classNames}
      onClick={() => setActiveComponent(component)}
    >
      {component}
    </button>
  )
}
