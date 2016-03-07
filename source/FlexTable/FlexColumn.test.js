import Immutable from 'immutable'
import { defaultCellDataGetter, defaultCellRenderer } from './FlexColumn'
import test from 'tape'

const map = Immutable.Map({
  foo: 'Foo',
  bar: 1
})

test('Column defaultCellDataGetter() should return a value for specified attributes', (assert) => {
  assert.equal(defaultCellDataGetter('foo', map), 'Foo')
  assert.equal(defaultCellDataGetter('bar', map), 1)
  assert.end()
})

test('Column defaultCellDataGetter() should return undefined for missing attributes', (assert) => {
  assert.equal(defaultCellDataGetter('baz', map), undefined)
  assert.end()
})

test('Column defaultCellRenderer() should render a value for specified attributes', (assert) => {
  assert.equal(defaultCellRenderer('Foo', 'foo', map, 0), 'Foo')
  assert.equal(defaultCellRenderer(1, 'bar', map, 0), '1')
  assert.end()
})

test('Column defaultCellRenderer() should render empty string for null or missing attributes', (assert) => {
  assert.equal(defaultCellRenderer(null, 'baz', map, 0), '')
  assert.equal(defaultCellRenderer(undefined, 'baz', map, 0), '')
  assert.end()
})
