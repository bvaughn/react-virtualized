import AutoSizerExample from '../AutoSizer/AutoSizer.example'
import ComponentLink from './ComponentLink'
import GridExample from '../Grid/Grid.example'
import FlexTableExample from '../FlexTable/FlexTable.example'
import Immutable from 'immutable'
import InfiniteLoaderExample from '../InfiniteLoader/InfiniteLoader.example'
import NavLink from './NavLink'
import React, { Component } from 'react'
import styles from './Application.css'
import VirtualScrollExample from '../VirtualScroll/VirtualScroll.example'
import { generateRandomList } from './utils'
import { render } from 'react-dom'
import shouldPureComponentUpdate from 'react-pure-render/function'
import '../../styles.css'

const COMPONENTS = ['AutoSizer', 'Grid', 'FlexTable', 'InfiniteLoader', 'VirtualScroll']

// HACK Generate arbitrary data for use in example components :)
const list = Immutable.List(generateRandomList())

class Application extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  constructor (props) {
    super(props)

    // Support deep links to specific components
    const matches = window.location.search.match('component=(.+)')
    const activeComponent = matches && COMPONENTS.includes(matches[1])
      ? matches[1]
      : 'VirtualScroll'

    this.state = {
      activeComponent
    }
  }

  render () {
    const { activeComponent } = this.state

    const setActiveComponent = component => this.setState({ activeComponent: component })

    return (
      <div className={styles.demo}>
        <div className={styles.headerRow}>
          <div className={styles.ReactVirtualizedContainer}>
            <img
              alt='React virtualized'
              className={styles.logo}
              src='https://cloud.githubusercontent.com/assets/29597/11736841/c0497158-9f87-11e5-8dfe-9c0be97d4286.png'
            />
            <div className={styles.PrimaryLogoText}>
              React
            </div>
            <div className={styles.SecondaryLogoText}>
              Virtualized
            </div>
          </div>

          <ul className={styles.NavList}>
            <NavLink
              text='Components'
            />
            <NavLink
              text='Source'
              url='https://github.com/bvaughn/react-virtualized'
            />
            <NavLink
              text='Documentation'
              url='https://github.com/bvaughn/react-virtualized/tree/master/docs'
            />
            <NavLink
              text='Issues'
              url='https://github.com/bvaughn/react-virtualized/issues'
            />
          </ul>

          <ul className={styles.ComponentList}>
            {COMPONENTS.map(component => (
              <ComponentLink
                key={component}
                activeComponent={activeComponent}
                component={component}
                setActiveComponent={setActiveComponent}
              />
            ))}
          </ul>
        </div>

        <div className={styles.row}>
          {activeComponent === 'AutoSizer' &&
            <AutoSizerExample
              className={styles.column}
              list={list}
            />
          }
          {activeComponent === 'FlexTable' &&
            <FlexTableExample
              className={styles.column}
              list={list}
            />
          }
          {activeComponent === 'Grid' &&
            <GridExample
              className={styles.column}
              list={list}
            />
          }
          {activeComponent === 'InfiniteLoader' &&
            <InfiniteLoaderExample
              className={styles.column}
              list={list}
            />
          }
          {activeComponent === 'VirtualScroll' &&
            <VirtualScrollExample
              className={styles.column}
              list={list}
            />
          }
        </div>

        <p className={styles.footer}>
          React Virtualized is available under the MIT license.
        </p>
      </div>
    )
  }
}

render(
  <Application/>,
  document.getElementById('root')
)

// Import and attach the favicon
document.querySelector('[rel="shortcut icon"]').href = require('file!./favicon.png')
