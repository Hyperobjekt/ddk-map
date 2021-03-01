import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'
import { MdClose } from 'react-icons/md'
import { IconButton } from '@material-ui/core'

import useStore from './../../store'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: '5px',
    position: 'absolute',
    left: '16px',
    bottom: '42px',
    color: theme.extras.variables.colors.white,
    padding: '18px 36px 18px 18px',
    fontFamily: 'Fira Sans',

    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
    maxWidth: `calc(100vw - 160px)`,
    [theme.breakpoints.up('sm')]: {
      maxWidth: '393px',
    },
  },
  button: {
    position: 'absolute',
    right: 0,
    top: 0,
    '& svg': {
      width: '20px',
      height: '20px',
      color: 'white',
    },
  },
  text: {},
}))

const Notifications = () => {
  const {
    activeNorm,
    notifications,
    updateNotifications,
  } = useStore(
    state => ({
      activeNorm: state.activeNorm,
      notifications: state.notifications,
      updateNotifications: state.updateNotifications,
    }),
    shallow,
  )

  const classes = useStyles()

  const warnStrings = {
    n: `WARN_NATL_COMPARISON`,
    s: `WARN_STATE_COMPARISON`,
    m: `WARN_METRO_COMPARISON`,
  }

  const [showNotifcation, setShowNotification] = useState(
    false,
  )

  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (notifications[activeNorm] === 0) {
      setNotification(
        i18n.translate(warnStrings[activeNorm]),
      )
    } else {
      setNotification('')
    }
  }, [activeNorm, ...Object.values(notifications)])

  const handleClose = () => {
    // console.log('handleClose()')
    updateNotifications(activeNorm)
  }

  if (notification && notification.length > 0) {
    return (
      <div
        className={clsx('map-notifications', classes.root)}
      >
        <IconButton
          className={clsx(
            'map-notifications-btn-close',
            classes.button,
          )}
          onClick={handleClose}
        >
          <MdClose />
        </IconButton>
        <div
          className={clsx(
            'map-notifications-text',
            classes.text,
          )}
        >
          {notification}
        </div>
      </div>
    )
  } else {
    return ''
  }
}

export default Notifications
