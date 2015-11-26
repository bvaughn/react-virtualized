import Immutable from 'immutable'
import { defaultCellDataGetter, defaultCellRenderer } from './Column'
import expect from 'expect.js'

describe('Column', () => {
  const map = Immutable.Map({
    foo: 'Foo',
    bar: 1
  })

  describe('defaultCellDataGetter', () => {
    it('should return a value for specified attributes', () => {
      expect(defaultCellDataGetter('foo', map)).to.equal('Foo')
      expect(defaultCellDataGetter('bar', map)).to.equal(1)
    })

    it('should return undefined for missing attributes', () => {
      expect(defaultCellDataGetter('baz', map)).to.equal(undefined)
    })
  })

  describe('defaultCellRenderer', () => {
    it('should render a value for specified attributes', () => {
      expect(defaultCellRenderer('Foo', 'foo', map, 0)).to.equal('Foo')
      expect(defaultCellRenderer(1, 'bar', map, 0)).to.equal('1')
    })

    it('should render empty string for null or missing attributes', () => {
      expect(defaultCellRenderer(null, 'baz', map, 0)).to.equal('')
      expect(defaultCellRenderer(undefined, 'baz', map, 0)).to.equal('')
    })
  })
})
