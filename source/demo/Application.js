import ArrowKeyStepperExample from '../ArrowKeyStepper/ArrowKeyStepper.example'
import AutoSizerExample from '../AutoSizer/AutoSizer.example'
import CellMeasurerExample from '../CellMeasurer/CellMeasurer.example'
import CollectionExample from '../Collection/Collection.example'
import ColumnSizerExample from '../ColumnSizer/ColumnSizer.example'
import ComponentLink from './ComponentLink'
import GridExample from '../Grid/Grid.example'
import FlexTableExample from '../FlexTable/FlexTable.example'
import Immutable from 'immutable'
import InfiniteLoaderExample from '../InfiniteLoader/InfiniteLoader.example'
import NavLink from './NavLink'
import React, { Component } from 'react'
import ScrollSyncExample from '../ScrollSync/ScrollSync.example'
import styles from './Application.css'
import VirtualScrollExample from '../VirtualScroll/VirtualScroll.example'
import { generateRandomList } from './utils'
import { render } from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import '../../styles.css'

const COMPONENTS = ['Collection', 'Grid', 'FlexTable', 'VirtualScroll']
const HIGH_ORDER_COMPONENTS = ['ArrowKeyStepper', 'AutoSizer', 'CellMeasurer', 'ColumnSizer', 'InfiniteLoader', 'ScrollSync']

// HACK Generate arbitrary data for use in example components :)
const list = Immutable.List(generateRandomList())

class Application extends Component {
  constructor (props) {
    super(props)

    // Support deep links to specific components
    const matches = window.location.search.match('component=(.+)')
    const activeComponent = matches && (COMPONENTS.includes(matches[1]) || HIGH_ORDER_COMPONENTS.includes(matches[1]))
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
              url='https://github.com/bvaughn/react-virtualized/tree/master/docs#documentation'
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

          <ul className={styles.HighOrderComponentList}>
            {HIGH_ORDER_COMPONENTS.map(component => (
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
          {activeComponent === 'ArrowKeyStepper' &&
            <ArrowKeyStepperExample
              className={styles.column}
              list={list}
            />
          }
          {activeComponent === 'AutoSizer' &&
            <AutoSizerExample
              className={styles.column}
              list={list}
            />
          }
          {activeComponent === 'CellMeasurer' &&
            <CellMeasurerExample
              className={styles.column}
              list={list}
            />
          }
          {activeComponent === 'Collection' &&
            <CollectionExample
              className={styles.column}
              list={list}
            />
          }
          {activeComponent === 'ColumnSizer' &&
            <ColumnSizerExample
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
          {activeComponent === 'ScrollSync' &&
            <ScrollSyncExample
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

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
}

render(
  <Application />,
  document.getElementById('root')
)

// Import and attach the favicon
document.querySelector('[rel="shortcut icon"]').href = require('file!./favicon.png')
