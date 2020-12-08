/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { useEffect, useState } from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import i18n from '@pureartisan/simple-i18n'
import copy from 'copy-to-clipboard'

import useStore from './../store'
import {
  Backdrop,
  Fade,
  FormGroup,
  IconButton,
  Input,
} from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'

const ShareLinkModal = props => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const shareLinkModal = useStore(
    state => state.shareLinkModal,
  )
  const toggle = () => {
    setStoreValues({ shareLinkModal: !shareLinkModal })
  }
  const activeRoute = useStore(state => state.activeRoute)
  const shareHash = useStore(state => state.shareHash)
  const eventShareLink = useStore(
    state => state.eventShareLink,
  )

  const onCopy = () => {
    copy(location)
    setStoreValues({ eventShareLink: eventShareLink + 1 })
  }

  // Update value for share link only when window object exists.
  const [shareLinkValue, setShareLinkValue] = useState('')
  useEffect(() => {
    setShareLinkValue(
      !!shareHash
        ? window.location.origin +
            window.location.pathname +
            shareHash
        : window.location.origin +
            window.location.pathname +
            activeRoute,
    )
  }, [shareHash])

  // Styles for this component.
  const styles = makeStyles(theme => ({
    root: {
      position: 'absolute',
      height: 200,
      width: 400,
      top: 'calc(50% - 100px) !important',
      left: 'calc(50% - 200px) !important',
      // inset: 'unset !important',
    },
    body: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    input: {
      width: 'calc(100% - 50px)',
      background: '#eaebf4',
      padding: theme.spacing(1),
    },
    fileIcon: {
      '&:hover': {
        fill: 'black',
      },
    },
  }))

  const classes = styles()

  return (
    <Modal
      open={!!shareLinkModal}
      onClose={toggle}
      className={classes.root}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={!!shareLinkModal}>
        <div className={classes.body}>
          <h3>{i18n.translate('MODAL_SHARE_LINK_HEAD')}</h3>
          <p>{i18n.translate('MODAL_SHARE_LINK_INSTR')}</p>
          {i18n.translate('MODAL_SHARE_LINK_INPUT')}
          <br></br>
          <FormGroup row>
            <Input
              type="text"
              id="link"
              name="link"
              className={classes.input}
              value={shareLinkValue}
              // variant='filled'
              readOnly
              // disabled
              // fullWidth
            />
            <IconButton onClick={onCopy}>
              <FileCopy className={classes.fileIcon} />
            </IconButton>
          </FormGroup>
        </div>
      </Fade>
    </Modal>
  )
}

export default ShareLinkModal
