import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { IconButton } from '@material-ui/core'
import { AiOutlineControl } from 'react-icons/ai'
import shallow from 'zustand/shallow'
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import useStore from './../store'
import { DesktopUnifiedShareBtn } from '../Share'

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

  const hideControlPanel =
    activeView === 'embed' ||
    !!isMobile ||
    breakpoint === 'xs' ||
    breakpoint === 'sm'

  // Styles for this component.
  const styles = makeStyles(theme => ({
    root: {
      display: hideControlPanel ? 'none' : 'flex',
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
      boxShadow: theme.shadows[3],
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    button: {
      color: 'inherit',
    },
    buttonContainer: {
      transition: 'background-color 300ms ease-in-out, color 300ms ease-in-out',
      boxSizing: 'border-box',
      width: '100%',
      color: '#fff',
      textAlign: 'center',
      '&.active' : {
        color: theme.extras.variables.colors.ddkBlue,
        backgroundColor: '#DAF0FF',
        borderRight: `3px solid ${theme.extras.variables.colors.ddkRed}`,
      }
    },
    buttonLabel: {
      fontSize: '10px',
      letterSpacing: '1.5px'
    },
    buttonGroup: {
      paddingTop: '50%'
    }
  }))

  const classes = styles()

  return (
    <Box className={clsx('control-panel', classes.root)}>
      <div className={classes.buttonGroup}>
        <div class={clsx(classes.buttonContainer, slideoutPanel.active && slideoutPanel.panel === 'tract' ? 'active' : '')}>
          <IconButton
            onClick={toggleSlideout}
            className={clsx(
              'control-panel-button',
              classes.button
            )}
            disabled={slideoutTract === 0 ? true : false}
          >
            <div>
              <RoomOutlinedIcon fontSize={'large'}/>
              <div className={classes.buttonLabel}>
                Location<br />
                Details
              </div>
            </div>
          </IconButton>
        </div>
        <div class={clsx(classes.buttonContainer, slideoutPanel.active && slideoutPanel.panel === 'faq' ? 'active' : '')}>
          <IconButton
            onClick={toggleSlideout}
            className={clsx(
              'control-panel-button',
              classes.button,
            )}
          >
            <div>
              <ShareOutlinedIcon fontSize={'large'} />
              <div className={classes.buttonLabel}>
                Share
              </div>
            </div>
          </IconButton>
        </div>
        <div class={clsx(classes.buttonContainer, slideoutPanel.active && slideoutPanel.panel === 'faq' ? 'active' : '')}>
          <IconButton
            onClick={toggleSlideout}
            className={clsx(
              'control-panel-button',
              classes.button,
            )}
          >
            <div>
              <HelpOutlineIcon fontSize={'large'}/>
              <div className={classes.buttonLabel}>
                FAQS
              </div>
            </div>
          </IconButton>
        </div>
      </div>
    </Box>
  )
}

ControlPanel.propTypes = {}

ControlPanel.defaultProps = {}

export default ControlPanel
