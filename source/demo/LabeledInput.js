import React, { PropTypes } from 'react'
import './LabeledInput.less'

export function LabeledInput ({ label, name, onChange, placeholder, value }) {
  return (
    <div className='LabeledInput'>
      <label className='LabeledInput__label'>
        {label}
      </label>
      <input
        className='LabeledInput__input'
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
    <div className='InputRow'>
      {children}
    </div>
  )
}
