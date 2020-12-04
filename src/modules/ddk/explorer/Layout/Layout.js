import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import ReactMapGL, {
  NavigationControl,
  Popup,
} from 'react-map-gl'
import { Paper } from '@material-ui/core'

import Header from './../Header'
import ControlPanel from './../ControlPanel'
import Map from './../Map'

const Layout = ({ ...props }) => {
  const layoutStyles = makeStyles(theme => ({
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.palette.background.default,
    },
  }))

  const classes = layoutStyles()

  return (
    <Paper
      elevation={0}
      className={clsx('layout', classes.root)}
    >
      <Header />
      <main>
        <ControlPanel />
        <Map />
      </main>
    </Paper>
  )
}

Layout.propTypes = {}

Layout.defaultProps = {}

export default Layout
