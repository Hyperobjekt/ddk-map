import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'

import { getRoundedValue, getHashLeft } from './../utils'

const styles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '40px',
    position: 'relative',
  },
  bar: {
    height: '3px',
    width: '100%',
    display: 'block',

    top: 0,
    left: 0,
    // backgroundColor: 'black',
    backgroundImage:
      'linear-gradient(90deg, #C9E8F8 0%, #58798F 101.52%)',
    backgroundSize: '100% 3px',
  },
  hashGroup: {
    position: 'absolute',
    boxSizing: 'border-box',
  },
  hash: {
    width: '0.5px',
    height: '22px',
    backgroundColor: '#58798F',
  },
}))

const LinearScale = ({ ...props }) => {
  // console.log('LinearScale, ', props)

  const classes = styles()

  const high_is_good = !!props.indicator.high_is_good
  const currency = !!props.indicator.currency
  const decimals = Number(props.indicator.decimals)
  const alt_u = props.indicator.alt_u
  const min = props.indicator.min
  const max = props.indicator.max
  const mean = props.indicator.mean
  const percent = false

  const rightLabel = getRoundedValue(
    !!high_is_good ? max : min,
    decimals,
    currency,
    percent,
  )
  const leftLabel = getRoundedValue(
    !!high_is_good ? min : max,
    decimals,
    currency,
    percent,
  )
  const valueLabel = getRoundedValue(
    props.value,
    decimals,
    currency,
    percent,
  )

  const meanLabel = i18n.translate(`SCALE_MEAN`)
  const percentFromLeft = `${getHashLeft(
    props.value,
    min,
    max,
  )}%`
  const meanPercentFromLeft = `${getHashLeft(
    mean,
    min,
    max,
  )}%`

  return (
    <div className={clsx('linear-scale', classes.root)}>
      <div
        className={clsx('linear-scale-bar', classes.bar)}
      ></div>
      <div
        className={clsx(
          'linear-scale-value',
          classes.hashGroup,
        )}
        style={{ left: percentFromLeft }}
      >
        <div
          className={clsx(
            'linear-scale-hash-value',
            classes.hash,
          )}
        ></div>
        <span className={clsx('label')}>{valueLabel}</span>
      </div>
      <div
        className={clsx(
          'linear-scale-mean',
          classes.hashGroup,
        )}
        style={{ left: meanPercentFromLeft }}
      >
        <div
          className={clsx('linear-scale-hash-mean')}
        ></div>
        <span className={clsx('label')}>{meanLabel}</span>
      </div>
      <div className={clsx('linear-scale-label-left')}>
        <span className={clsx('label')}>{leftLabel}</span>
      </div>
      <div className={clsx('linear-scale-label-right')}>
        <span className={clsx('label')}>{rightLabel}</span>
      </div>
    </div>
  )
}

LinearScale.propTypes = {
  indicator: PropTypes.object,
  value: PropTypes.number,
}

export default LinearScale
