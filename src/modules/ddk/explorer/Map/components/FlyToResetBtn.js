import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Button } from '@material-ui/core'
import shallow from 'zustand/shallow'

import useStore from './../../store'

const styles = makeStyles(theme => ({
  btn: {
    '& svg': {
      marginTop: '3px',
      width: '24px',
      height: '24px',
    },
  },
}))

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

  const classes = styles()

  return (
    <Tooltip title={i18n.translate(`MAP_RESET`)} arrow>
      <Button
        aria-label={i18n.translate(`MAP_RESET`)}
        onClick={handleClick}
        placement={props.placement}
        className={clsx(
          'btn-reset',
          props.className,
          classes.btn,
        )}
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
