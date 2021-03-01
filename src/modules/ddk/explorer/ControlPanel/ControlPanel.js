import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { IconButton } from '@material-ui/core'
import { AiOutlineControl } from 'react-icons/ai'
import shallow from 'zustand/shallow'
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import useStore from './../store'
import { DesktopUnifiedShareBtn } from '../Share'

const ControlPanel = ({ ...props }) => {
  // Header is not displayed if the view type is 'embed'
  const {
    slideoutTract,
    activeView,
    slideoutPanel,
    setStoreValues,
  } = useStore(
    state => ({
      slideoutTract: state.slideoutTract,
      activeView: state.activeView,
      slideoutPanel: state.slideoutPanel,
      setStoreValues: state.setStoreValues,
    }),
    shallow,
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
      backgroundColor: theme.extras.variables.colors.ddkBlue,
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
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    button: {
      padding: '1.5rem',
      color: 'white'
    },
  }))

  const classes = styles()

  if (activeView === 'embed') {
    return ''
  } else {
    return (
      <Box className={clsx('control-panel', classes.root)}>
        <div className={'buttonGroup'}>
          <IconButton
            onClick={toggleSlideout}
            className={clsx(
              'control-panel-button',
              classes.button,
            )}
            disabled={slideoutTract === 0 ? true : false}
          >
            <RoomOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={toggleSlideout}
            className={clsx(
              'control-panel-button',
              classes.button,
            )}
          >
            <HelpOutlineIcon />
          </IconButton>
          <DesktopUnifiedShareBtn />
        </div>
      </Box>
    )
  }
}

ControlPanel.propTypes = {}

ControlPanel.defaultProps = {}

export default ControlPanel
