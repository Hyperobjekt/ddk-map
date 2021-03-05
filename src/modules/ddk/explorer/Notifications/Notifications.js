import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'
import { MdClose } from 'react-icons/md'
import { IconButton } from '@material-ui/core'
import { getStateFromFips } from '@hyperobjekt/us-states'

import useStore from '../store'
import { FULL_FUNCT_ZOOM_THRESHOLD } from './../../../../constants/map'

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
    [theme.breakpoints.up('xs')]: {},
    [theme.breakpoints.up('sm')]: {
      maxWidth: '393px',
    },
    [theme.breakpoints.up('md')]: {
      left: `${theme.extras.controlPanel.width + 16}px`,
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
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  text: {},
}))

const Notifications = () => {
  const {
    activeNorm,
    notifications,
    updateNotifications,
    centerMetro,
    centerState,
    setStoreValues,
    viewport,
  } = useStore(
    state => ({
      activeNorm: state.activeNorm,
      notifications: { ...state.notifications },
      updateNotifications: state.updateNotifications,
      centerMetro: state.centerMetro,
      centerState: state.centerState,
      setStoreValues: state.setStoreValues,
      viewport: state.viewport,
    }),
    shallow,
  )

  const classes = useStyles()

  const getNotification = norm => {
    let str = i18n.translate(`WARN_NATL_NORM_LOWZOOM`)
    if (viewport.zoom > FULL_FUNCT_ZOOM_THRESHOLD) {
      // Display messages with location information, if available
      if (norm === 'n') {
        str = i18n.translate(`WARN_NATL_NORM_GENERIC_LOCAL`)
      }
      if (norm === 's') {
        if (centerState !== 0) {
          str = i18n.translate(`WARN_STATE_NORM`, {
            state: getStateFromFips(
              String(centerState).padStart(2, '0'),
            ).full,
          })
        } else {
          str = i18n.translate(
            `WARN_STATE_NORM_GENERIC_LOCAL`,
          )
        }
      }
      if (norm === 'm') {
        if (centerMetro !== 0) {
          str = i18n.translate(`WARN_METRO_NORM`, {
            metro: i18n.translate(centerMetro),
          })
        } else {
          str = i18n.translate(
            `WARN_METRO_NORM_GENERIC_LOCAL`,
          )
        }
      }
    } else {
      // Display generic messages (without location information)
      if (norm === 's') {
        str = i18n.translate(`WARN_STATE_NORM_LOWZOOM`)
      }
      if (norm === 'm') {
        str = i18n.translate(`WARN_METRO_NORM_LOWZOOM`)
      }
    }
    return str
  }

  // const [notification, setNotification] = useState('')

  const notification = useMemo(() => {
    if (notifications[activeNorm] === 0) {
      return getNotification(activeNorm)
    } else {
      return ''
    }
  }, [
    activeNorm,
    centerMetro,
    centerState,
    ...Object.values(notifications),
    viewport.zoom,
  ])

  const handleClose = () => {
    // console.log('handleClose()')
    setStoreValues({
      controlHovered: true,
    })
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
