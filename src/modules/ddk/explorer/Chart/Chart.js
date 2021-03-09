import React, { useEffect, useMemo } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Customized,
  Tooltip,
} from 'recharts'
import shallow from 'zustand/shallow'

import { OPTIONS_ACTIVE_POINTS } from './../../../../constants/map'
import useStore from './../store'

const useStyles = makeStyles(theme => ({
  legendIndicator: {
    verticalAlign: 'middle',
    display: 'inline-block',
    width: '15px',
    height: '7px',
    marginRight: '3px',
    borderRadius: '2px',
    '&.ai': {
      backgroundColor: theme.extras.demos.ai,
    },
    '&.ap': {
      backgroundColor: theme.extras.demos.ap,
    },
    '&.b': {
      backgroundColor: theme.extras.demos.b,
    },
    '&.hi': {
      backgroundColor: theme.extras.demos.hi,
    },
    '&.w': {
      backgroundColor: theme.extras.demos.w,
    },
  },
  legend: {
    width: '307px',
    height: '11px',
    margin: '-20px 10px 6px 58px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '2px',
    fontSize: '9px',
    padding: '4px',
    boxShadow: theme.shadows[1],
    color: '#616161',
  },
  background: {
    '&.vl': { fill: theme.extras.SDScale.onColors[0] },
    '&.l': { fill: theme.extras.SDScale.onColors[1] },
    '&.m': { fill: theme.extras.SDScale.onColors[2] },
    '&.h': { fill: theme.extras.SDScale.onColors[3] },
    '&.vh': { fill: theme.extras.SDScale.onColors[4] },
  },
  ai: {
    fill: theme.extras.demos.ai,
  },
  ap: {
    fill: theme.extras.demos.ap,
  },
  b: {
    fill: theme.extras.demos.b,
  },
  hi: {
    fill: theme.extras.demos.hi,
  },
  w: {
    fill: theme.extras.demos.w,
  },
}))

const Chart = ({ ...props }) => {
  const {
    activeYear,
    activeNorm,
    centerMetro,
    centerState,
  } = useStore(
    state => ({
      activeYear: state.activeYear,
      activeNorm: state.activeNorm,
      centerMetro: state.centerMetro,
      centerState: state.centerState,
    }),
    shallow,
  )

  const addPercent = el => {
    return `${el}%`
  }

  const renderLegend = props => {
    const { payload } = props

    return (
      <div className={classes.legend}>
        {payload.length > 0 &&
          payload.map((entry, index) => (
            <div
              key={`item-${index}`}
              style={{
                display: 'inline-block',
                padding: '0px 5px',
              }}
            >
              <div
                className={clsx(
                  classes.legendIndicator,
                  `${entry.value}`,
                )}
              ></div>
              <span>
                {i18n.translate(
                  `POP_${entry.value.toUpperCase()}`,
                )}
              </span>
            </div>
          ))}
        {payload.length === 0 && (
          <span>
            {i18n.translate(`LEGEND_DEMO`).replace(':', '')}
          </span>
        )}
      </div>
    )
  }

  const Background = () => {
    const bgWidth = 311
    const bgHeight = 265.5
    const xOffset = 36
    const yOffset = 5
    const indexes = ['vl', 'l', 'm', 'h', 'vh']

    return (
      <>
        <rect
          style={{ fill: '#fff' }}
          x={xOffset - 2}
          y={yOffset - 2}
          height={bgHeight + 4}
          width={bgWidth + 4}
        ></rect>
        {indexes.map((val, i) => {
          return (
            <rect
              key={i}
              className={clsx(classes.background, val)}
              x={(i * bgWidth) / indexes.length + xOffset}
              y={yOffset}
              height={bgHeight}
              width={
                bgWidth - (i * bgWidth) / indexes.length
              }
            ></rect>
          )
        })}
      </>
    )
  }

  /**
   * Finds the highest value from the arrays of data for
   * active demographics.
   */
  const getMaxValue = useMemo(() => {
    let maxValue = 0
    props.activeBars.forEach(el => {
      props.data.forEach(row => {
        // console.log(`row val for ${row}`, row[el], maxValue)
        if (row[el] > maxValue) {
          maxValue = row[el]
        }
      })
    })
    // console.log(
    //   'maxValue after looops, ',
    //   maxValue,
    //   Math.ceil((maxValue + 1) / 10) * 10,
    // )
    return Math.ceil((maxValue + 1) / 10) * 10
  }, [
    props.activeBars,
    activeYear,
    activeNorm,
    centerMetro,
    centerState,
  ])

  const classes = useStyles()

  // console.log('data is, ', props.data, props.activeBars)

  const getBars = useMemo(() => {
    const pointSet = OPTIONS_ACTIVE_POINTS.options.slice()
    const barSet = pointSet.reverse().filter(el => {
      return props.activeBars.indexOf(el) > -1
    })
    return barSet
  }, [props.activeBars])

  return (
    <div
      className="responsive-container-parent"
      style={{ height: '310px', width: '100%' }}
    >
      <ResponsiveContainer>
        <BarChart
          data={props.data}
          // data={processData(props.data, props.geo, props.year)}
          margin={{
            top: 5,
            right: 5,
            bottom: 5,
            left: -24,
          }}
          barCategoryGap="5%"
          barGap="1"
        >
          <CartesianGrid
            horizontal={false}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            minTickGap={0}
            axisLine={false}
            tickLine={false}
            domain={[0, getMaxValue]}
            tickCount={getMaxValue / 10 + 1}
            tickFormatter={addPercent}
          />
          <Legend content={renderLegend} />

          <Customized key={'bg'} component={Background} />
          {!!getBars
            ? getBars.map((el, i) => {
                return (
                  <Bar
                    key={i}
                    radius={[2, 2, 0, 0]}
                    dataKey={el}
                    className={classes[el]}
                  />
                )
              })
            : ''}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

Chart.propTypes = {
  data: PropTypes.array,
  activeBars: PropTypes.array,
}

Chart.defaultProps = {}

export default Chart
