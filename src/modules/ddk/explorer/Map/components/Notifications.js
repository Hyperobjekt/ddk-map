import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'

const Notifications = () => {

  const styles = makeStyles(theme => ({
    root: {
    }
  }))

  const classes = styles()

  return (
    <div className={clsx('map-notifications', classes.root)}
  )
}

export default Notifications

