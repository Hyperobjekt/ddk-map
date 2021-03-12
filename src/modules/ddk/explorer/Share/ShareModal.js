/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react'
import { Dialog, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'
import clsx from 'clsx'
import { Close } from '@material-ui/icons'

import useStore from '../store'
import ShareContents from './ShareContents'

// Styles for this component.
const useStyles = makeStyles(theme => ({
  root: {
    width: `${theme.extras.sharePopper.widthMobile}px`,
    [theme.breakpoints.up('sm')]: {
      width: `${theme.extras.sharePopper.width}px`,
    },
    margin: 'auto',
    '& .MuiDialog-paper': {
      overflowX: 'hidden',
    },
  },
  close: {
    padding: '1rem',
    position: 'absolute',
    top: 6,
    right: 6,
  },
}))

const ShareModal = () => {
  const { shareLinkModal, setStoreValues } = useStore(
    state => ({
      shareLinkModal: state.shareLinkModal,
      setStoreValues: state.setStoreValues,
    }),
    shallow,
  )

  const handleClose = () => {
    // console.log('handleClose()')
    setStoreValues({
      shareLinkModal: false,
    })
  }

  const classes = useStyles()

  return (
    <Dialog
      open={shareLinkModal}
      onClose={handleClose}
      className={clsx('modal-intro-parent', classes.root)}
    >
      <IconButton
        onClick={handleClose}
        className={clsx(classes.close)}
        id={`control_panel_share_btn`}
        aria-label={i18n.translate(`BTN_CLOSE`)}
      >
        <Close />
      </IconButton>
      <ShareContents />
    </Dialog>
  )
}

export default ShareModal
