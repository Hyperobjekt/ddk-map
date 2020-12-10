import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { IconButton } from '@material-ui/core'
import { AiOutlineControl } from 'react-icons/ai'
import LayersIcon from '@material-ui/icons/Layers'

import useStore from './../store'
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

  const infoPanelOpen =
    slideoutPanel.active && slideoutPanel.panel === 'info'
  const layersPanelOpen =
    slideoutPanel.active && slideoutPanel.panel === 'layers'

  const openInfoPanel = () => {
    if (infoPanelOpen) {
      setStoreValues({
        slideoutPanel: {
          ...slideoutPanel,
          active: false,
        },
      })
      return
    }

    setStoreValues({
      slideoutPanel: {
        ...slideoutPanel,
        active: true,
        panel: 'info',
      },
    })
  }

  const openLayersPanel = () => {
    if (layersPanelOpen) {
      setStoreValues({
        slideoutPanel: {
          ...slideoutPanel,
          active: false,
        },
      })
      return
    }

    setStoreValues({
      slideoutPanel: {
        ...slideoutPanel,
        active: true,
        panel: 'layers',
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
      '&:hover svg': {
        fill: theme.extras.colors.svgFillHover,
      },
      '&.active svg': {
        fill: theme.extras.colors.svgFillActive,
      },
    },
  }))

  const classes = styles()

  if (activeView === 'embed') {
    return ''
  } else {
    return (
      <Box className={classes.root}>
        <IconButton
          onClick={openInfoPanel}
          className={clsx(classes.button, {
            active: infoPanelOpen,
          })}
        >
          <AiOutlineControl />
        </IconButton>
        <IconButton
          onClick={openLayersPanel}
          className={clsx(classes.button, {
            active: layersPanelOpen,
          })}
        >
          <LayersIcon />
        </IconButton>
        <DesktopUnifiedShareBtn />
      </Box>
    )
  }
}

ControlPanel.propTypes = {}

ControlPanel.defaultProps = {}

export default ControlPanel
