import React from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'
import {
  FormControlLabel,
  Checkbox,
  withStyles,
} from '@material-ui/core'

import SelectBox from '../App/components/SelectBox'

import {
  OPTIONS_ACTIVE_POINTS,
  OPTIONS_METRIC,
  OPTIONS_NORM,
} from './../../../../constants/map'
import useStore from '../store'

// Styles for this component.
const styles = theme => ({
  row: {
    width: '100%',
    '&:nth-child(n+2)': {
      paddingTop: '7px',
    },
  },
  col3: {
    boxSizing: 'border-box',
    width: '50%',
    display: 'inline-block',
    padding: '0px 2px 0px 0px',
    '&:nth-child(2)': {
      padding: '0px 0px 0px 2px',
    },
  },
  labelText: {
    display: 'block',
    color: '#616161',
    paddingBottom: '3px',
  },
  checkboxContainer: {
    display: 'block',
    justifyContent: 'left',
    paddingLeft: '9px',
  },
  checkboxLabel: {
    verticalAlign: 'middle',
    paddingLeft: '6px',
    fontSize: '14px',
    color: theme.extras.variables.colors.darkGray,
  },
  checkbox: {
    padding: '0px 0px',
    verticalAlign: 'middle',
  },
  checkboxColor_w: {
    color: '#96cc60',
    '&.Mui-checked': {
      color: theme.extras.demos.w,
    },
  },
  checkboxColor_hi: {
    color: '#9d70b5',
    '&.Mui-checked': {
      color: theme.extras.demos.hi,
    },
  },
  checkboxColor_b: {
    color: '#fcdb7c',
    '&.Mui-checked': {
      color: theme.extras.demos.b,
    },
  },
  checkboxColor_ap: {
    color: '#ffb178',
    '&.Mui-checked': {
      color: theme.extras.demos.ap,
    },
  },
  checkboxColor_ai: {
    color: '#ff85e7',
    '&.Mui-checked': {
      color: theme.extras.demos.ai,
    },
  },
  indexSelect: {
    fontWeight: '500',
  },
})

const createOptions = (prefix, options) => {
  return options.map(el => {
    return {
      val: el,
      display: i18n.translate(
        `${prefix}${el.toUpperCase()}`,
      ),
    }
  })
}

const LegendControl = ({ classes }) => {
  const {
    loadYears,
    activeYear,
    activeNorm,
    activePointLayers,
    activeMetric,
    setStoreValues,
  } = useStore(
    state => ({
      loadYears: state.loadYears,
      activeYear: state.activeYear,
      activeNorm: state.activeNorm,
      activePointLayers: state.activePointLayers,
      activeMetric: state.activeMetric,
      setStoreValues: state.setStoreValues,
    }),
    shallow,
  )

  console.log('render legend control')

  /** Handle active metric changes */
  const handleActiveMetric = event => {
    setStoreValues({
      activeMetric: event.target.value,
    })
  }

  /** Handle active norm changes */
  const handleActiveNorm = event => {
    setStoreValues({
      activeNorm: event.target.value,
    })
  }

  /** Handle active year changes */
  const handleActiveYear = event => {
    setStoreValues({
      activeYear: event.target.value,
    })
  }

  /** Handle changes to the point layer checkboxes */
  const handleActivePointLayers = event => {
    const name = event.currentTarget.name
    let layers = activePointLayers.slice()
    const ind = layers.indexOf(name)
    if (ind >= 0) {
      layers.splice(ind, 1)
    } else {
      layers.push(name)
    }
    setStoreValues({
      activePointLayers: layers,
    })
  }

  return (
    <>
      <div className={classes.row}>
        <SelectBox
          options={createOptions(
            'LABEL_',
            OPTIONS_METRIC.options,
          )}
          current={activeMetric}
          handleChange={handleActiveMetric}
          label={i18n.translate('LEGEND_SELECT_INDEX')}
          className="block-click"
        ></SelectBox>
      </div>
      <div className={classes.row}>
        <div className={classes.col3}>
          <SelectBox
            options={createOptions(
              'LEGEND_',
              OPTIONS_NORM.options,
            )}
            current={activeNorm}
            handleChange={handleActiveNorm}
            showHelp={true}
            label={i18n.translate('LEGEND_COMPARE')}
            className={clsx('block-click')}
          ></SelectBox>
        </div>
        <div className={classes.col3}>
          <SelectBox
            options={createOptions('LEGEND_', loadYears)}
            current={activeYear}
            handleChange={handleActiveYear}
            label={i18n.translate('LEGEND_TIME')}
            className={clsx('block-click')}
          ></SelectBox>
        </div>
      </div>
      <div className={classes.row}>
        <span className={classes.labelText}>
          {i18n.translate(`LEGEND_DEMO`)}
        </span>
        <div>
          {OPTIONS_ACTIVE_POINTS.options.map((el, i) => {
            return (
              <FormControlLabel
                className={classes.checkboxContainer}
                classes={{ label: classes.checkboxLabel }}
                control={
                  <Checkbox
                    className={classes.checkbox}
                    classes={{
                      root: classes[`checkboxColor_${el}`],
                    }}
                    checked={
                      activePointLayers.indexOf(el) > -1
                    }
                    onChange={handleActivePointLayers}
                    name={el}
                  />
                }
                label={i18n.translate(
                  `POP_${String(el).toUpperCase()}`,
                )}
                key={el}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default withStyles(styles)(LegendControl)
