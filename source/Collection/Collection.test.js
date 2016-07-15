/**
 * Tests Collection and CollectionView.
 * @flow
 */
import getScrollbarSize from 'dom-helpers/util/scrollbarSize'
import React from 'react'
import { findDOMNode } from 'react-dom'
import { Simulate } from 'react-addons-test-utils'
import { render } from '../TestUtils'
import Collection from './Collection'
import { CELLS, SECTION_SIZE } from './TestData'

describe('Collection', () => {
  function defaultCellRenderer ({ index }) {
    return (
      <div className='cell'>
        cell:{index}
      </div>
    )
  }

  function getMarkup (props = {}) {
    const {
      cellCount = CELLS.length
    } = props

    function defaultCellSizeAndPositionGetter ({ index }) {
      index = index % cellCount

      return CELLS[index]
    }

    return (
      <Collection
        cellCount={cellCount}
        cellRenderer={defaultCellRenderer}
        cellSizeAndPositionGetter={defaultCellSizeAndPositionGetter}
        height={SECTION_SIZE}
        sectionSize={SECTION_SIZE}
        width={SECTION_SIZE * 2}
        {...props}
      />
    )
  }

  function simulateScroll ({ collection, scrollLeft, scrollTop }) {
    const target = { scrollLeft, scrollTop }
    collection._collectionView._scrollingContainer = target // HACK to work around _onScroll target check
    Simulate.scroll(findDOMNode(collection), { target })
  }

  function compareArrays (array1, array2) {
    expect(array1.length).toEqual(array2.length)

    array1.forEach(value => {
      expect(array2).toContain(value)
    })
  }

  describe('number of rendered children', () => {
    it('should render enough children to fill the available area', () => {
      const rendered = findDOMNode(render(getMarkup()))
      expect(rendered.querySelectorAll('.cell').length).toEqual(4)
    })

    it('should not render more cells than available if the area is not filled', () => {
      const rendered = findDOMNode(render(getMarkup({ cellCount: 2 })))
      expect(rendered.querySelectorAll('.cell').length).toEqual(2)
    })

    // Small performance tweak added in 5.5.6
    it('should not render/parent cells that are null or false', () => {
      function cellRenderer ({ index }) {
        if (index > 2) {
          return null
        } else {
          return (
            <div className='cell'>
              {index}
            </div>
          )
        }
      }
      const rendered = findDOMNode(render(getMarkup({ cellRenderer })))
      expect(rendered.querySelectorAll('.cell').length).toEqual(3)
    })
  })

  describe('shows and hides scrollbars based on rendered content', () => {
    let scrollbarSize

    beforeAll(() => {
      scrollbarSize = getScrollbarSize()
    })

    it('should set overflowX:hidden if columns fit within the available width and y-axis has no scrollbar', () => {
      const rendered = findDOMNode(render(getMarkup({
        height: 4,
        width: 6
      })))
      expect(rendered.style.overflowX).toEqual('hidden')
    })

    it('should set overflowX:hidden if columns and y-axis scrollbar fit within the available width', () => {
      const rendered = findDOMNode(render(getMarkup({
        height: 1,
        width: 6 + scrollbarSize
      })))
      expect(rendered.style.overflowX).toEqual('hidden')
    })

    it('should leave overflowX:auto if columns require more than the available width', () => {
      const rendered = findDOMNode(render(getMarkup({
        width: 1
      })))
      expect(rendered.style.overflowX).not.toEqual('hidden')
    })

    it('should leave overflowX:auto if columns and y-axis scrollbar require more than the available width', () => {
      const rendered = findDOMNode(render(getMarkup({
        height: 1,
        width: 6 + scrollbarSize - 1
      })))
      expect(rendered.style.overflowX).not.toEqual('hidden')
    })

    it('should set overflowY:hidden if rows fit within the available width and xaxis has no scrollbar', () => {
      const rendered = findDOMNode(render(getMarkup({
        height: 4,
        width: 6
      })))
      expect(rendered.style.overflowY).toEqual('hidden')
    })

    it('should set overflowY:hidden if rows and x-axis scrollbar fit within the available width', () => {
      const rendered = findDOMNode(render(getMarkup({
        height: 4 + scrollbarSize,
        width: 1
      })))
      expect(rendered.style.overflowY).toEqual('hidden')
    })

    it('should leave overflowY:auto if rows require more than the available height', () => {
      const rendered = findDOMNode(render(getMarkup({
        height: 1
      })))
      expect(rendered.style.overflowY).not.toEqual('hidden')
    })

    it('should leave overflowY:auto if rows and y-axis scrollbar require more than the available height', () => {
      const rendered = findDOMNode(render(getMarkup({
        height: 4 + scrollbarSize - 1,
        width: 1
      })))
      expect(rendered.style.overflowY).not.toEqual('hidden')
    })

    it('should accept styles that overwrite calculated ones', () => {
      const rendered = findDOMNode(render(getMarkup({
        height: 1,
        style: {
          overflowX: 'auto',
          overflowY: 'auto'
        },
        width: 1
      })))
      expect(rendered.style.overflowX).toEqual('auto')
      expect(rendered.style.overflowY).toEqual('auto')
    })
  })

  describe(':scrollToCell', () => {
    it('should scroll to the top/left', () => {
      const grid = render(getMarkup({ scrollToCell: 0 }))
      expect(grid._collectionView.state.scrollLeft).toEqual(0)
      expect(grid._collectionView.state.scrollTop).toEqual(0)
    })

    it('should scroll over to the middle', () => {
      const grid = render(getMarkup({ scrollToCell: 7 }))
      expect(grid._collectionView.state.scrollLeft).toEqual(1)
      expect(grid._collectionView.state.scrollTop).toEqual(1)
    })

    it('should scroll to the bottom/right', () => {
      const grid = render(getMarkup({ scrollToCell: 9 }))
      expect(grid._collectionView.state.scrollLeft).toEqual(2)
      expect(grid._collectionView.state.scrollTop).toEqual(2)
    })

    it('should honor the specified :scrollToAlignment', () => {
      let grid = render(getMarkup({
        scrollToAlignment: 'start',
        scrollToCell: 2,
        width: SECTION_SIZE
      }))
      // Minimum amount of scrolling ("auto") would be 0,0
      expect(grid._collectionView.state.scrollLeft).toEqual(2)
      expect(grid._collectionView.state.scrollTop).toEqual(1)

      grid = render(getMarkup({
        scrollToAlignment: 'end',
        scrollToCell: 2,
        width: SECTION_SIZE
      }))
      // This cell would already by visible by "auto" rules
      expect(grid._collectionView.state.scrollLeft).toEqual(1)
      expect(grid._collectionView.state.scrollTop).toEqual(0)

      grid = render(getMarkup({
        scrollToAlignment: 'center',
        scrollToCell: 4,
        width: SECTION_SIZE
      }))
      // This cell doesn't fit entirely in the viewport but we center it anyway.
      expect(grid._collectionView.state.scrollLeft).toEqual(0.5)
      expect(grid._collectionView.state.scrollTop).toEqual(2)
    })

    it('should scroll to a cell just added', () => {
      let grid = render(getMarkup({
        cellCount: 4
      }))
      expect(grid._collectionView.state.scrollLeft).toEqual(0)
      expect(grid._collectionView.state.scrollTop).toEqual(0)
      grid = render(getMarkup({
        cellCount: 8,
        scrollToCell: 7
      }))
      expect(grid._collectionView.state.scrollLeft).toEqual(1)
      expect(grid._collectionView.state.scrollTop).toEqual(1)
    })
  })

  describe('property updates', () => {
    it('should update :scrollToCell position when :width changes', () => {
      let grid = findDOMNode(render(getMarkup({ scrollToCell: 3 })))
      expect(grid.textContent).toContain('cell:3')
      // Making the grid narrower leaves only room for 1 item
      grid = findDOMNode(render(getMarkup({ scrollToCell: 3, width: 1 })))
      expect(grid.textContent).toContain('cell:3')
    })

    it('should update :scrollToCell position when :height changes', () => {
      let grid = findDOMNode(render(getMarkup({ scrollToCell: 4 })))
      expect(grid.textContent).toContain('cell:4')
      // Making the grid shorter leaves only room for 1 item
      grid = findDOMNode(render(getMarkup({ scrollToCell: 4, height: 1 })))
      expect(grid.textContent).toContain('cell:4')
    })

    it('should update scroll position when :scrollToCell changes', () => {
      let grid = findDOMNode(render(getMarkup()))
      expect(grid.textContent).not.toContain('cell:9')
      grid = findDOMNode(render(getMarkup({ scrollToCell: 9 })))
      expect(grid.textContent).toContain('cell:9')
    })
  })

  describe('noContentRenderer', () => {
    it('should call :noContentRenderer if :cellCount is 0', () => {
      let list = findDOMNode(render(getMarkup({
        noContentRenderer: () => <div>No data</div>,
        cellCount: 0
      })))
      expect(list.textContent).toEqual('No data')
    })

    it('should render an empty body if :cellCount is 0 and there is no :noContentRenderer', () => {
      let list = findDOMNode(render(getMarkup({
        cellCount: 0
      })))
      expect(list.textContent).toEqual('')
    })
  })

  describe('onSectionRendered', () => {
    it('should call :onSectionRendered if at least one cell is rendered', () => {
      let indices
      render(getMarkup({
        onSectionRendered: params => {
          indices = params.indices
        }
      }))
      compareArrays(indices, [0, 1, 2, 3])
    })

    it('should not call :onSectionRendered unless the rendered indices have changed', () => {
      let numCalls = 0
      let indices
      const onSectionRendered = params => {
        indices = params.indices
        numCalls++
      }
      render(getMarkup({ onSectionRendered }))
      expect(numCalls).toEqual(1)
      compareArrays(indices, [0, 1, 2, 3])
      render(getMarkup({ onSectionRendered }))
      expect(numCalls).toEqual(1)
      compareArrays(indices, [0, 1, 2, 3])
    })

    it('should call :onSectionRendered if the rendered indices have changed', () => {
      let numCalls = 0
      let indices
      const onSectionRendered = params => {
        indices = params.indices
        numCalls++
      }
      render(getMarkup({ onSectionRendered }))
      expect(numCalls).toEqual(1)
      compareArrays(indices, [0, 1, 2, 3])
      render(getMarkup({
        height: SECTION_SIZE * 2,
        onSectionRendered
      }))
      expect(numCalls).toEqual(2)
      compareArrays(indices, [0, 1, 2, 3, 4, 5])
      render(getMarkup({
        height: SECTION_SIZE * 2,
        onSectionRendered,
        width: SECTION_SIZE
      }))
      expect(numCalls).toEqual(3)
      expect(indices).toEqual([0, 4])
    })

    it('should not call :onSectionRendered if no cells are rendered', () => {
      let numCalls = 0
      render(getMarkup({
        height: 0,
        onSectionRendered: () => numCalls++
      }))
      expect(numCalls).toEqual(0)
    })
  })

  describe(':scrollLeft and :scrollTop properties', () => {
    it('should render correctly when an initial :scrollLeft and :scrollTop properties are specified', () => {
      let indices
      render(getMarkup({
        onSectionRendered: params => {
          indices = params.indices
        },
        scrollLeft: 2,
        scrollTop: 2
      }))
      compareArrays(indices, [3, 4, 5, 7, 8, 9])
    })

    it('should render correctly when :scrollLeft and :scrollTop properties are updated', () => {
      let indices
      render(getMarkup({
        onSectionRendered: params => {
          indices = params.indices
        }
      }))
      compareArrays(indices, [0, 1, 2, 3])
      render(getMarkup({
        onSectionRendered: params => {
          indices = params.indices
        },
        scrollLeft: 2,
        scrollTop: 2
      }))
      compareArrays(indices, [3, 4, 5, 7, 8, 9])
    })
  })

  describe('styles and classeNames', () => {
    it('should use the expected global CSS classNames', () => {
      const rendered = findDOMNode(render(getMarkup()))
      expect(rendered.className).toEqual('Collection')
    })

    it('should use a custom :className if specified', () => {
      const rendered = findDOMNode(render(getMarkup({ className: 'foo' })))
      expect(rendered.className).toContain('foo')
    })

    it('should use a custom :style if specified', () => {
      const style = { backgroundColor: 'red' }
      const rendered = findDOMNode(render(getMarkup({ style })))
      expect(rendered.style.backgroundColor).toEqual('red')
    })
  })

  describe('onScroll', () => {
    it('should trigger callback when component is mounted', () => {
      const onScrollCalls = []
      render(getMarkup({
        onScroll: params => onScrollCalls.push(params),
        scrollLeft: 2,
        scrollTop: 1
      }))
      expect(onScrollCalls).toEqual([{
        clientHeight: SECTION_SIZE,
        clientWidth: SECTION_SIZE * 2,
        scrollHeight: 4,
        scrollLeft: 2,
        scrollTop: 1,
        scrollWidth: 6
      }])
    })

    it('should trigger callback when component scrolls horizontally', () => {
      const onScrollCalls = []
      const collection = render(getMarkup({
        onScroll: params => onScrollCalls.push(params)
      }))
      simulateScroll({
        collection,
        scrollLeft: 1,
        scrollTop: 0
      })
      expect(onScrollCalls.length).toEqual(2)
      expect(onScrollCalls[1]).toEqual({
        clientHeight: SECTION_SIZE,
        clientWidth: SECTION_SIZE * 2,
        scrollHeight: 4,
        scrollLeft: 1,
        scrollTop: 0,
        scrollWidth: 6
      })
    })

    it('should trigger callback when component scrolls vertically', () => {
      const onScrollCalls = []
      const collection = render(getMarkup({
        onScroll: params => onScrollCalls.push(params)
      }))
      simulateScroll({
        collection,
        scrollLeft: 0,
        scrollTop: 2
      })
      expect(onScrollCalls.length).toEqual(2)
      expect(onScrollCalls[1]).toEqual({
        clientHeight: SECTION_SIZE,
        clientWidth: SECTION_SIZE * 2,
        scrollHeight: 4,
        scrollLeft: 0,
        scrollTop: 2,
        scrollWidth: 6
      })
    })

    it('should not allow negative scroll values', () => {
      const onScrollCalls = []
      const collection = render(getMarkup({
        onScroll: params => onScrollCalls.push(params)
      }))
      simulateScroll({
        collection,
        scrollLeft: -1,
        scrollTop: -1
      })
      expect(onScrollCalls.length).toEqual(1)
      expect(onScrollCalls[0].scrollLeft).toEqual(0)
      expect(onScrollCalls[0].scrollTop).toEqual(0)
    })
  })

  describe('cellGroupRenderer', () => {
    it('should use a custom :cellGroupRenderer if specified', () => {
      let cellGroupRendererCalled = 0
      let cellGroupRendererParams
      const cellRenderer = ({ index }) => index
      findDOMNode(render(getMarkup({
        cellRenderer,
        cellGroupRenderer: (params) => {
          cellGroupRendererParams = params
          cellGroupRendererCalled++

          return [
            <div key='0'>Fake content</div>
          ]
        }
      })))
      expect(cellGroupRendererCalled).toEqual(1)
      expect(cellGroupRendererParams.cellRenderer).toEqual(cellRenderer)
      expect(typeof cellGroupRendererParams.cellSizeAndPositionGetter).toEqual('function')
      compareArrays(cellGroupRendererParams.indices, [0, 1, 2, 3])
    })
  })

  it('should pass the cellRenderer an :isScrolling flag when scrolling is in progress', () => {
    const cellRendererCalls = []
    function cellRenderer ({ index, isScrolling }) {
      cellRendererCalls.push(isScrolling)
      return defaultCellRenderer({ index })
    }
    const collection = render(getMarkup({
      cellRenderer
    }))
    expect(cellRendererCalls[0]).toEqual(false)
    cellRendererCalls.splice(0)
    simulateScroll({ collection, scrollTop: 100 })
    expect(cellRendererCalls[0]).toEqual(true)
  })
})
