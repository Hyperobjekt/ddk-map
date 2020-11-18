import React, { Component } from 'react'
import { render } from 'react-dom'

import Explorer from '../../src'

// For testing props that will be passed in from Gatsby,
// where they are editable by the CMS.
const lang = 'en_US'
import langSet from './lang.json'

export default class Demo extends Component {
  // Fake toggle menu function to store in state for testing only.
  // toggleMenu = () => {
  //   return null
  // }

  render() {
    return <Explorer lang={lang} langSet={langSet} />
  }
}

render(<Demo />, document.querySelector('#demo'))
