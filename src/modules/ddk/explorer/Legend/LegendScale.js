import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import SDScale from '../SDScale'

const LegendScale = ({
  classes,
  activeMetric,
  activeNorm,
}) => {
  return (
    <div className={classes.root}>
      <span className={classes.label}>
        {i18n.translate(`${activeMetric}${activeNorm}`)}
      </span>
      <SDScale
        active={[1, 1, 1, 1, 1]}
        type={'legend'}
      ></SDScale>
    </div>
  )
}

LegendScale.defaultProps = {
  classes: {},
}

export default LegendScale
