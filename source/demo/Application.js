/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { HashRouter, Match, Redirect } from 'react-router'

import ComponentLink from './ComponentLink'
import styles from './Application.css'
import NavLink from './NavLink'
import Wizard from './Wizard'
import { generateRandomList } from './utils'

import ArrowKeyStepperExample from '../ArrowKeyStepper/ArrowKeyStepper.example'
import AutoSizerExample from '../AutoSizer/AutoSizer.example'
import WindowScrollerExample from '../WindowScroller/WindowScroller.example'
import CellMeasurerExample from '../CellMeasurer/CellMeasurer.example'
import CollectionExample from '../Collection/Collection.example'
import ColumnSizerExample from '../ColumnSizer/ColumnSizer.example'
import GridExample from '../Grid/Grid.example'
import TableExample from '../Table/Table.example'
import InfiniteLoaderExample from '../InfiniteLoader/InfiniteLoader.example'
import ScrollSyncExample from '../ScrollSync/ScrollSync.example'
import ListExample from '../List/List.example'

const COMPONENT_EXAMPLES_MAP = {
  '/components/ArrowKeyStepper': ArrowKeyStepperExample,
  '/components/AutoSizer': AutoSizerExample,
  '/components/CellMeasurer': CellMeasurerExample,
  '/components/Collection': CollectionExample,
  '/components/ColumnSizer': ColumnSizerExample,
  '/components/Table': TableExample,
  '/components/Grid': GridExample,
  '/components/InfiniteLoader': InfiniteLoaderExample,
  '/components/ScrollSync': ScrollSyncExample,
  '/components/List': ListExample,
  '/components/WindowScroller': WindowScrollerExample
}

// HACK Generate arbitrary data for use in example components :)
const list = Immutable.List(generateRandomList())

export default class Application extends Component {
  static childContextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  };

  getChildContext () {
    return {
      list
    }
  }

  render () {
    return (
      <HashRouter>
        <div className={styles.demo}>
          <div className={styles.headerRow}>
            <div className={styles.logoRow}>
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
                <NavLink to='/components/List'>Components</NavLink>
                <NavLink to='/wizard'>Wizard</NavLink>
                <NavLink href='https://github.com/bvaughn/react-virtualized'>Source</NavLink>
                <NavLink href='https://github.com/bvaughn/react-virtualized/tree/master/docs#documentation'>Documentation</NavLink>
                <NavLink href='https://github.com/bvaughn/react-virtualized/issues'>Issues</NavLink>
              </ul>
            </div>

            <div className={styles.ComponentList}>
              <ComponentLink to='/components/Collection'>Collection</ComponentLink>
              <ComponentLink to='/components/Grid'>Grid</ComponentLink>
              <ComponentLink to='/components/List'>List</ComponentLink>
              <ComponentLink to='/components/Table'>Table</ComponentLink>
            </div>

            <div className={styles.HighOrderComponentList}>
              <ComponentLink to='/components/ArrowKeyStepper'>ArrowKeyStepper</ComponentLink>
              <ComponentLink to='/components/AutoSizer'>AutoSizer</ComponentLink>
              <ComponentLink to='/components/CellMeasurer'>CellMeasurer</ComponentLink>
              <ComponentLink to='/components/ColumnSizer'>ColumnSizer</ComponentLink>
              <ComponentLink to='/components/InfiniteLoader'>InfiniteLoader</ComponentLink>
              <ComponentLink to='/components/ScrollSync'>ScrollSync</ComponentLink>
              <ComponentLink to='/components/WindowScroller'>WindowScroller</ComponentLink>
            </div>
          </div>

          <div className={styles.Body}>
            <div className={styles.column}>
              <Match pattern='/wizard' component={Wizard} />
              {Object.keys(COMPONENT_EXAMPLES_MAP).map((route) => (
                <Match
                  component={COMPONENT_EXAMPLES_MAP[route]}
                  key={route}
                  pattern={route}
                />
              ))}
              <Match
                exactly
                pattern='/'
                render={() => (
                  <Redirect to='/components/List' />
                )}
              />
            </div>
          </div>
        </div>
      </HashRouter>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
}
