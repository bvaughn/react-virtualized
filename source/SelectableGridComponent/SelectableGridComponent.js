import { Component, PropTypes } from 'react'

export default class SelectableGridComponent extends Component {

  constructor (props) {
    super(props)

    this.state = {
      selectedRows: props.selectedRows
    }

    this.handleOnSelect = this.handleOnSelect.bind(this)
  }

  static propTypes= {
    /** Optional option to set if the a FlexTable allows multiple selection*/
    allowsMultipleSelection: PropTypes.bool,

    /** Children of the component, it only support the FlexTable so far*/
    children: PropTypes.func.isRequired,

    /**
    * Optional callback when a row is selected
    * ({ index: number }): void
    */
    onRowSelect: PropTypes.func,

    /**
    * Optional callback when a row is deselected
    * ({ index: number }): void
    */
    onRowDeselect: PropTypes.func,

    /**
    * Optional callback when a row is deselected
    * The callback should return a set of the next rows to select
    * ({ indexes: object }): object
    */
    onSelectionIndexesForProposedSelection: PropTypes.func,

    /** Current selected rows in the FlexTable*/
    selectedRows: PropTypes.object
  }

  static defaultProps = {
    allowsMultipleSelection: false,
    selectedRows: new Set()
  }

  handleOnSelect (rowIndex, event) {
    const {
      allowsMultipleSelection,
      onRowSelect,
      onRowDeselect,
      onSelectionIndexesForProposedSelection
    } = this.props

    const isMetaEvent = event.metaKey
    const isShiftEvent = event.shiftKey
    const index = rowIndex.index

    let currentSelectedRows = this.state.selectedRows
    let newSelectedRows = new Set()

    if (allowsMultipleSelection && isShiftEvent && currentSelectedRows.size > 0) {
      const firstSelectedIndex = currentSelectedRows.values().next().value
      let i = firstSelectedIndex

      if (index === firstSelectedIndex) newSelectedRows.add(index)
      else if (index > firstSelectedIndex) for (i = firstSelectedIndex; i <= index; i++) newSelectedRows.add(i)
      else for (i = firstSelectedIndex; i >= index; i--) newSelectedRows.add(i)
    }

    if (allowsMultipleSelection && isMetaEvent) newSelectedRows = new Set(currentSelectedRows)
    if (currentSelectedRows.has(index) && isMetaEvent) newSelectedRows.delete(index)
    if (!currentSelectedRows.has(index)) newSelectedRows.add(index)
    if (currentSelectedRows.has(index) && !isMetaEvent && !isShiftEvent) newSelectedRows = new Set().add(index)
    if (onSelectionIndexesForProposedSelection) newSelectedRows = onSelectionIndexesForProposedSelection({indexes: newSelectedRows})

    currentSelectedRows.forEach((index) => {
      if (!newSelectedRows.has(index) && onRowDeselect) onRowDeselect({index})
    })

    newSelectedRows.forEach((index) => {
      if (!currentSelectedRows.has(index) && onRowSelect) onRowSelect({index})
    })

    this.setState({
      selectedRows: newSelectedRows
    })
  }

  render () {
    const { children } = this.props

    return children({
      onRowClick: this.handleOnSelect
    })
  }
}
