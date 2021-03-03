import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import shallow from 'zustand/shallow'
import {
  IconButton,
  Popper,
  FormGroup,
  Input,
} from '@material-ui/core'
// import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined'
import {
  FileCopy,
  Close,
  ShareOutlined,
} from '@material-ui/icons'
import copy from 'copy-to-clipboard'

import { TwitterShareBtn } from '.'
import { FacebookShareBtn } from '.'
import { MailShareBtn } from '.'
import { DEFAULT_ROUTE } from '../../../../constants/map'
import useStore from '../store'

// Styles for this component.
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 'auto',
    marginBottom: '1.5rem',
    transition:
      'background-color 300ms ease-in-out, color 300ms ease-in-out',
    boxSizing: 'border-box',
    width: '100%',
    color: '#fff',
    textAlign: 'center',
    borderRight: `3px solid ${theme.extras.variables.colors.ddkBlue}`,
    '& button:hover': {
      backgroundColor: 'transparent',
      color: 'red', // '#DAF0FF',
      '& .MuiIconButton-label, & svg': {
        color: '#DAF0FF',
      },
    },
    '&.active': {
      color: theme.extras.variables.colors.ddkBlue,
      backgroundColor: '#DAF0FF',
      borderRight: `3px solid ${theme.extras.variables.colors.ddkRed}`,
      '& .MuiIconButton-label, & svg': {
        color: theme.extras.variables.colors.ddkBlue,
        '&:hover': {
          color: `${theme.extras.variables.colors.ddkBlue} !important`,
        },
      },
      '& button, & button:hover': {
        color: theme.extras.variables.colors.ddkBlue,
        '& .MuiIconButton-label, & svg': {
          color: theme.extras.variables.colors.ddkBlue,
        },
      },
    },
  },
  popperButton: {
    // padding: '1.5rem',
    color: '#fff',
    '& .MuiIconButton-label': {
      flexWrap: 'wrap',
      color: '#fff',
    },
  },
  popper: {
    padding: '19px',
    width: `${theme.extras.sharePopper.width}px`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: `0px 0px 4px rgba(0, 0, 0, 0.25)`,
    borderRadius: '5px',
    display: 'flex',
    flexWrap: `wrap`,
    justifyContent: 'flex-start',
  },
  shareButton: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    flex: '0 0 auto',
    color: theme.extras.variables.colors.ddkAnotherNavy,
    backgroundColor: 'rgba(59, 89, 152, 0.1)',
    marginRight: '1rem',
    '& button:hover': {
      background:
        theme.extras.variables.colors.ddkALighterOneOffBlue, //'#eaebf4',
      color:
        theme.extras.variables.colors.ddkAnotherOneOffBlue,
      cursor: 'pointer',
    },
    '& .sr-only': { display: 'none' },
  },
  shareIcon: {
    color: 'white',
    '&:hover': {
      color: 'blue',
    },
  },
  buttonLabel: {
    fontSize: '10px',
    letterSpacing: '1.5px',
  },
  input: {
    width: 'calc(100% - 40px)',
    background: 'rgba(59, 89, 152, 0.1)',
    // theme.extras.variables.colors.lightLightGray,
    padding: theme.spacing(1),
    height: `40px`,
    border: 0,
    '&.MuiInput-underline:before, &.MuiInput-underline:after': {
      display: 'none',
    },
    fontSize: '14px',
    fontFamily: 'Fira Sans',
    fontWeight: 200,
    color: theme.extras.variables.colors.darkGray,
  },
  inputGroup: {
    border: `1px solid gray`,
    borderRadius: `5px`,
    height: `40px`,
    marginTop: '6px',
    '& .MuiIconButton-root': {
      width: '40px',
      height: '40px',
      flex: '0 0 40px',
      marginRight: 0,
      marginLeft: 'auto',
      borderRadius: 0,
      '&:hover': {
        background:
          theme.extras.variables.colors
            .ddkALighterOneOffBlue, //'#eaebf4',
        color:
          theme.extras.variables.colors
            .ddkAnotherOneOffBlue,
        cursor: 'pointer',
      },
    },
  },
  inputParent: {
    flex: '1 0 100%',
    margin: '0.5rem auto',
    '&:first-of-type': {
      marginTop: '2rem',
    },
    fontSize: '12px',
    color: theme.extras.variables.colors.ddkAnotherGray,
  },
  first: {
    marginTop: '1.6rem',
  },
  close: {
    padding: '1rem',
    position: 'absolute',
    top: 6,
    right: 6,
  },
  h3: {
    flex: `0 0 100%`,
  },
}))

const DesktopUnifiedShareBtn = ({ children, ...props }) => {
  const {
    setStoreValues,
    shareHash,
    eventShareLink,
    eventShareEmbed,
    slideoutPanel,
    showSharePopover,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      shareHash: state.shareHash,
      eventShareLink: state.eventShareLink,
      eventShareEmbed: state.eventShareEmbed,
      slideoutPanel: state.slideoutPanel,
      showSharePopover: state.showSharePopover,
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

  const anchorEl = document.getElementById(
    'control_panel_share_btn',
  )

  const toggleShareTooltip = () => {
    // If the slideout panel is open, close it.
    if (!!slideoutPanel.active) {
      setStoreValues({
        slideoutPanel: { ...slideoutPanel, active: false },
        showSharePopover: true,
      })
    } else {
      setStoreValues({
        showSharePopover: !showSharePopover,
      })
    }
  }

  const classes = useStyles()

  return (
    <div
      className={clsx(
        classes.root,
        showSharePopover ? 'active' : '',
      )}
    >
      <IconButton
        onClick={toggleShareTooltip}
        className={clsx(classes.popperButton)}
        disableRipple={true}
        id={`control_panel_share_btn`}
      >
        <ShareOutlined fontSize={'large'} />
        {children}
      </IconButton>
      <Popper
        id={`simple-popper`}
        open={showSharePopover}
        anchorEl={anchorEl}
        placement={'right-start'}
      >
        <IconButton
          onClick={toggleShareTooltip}
          className={clsx(classes.close)}
          disableRipple={true}
          id={`control_panel_share_btn`}
        >
          <Close />
        </IconButton>
        <div
          className={clsx(
            'control-panel-share-popper',
            classes.popper,
          )}
        >
          <h3 className={clsx(classes.h3)}>Share to:</h3>
          <FacebookShareBtn
            className={classes.shareButton}
            aria-label={i18n.translate(
              `BUTTON_SHARE_FACEBOOK`,
            )}
          ></FacebookShareBtn>
          <TwitterShareBtn
            className={classes.shareButton}
            aria-label={i18n.translate(
              `BUTTON_SHARE_TWITTER`,
            )}
          ></TwitterShareBtn>
          <MailShareBtn
            className={classes.shareButton}
            aria-label={i18n.translate(
              `BUTTON_SHARE_EMAIL`,
            )}
          ></MailShareBtn>
          {/* <LinkShareBtn className={classes.shareButton}>
              <span className="btn-label">
                {i18n.translate(`BUTTON_SHARE_LINK`)}
              </span>
            </LinkShareBtn>
            <EmbedShareBtn className={classes.shareButton}>
              <span className="btn-label">
                {i18n.translate(`BUTTON_SHARE_LINK`)}
              </span>
            </EmbedShareBtn> */}
          <div
            className={clsx(
              classes.inputParent,
              classes.first,
            )}
          >
            <span id="share_link_label">
              {i18n.translate('MODAL_SHARE_LINK_INPUT')}
            </span>
            <FormGroup row className={classes.inputGroup}>
              <Input
                type="text"
                id="link"
                name="link"
                className={classes.input}
                value={shareLinkValue}
                aria-labelledby={``}
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
          <div className={classes.inputParent}>
            <span id="share_link_label">
              {i18n.translate('MODAL_SHARE_EMBED_INPUT')}
            </span>
            <FormGroup row className={classes.inputGroup}>
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
        </div>
      </Popper>
    </div>
  )
}

export default DesktopUnifiedShareBtn
