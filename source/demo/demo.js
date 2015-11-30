import React from 'react'
import { render } from 'react-dom'
import FlexTableExample from '../FlexTable/FlexTable.example'
import VirtualScrollExample from '../VirtualScroll/VirtualScroll.example'

require('./demo.less')

render((
    <div className='demo__row'>
      <VirtualScrollExample/>
      <FlexTableExample/>
    </div>
  ),
  document.getElementById('root')
)
