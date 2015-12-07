import React, { PropTypes } from 'react'
import styles from './LabeledInput.css'

export function LabeledInput ({ label, name, onChange, placeholder, value }) {
  return (
    <div className={styles.LabeledInput}>
      <label className={styles.Label}>
        {label}
      </label>
      <input
        className={styles.Input}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  )
}
LabeledInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.any
}

export function InputRow ({ children }) {
  return (
    <div className={styles.InputRow}>
      {children}
    </div>
  )
}
