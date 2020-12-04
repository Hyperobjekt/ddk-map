import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { IconButton } from '@material-ui/core'
import { AiOutlineControl } from 'react-icons/ai'

import useStore from './../store'
import theme from './../theme'
import { DesktopUnifiedShareBtn } from '../Share'

const ControlPanel = ({ ...props }) => {
  // Header is not displayed if the view type is 'embed'
  const activeView = useStore(state => state.activeView)
  const slideoutPanel = useStore(
    state => state.slideoutPanel,
  )
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )

  const toggleSlideout = e => {
    setStoreValues({
      slideoutPanel: {
        ...slideoutPanel,
        active: !slideoutPanel.active,
      },
    })
  }

  // Styles for this component.
  const styles = makeStyles(theme => ({
    root: {
      zIndex: theme.extras.controlPanel.zIndex,
      backgroundColor: theme.palette.background.paper,
      position: 'absolute',
      top: 0,
      left: 0,
      width: theme.extras.controlPanel.width,
      // Adjust for different app bar height.
      height: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px)`,
      top: `${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px`,
      [theme.breakpoints.up('sm')]: {
        height: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
        top: `${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px`,
      },
      boxShadow: theme.shadows[3],
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    button: {
      padding: '1.5rem',
    },
  }))

  const classes = styles()

  if (activeView === 'embed') {
    return ''
  } else {
    return (
      <Box className={clsx('control-panel', classes.root)}>
        <IconButton
          onClick={toggleSlideout}
          className={clsx(
            'control-panel-button',
            classes.button,
          )}
        >
          <AiOutlineControl />
        </IconButton>
        <DesktopUnifiedShareBtn />
      </Box>
    )
  }
}

ControlPanel.propTypes = {}

ControlPanel.defaultProps = {}

export default ControlPanel
