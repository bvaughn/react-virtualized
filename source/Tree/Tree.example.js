import React from 'react';
import {AutoSizer} from '../AutoSizer';
import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph,
} from '../demo/ContentBox';
import Tree from './Tree';
import {InputRow, LabeledInput} from '../demo/LabeledInput';
import styles from './Tree.example.css';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default class TreeExample extends React.PureComponent {
  static overscanIndicesGetter({startIndex, stopIndex}) {
    return {
      overscanStartIndex: startIndex,
      overscanStopIndex: stopIndex,
    };
  }

  id = 0;
  allKeys;
  root = this._createNode();
  state = {
    closeAll: false,
    dynamicRowsHeights: false,
    height: 270,
    rowHeight: 30,
    scrollTo: undefined,
  };
  tree;

  constructor(...args) {
    super(...args);
    this._nodeGetter = this._nodeGetter.bind(this);
    this.allKeys = this._prepareAllKeys();
  }

  componentDidUpdate(_, {
    closeAll: prevCloseAll,
    dynamicRowsHeight: prevDynamicRowsHeight,
  }) {
    const {
      closeAll,
      dynamicRowsHeights,
    } = this.state;

    if (closeAll !== prevCloseAll) {
      this.tree.setNodesStates(this._createStates(!closeAll));
    }

    if (dynamicRowsHeights !== prevDynamicRowsHeight) {
      this.tree.forceUpdate();
      this.tree.forceUpdateGrid();
    }
  }

  render() {
    const {
      closeAll,
      dynamicRowsHeights,
      height,
      rowHeight,
      scrollTo,
    } = this.state;

    return (
      <ContentBox>
        <ContentBoxHeader
          text="Tree"
          sourceLink="https://github.com/bvaughn/react-virtualized/blob/master/source/Tree/Tree.example.js"
          docsLink="https://github.com/bvaughn/react-virtualized/blob/master/docs/Tree.md"
        />

        <ContentBoxParagraph>
          The tree below is windowed (or "virtualized") meaning that only the
          visible rows are rendered.
        </ContentBoxParagraph>

        <ContentBoxParagraph>
          <label className={styles.checkboxLabel}>
            <input
              aria-label="Close all nodes?"
              checked={closeAll}
              type="checkbox"
              onChange={event => this.setState({closeAll: event.target.checked})}
            />
            Close all nodes?
          </label>
          <label className={styles.checkboxLabel}>
            <input
              aria-label="Use dynamic rows heights?"
              checked={dynamicRowsHeights}
              type="checkbox"
              onChange={event => this.setState({dynamicRowsHeights: event.target.checked})}
            />
            Use dynamic rows heights?
          </label>
        </ContentBoxParagraph>

        <InputRow>
          <LabeledInput
            label="Height"
            name="height"
            onChange={event => this.setState({height: parseInt(event.target.value, 10) || 1})}
            value={height}
          />
          <LabeledInput
            label="Scroll to"
            name="scrollTo"
            placeholder="Index..."
            onChange={event => this.setState({scrollTo: parseInt(event.target.value, 10) || undefined})}
            value={scrollTo}
          />
          <LabeledInput
            label="Row height"
            name="rowHeight"
            onChange={event => this.setState({rowHeight: parseInt(event.target.value, 10) || 1})}
            value={rowHeight}
          />
        </InputRow>

        <div>
          <AutoSizer disableHeight>
            {({width}) => (
              <Tree
                height={height}
                nodeGetter={this._nodeGetter}
                overscanIndicesGetter={this.constructor.overscanIndicesGetter}
                overscanRowCount={0}
                ref={this._setRef}
                rowHeight={rowHeight}
                scrollToIndex={scrollTo}
                width={width}
              />
            )}
          </AutoSizer>
        </div>
      </ContentBox>
    );
  }

  _createNode(depth = 0) {
    const node = {
      id: this.id,
      name: `test-${this.id}`,
      children: [],
    };

    this.id += 1;

    if (depth === 5) {
      return node;
    }

    for (let i = 0; i < 5; i++) {
      node.children.push(this._createNode(depth + 1));
    }

    return node;
  }

  _createStates(value) {
    const states = {};

    for (const key of this.allKeys) {
      states[key] = value;
    }

    return states;
  }

  * _nodeGetter() {
    const {dynamicRowsHeights} = this.state;

    const stack = [];

    stack.push({
      nestingLevel: 0,
      node: this.root,
    });

    while (stack.length !== 0) {
      const {node, nestingLevel} = stack.pop();

      const isOpened = yield {
        childrenCount: node.children.length,
        height: dynamicRowsHeights ? getRandomInt(30, 60) : undefined,
        id: node.id,
        isOpenedByDefault: true,
        nestingLevel,
        nodeData: node.name,
      };

      if (node.children.length !== 0 && isOpened) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            nestingLevel: nestingLevel + 1,
            node: node.children[i],
          });
        }
      }
    }
  }

  _prepareAllKeys() {
    const result = [];
    const stack = [];

    stack.push({
      nestingLevel: 0,
      node: this.root,
    });

    while (stack.length !== 0) {
      const {node, nestingLevel} = stack.pop();
      result.push(node.id);

      if (node.children.length !== 0) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            nestingLevel: nestingLevel + 1,
            node: node.children[i],
          });
        }
      }
    }

    return result;
  }

  _setRef = (instance) => {
    this.tree = instance;
  }
}
