import { render } from 'react-dom'
import FlexTableExample from './FlexTable/FlexTable.example'
import React from 'react'
import VirtualScrollExample from './VirtualScroll/VirtualScroll.example'

require('./demo.less')

render((
    <div className='demo__row'>
      <div className='demo__row__VirtualScrollExampleColumn'>
        <VirtualScrollExample/>
      </div>
      <div className='demo__row__FlexTableExampleColumn'>
        <FlexTableExample/>
      </div>
    </div>
  ),
  document.getElementById('root')
)
