import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Button } from '@material-ui/core'
import shallow from 'zustand/shallow'

import useStore from './../../store'

const FlyToResetBtn = ({ children, ...props }) => {
  const { flyToReset, setStoreValues } = useStore(
    state => ({
      flyToReset: state.flyToReset,
      setStoreValues: state.setStoreValues,
    }),
    shallow,
  )

  const handleClick = () => {
    setStoreValues({
      controlHovered: true,
    })
    flyToReset()
  }

  return (
    <Tooltip title={i18n.translate(`MAP_RESET`)} arrow>
      <Button
        aria-label={i18n.translate(`MAP_RESET`)}
        onClick={handleClick}
        placement={props.placement}
        className={props.className}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

FlyToResetBtn.propTypes = {
  placement: PropTypes.string,
}

export default FlyToResetBtn
