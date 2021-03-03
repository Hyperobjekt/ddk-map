import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'
import { getStateFromFips } from '@hyperobjekt/us-states'

import useStore from './../store'

const LegendChartHeaders = ({ classes }) => {
  const { activeNorm, centerMetro, centerState } = useStore(
    state => ({
      activeNorm: state.activeNorm,
      centerMetro: state.centerMetro,
      centerState: state.centerState,
    }),
    shallow,
  )

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
        return i18n.translate('GENERIC_THE_US')
      case 's':
        if (centerState > 0) {
          return getStateFromFips(
            String(centerState).padStart(2, '0'),
          )
            ? getStateFromFips(
                String(centerState).padStart(2, '0'),
              ).full
            : i18n.translate('GENERIC_THE_STATE')
        }
      case 'm':
        if (centerMetro > 0) {
          return i18n.translate(centerMetro)
            ? i18n.translate(centerMetro)
            : i18n.translate('GENERIC_THE_METRO')
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
