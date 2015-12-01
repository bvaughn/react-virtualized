/**
 * @flow
 */
import React, { Component } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import VirtualScroll from './VirtualScroll'
import './VirtualScroll.example.less'

export default class VirtualScrollExample extends Component {
  constructor (props) {
    super(props)

    // HACK :)
    this._list = []
    for (var i = 0; i < 1000; i++) {
      this._list.push({
        index: i,
        color: BADGE_COLORS[i % BADGE_COLORS.length],
        name: NAMES[i % NAMES.length]
      })
    }

    this.state = {
      rowsCount: this._list.length,
      scrollToIndex: undefined,
      virtualScrollHeight: 300,
      virtualScrollRowHeight: 60
    }

    this._onRowsCountChange = this._onRowsCountChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)
  }

  render () {
    const { rowsCount, scrollToIndex, virtualScrollHeight, virtualScrollRowHeight } = this.state

    return (
      <ContentBox className='VirtualScrollExample'>
        <ContentBoxHeader
          text='VirtualScroll'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/VirtualScroll/VirtualScroll.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/VirtualScroll.md'
        />

        <ContentBoxParagraph>
          The list below is virtualized, meaning that only the visible rows are rendered.
          Adjust its configurable properties below to see how it reacts.
        </ContentBoxParagraph>

        <InputRow>
          <LabeledInput
            label='Num rows'
            name='rowsCount'
            onChange={this._onRowsCountChange}
            value={rowsCount}
          />
          <LabeledInput
            label='Scroll to'
            name='onScrollToRow'
            placeholder='Index...'
            onChange={this._onScrollToRowChange}
            value={scrollToIndex}
          />
          <LabeledInput
            label='List height'
            name='virtualScrollHeight'
            onChange={event => this.setState({ virtualScrollHeight: parseInt(event.target.value, 10) || 1 })}
            value={virtualScrollHeight}
          />
          <LabeledInput
            label='Row height'
            name='virtualScrollRowHeight'
            onChange={event => this.setState({ virtualScrollRowHeight: parseInt(event.target.value, 10) || 1 })}
            value={virtualScrollRowHeight}
          />
        </InputRow>

        <VirtualScroll
          className='VirtualScrollExample__VirtualScroll'
          width={310}
          height={virtualScrollHeight}
          rowsCount={rowsCount}
          rowHeight={virtualScrollRowHeight}
          rowRenderer={this._rowRenderer}
          scrollToIndex={scrollToIndex}
        />
      </ContentBox>
    )
  }

  _onRowsCountChange (event) {
    let rowsCount = parseInt(event.target.value, 10) || 0
    rowsCount = Math.max(0, Math.min(this._list.length, rowsCount))

    this.setState({ rowsCount })
  }

  _onScrollToRowChange (event) {
    const { rowsCount } = this.state
    let scrollToIndex = Math.min(rowsCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined
    }

    this.setState({ scrollToIndex })
  }

  _rowRenderer (index) {
    const { virtualScrollRowHeight } = this.state
    const rowStyle = {
      height: virtualScrollRowHeight
    }

    const data = this._list[index]

    return (
      <div
        key={index}
        className='VirtualScrollExample__VirtualScroll__row'
        style={rowStyle}
      >
        <div
          className='VirtualScrollExample__VirtualScroll__row__letter'
          style={{
            backgroundColor: data.color
          }}
        >
          {data.name.charAt(0)}
        </div>
        <div>
          <div className='VirtualScrollExample__VirtualScroll__row__name'>
            {data.name}
          </div>
          <div className='VirtualScrollExample__VirtualScroll__row__index'>
            This is row {index}
          </div>
        </div>
      </div>
    )
  }
}

const BADGE_COLORS = ['#f44336', '#3f51b5', '#4caf50', '#ff9800', '#2196f3', '#374046', '#cddc39', '#2196f3', '#9c27b0', '#ffc107', '#009688', '#673ab7', '#ffeb3b', '#cddc39', '#795548']
const NAMES = ['Peter Brimer', 'Tera Gaona', 'Kandy Liston', 'Lonna Wrede', 'Kristie Yard', 'Raul Host', 'Yukiko Binger', 'Velvet Natera', 'Donette Ponton', 'Loraine Grim', 'Shyla Mable', 'Marhta Sing', 'Alene Munden', 'Holley Pagel', 'Randell Tolman', 'Wilfred Juneau', 'Naida Madson', 'Marine Amison', 'Glinda Palazzo', 'Lupe Island', 'Cordelia Trotta', 'Samara Berrier', 'Era Stepp', 'Malka Spradlin', 'Edward Haner', 'Clemencia Feather', 'Loretta Rasnake', 'Dana Hasbrouck', 'Sanda Nery', 'Soo Reiling', 'Apolonia Volk', 'Liliana Cacho', 'Angel Couchman', 'Yvonne Adam', 'Jonas Curci', 'Tran Cesar', 'Buddy Panos', 'Rosita Ells', 'Rosalind Tavares', 'Renae Keehn', 'Deandrea Bester', 'Kelvin Lemmon', 'Guadalupe Mccullar', 'Zelma Mayers', 'Laurel Stcyr', 'Edyth Everette', 'Marylin Shevlin', 'Hsiu Blackwelder', 'Mark Ferguson', 'Winford Noggle', 'Shizuko Gilchrist', 'Roslyn Cress', 'Nilsa Lesniak', 'Agustin Grant', 'Earlie Jester', 'Libby Daigle', 'Shanna Maloy', 'Brendan Wilken', 'Windy Knittel', 'Alice Curren', 'Eden Lumsden', 'Klara Morfin', 'Sherryl Noack', 'Gala Munsey', 'Stephani Frew', 'Twana Anthony', 'Mauro Matlock', 'Claudie Meisner', 'Adrienne Petrarca', 'Pearlene Shurtleff', 'Rachelle Piro', 'Louis Cocco', 'Susann Mcsweeney', 'Mandi Kempker', 'Ola Moller', 'Leif Mcgahan', 'Tisha Wurster', 'Hector Pinkett', 'Benita Jemison', 'Kaley Findley', 'Jim Torkelson', 'Freda Okafor', 'Rafaela Markert', 'Stasia Carwile', 'Evia Kahler', 'Rocky Almon', 'Sonja Beals', 'Dee Fomby', 'Damon Eatman', 'Alma Grieve', 'Linsey Bollig', 'Stefan Cloninger', 'Giovanna Blind', 'Myrtis Remy', 'Marguerita Dostal', 'Junior Baranowski', 'Allene Seto', 'Margery Caves', 'Nelly Moudy', 'Felix Sailer']
