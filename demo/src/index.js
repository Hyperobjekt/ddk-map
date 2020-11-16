import React, { Component } from 'react'
import { render } from 'react-dom'

import Explorer from '../../src'

export default class Demo extends Component {
  toggleMenu = () => {
    // console.log('demo page toggle menu blah')
    return null
  }
  // TODO: Pass in language object from parent site.
  // TODO: Pass in active language from parent site.

  render() {
    return <Explorer toggleMenu={this.toggleMenu} />
  }
}

render(<Demo />, document.querySelector('#demo'))
