import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import useStore from './../store'

const SlideoutPanel = ({ ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const slideoutPanel = useStore(
    state => state.slideoutPanel,
  )

  const handleClose = () => {
    setStoreValues({
      slideoutPanel: { ...slideoutPanel, active: false },
    })
  }

  // Styles for this component.
  const styles = makeStyles(theme => ({
    root: {
      zIndex: theme.extras.slideoutPanel.zIndex,
      backgroundColor: theme.palette.background.paper,
      position: 'absolute',
      top: 0,
      left: slideoutPanel.active
        ? theme.extras.controlPanel.width
        : '-' + theme.extras.slideoutPanel.width,
      transition: 'left 500ms ease-in-out',
      width: theme.extras.slideoutPanel.width,
      // Adjust for different app bar height.
      height: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px)`,
      top: `${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px`,
      [theme.breakpoints.up('sm')]: {
        height: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
        top: `${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px`,
      },
      boxShadow: theme.shadows[3],
    },
    button: {
      padding: '1.5rem',
      position: 'absolute',
      top: 0,
      right: 0,
    },
  }))

  const classes = styles()

  return (
    <div className={clsx(classes.root)}>
      <IconButton
        onClick={handleClose}
        className={clsx(classes.button)}
      >
        <CloseIcon />
      </IconButton>
    </div>
  )
}

SlideoutPanel.propTypes = {}

SlideoutPanel.defaultProps = {}

export default SlideoutPanel
