import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import i18n from '@pureartisan/simple-i18n'
import { Tooltip, Button } from '@material-ui/core'
import shallow from 'zustand/shallow'

import useStore from './../../store'

const styles = makeStyles(theme => ({
  btn: {
    '& svg': {
      width: '20px',
      height: '20px',
    },
  },
}))

const ScreenshotBtn = ({ children, ...props }) => {
  const { setStoreValues, eventMapCapture } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      eventMapCapture: state.eventMapCapture,
    }),
    shallow,
  )

  const handleClick = () => {
    // console.log('handleClick', props.mapRef)
    // console.log('captureMap')
    setStoreValues({
      controlHovered: true,
      eventMapCapture: eventMapCapture + 1,
    })
    const dataURL = props.mapRef
      .getCanvas()
      .toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.setAttribute('download', 'ddk-explorer-capture.png')
    a.click()
    a.remove()
  }
  const classes = styles()

  return (
    <Tooltip title={i18n.translate(`MAP_SCREENSHOT`)} arrow>
      <Button
        aria-label={i18n.translate(`MAP_SCREENSHOT`)}
        onClick={handleClick}
        placement={props.placement}
        className={clsx(props.className, classes.btn)}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

ScreenshotBtn.propTypes = {}

export default ScreenshotBtn
