import React from 'react'
import { findDOMNode } from 'react-dom'
import { render } from '../TestUtils'
import { Simulate } from 'react-addons-test-utils'
import Immutable from 'immutable'
import FlexColumn from './../FlexTable/FlexColumn'
import FlexTable from './../FlexTable/FlexTable'
import SelectableGridComponent from './SelectableGridComponent'

describe('SelectableGridComponent', () => {
  const array = []
  for (var i = 0; i < 100; i++) {
    array.push({
      id: i,
      name: `Name ${i}`,
      email: `user-${i}@treasure-data.com`
    })
  }
  const list = Immutable.fromJS(array)

  // Works with an Immutable List of Maps
  function immutableRowGetter ({ index }) {
    return list.get(index)
  }

  function getMarkup ({
    ...selectableGridComponentProps
  } = {}) {
    return (
      <SelectableGridComponent
        {...selectableGridComponentProps}>
        {({ onRowClick }) => (
          <FlexTable
            headerHeight={20}
            height={100}
            overscanRowCount={0}
            rowCount={list.size}
            rowHeight={10}
            width={100}
            onRowClick={(index, event) => {
              onRowClick(index, event)
            }}
            rowGetter={immutableRowGetter}
          >
            <FlexColumn
              label='Name'
              dataKey='name'
              width={50}
            />
            <FlexColumn
              label='Email'
              dataKey='email'
              width={50}
            />
            {false}
            {true}
            {null}
            {undefined}
          </FlexTable>
        )}
      </SelectableGridComponent>
    )
  }

  describe('onRowSelect', () => {
    it('should call :onRowSelect with the correct :rowIndex when a row is selected', () => {
      const onRowSelectCalls = []
      const rendered = findDOMNode(render(getMarkup({
        onRowSelect: ({ index }) => onRowSelectCalls.push(index)
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[0])
      Simulate.click(rows[3])
      expect(onRowSelectCalls).toEqual([0, 3])
    })

    it('should call :onRowSelect with the correct :rowIndex when a row is selected and changing the indexes in onSelectionIndexesForProposedSelection', () => {
      const onRowSelectCalls = []
      const rendered = findDOMNode(render(getMarkup({
        onRowSelect: ({ index }) => onRowSelectCalls.push(index),
        onSelectionIndexesForProposedSelection: ({ indexes }) => new Set().add(1)
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[0])
      expect(onRowSelectCalls).toEqual([1])
    })

    it('should call :onRowSelect with the correct :rowIndex when a row is selected with multipleSelection, onRowDeselect should not be called', () => {
      const onRowSelectCalls = []
      const onRowDeselectCalls = []
      const rendered = findDOMNode(render(getMarkup({
        allowsMultipleSelection: true,
        onRowSelect: ({ index }) => onRowSelectCalls.push(index),
        onRowDeselect: ({ index }) => onRowDeselectCalls.push(index)
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[0], {metaKey: true})
      Simulate.click(rows[3], {metaKey: true})
      expect(onRowSelectCalls).toEqual([0, 3])
      expect(onRowDeselectCalls).toEqual([])
    })

    it('should call :onRowSelect and onRowDeselect with the correct :rowIndex when a row is selected and deselected with the meta key', () => {
      const onRowSelectCalls = []
      const onRowDeselectCalls = []
      const rendered = findDOMNode(render(getMarkup({
        allowsMultipleSelection: true,
        onRowSelect: ({ index }) => onRowSelectCalls.push(index),
        onRowDeselect: ({ index }) => onRowDeselectCalls.push(index)
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[0], {metaKey: true})
      Simulate.click(rows[0], {metaKey: true})
      expect(onRowSelectCalls).toEqual([0])
      expect(onRowDeselectCalls).toEqual([0])
    })

    it('should call :onRowSelect and onRowDeselect with the correct :rowIndex when a row is selected and deselected with the meta key and with multipleSelections', () => {
      const onRowSelectCalls = []
      const onRowDeselectCalls = []
      const rendered = findDOMNode(render(getMarkup({
        allowsMultipleSelection: true,
        onRowSelect: ({ index }) => onRowSelectCalls.push(index),
        onRowDeselect: ({ index }) => onRowDeselectCalls.push(index)
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[0], {metaKey: true})
      Simulate.click(rows[3], {metaKey: true})
      expect(onRowSelectCalls).toEqual([0, 3])
      expect(onRowDeselectCalls).toEqual([])
      Simulate.click(rows[2], {metaKey: false})
      expect(onRowSelectCalls).toEqual([0, 3, 2])
      expect(onRowDeselectCalls).toEqual([0, 3])
    })

    it('should call :onRowSelect and onRowDeselect with the correct :rowIndex when a row is selected and deselected with the shift key (ASC)', () => {
      let onRowSelectCalls = []
      let onRowDeselectCalls = []
      const rendered = findDOMNode(render(getMarkup({
        allowsMultipleSelection: true,
        onRowSelect: ({ index }) => onRowSelectCalls.push(index),
        onRowDeselect: ({ index }) => onRowDeselectCalls.push(index)
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[0])
      Simulate.click(rows[4], {shiftKey: true})
      expect(onRowSelectCalls).toEqual([0, 1, 2, 3, 4])
      expect(onRowDeselectCalls).toEqual([])
      onRowSelectCalls = []
      onRowDeselectCalls = []
      Simulate.click(rows[2], {shiftKey: true})
      expect(onRowSelectCalls).toEqual([])
      expect(onRowDeselectCalls).toEqual([3, 4])
    })

    it('should call :onRowSelect and onRowDeselect with the correct :rowIndex when a row is selected and deselected with the shift key (DESC)', () => {
      let onRowSelectCalls = []
      let onRowDeselectCalls = []
      const rendered = findDOMNode(render(getMarkup({
        allowsMultipleSelection: true,
        onRowSelect: ({ index }) => onRowSelectCalls.push(index),
        onRowDeselect: ({ index }) => onRowDeselectCalls.push(index)
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[4])
      Simulate.click(rows[0], {shiftKey: true})
      expect(onRowSelectCalls).toEqual([4, 3, 2, 1, 0])
      expect(onRowDeselectCalls).toEqual([])
      onRowSelectCalls = []
      onRowDeselectCalls = []
      Simulate.click(rows[2], {shiftKey: true})
      expect(onRowSelectCalls).toEqual([])
      expect(onRowDeselectCalls).toEqual([1, 0])
    })
  })

  describe('onRowDeselect', () => {
    it('should call :onRowDeselect with the correct :rowIndex when a row is deselected', () => {
      const onRowDeselectCalls = []
      const rendered = findDOMNode(render(getMarkup({
        onRowDeselect: ({ index }) => onRowDeselectCalls.push(index)
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[0])
      Simulate.click(rows[3])
      Simulate.click(rows[2])
      expect(onRowDeselectCalls).toEqual([0, 3])
    })

    it('should call :onRowDeselect with the correct :rowIndex when a row is deselected and changing the indexes in onSelectionIndexesForProposedSelection', () => {
      const onRowDeselectCalls = []
      const rendered = findDOMNode(render(getMarkup({
        onRowDeselect: ({ index }) => onRowDeselectCalls.push(index),
        onSelectionIndexesForProposedSelection: ({ indexes }) => new Set().add(0)
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[0])
      Simulate.click(rows[3])
      expect(onRowDeselectCalls).toEqual([])
    })
  })

  describe('onSelectionIndexesForProposedSelection', () => {
    it('should call :onSelectionIndexesForProposedSelection with the correct :rowIndexes when a row is selected', () => {
      const onSelectionIndexesForProposedSelectionCalls = []
      const rendered = findDOMNode(render(getMarkup({
        onSelectionIndexesForProposedSelection: ({ indexes }) => {
          onSelectionIndexesForProposedSelectionCalls.push(indexes)
          return indexes
        }
      })))
      const rows = rendered.querySelectorAll('.FlexTable__row')
      Simulate.click(rows[0])
      Simulate.click(rows[3])
      expect(onSelectionIndexesForProposedSelectionCalls[0].has(0)).toEqual(true)
      expect(onSelectionIndexesForProposedSelectionCalls[1].has(3)).toEqual(true)
    })
  })
})
