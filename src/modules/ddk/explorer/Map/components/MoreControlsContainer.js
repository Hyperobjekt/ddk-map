import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import FlyToStateBtn from './FlyToStateBtn'
import FlyToResetBtn from './FlyToResetBtn'
import FlyToMyLocationBtn from './FlyToMyLocationBtn'
import ScreenshotBtn from './ScreenshotBtn'
import {
  CrosshairIcon,
  AlaskaIcon,
  HawaiiIcon,
  USIcon,
  CameraIcon,
} from './../../../../assets/Icons'

const styles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    bottom: '120px',
    right: '16px',
    display: 'flex',
    width: '40px',
    height: 'auto',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    '& button': {
      width: '40px',
      height: '40px',
      backgroundColor: '#fff',
      padding: 0,
      minWidth: 0,
      borderRadius: 0,
    },
  },
  button: {
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: `${theme.extras.variables.colors.ddkLightRedHex} !important`,
    },
    '& svg': {
      width: '32px',
      heigth: '32px',
    },
    marginTop: '0.15rem',
  },
}))

const MoreControlsContainer = props => {
  const classes = styles()

  return (
    <div className={clsx('more-controls', classes.root)}>
      <ScreenshotBtn
        className={clsx(classes.button)}
        mapRef={props.mapRef}
      >
        <CameraIcon />
      </ScreenshotBtn>
      <FlyToStateBtn
        fips="2"
        placement={'left'}
        className={clsx(classes.button)}
      >
        <AlaskaIcon />
      </FlyToStateBtn>
      <FlyToStateBtn
        fips="15"
        placement={'left'}
        className={clsx(classes.button)}
      >
        <HawaiiIcon />
      </FlyToStateBtn>
      <FlyToResetBtn
        placement="left"
        className={clsx(classes.button)}
      >
        <USIcon />
      </FlyToResetBtn>
      <FlyToMyLocationBtn
        placement="left"
        className={clsx(classes.button)}
      >
        <CrosshairIcon />
      </FlyToMyLocationBtn>
    </div>
  )
}

export default MoreControlsContainer
