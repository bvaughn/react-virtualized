import React from 'react';
import Tree from './Tree';

export default class TreeExample extends React.PureComponent {
  static overscanIndicesGetter({startIndex, stopIndex}) {
    return {
      overscanStartIndex: startIndex,
      overscanStopIndex: stopIndex,
    };
  }

  id = 0;
  root = this.createNode();

  constructor(...args) {
    super(...args);

    this.nodeGetter = this.nodeGetter.bind(this);
  }

  render() {
    return (
      <Tree
        height={500}
        nodeGetter={this.nodeGetter}
        overscanIndicesGetter={this.constructor.overscanIndicesGetter}
        overscanRowCount={0}
        rowHeight={30}
        width={1024}
      />
    );
  }

  createNode(depth = 0) {
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
      node.children.push(this.createNode(depth + 1));
    }

    return node;
  }

  *nodeGetter() {
    const stack = [];

    stack.push({
      nestingLevel: 0,
      node: this.root,
    });

    while (stack.length !== 0) {
      const {node, nestingLevel} = stack.pop();

      const isOpened = yield {
        childrenCount: node.children.length,
        id: node.id,
        isOpenedByDefault: false,
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
}
