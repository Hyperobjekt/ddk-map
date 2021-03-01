import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { Tooltip, Button } from '@material-ui/core'
import shallow from 'zustand/shallow'

import useStore from './../../store'

const ScreenshotBtn = ({ children, ...props }) => {
  const { setStoreValues, eventMapCapture } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      eventMapCapture: state.eventMapCapture,
    }),
    shallow,
  )

  const handleClick = () => {
    console.log('handleClick', props.mapRef)
    // console.log('captureMap')
    const dataURL = props.mapRef
      .getCanvas()
      .toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.setAttribute('download', 'ddk-explorer-capture.png')
    a.click()
    a.remove()
    setStoreValues({
      eventMapCapture: eventMapCapture + 1,
    })
  }

  return (
    <Tooltip title={i18n.translate(`MAP_SCREENSHOT`)} arrow>
      <Button
        aria-label={i18n.translate(`MAP_SCREENSHOT`)}
        onClick={handleClick}
        placement={props.placement}
        className={props.className}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

ScreenshotBtn.propTypes = {}

export default ScreenshotBtn
