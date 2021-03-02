/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import i18n from '@pureartisan/simple-i18n'
import copy from 'copy-to-clipboard'
import shallow from 'zustand/shallow'

import { TwitterShareBtn } from '.'
import { FacebookShareBtn } from '.'
import { MailShareBtn } from '.'
import useStore from './../store'
import {
  Backdrop,
  Fade,
  FormGroup,
  IconButton,
  Input,
} from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'
import { DEFAULT_ROUTE } from '../../../../constants/map'

// Styles for this component.
const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    width: 400,
    maxWidth: '70vw',
    // along with transform values on body, centers the modal
    top: '50% !important',
    left: '50% !important',
    // inset: 'unset !important',
  },
  body: {
    width: '100%',
    // along with top/left values on root, centers the modal
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4),
  },
  input: {
    width: 'calc(100% - 50px)',
    background: '#eaebf4',
    padding: theme.spacing(1),
  },
  shareButtons: {
    display: 'flex',
  },
  fileIcon: {
    '&:hover': {
      fill: 'black',
    },
  },
  shareButton: {
    '&:hover': {
      '& .social-icon': {
        fill: 'black',
      },
      color: 'gray',
      cursor: 'pointer',
    },
    '& .sr-only': { display: 'none' },
  },
}))

const GenericShareModal = ({
  open,
  onClose,
  heading,
  showIconSection,
  showLinkSection,
  showEmbedSection,
}) => {
  const {
    shareHash,
    eventShareLink,
    eventShareEmbed,
    setStoreValues,
  } = useStore(
    state => ({
      shareHash: state.shareHash,
      eventShareLink: state.eventShareLink,
      eventShareEmbed: state.eventShareEmbed,
      eventShareEmbed: state.setStoreValues,
    }),
    shallow,
  )

  // Update value for share link only when window object exists.
  const [shareLinkValue, setShareLinkValue] = useState('')
  const [shareEmbedValue, setShareEmbedValue] = useState('')
  useEffect(() => {
    const linkValue = !!shareHash
      ? window.location.origin +
        window.location.pathname +
        shareHash
      : window.location.origin +
        window.location.pathname +
        DEFAULT_ROUTE

    setShareLinkValue(linkValue)
    const embedLink = linkValue.replace('explorer', 'embed')
    const embedValue = `<iframe src="${embedLink}" style="width:720px;height:405px;max-width:100%;" frameborder="0"></iframe>`
    setShareEmbedValue(embedValue)
  }, [shareHash])

  const onCopyLink = () => {
    copy(shareLinkValue)
    setStoreValues({ eventShareLink: eventShareLink + 1 })
  }

  const onCopyEmbed = () => {
    copy(shareEmbedValue)
    setStoreValues({ eventShareEmbed: eventShareEmbed + 1 })
  }

  const classes = useStyles()

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={classes.root}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.body}>
          <h3>{heading}</h3>

          {showIconSection && (
            <div className={classes.shareButtons}>
              <TwitterShareBtn
                className={classes.shareButton}
              />
              <FacebookShareBtn
                className={classes.shareButton}
              />
              <MailShareBtn
                className={classes.shareButton}
              />
            </div>
          )}

          {showLinkSection && (
            <div>
              <p>
                {i18n.translate('MODAL_SHARE_LINK_INSTR')}
              </p>
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
                <IconButton onClick={onCopyLink}>
                  <FileCopy className={classes.fileIcon} />
                </IconButton>
              </FormGroup>
            </div>
          )}

          {showEmbedSection && (
            <div>
              <p>
                {i18n.translate('MODAL_SHARE_EMBED_INSTR')}
              </p>
              {i18n.translate('MODAL_SHARE_EMBED_INPUT')}
              <br></br>
              <FormGroup row>
                <Input
                  type="text"
                  id="embed"
                  name="embed"
                  className={classes.input}
                  value={shareEmbedValue}
                  // variant='filled'
                  readOnly
                  // disabled
                  // fullWidth
                />
                <IconButton onClick={onCopyEmbed}>
                  <FileCopy className={classes.fileIcon} />
                </IconButton>
              </FormGroup>
            </div>
          )}
        </div>
      </Fade>
    </Modal>
  )
}

GenericShareModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  heading: PropTypes.string,
  showIconSection: PropTypes.bool,
  showLinkSection: PropTypes.bool,
  showEmbedSection: PropTypes.bool,
}

GenericShareModal.defaultProps = {
  open: false,
  onClose: () => {},
  heading: '',
  showIconSection: false,
  showLinkSection: false,
  showEmbedSection: false,
}

export default GenericShareModal
