import React from 'react'
import { Dialog, Button } from '@material-ui/core'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import useStore from './../store'
import GeocodeSearch from './../GeocodeSearch'
import {
  USIcon,
  CrosshairIcon,
  HelpCircleIcon,
} from './../../../assets/Icons'

const IntroModal = () => {
  const showIntroModal = useStore(
    state => state.showIntroModal,
  )
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )

  const styles = makeStyles(theme => ({
    root: {
      padding: '32px',
      fontFamily: 'Fira Sans',
    },
    heading: {
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '24px',
      letterSpacing: '0.15px',
      marginBlockStart: '0',
      color: theme.extras.variables.colors.darkGray,
    },
    button: {
      fontFamily: 'Fira Sans',
      fontWeight: 500,
      fontSize: '14px',
      width: '288px',
      display: 'inline',
      margin: '0.5rem auto',
      // display: 'flex',
      textAlign: 'center',
      // justifyContent: 'center',
      // alignItems: 'center',
      borderRadius: '5px',
      border: `1px solid ${theme.extras.variables.colors.ddkRed}`,
      color: theme.extras.variables.colors.ddkRed,
      '& svg': {
        width: '24px',
        height: '24px',
        left: '22px',
        position: 'absolute',
      },
      '&.to-my svg path, &.to-faq svg path': {
        stroke: theme.extras.variables.colors.ddkRed,
      },
      '&.to-nat svg path': {
        fill: theme.extras.variables.colors.ddkRed,
      },
    },
  }))

  const classes = styles()

  const handleClose = () => {
    // console.log('handleClose')
    setStoreValues({
      showIntroModal: false,
    })
  }

  return (
    <Dialog open={showIntroModal} onClose={handleClose}>
      <div className={clsx('modal-intro', classes.root)}>
        <h2 className={clsx(classes.heading)}>
          {i18n.translate(`MODAL_INTRO_HEADING`)}
        </h2>
        <p>{i18n.translate(`MODAL_INTRO_DESC`)}</p>
        <p>{i18n.translate(`MODAL_INTRO_PROMPT`)}</p>
        <GeocodeSearch />
        <Button
          aria-label={i18n.translate(`MODAL_INTRO_GO_TO`)}
          className={clsx(
            'modal-intro-btn',
            'to-my',
            classes.button,
          )}
        >
          <CrosshairIcon />
          <span>{i18n.translate(`MODAL_INTRO_GO_TO`)}</span>
        </Button>
        <Button
          aria-label={i18n.translate(`MODAL_INTRO_NAT`)}
          className={clsx(
            'modal-intro-btn',
            'to-nat',
            classes.button,
          )}
        >
          <USIcon />
          <span>{i18n.translate(`MODAL_INTRO_NAT`)}</span>
        </Button>
        <Button
          aria-label={i18n.translate(`MODAL_INTRO_FAQ`)}
          className={clsx(
            'modal-intro-btn',
            'to-faq',
            classes.button,
          )}
        >
          <HelpCircleIcon />
          <span>{i18n.translate(`MODAL_INTRO_FAQ`)}</span>
        </Button>
      </div>
    </Dialog>
  )
}

export default IntroModal
