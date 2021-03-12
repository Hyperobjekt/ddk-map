import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import shallow from 'zustand/shallow'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import { FiShare2 } from 'react-icons/fi'

import useStore from '../store'
import { theme } from './../theme'

const styles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    right: '16px',
    bottom: '16px',
    backgroundColor: theme.extras.variables.colors.ddkRed,
    color: '#fff',
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    '&:hover': {
      backgroundColor: theme.extras.variables.colors.ddkRed,
    },
  },
}))

const MobileShareBtn = () => {
  const { setStoreValues, shareLinkModal } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      shareLinkModal: state.shareLinkModal,
    }),
    shallow,
  )

  const toggleShare = e => {
    e.preventDefault()
    setStoreValues({
      controlHovered: true,
      shareLinkModal: !shareLinkModal,
    })
  }

  const classes = styles()

  return (
    <IconButton
      label={i18n.translate(`CONTROL_PANEL_SHARE`)}
      onClick={toggleShare}
      className={clsx('map-share-mobile', classes.root)}
    >
      <FiShare2 className="social-icon" />
    </IconButton>
  )
}

export default MobileShareBtn
