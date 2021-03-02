import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import { STATES } from './../../../../constants/map'

const LegendChartHeaders = ({ activeNorm, classes }) => {
  const SDArray = [
    i18n.translate(`SDSCALE_VLOW`),
    i18n.translate(`SDSCALE_LOW`),
    i18n.translate(`SDSCALE_MOD`),
    i18n.translate(`SDSCALE_HIGH`),
    i18n.translate(`SDSCALE_VHIGH`),
  ]

  const getChartSubtitle = geo => {
    switch (geo) {
      case 'n':
        return 'the U.S'
      case 's':
        if (centerState > 0) {
          return STATES[centerState].full
        }
      case 'm':
        if (centerMetro > 0) {
          return remoteJson.metros.data.find(
            el => el.GEOID === centerMetro.toString(),
          ).msaname15
        }
    }
  }

  return (
    <>
      <div className={classes.title}>
        {i18n.translate('LEGEND_CHART_TITLE')}
      </div>
      <div className={classes.subtitle}>
        {i18n.translate('LEGEND_CHART_SUBTITLE', {
          chartSubtitle: getChartSubtitle(activeNorm),
        })}
      </div>
      <div className={classes.panel}>
        {SDArray.map((el, i) => {
          return (
            <span key={el} className={classes.cell}>
              {el.toUpperCase()}
            </span>
          )
        })}
      </div>
    </>
  )
}

LegendChartHeaders.defaultProps = {
  classes: {},
}

export default LegendChartHeaders
