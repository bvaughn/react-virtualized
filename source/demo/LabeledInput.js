import React, { PropTypes } from 'react'
import cn from 'classnames'
import styles from './LabeledInput.css'

export function LabeledInput ({
  disabled,
  label,
  name,
  onChange,
  placeholder,
  value
}) {
  const labelClassName = cn(styles.Label, {
    [styles.LabelDisabled]: disabled
  })

  return (
    <div className={styles.LabeledInput}>
      <label className={labelClassName}>
        {label}
      </label>
      <input
        className={styles.Input}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </div>
  )
}
LabeledInput.propTypes = {
  disabled: PropTypes.bool,
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
