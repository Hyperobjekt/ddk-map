import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { IconButton } from '@material-ui/core'
import shallow from 'zustand/shallow'
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
// import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined'
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
        backgroundColor:
          theme.extras.variables.colors.ddkBlue,
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${theme.extras.controlPanel.width}px`,
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
      color: 'inherit',
      '&:hover': {
        backgroundColor: 'transparent',
        color: '#DAF0FF',
      },
      marginLeft: 'auto',
      marginRight: 'auto',
      '&.Mui-disabled': {
        color: theme.extras.variables.colors.lightGray,
      },
    },
    buttonContainer: {
      transition:
        'background-color 300ms ease-in-out, color 300ms ease-in-out',
      boxSizing: 'border-box',
      width: '100%',
      color: '#fff',
      textAlign: 'center',
      borderRight: `3px solid ${theme.extras.variables.colors.ddkBlue}`,
      '&.active': {
        color: theme.extras.variables.colors.ddkBlue,
        backgroundColor: '#DAF0FF',
        borderRight: `3px solid ${theme.extras.variables.colors.ddkRed}`,
        '& button': {
          color: theme.extras.variables.colors.ddkBlue,
        },
      },
    },
    buttonLabel: {
      fontSize: '10px',
      letterSpacing: '1.5px',
    },
    buttonGroup: {
      paddingTop: '10vh',
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
    showSharePopover,
  } = useStore(
    state => ({
      slideoutTract: state.slideoutTract,
      activeView: state.activeView,
      slideoutPanel: state.slideoutPanel,
      setStoreValues: state.setStoreValues,
      isMobile: state.isMobile,
      breakpoint: state.breakpoint,
      showSharePopover: state.showSharePopover,
    }),
    shallow,
  )

  const toggleSlideout = (val, e) => {
    if (
      slideoutPanel.active &&
      slideoutPanel.panel === val
    ) {
      setStoreValues({
        slideoutPanel: {
          ...slideoutPanel,
          active: false,
        },
        showSharePopover: false,
      })
    } else if (
      slideoutPanel.active &&
      slideoutPanel.panel != val
    ) {
      setStoreValues({
        slideoutPanel: {
          ...slideoutPanel,
          panel: val,
        },
        showSharePopover: false,
      })
    } else {
      setStoreValues({
        slideoutPanel: {
          ...slideoutPanel,
          active: true,
          panel: val,
        },
        showSharePopover: false,
      })
    }
  }

  const classes = useStyles({
    activeView,
    isMobile,
    breakpoint,
  })

  return (
    <Box className={clsx('control-panel', classes.root)}>
      <div className={classes.buttonGroup}>
        <div
          className={clsx(
            classes.buttonContainer,
            slideoutPanel.active &&
              slideoutPanel.panel === 'tract'
              ? 'active'
              : '',
          )}
        >
          <IconButton
            onClick={e => {
              toggleSlideout('tract', e)
            }}
            className={clsx(
              'control-panel-button',
              classes.button,
            )}
            disabled={slideoutTract === 0 ? true : false}
            disableRipple={true}
          >
            <div>
              <RoomOutlinedIcon fontSize={'large'} />
              <div
                className={classes.buttonLabel}
                dangerouslySetInnerHTML={{
                  __html: i18n.translate(
                    'CONTROL_PANEL_LOCATION',
                  ),
                }}
              ></div>
            </div>
          </IconButton>
        </div>
        {/* <div
          className={clsx(
            classes.buttonContainer,
            slideoutPanel.active &&
              slideoutPanel.panel === 'share'
              ? 'active'
              : '',
          )}
        >
          <IconButton
            onClick={e => {
              toggleSlideout('share', e)
            }}
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
        </div> */}
        <div
          className={clsx(
            classes.buttonContainer,
            slideoutPanel.active &&
              slideoutPanel.panel === 'faq'
              ? 'active'
              : '',
          )}
        >
          <IconButton
            onClick={e => {
              toggleSlideout('faq', e)
            }}
            className={clsx(
              'control-panel-button',
              classes.button,
            )}
            disableRipple={true}
          >
            <div>
              <HelpOutlineIcon fontSize={'large'} />
              <div
                className={classes.buttonLabel}
                dangerouslySetInnerHTML={{
                  __html: i18n.translate(
                    'CONTROL_PANEL_FAQS',
                  ),
                }}
              ></div>
            </div>
          </IconButton>
        </div>
        <DesktopUnifiedShareBtn
          className={clsx(
            classes.buttonContainer,
            slideoutPanel.active &&
              slideoutPanel.panel === 'share'
              ? 'active'
              : '',
          )}
        >
          <div
            className={classes.buttonLabel}
            dangerouslySetInnerHTML={{
              __html: i18n.translate('CONTROL_PANEL_SHARE'),
            }}
          ></div>
        </DesktopUnifiedShareBtn>
      </div>
    </Box>
  )
}

ControlPanel.propTypes = {}

ControlPanel.defaultProps = {}

export default ControlPanel
