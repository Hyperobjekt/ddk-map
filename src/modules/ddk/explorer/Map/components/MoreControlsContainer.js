import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import FlyToStateBtn from './FlyToStateBtn'
import FlyToResetBtn from './FlyToResetBtn'
import FlyToMyLocationBtn from './FlyToMyLocationBtn'

const MoreControlsContainer = () => {
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
  }))

  const classes = styles()

  return (
    <div className={clsx('more-controls', classes.root)}>
      <FlyToStateBtn fips="2" placement={'left'}>
        {'AK'}
      </FlyToStateBtn>
      <FlyToStateBtn fips="15" placement={'left'}>
        {'HI'}
      </FlyToStateBtn>
      <FlyToResetBtn placement="left">R</FlyToResetBtn>
      <FlyToMyLocationBtn placement="left">
        L
      </FlyToMyLocationBtn>
    </div>
  )
}

export default MoreControlsContainer
