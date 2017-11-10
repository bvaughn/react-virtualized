const {PureComponent} = React;
const {AutoSizer, List} = ReactVirtualized;

class ListExample extends PureComponent {
  render() {
    return React.createElement(AutoSizer, null, ({height, width}) =>
      React.createElement(List, {
        height: height,
        overscanRowCount: 0,
        rowCount: 1000,
        rowHeight: 30,
        rowRenderer: this._rowRenderer,
        width: width,
      }),
    );
  }

  _rowRenderer({index, isScrolling, key, style}) {
    return React.createElement(Row, {
      index: index,
      key: key,
      style: style,
    });
  }
}

class Row extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      counter: 0,
    };

    this._renderCount = 0;
  }

  render() {
    this._renderCount++;

    const {counter} = this.state;
    const {index, style} = this.props;

    return React.createElement(
      'div',
      {
        onClick: () => {
          this.setState(state => {
            counter: state.counter++;
          });
        },
        style: style,
      },
      'Row ',
      index,
      ', ',
      this._renderCount,
    );
  }
}

ReactDOM.render(
  React.createElement(ListExample),
  document.querySelector('#mount'),
);
