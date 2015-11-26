import Immutable from 'immutable'
import { defaultCellDataGetter, defaultCellRenderer } from './FlexColumn'

describe('Column', () => {
  const map = Immutable.Map({
    foo: 'Foo',
    bar: 1
  })

  describe('defaultCellDataGetter', () => {
    it('should return a value for specified attributes', () => {
      expect(defaultCellDataGetter('foo', map)).toEqual('Foo')
      expect(defaultCellDataGetter('bar', map)).toEqual(1)
    })

    it('should return undefined for missing attributes', () => {
      expect(defaultCellDataGetter('baz', map)).toEqual(undefined)
    })
  })

  describe('defaultCellRenderer', () => {
    it('should render a value for specified attributes', () => {
      expect(defaultCellRenderer('Foo', 'foo', map, 0)).toEqual('Foo')
      expect(defaultCellRenderer(1, 'bar', map, 0)).toEqual('1')
    })

    it('should render empty string for null or missing attributes', () => {
      expect(defaultCellRenderer(null, 'baz', map, 0)).toEqual('')
      expect(defaultCellRenderer(undefined, 'baz', map, 0)).toEqual('')
    })
  })
})
