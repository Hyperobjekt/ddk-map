import React, { useEffect, useState } from 'react'
import { Dialog, Button } from '@material-ui/core'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import shallow from 'zustand/shallow'

import useStore from './../store'
import GeocodeSearch from './../GeocodeSearch'
import {
  USIcon,
  CrosshairIcon,
  HelpCircleIcon,
} from './../../../assets/Icons'

const styles = makeStyles(theme => ({
  root: {
    padding: '32px',
    fontFamily: 'Fira Sans',
    '& .MUIPaper-root, & .MuiDialog-paper': {
      overflowY: 'visible !important',
    },
  },
  heading: {
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    marginBlockStart: '0',
    color: theme.extras.variables.colors.darkGray,
  },
  desc: {
    color: theme.extras.variables.colors.lightGray,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.5px',
  },
  prompt: {
    display: 'block',
    width: `${theme.extras.introModal.buttonWidth}px`,
    margin: `0 auto 12px auto`,
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '24px',
  },
  center: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  search: {
    marginLeft: 'auto !important',
    marginRight: 'auto !important',
    width: `${theme.extras.introModal.buttonWidth}px !important`,
    // [theme.breakpoints.up('sm')]: {
    //   marginLeft: 'auto',
    //   marginRight: 'auto',
    //   width: `${theme.extras.introModal.buttonWidth}px !important`,
    // },
  },
  button: {
    zIndex: 500,
    fontFamily: 'Fira Sans',
    fontWeight: 500,
    fontSize: '14px',
    width: `${theme.extras.introModal.buttonWidth}px`,
    display: 'block',
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

const IntroModal = () => {
  const {
    showIntroModal,
    flyToLatLon,
    setStoreValues,
    incrementUpdateNorming,
  } = useStore(
    state => ({
      showIntroModal: state.showIntroModal,
      flyToLatLon: state.flyToLatLon,
      setStoreValues: state.setStoreValues,
      incrementUpdateNorming: state.incrementUpdateNorming,
    }),
    shallow,
  )

  const hideModal = () => {
    setStoreValues({
      showIntroModal: false,
    })
  }

  const [position, setPosition] = useState(null)

  const flyToMyLocation = () => {
    // console.log('flyToMyLocation')
    hideModal()
    flyToLatLon(
      position.coords.latitude,
      position.coords.longitude,
      12,
    )
    setStoreValues({ doUpdateNorming: true })
  }

  useEffect(() => {
    // Store the user's location when the app loads, to save time.
    if (
      'geolocation' in navigator &&
      navigator.permissions &&
      navigator.permissions.query({ name: 'geolocation' })
    ) {
      // console.log('loaded. setting position.')
      navigator.geolocation.getCurrentPosition(
        position => {
          setPosition(position)
        },
        error => {
          setPosition(false)
        },
      )
    }
  }, [])

  const handleShowFaq = () => {
    // TODO: After faq is wired up.
    console.log('handleShowFaq()')
    hideModal()
  }

  const handleClose = () => {
    // console.log('handleClose')
    hideModal()
  }

  const classes = styles()

  return (
    <Dialog
      open={showIntroModal}
      onClose={handleClose}
      className={clsx('modal-intro-parent', classes.root)}
    >
      <div className={clsx('modal-intro', classes.root)}>
        <h2 className={clsx(classes.heading)}>
          {i18n.translate(`MODAL_INTRO_HEADING`)}
        </h2>
        <p className={clsx(classes.desc)}>
          {i18n.translate(`MODAL_INTRO_DESC`)}
        </p>
        <p className={clsx(classes.prompt, classes.center)}>
          {i18n.translate(`MODAL_INTRO_PROMPT`)}
        </p>
        <GeocodeSearch
          classes={classes.search}
          prompt={i18n.translate(`MODAL_INTRO_SEARCH`)}
        />
        {!!position && (
          <Button
            aria-label={i18n.translate(`MODAL_INTRO_GO_TO`)}
            className={clsx(
              'modal-intro-btn',
              'to-my',
              classes.button,
              classes.center,
            )}
            onClick={flyToMyLocation}
          >
            <CrosshairIcon />
            <span>
              {i18n.translate(`MODAL_INTRO_GO_TO`)}
            </span>
          </Button>
        )}

        <Button
          aria-label={i18n.translate(`MODAL_INTRO_NAT`)}
          className={clsx(
            'modal-intro-btn',
            'to-nat',
            classes.button,
            classes.center,
          )}
          onClick={handleClose}
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
            classes.center,
          )}
          onClick={handleShowFaq}
        >
          <HelpCircleIcon />
          <span>{i18n.translate(`MODAL_INTRO_FAQ`)}</span>
        </Button>
      </div>
    </Dialog>
  )
}

export default IntroModal
