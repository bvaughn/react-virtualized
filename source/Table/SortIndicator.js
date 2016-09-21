import React, { PropTypes } from 'react'
import cn from 'classnames'
import SortDirection from './SortDirection'

/**
 * Displayed beside a header to indicate that a Table is currently sorted by this column.
 */
export default function SortIndicator ({ sortDirection }) {
  const classNames = cn('ReactVirtualized__Table__sortableHeaderIcon', {
    'ReactVirtualized__Table__sortableHeaderIcon--ASC': sortDirection === SortDirection.ASC,
    'ReactVirtualized__Table__sortableHeaderIcon--DESC': sortDirection === SortDirection.DESC
  })

  const renderSortIcon = () => {
    switch (sortDirection) {
      case SortDirection.ASC:
        return <path d='M7 14l5-5 5 5z' />
      case SortDirection.DESC:
        return <path d='M7 10l5 5 5-5z' />
      default:
        return null
    }
  }

  return (
    <svg
      className={classNames}
      width={18}
      height={18}
      viewBox='0 0 24 24'
    >
      {renderSortIcon(sortDirection)}
      <path d='M0 0h24v24H0z' fill='none' />
    </svg>
  )
}
SortIndicator.propTypes = {
  sortDirection: PropTypes.oneOf([SortDirection.NAT, SortDirection.ASC, SortDirection.DESC])
}
