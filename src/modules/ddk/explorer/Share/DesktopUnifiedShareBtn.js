import React, { useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import { TwitterShareBtn } from '.'
import { FacebookShareBtn } from '.'
import { MailShareBtn } from '.'
import { LinkShareBtn } from '.'
import { IconButton, Popper } from '@material-ui/core'
import ShareIcon from '@material-ui/icons/Share'

const DesktopUnifiedShareBtn = ({ ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-Popper' : undefined

  // Styles for this component.
  const styles = makeStyles(theme => ({
    root: {},
    popperButton: {
      padding: '1.5rem',
      marginTop: 'auto',
      marginBottom: '1.5rem',
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
    <IconButton
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      className={clsx(
        props.className,
        classes.popperButton,
      )}
    >
      <ShareIcon />
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement={'right-end'}
      >
        <div className={classes.popper}>
          <TwitterShareBtn className={classes.shareButton}>
            <span className="btn-label">
              {i18n.translate(`BUTTON_SHARE_TWITTER`)}
            </span>
          </TwitterShareBtn>
          <FacebookShareBtn className={classes.shareButton}>
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
  )
}

export default DesktopUnifiedShareBtn
