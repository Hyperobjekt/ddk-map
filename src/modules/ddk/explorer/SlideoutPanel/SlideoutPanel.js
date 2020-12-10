import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import {
  Backdrop,
  Fade,
  IconButton,
  Modal,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import useStore from './../store'
import { variables } from '../theme'

const SlideoutPanel = () => {
  const {
    setStoreValues,
    slideoutPanel,
    interactionsMobile,
    breakpoint,
    browserWidth,
  } = useStore(state => state)

  const handleClose = () => {
    setStoreValues({
      slideoutPanel: { ...slideoutPanel, active: false },
    })
  }

  // Styles for this component.
  const styles = makeStyles(theme => ({
    panel: {
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
      // height: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px)`,
      // top: `${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px`,
      // [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
      top: `${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px`,
      // },
      // [theme.breakpoints.down('xs')]: {
      //   display: 'none',
      // },
      boxShadow: theme.shadows[3],
    },
    panelContent: {
      padding: theme.spacing(3, 4, 3),
    },
    modal: {
      // inset: '10vh 10vw !important',
      top: '10vh !important',
      bottom: '10vh !important',
      left: '10vw !important',
      right: '10vw !important',
      // [theme.breakpoints.up('sm')]: {
      //   display: 'none',
      // },
      boxShadow: theme.shadows[3],
      outline: 0,
    },
    modalContent: {
      border: '1px solid #000',
      outline: 0,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(3, 4, 3),
      height: '100%',
      // width: '100%',
    },
    button: {
      padding: '1.5rem',
      position: 'absolute',
      top: 0,
      right: 0,
      '&:hover svg': {
        fill: theme.extras.colors.svgFillHover,
      },
    },
  }))

  const classes = styles()

  let content = null
  switch (slideoutPanel.panel) {
    case 'info':
      content = <div className={classes.content}>info</div>
      break

    case 'layers':
      content = (
        <div className={classes.content}>layers</div>
      )
      break

    case 'filters':
      content = (
        <div className={classes.content}>filters</div>
      )
      break

    default:
      content = <div className={classes.content}>other</div>
      break
  }

  if (browserWidth < variables.largeTabletWidth) {
    return (
      <Modal
        className={classes.modal}
        open={slideoutPanel.active}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={slideoutPanel.active}>
          <div className={classes.modalContent}>
            <IconButton
              onClick={handleClose}
              className={classes.button}
            >
              <CloseIcon />
            </IconButton>
            {content}
          </div>
        </Fade>
      </Modal>
    )
  } else {
    return (
      <div className={classes.panel}>
        <div className={classes.panelContent}>
          <IconButton
            onClick={handleClose}
            className={classes.button}
          >
            <CloseIcon />
          </IconButton>
          {content}
        </div>
      </div>
    )
  }
}

SlideoutPanel.propTypes = {}

SlideoutPanel.defaultProps = {}

export default SlideoutPanel
