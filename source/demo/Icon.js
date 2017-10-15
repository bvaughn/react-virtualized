import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './Icon.css';

// TODO: Remove unused BURGER and ARROW_LEFT?
// TODO: Rotate ARROW_UP to create ARROW_DOWN
export const TYPES = {
  COMPONENTS: 'COMPONENTS',
  DOCUMENTATION: 'DOCUMENTATION',
  ISSUES: 'ISSUES',
  SOURCE: 'SOURCE',
  WIZARD: 'WIZARD',
};

Icon.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(TYPES)).isRequired,
};

export default function Icon({className, title, type}) {
  return (
    <svg
      className={cn(styles.Icon, className)}
      height={12}
      title={title}
      viewBox="0 0 24 24"
      width={12}>
      <path d="M0 0h24v24H0V0z" fill="none" />

      {getIconData(type)}
    </svg>
  );
}

export function getIconData(type) {
  switch (type) {
    case TYPES.COMPONENTS:
      return (
        <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
      );
    case TYPES.DOCUMENTATION:
      return (
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
      );
    case TYPES.ISSUES:
      return (
        <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" />
      );
    case TYPES.SOURCE:
      return (
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
      );
    case TYPES.WIZARD:
      return <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />;
    default:
      throw new Error(`Invalid icon type: ${type}`);
  }
}
