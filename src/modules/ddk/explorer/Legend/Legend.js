import React, { useEffect } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Backdrop,
  Fade,
  IconButton,
  Modal,
  Paper
} from '@material-ui/core'
import {
  AiOutlineColumnHeight,
  AiOutlineControl,
} from 'react-icons/ai'

import Chart from './Chart'
import arrow from './arrow.svg'
import SelectButton from '../App/components/SelectButton'
import useStore from './../store'
import SDScale from '../SDScale'
import SlideoutPanel from '../SlideoutPanel'
import {
  OPTIONS_ACTIVE_POINTS,
  OPTIONS_METRIC,
  OPTIONS_NORM,
} from './../../../../constants/map'

const Legend = ({ ...props }) => {
  // Styles for this component.
  const styles = makeStyles(theme => ({
    root: {
      zIndex: theme.extras.Legend.zIndex,
      backgroundColor: theme.palette.background.paper,
      position: 'absolute',
      right: theme.extras.Legend.cushionRight,
      transition: 'width 300ms ease-in-out',
      width: legendPanel.active ? '668px' : '284px', //620px
      // Adjust for different app bar height.
      top: theme.extras.Legend.cushionTop,
      boxShadow: theme.shadows[3],
      justifyContent: 'center',
      alignItems: 'flex-start',
      fontFamily: 'Fira Sans',
      fontSize: '12px',
      cursor: 'default',
      borderRadius: 5,
      overflow: 'hidden'
      //clip: 'rect(0px 284px 391px 0px)'    // pointerEvents: 'none',
    },
    formControl: {
      width: '100%',
    },
    row: {
      width: '100%',
      '&:nth-child(n+2)': {
        paddingTop: '7px',
      },
    },
    col1: {
      width: '100%',
      display: 'block',
    },
    col2: {
      boxSizing: 'border-box',
      width: '50%',
      display: 'inline-block',
      padding: '0px 2px 0px 0px',
      '&:nth-child(2)': {
        padding: '0px 0px 0px 2px',
      },
    },
    checkboxContainer: {
      display: 'block',
      justifyContent: 'left',
      paddingLeft: '9px'
    },
    checkboxLabel: {
      verticalAlign: 'middle',
      paddingLeft: '6px',
      fontSize: '14px'
    },
    checkbox: {
      padding: '0px 0px',
      verticalAlign: 'middle',
    },
    labelText: {
      display: 'block',
      color: '#616161',
      paddingBottom: '3px'
    },
    showChart: {
      color: '#C9422C',
      fontSize: '14px',
      verticalAlign: 'middle',
      letterSpacing: '1.25px',
      fontWeight: 500,
      paddingLeft: '3px'
    },
    img: {
      transition: 'transform 300ms ease-in-out',
      transform: legendPanel.active ? 'rotate(180deg)' : 'rotate(0deg)',
      width: '27px',
      verticalAlign: 'middle',
    },
    checkboxColor_w: {
      color: '#96cc60',
      '&.Mui-checked': {
        color: '#66CC00',
      },
    },
    checkboxColor_hi: {
      color: '#9d70b5',
      '&.Mui-checked': {
        color: '#7401B1',
      },
    },
    checkboxColor_b: {
      color: '#fcdb7c',
      '&.Mui-checked': {
        color: '#FFC31A',
      },
    },
    checkboxColor_ap: {
      color: '#ffb178',
      '&.Mui-checked': {
        color: '#FF730C',
      },
    },
    checkboxColor_ai: {
      color: '#ff85e7',
      '&.Mui-checked': {
        color: '#FF00CC',
      },
    },
    indexSelect: {
      fontWeight: '500',
    },
    controller: {
      borderRadius: 5,
      padding: theme.spacing(2),
      background: theme.palette.background.paper,
      width: '252px',
      height: '100%',
      float: 'right',
    },
    panel: {
      top: '0px',
      right: '284px',
      height: '352px',
      width: '352px',
      padding: '16px 16px',
      zIndex: '-1',
      background: '#EEE',
      position: 'absolute'
    },
    chart: {
      width: '100%',
      height: '270px',
    },
    graphContainer: {
      backgroundColor: '#000',
      height: '100px',
      width: '100px'
    },
    showButton: {
      width: '27px',
      height: '27px',
      padding: '0px',
      marginLeft: '-2px'
    },
    panelName: {
      fontSize: '14px',
      padding: '0px 0px 10px 20px',
      letterSpacing: '.1px'
    },
    panelLabel: {
      padding: '0px 0px 10px 20px'
    },
    panelSds: {
      width: 'calc(100% - 29px)',
      margin: '0px 0px auto 31px',
      textAlign: 'center',
      fontSize: '12px',
      padding: '4px',
      display: 'flex',
    },
    sdsCell: {

    }
  }))

  const {
    loadYears,
    activeYear,
    activeNorm,
    activePointLayers,
    activeMetric,
    legendPanel,
    centerMetro,
    remoteJson,
    setStoreValues,
  } = useStore(state => ({
    loadYears: state.loadYears,
    activeYear: state.activeYear,
    activeNorm: state.activeNorm,
    activePointLayers: state.activePointLayers,
    activeMetric: state.activeMetric,
    legendPanel: state.legendPanel,
    centerMetro: state.centerMetro,
    remoteJson: state.remoteJson,
    setStoreValues: state.setStoreValues,
  }))

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

  const handleEvent = (val, e) => {
    var data = {}
    if (val === 'showChart') {
      const data = {active: !legendPanel.active}
      setStoreValues({legendPanel: data})
    }
    if (val === 'activePointLayers') {
      // console.log('e, ', e, e.currentTarget.name, e.target)
      const name = e.currentTarget.name
      let layers = activePointLayers.slice()
      const ind = layers.indexOf(name)
      if (ind >= 0) {
        layers.splice(ind, 1)
      } else {
        layers.push(name)
      }
      // console.log('layers, ', layers)
      data[val] = layers
      setStoreValues(data)
    } else {
      // console.log('hit')
      data[val] = e.target.value
      setStoreValues(data)
    }
  }

  const SDArray = [
    i18n.translate(`SDSCALE_VLOW`),
    i18n.translate(`SDSCALE_LOW`),
    i18n.translate(`SDSCALE_MOD`),
    i18n.translate(`SDSCALE_HIGH`),
    i18n.translate(`SDSCALE_VHIGH`),
  ]

  const classes = styles()

  return (
    <div>
    <Box className={clsx('map-legend', classes.root)}>
      <div className={classes.controller}>
        <div className={classes.row}>
          <IconButton className={classes.showButton} onClick={(e) => {handleEvent('showChart', e)}}><img className={classes.img} src={arrow}></img></IconButton>
          <span className={classes.showChart}>{i18n.translate(legendPanel.active ? `LEGEND_CHART_TOGGLE_OFF` : `LEGEND_CHART_TOGGLE_ON`)}</span>
        </div>
        <div className={classes.row}>
          <span className={classes.labelText}>
            {i18n.translate(`${activeMetric}${activeNorm}`)}
          </span>
          <SDScale
            active={[1, 1, 1, 1, 1]}
            type={'legend'}
          ></SDScale>
        </div>
        <div className={classes.row}>
          <SelectButton
            options={createOptions(
              'LEGEND_',
              OPTIONS_METRIC.options,
            )}
            current={activeMetric}
            handleChange={e =>
              handleEvent('activeMetric', e)
            }
            label={i18n.translate('LEGEND_SELECT_INDEX')}
          ></SelectButton>
        </div>
        <div className={classes.row}>
          <div className={classes.col2}>
            <SelectButton
              options={createOptions(
                'LEGEND_',
                OPTIONS_NORM.options,
              )}
              current={activeNorm}
              handleChange={e =>
                handleEvent('activeNorm', e)
              }
              showHelp={true}
              label={i18n.translate('LEGEND_COMPARE')}
            ></SelectButton>
          </div>
          <div className={classes.col2}>
            <SelectButton
              options={createOptions('LEGEND_', loadYears)}
              current={activeYear}
              handleChange={e =>
                handleEvent('activeYear', e)
              }
              label={i18n.translate('LEGEND_TIME')}
            ></SelectButton>
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
                      onChange={e =>
                        handleEvent('activePointLayers', e)
                      }
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
      </div>
      <div className={classes.panel}>
        {remoteJson.barcharts && centerMetro > 0 &&
          <div className={classes.chart}>
            <div className={classes.panelName}>
              Percentage of Children at Each Opportunity Level
            </div>
          <div className={clsx(classes.labelText, classes.panelLabel)}>
            By race/ethnicity for {remoteJson.metros.data.find(el => el.GEOID === centerMetro.toString()).msaname15}
          </div>
          <div className={classes.panelSds}>
          {SDArray.map((el, i) => {
            return (
              <span style={{width: '62.2px'}}>{el.toUpperCase()}</span>
            )
          })}
          </div>
            <Chart
              data={remoteJson}
              year={activeYear}
              geo={{type: 'metros', id: centerMetro}}
            />
          </div>
        } 
    </div>
    </Box>
    </div>
  )
}

Legend.propTypes = {}

Legend.defaultProps = {}

export default Legend
