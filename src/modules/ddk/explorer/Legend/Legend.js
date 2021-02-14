import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { IconButton } from '@material-ui/core'
import { AiOutlineControl } from 'react-icons/ai'

import useStore from './../store'
import theme from './../theme'

const Legend = ({ ...props }) => {
  // Header is not displayed if the view type is 'embed'
  const activeView = useStore(state => state.activeView)
  // Source data
  // const remoteJson = useStore(state => state.remoteJson)
  // useEffect(() => {
  //   console.log('remoteJson changed, ', remoteJson)
  // }, [remoteJson])
  // Styles for this component.
  const styles = makeStyles(theme => ({
    root: {
      zIndex: theme.extras.Legend.zIndex,
      backgroundColor: theme.palette.background.paper,
      position: 'absolute',
      right: theme.extras.Legend.cushionRight,
      width: theme.extras.Legend.width,
      height: theme.extras.Legend.height,
      // Adjust for different app bar height.
      top: theme.extras.Legend.cushionTop,
      padding: theme.spacing(3),
      boxShadow: theme.shadows[3],
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      // pointerEvents: 'none',
    },
  }))

  const classes = styles()

  return (
    <Box className={clsx('map-legend', classes.root)}>
      Legend
    </Box>
  )
}

Legend.propTypes = {}

Legend.defaultProps = {}

export default Legend
