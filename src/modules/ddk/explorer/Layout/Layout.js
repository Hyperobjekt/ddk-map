import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'

import Header from './../Header'
import ControlPanel from './../ControlPanel'
import SlideoutPanel from './../SlideoutPanel'
import Map from './../Map'
import Legend from '../Legend'
import IntroModal from './../IntroModal'

const useLayoutStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  main: {
    // marginTop:
    //   theme.extras.variables.dimensions.navbarHeight,
    // height: `calc(100vh - ${theme.extras.variables.dimensions.navbarHeight})`,
  },
}))

const Layout = ({ ...props }) => {
  const classes = useLayoutStyles()

  return (
    <Paper
      elevation={0}
      className={clsx('layout', classes.root)}
    >
      <Header />
      <main className={clsx(classes.main)}>
        <ControlPanel />
        <SlideoutPanel />
        <Legend />
        <Map />
        <IntroModal />
      </main>
    </Paper>
  )
}

Layout.propTypes = {}

Layout.defaultProps = {}

export default Layout
