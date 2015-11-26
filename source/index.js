import React from 'react'
import { render } from 'react-dom'
import createApp from './Demo'

const Demo = createApp(React)
const props = {}

render(
  <Demo { ...props }/>,
  document.getElementById('root')
)
