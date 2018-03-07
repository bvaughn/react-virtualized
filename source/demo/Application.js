import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import {Redirect} from 'react-router';
import {HashRouter, Route} from 'react-router-dom';

import ComponentLink from './ComponentLink';
import styles from './Application.css';
import NavLink from './NavLink';
import Wizard from './Wizard';
import {TYPES} from './Icon';
import {generateRandomList} from './utils';

import ArrowKeyStepperExample from '../ArrowKeyStepper/ArrowKeyStepper.example';
import AutoSizerExample from '../AutoSizer/AutoSizer.example';
import CellMeasurerExample from '../CellMeasurer/CellMeasurer.example';
import CollectionExample from '../Collection/Collection.example';
import ColumnSizerExample from '../ColumnSizer/ColumnSizer.example';
import GridExample from '../Grid/Grid.example';
import InfiniteLoaderExample from '../InfiniteLoader/InfiniteLoader.example';
import ListExample from '../List/List.example';
import MasonryExample from '../Masonry/Masonry.example';
import MultiGridExample from '../MultiGrid/MultiGrid.example';
import ScrollSyncExample from '../ScrollSync/ScrollSync.example';
import TableExample from '../Table/Table.example';
import WindowScrollerExample from '../WindowScroller/WindowScroller.example';

const COMPONENT_EXAMPLES_MAP = {
  '/components/ArrowKeyStepper': ArrowKeyStepperExample,
  '/components/AutoSizer': AutoSizerExample,
  '/components/CellMeasurer': CellMeasurerExample,
  '/components/Collection': CollectionExample,
  '/components/ColumnSizer': ColumnSizerExample,
  '/components/Grid': GridExample,
  '/components/Masonry': MasonryExample,
  '/components/InfiniteLoader': InfiniteLoaderExample,
  '/components/List': ListExample,
  '/components/MultiGrid': MultiGridExample,
  '/components/ScrollSync': ScrollSyncExample,
  '/components/Table': TableExample,
  '/components/WindowScroller': WindowScrollerExample,
};

// HACK Generate arbitrary data for use in example components :)
const list = Immutable.List(generateRandomList());

export default class Application extends React.PureComponent {
  static childContextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    customElement: PropTypes.any,
    isScrollingCustomElement: PropTypes.bool.isRequired,
    setScrollingCustomElement: PropTypes.func,
  };

  state = {
    isScrollingCustomElement: false,
  };

  constructor(props) {
    super(props);
    this.setScrollingCustomElement = this.setScrollingCustomElement.bind(this);
  }

  setScrollingCustomElement(custom) {
    this.setState({isScrollingCustomElement: custom});
  }

  getChildContext() {
    const {customElement, isScrollingCustomElement} = this.state;
    return {
      list,
      customElement,
      isScrollingCustomElement,
      setScrollingCustomElement: this.setScrollingCustomElement,
    };
  }

  render() {
    const {isScrollingCustomElement} = this.state;
    const bodyStyle = isScrollingCustomElement
      ? styles.ScrollingBody
      : styles.Body;
    return (
      <HashRouter>
        <div className={styles.demo}>
          <div className={styles.headerRow}>
            <div className={styles.logoRow}>
              <div className={styles.ReactVirtualizedContainer}>
                <img
                  alt="React virtualized"
                  className={styles.logo}
                  src="https://cloud.githubusercontent.com/assets/29597/11736841/c0497158-9f87-11e5-8dfe-9c0be97d4286.png"
                />
                <div className={styles.PrimaryLogoText}>React</div>
                <div className={styles.SecondaryLogoText}>Virtualized</div>
              </div>

              <ul className={styles.NavList}>
                <NavLink to="/components/List" iconType={TYPES.COMPONENTS}>
                  Components
                </NavLink>
                <NavLink to="/wizard" iconType={TYPES.WIZARD}>
                  Wizard
                </NavLink>
                <NavLink
                  href="https://github.com/bvaughn/react-virtualized"
                  iconType={TYPES.SOURCE}>
                  Source
                </NavLink>
                <NavLink
                  href="https://github.com/bvaughn/react-virtualized/tree/master/docs#documentation"
                  iconType={TYPES.DOCUMENTATION}>
                  Documentation
                </NavLink>
                <NavLink
                  href="https://github.com/bvaughn/react-virtualized/issues"
                  iconType={TYPES.ISSUES}>
                  Issues
                </NavLink>
              </ul>
            </div>

            <div className={styles.ComponentList}>
              <ComponentLink to="/components/Collection">
                Collection
              </ComponentLink>
              <ComponentLink to="/components/Grid">Grid</ComponentLink>
              <ComponentLink to="/components/List">List</ComponentLink>
              <ComponentLink to="/components/Masonry">Masonry</ComponentLink>
              <ComponentLink to="/components/Table">Table</ComponentLink>
            </div>

            <div className={styles.HighOrderComponentList}>
              <ComponentLink to="/components/ArrowKeyStepper">
                ArrowKeyStepper
              </ComponentLink>
              <ComponentLink to="/components/AutoSizer">
                AutoSizer
              </ComponentLink>
              <ComponentLink to="/components/CellMeasurer">
                CellMeasurer
              </ComponentLink>
              <ComponentLink to="/components/ColumnSizer">
                ColumnSizer
              </ComponentLink>
              <ComponentLink to="/components/InfiniteLoader">
                InfiniteLoader
              </ComponentLink>
              <ComponentLink to="/components/MultiGrid">
                MultiGrid
              </ComponentLink>
              <ComponentLink to="/components/ScrollSync">
                ScrollSync
              </ComponentLink>
              <ComponentLink to="/components/WindowScroller">
                WindowScroller
              </ComponentLink>
            </div>
          </div>

          <div
            className={bodyStyle}
            ref={e => this.setState({customElement: e})}>
            <div className={styles.column}>
              <Route path="/wizard" component={Wizard} />
              {Object.keys(COMPONENT_EXAMPLES_MAP).map(route => (
                <Route
                  key={route}
                  path={route}
                  component={COMPONENT_EXAMPLES_MAP[route]}
                />
              ))}
              <Route
                exact
                path="/"
                render={() => <Redirect to="/components/List" />}
              />
            </div>
          </div>
        </div>
      </HashRouter>
    );
  }
}
