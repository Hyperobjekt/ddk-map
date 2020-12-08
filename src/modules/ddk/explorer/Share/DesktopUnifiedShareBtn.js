import React, { useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import { TwitterShareBtn } from '.'
import { FacebookShareBtn } from '.'
import { MailShareBtn } from '.'
import { LinkShareBtn } from '.'
import { UnifiedShareModal } from '.'
import { ShareLinkModal } from '.'
import { IconButton, Popper } from '@material-ui/core'
import ShareIcon from '@material-ui/icons/Share'
import useStore from '../store'

const DesktopUnifiedShareBtn = ({ ...props }) => {
  const { isTouchScreen, setStoreValues } = useStore(
    state => state,
  )

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  // open/close handlers for desktop
  const openShareTooltip = event => {
    if (isTouchScreen) {
      return
    }
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }
  const closeShareTooltip = () => {
    setAnchorEl(null)
  }

  // open handler for touch devices
  const openShareModal = event => {
    // in case this is the first touch event and it also triggered openShareTooltip
    closeShareTooltip()
    console.log('hi')
    setStoreValues({ unifiedShareModal: true })
  }

  // Styles for this component.
  const styles = makeStyles(theme => ({
    root: {
      marginTop: 'auto',
      marginBottom: '1.5rem',
    },
    popperButton: {
      padding: '1.5rem',
    },
    popper: {
      border: '1px solid',
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
    shareButton: {
      '&:hover': {
        '& .social-icon': {
          fill: 'gray',
        },
        color: 'gray',
        cursor: 'pointer',
      },
      '& .sr-only': { display: 'none' },
    },
  }))

  const classes = styles()

  return (
    <div className={clsx(classes.root)}>
      <IconButton
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        className={clsx(classes.popperButton)}
      >
        <ShareIcon />
        <Popper
          id={id}
          open={open}
          anchorEl={anchorEl}
          placement={'right-end'}
        >
          <div className={classes.popper}>
            <TwitterShareBtn
              className={classes.shareButton}
            >
              <span className="btn-label">
                {i18n.translate(`BUTTON_SHARE_TWITTER`)}
              </span>
            </TwitterShareBtn>
            <FacebookShareBtn
              className={classes.shareButton}
            >
              <span className="btn-label">
                {i18n.translate(`BUTTON_SHARE_FACEBOOK`)}
              </span>
            </FacebookShareBtn>
            <MailShareBtn className={classes.shareButton}>
              <span className="btn-label">
                {i18n.translate(`BUTTON_SHARE_EMAIL`)}
              </span>
            </MailShareBtn>
            <LinkShareBtn className={classes.shareButton}>
              <span className="btn-label">
                {i18n.translate(`BUTTON_SHARE_LINK`)}
              </span>
            </LinkShareBtn>
          </div>
        </Popper>
      </IconButton>
      <ShareLinkModal />
      <UnifiedShareModal />
    </div>
  )
}

export default DesktopUnifiedShareBtn
