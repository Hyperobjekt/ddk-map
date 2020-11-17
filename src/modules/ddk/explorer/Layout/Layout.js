import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import Header from './../Header'
import ControlPanel from './../ControlPanel'

const Layout = ({ ...props }) => {
  const layoutStyles = makeStyles({
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
    },
  })

  const classes = layoutStyles()

  return (
    <Paper
      elevation={0}
      className={clsx('layout', classes.root)}
    >
      <Header />
      <ControlPanel />
    </Paper>
  )
}

Layout.propTypes = {}

Layout.defaultProps = {}

export default Layout
