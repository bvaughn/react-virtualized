import { Component, PropTypes } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'

/**
 * HOC that simplifies the process of synchronizing scrolling between two or more virtualized components.
 */
export default class ScrollSync extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    /**
     * Function respondible for rendering 2 or more virtualized components.
     * This function should implement the following signature:
     * ({ onScroll, scrollLeft, scrollTop }) => PropTypes.element
     */
    children: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      scrollLeft: 0,
      scrollTop: 0
    }

    this._onScroll = this._onScroll.bind(this)
  }

  render () {
    const { children } = this.props
    const { scrollLeft, scrollTop } = this.state

    return children({
      onScroll: this._onScroll,
      scrollLeft,
      scrollTop
    })
  }

  _onScroll ({ scrollLeft, scrollTop }) {
    this.setState({ scrollLeft, scrollTop })
  }
}
