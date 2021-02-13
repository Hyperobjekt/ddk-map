import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'

const LinearScale = ({ ...props }) => {
  console.log('LinearScale, ', props)
  // const rightLabel =
  // const leftLabel =
  // const meanLabel =
  // const percentFromLeft =
  // const meanPercentFromLeft =

  return (
    <p>
      linear scale for{' '}
      {`${props.indicator.id} value is ${props.value}`}
    </p>
  )
}

LinearScale.propTypes = {
  indicator: PropTypes.object,
  value: PropTypes.number,
}

export default LinearScale
