import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import {
  TwitterShareBtn,
  FacebookShareBtn,
  MailShareBtn,
  LinkShareBtn,
  EmbedShareBtn,
} from '.'

// Styles for this component.
const useStyles = makeStyles(theme => ({
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
    borderRadius: '24px',
    flex: '0 0 15%',
    margin: '1.2rem 1.65rem',
    '& button': {
      backgroundColor: 'rgba(59, 89, 152, 0.1)',
      color: theme.extras.variables.colors.ddkAnotherNavy,
    },
    '& button:hover': {
      background:
        theme.extras.variables.colors.ddkALighterOneOffBlue, //'#eaebf4',
      color:
        theme.extras.variables.colors.ddkAnotherOneOffBlue,
      cursor: 'pointer',
    },
    '& span.btn-label': {
      fontSize: '12px',
      lineHeight: '16px',
      width: '100%',
      color: theme.extras.variables.colors.lightGray,
      textAlign: 'center',
      display: 'block',
      marginTop: '0.25rem',
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
    margin: '1rem 0 0 ',
  },
}))

const ShareContents = ({ children, ...props }) => {
  const classes = useStyles()

  return (
    <div
      className={clsx(
        'control-panel-share-contents',
        classes.popper,
      )}
    >
      <h3 className={clsx(classes.h3)}>Share to:</h3>
      <FacebookShareBtn
        className={classes.shareButton}
        aria-label={i18n.translate(`BUTTON_SHARE_FACEBOOK`)}
      >
        <span className="btn-label">
          {i18n.translate(`BUTTON_SHARE_FACEBOOK`)}
        </span>
      </FacebookShareBtn>
      <TwitterShareBtn
        className={classes.shareButton}
        aria-label={i18n.translate(`BUTTON_SHARE_TWITTER`)}
      >
        <span className="btn-label">
          {i18n.translate(`BUTTON_SHARE_TWITTER`)}
        </span>
      </TwitterShareBtn>
      <MailShareBtn
        className={classes.shareButton}
        aria-label={i18n.translate(`BUTTON_SHARE_EMAIL`)}
      >
        <span className="btn-label">
          {i18n.translate(`BUTTON_SHARE_EMAIL`)}
        </span>
      </MailShareBtn>
      <LinkShareBtn className={classes.shareButton}>
        <span className="btn-label">
          {i18n.translate(`BUTTON_SHARE_LINK`)}
        </span>
      </LinkShareBtn>
      <EmbedShareBtn className={classes.shareButton}>
        <span className="btn-label">
          {i18n.translate(`BUTTON_SHARE_EMBED`)}
        </span>
      </EmbedShareBtn>
    </div>
  )
}

export default ShareContents
