import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { IconButton } from '@material-ui/core'
import { AiOutlineControl } from 'react-icons/ai'
import shallow from 'zustand/shallow'

import useStore from './../store'
import { DesktopUnifiedShareBtn } from '../Share'

// Styles for this component.
const useStyles = makeStyles(theme => {
  return {
    root: ({ activeView, isMobile, breakpoint }) => {
      const hideControlPanel =
        activeView === 'embed' ||
        !!isMobile ||
        breakpoint === 'xs' ||
        breakpoint === 'sm'
      return {
        display: hideControlPanel ? 'none' : 'flex',
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
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }
    },
    button: {
      padding: '1.5rem',
    },
  }
})

const ControlPanel = ({ ...props }) => {
  // Header is not displayed if the view type is 'embed'
  const {
    slideoutTract,
    activeView,
    slideoutPanel,
    setStoreValues,
    isMobile,
    breakpoint,
  } = useStore(
    state => ({
      slideoutTract: state.slideoutTract,
      activeView: state.activeView,
      slideoutPanel: state.slideoutPanel,
      setStoreValues: state.setStoreValues,
      isMobile: state.isMobile,
      breakpoint: state.breakpoint,
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

  const classes = useStyles({
    activeView,
    isMobile,
    breakpoint,
  })

  return (
    <Box className={clsx('control-panel', classes.root)}>
      <IconButton
        onClick={toggleSlideout}
        className={clsx(
          'control-panel-button',
          classes.button,
        )}
        disabled={slideoutTract === 0 ? true : false}
      >
        <AiOutlineControl />
      </IconButton>
      <DesktopUnifiedShareBtn />
    </Box>
  )
}

ControlPanel.propTypes = {}

ControlPanel.defaultProps = {}

export default ControlPanel
