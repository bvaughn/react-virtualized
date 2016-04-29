import Immutable from 'immutable'
import { defaultCellDataGetter, defaultCellRenderer } from './FlexColumn'

describe('Column', () => {
  const rowData = Immutable.Map({
    foo: 'Foo',
    bar: 1
  })

  describe('defaultCellDataGetter', () => {
    it('should return a value for specified attributes', () => {
      expect(defaultCellDataGetter({
        dataKey: 'foo',
        rowData
      })).toEqual('Foo')
      expect(defaultCellDataGetter({
        dataKey: 'bar',
        rowData
      })).toEqual(1)
    })

    it('should return undefined for missing attributes', () => {
      expect(defaultCellDataGetter({
        dataKey: 'baz',
        rowData
      })).toEqual(undefined)
    })
  })

  describe('defaultCellRenderer', () => {
    it('should render a value for specified attributes', () => {
      expect(defaultCellRenderer('Foo', 'foo', rowData, 0)).toEqual('Foo')
      expect(defaultCellRenderer(1, 'bar', rowData, 0)).toEqual('1')
    })

    it('should render empty string for null or missing attributes', () => {
      expect(defaultCellRenderer(null, 'baz', rowData, 0)).toEqual('')
      expect(defaultCellRenderer(undefined, 'baz', rowData, 0)).toEqual('')
    })
  })
})
