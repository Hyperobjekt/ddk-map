import React, { useEffect } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import shallow from 'zustand/shallow'
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
  Paper,
  Button
} from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {
  AiOutlineColumnHeight,
  AiOutlineControl,
} from 'react-icons/ai'

import Chart from '../Chart'
import Arrow from '../Icons'
import SelectBox from '../App/components/SelectBox'
import useStore from './../store'
import SDScale from '../SDScale'
import SlideoutPanel from '../SlideoutPanel'
import {
  OPTIONS_ACTIVE_POINTS,
  OPTIONS_METRIC,
  OPTIONS_NORM,
  STATES,
} from './../../../../constants/map'
import { ShowChart } from '@material-ui/icons'

const Legend = ({ ...props }) => {
  // Styles for this component.
  const styles = makeStyles(theme => ({
    root: {
      zIndex: theme.extras.Legend.zIndex,
      backgroundColor: theme.palette.background.paper,
      position: 'fixed',
      transition: 'width 300ms ease-in-out',
      width: '100vw', //620px
      // Adjust for different app bar height.
      top: '55px',
      right: '0px',
      justifyContent: 'center',
      alignItems: 'flex-start',
      fontFamily: 'Fira Sans',
      fontSize: '12px',
      cursor: 'default',
      overflow: 'hidden',
      [theme.breakpoints.up('sm')]: {
        boxShadow: theme.shadows[3],
        width: legendPanel.active ? '668px' : '284px',
        position: 'absolute',
        right: theme.extras.Legend.cushionRight,
        top: theme.extras.Legend.cushionTop,
        borderRadius: 5,
      }
    },
    controlGuts: {
      paddingTop: '7px',
      transition: 'height 300ms ease-in-out',
      height: legendControl.active ? '243px' : '0px',
      [theme.breakpoints.up('sm')]: {
        height: '243px'
      },
      overflow: 'hidden',
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
      fontWeight: '500',
      paddingLeft: '3px',
      '&.disabled': {
        color: '#616161',
      }
    },
    showControl: {
      textAlign: 'center',
      borderTop: '1px solid #EEE',
    },
    controlIcon: {
      transition: 'transform 300ms ease-in-out',
      transform: legendControl.active ? 'rotate(0deg)' : 'rotate(180deg)',
    },
    controlButton: {
      textAlign: 'center'
    },
    controlBtnLabel: {
      color: '#C9422C',
      fontSize: '14px',
      letterSpacing: '1.25px',
      verticalAlign: 'middle',
    },
    checkboxContainer: {
      display: 'block',
      justifyContent: 'left',
      paddingLeft: '9px'
    },
    checkboxLabel: {
      verticalAlign: 'middle',
      paddingLeft: '6px',
      fontSize: '14px',
      color: theme.extras.variables.colors.darkGray
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
    controller: {
      boxSizing: 'border-box',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      background: theme.palette.background.paper,
      width: '100vw',
      height: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '284px',
        float: 'right',
        padding: theme.spacing(2),
        borderRadius: 5,
      }
    },
    panel: {
      top: '0px',
      right: '284px',
      height: '352px',
      width: '352px',
      padding: '16px 16px',
      zIndex: '-1',
      background: theme.extras.variables.colors.lightLightGray,
      position: 'absolute'
    },
    panelChart: {
      width: '100%',
      height: '270px',
    },
    panelName: {
      fontSize: '14px',
      padding: '6px 0px 10px 34px',
      letterSpacing: '.1px',
      color: theme.extras.variables.colors.darkGray
    },
    panelLabel: {
      padding: '0px 0px 0px 34px',
      height: '39px'
    },
    panelSds: {
      color: '#616161',
      width: '311px',
      margin: '0px 0px 0px 36px',
      textAlign: 'center',
      fontSize: '12px',
      paddingBottom: '4px',
      display: 'flex',
    },
    sdsCell: {
      width: '20%'
    },
    showButton: {
      width: '27px',
      height: '27px',
      padding: '0px',
      marginLeft: '-2px',
      transition: 'transform 300ms ease-in-out',
      transform: legendPanel.active ? 'rotate(180deg)' : 'rotate(0deg)',
      cursor: 'pointer',
    },
    showButtonDisabled: {
      stroke: theme.extras.variables.colors.lightGray
    },
    showButtonGlow: {
      position: 'absolute',
      borderRadius: '50%',
      width: '100%',
      height: '100%',
      transition: 'opacity 300ms ease-in-out',
      backgroundColor: '#fff',
      boxShadow: `0 0 4px 2px #fff, 0 0 20px 12px ${theme.extras.SDScale.onColors[1]}, 0 0 28px 18px ${theme.extras.SDScale.onColors[2]}`,
      opacity: legendPanel.glow ? 1 : 0,
      zIndex: -1,
    }
  }))

  const {
    loadYears,
    activeYear,
    activeNorm,
    activePointLayers,
    activeMetric,
    legendPanel,
    legendControl,
    centerMetro,
    centerState,
    remoteJson,
    activeView,
    breakpoint,
    setStoreValues,
  } = useStore(
    state => ({
      loadYears: state.loadYears,
      activeYear: state.activeYear,
      activeNorm: state.activeNorm,
      activePointLayers: state.activePointLayers,
      activeMetric: state.activeMetric,
      legendPanel: state.legendPanel,
      legendControl: state.legendControl,
      centerMetro: state.centerMetro,
      centerState: state.centerState,
      remoteJson: state.remoteJson,
      activeView: state.activeView,
      breakpoint: state.breakpoint,
      setStoreValues: state.setStoreValues,
    }),
    shallow,
  )

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

  const processData = (data, geo, year) => {
    var struct = [];
    var selected = [];
    switch(geo) {
      case 'n':
        selected = data.barcharts.data[`20${year}`].nation
        break
      case 's':
        if(centerState > 0){
          selected = data.barcharts.data[`20${year}`].states[STATES[centerState].abbr]
        }
        break
      case 'm':
        if(centerMetro > 0){
          selected = data.barcharts.data[`20${year}`].metros[centerMetro]
        }
    }
    selected.map(el => {
      struct.push({
        ai: el.ai,
        ap: el.ap,
        w: el.w,
        b: el.b,
        hi: el.hi,
      })
    })
    return struct
  }

  const handleEvent = (val, e) => {
    var data = {}
    if (val === 'showControl') {
      const data = {active: !legendControl.active}
      setStoreValues({legendControl: data})
    }
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

  useEffect(() => {
    if(activeNorm === 'm' && centerMetro === 0 && legendPanel.active) {
      const data = {active: !legendPanel.active}
      setStoreValues({legendPanel: data})
    } else if (activeNorm === 's' && centerState === 0 && legendPanel.active) {
      const data = {active: !legendPanel.active}
      setStoreValues({legendPanel: data})
    } else if(activeNorm === 'n' && legendPanel.active) {
      const data = {active: !legendPanel.active}
      setStoreValues({legendPanel: data})
    }
  }, [centerMetro, centerState, activeNorm])

  const SDArray = [
    i18n.translate(`SDSCALE_VLOW`),
    i18n.translate(`SDSCALE_LOW`),
    i18n.translate(`SDSCALE_MOD`),
    i18n.translate(`SDSCALE_HIGH`),
    i18n.translate(`SDSCALE_VHIGH`),
  ]

  const getChartSubtitle = (geo) => {
    switch(geo) {
      case 'n':
        return 'the U.S'
      case 's':
        if(centerState > 0) {
          return STATES[centerState].full
        }
      case 'm':
        if(centerMetro > 0){
          return remoteJson.metros.data.find(el => el.GEOID === centerMetro.toString()).msaname15
        }
    }
  }

  const renderChart = () => {
    if ((remoteJson.barcharts) && ((activeNorm === 'm' && centerMetro > 0) || (activeNorm === 's' && centerState > 0))) {
      if (legendPanel.activated === false) {
        var data = {active: legendPanel.active, activated: true, glow: true}
        setStoreValues({legendPanel: data})
        setTimeout(function(){
          data = {active: legendPanel.active, activated: true, glow: false}
          setStoreValues({legendPanel: data})
        }, 1500)
      }
      return true
    } else {
      if (legendPanel.activated === true) {
        var data = {active: legendPanel.active, activated: false, glow: false}
        setStoreValues({legendPanel: data})
      }
      return false
    }
  }

  const ChartToggle = () => {
    return (
      <div className={classes.row}>
        <IconButton disabled={ !renderChart() } className={classes.showButton} onClick={(e) => {handleEvent('showChart', e)}}>
          <div className={classes.showButtonGlow}></div>
          <Arrow disabled={!renderChart()}/>
        </IconButton>
        <span className={clsx(classes.showChart, (!renderChart() ? 'disabled' : ''))}>{i18n.translate(legendPanel.active ? `LEGEND_CHART_TOGGLE_OFF` : `LEGEND_CHART_TOGGLE_ON`)}</span>
      </div>
    )
  }

  const SdsScale = () => {
    return(
      <div className={classes.row}>
        <span className={classes.labelText}>
          {i18n.translate(`${activeMetric}${activeNorm}`)}
        </span>
        <SDScale
          active={[1, 1, 1, 1, 1]}
          type={'legend'}
        ></SDScale>
      </div>
    )
  }
  
  const Control = () => {
    return (
      <div className={classes.controlGuts}>
        <div className={classes.row}>
          <SelectBox
            options={createOptions(
              'LABEL_',
              OPTIONS_METRIC.options,
            )}
            current={activeMetric}
            handleChange={e =>
              handleEvent('activeMetric', e)
            }
            label={i18n.translate('LEGEND_SELECT_INDEX')}
            className={clsx('block-click')}
          ></SelectBox>
        </div>
        <div className={classes.row}>
          <div className={classes.col2}>
            <SelectBox
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
              className={clsx('block-click')}
            ></SelectBox>
          </div>
          <div className={classes.col2}>
            <SelectBox
              options={createOptions('LEGEND_', loadYears)}
              current={activeYear}
              handleChange={e =>
                handleEvent('activeYear', e)
              }
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
    )
  }

  const ControlToggle = () => {
    return (
      <div className={clsx(classes.row)}>
        <div className={classes.controlButton}>
          <Button onClick = {(e) => {handleEvent('showControl', e)}} classes={{label: classes.controlBtnLabel}}>
            <ExpandLessIcon className={classes.controlIcon}/>
            <span>{i18n.translate(`LEGEND_CONTROL_${legendControl.active.toString().toUpperCase()}`)}</span>
          </Button>
        </div>
      </div>
    )
  }

  const ChartHeaders = () => {
    return(
      <>
        <div className={classes.panelName}>
          {i18n.translate('LEGEND_CHART_TITLE')}
        </div>
        <div className={clsx(classes.labelText, classes.panelLabel)}>
          {i18n.translate('LEGEND_CHART_SUBTITLE', { chartSubtitle: getChartSubtitle(activeNorm) })}
        </div>
        <div className={classes.panelSds}>
          {SDArray.map((el, i) => {
            return (
              <span key={el} className={classes.sdsCell}>{el.toUpperCase()}</span>
            )
          })}
        </div>
      </>
    )
  }

  const classes = styles()

  return (
  <>
    {/* DESKTOP VIEW */}
    {breakpoint != 'xs' && activeView === 'explorer' && 
      <Box className={clsx('map-legend', classes.root)}>
        <div className={classes.controller}>
          <div className={classes.row}>
            <IconButton disabled={ !renderChart() } className={classes.showButton} onClick={(e) => {handleEvent('showChart', e)}}>
              <div className={classes.showButtonGlow}></div>
              <Arrow disabled={!renderChart()}/>
            </IconButton>
            <span className={clsx(classes.showChart, (!renderChart() ? 'disabled' : ''))}>{i18n.translate(legendPanel.active ? `LEGEND_CHART_TOGGLE_OFF` : `LEGEND_CHART_TOGGLE_ON`)}</span>
          </div>
          <SdsScale />
          <Control />
        </div>
        <div className={classes.panel}>
          {renderChart() &&
            <div className={classes.panelChart}>
              <ChartHeaders />
              <Chart
                data={processData(remoteJson, activeNorm, activeYear)}
                activeBars={activePointLayers}
              />
            </div>
          }
        </div>
      </Box>
    }
    {/* MOBILE VIEW */}
    {breakpoint === 'xs' && activeView === 'explorer' && 
      <Box className={clsx('map-legend', classes.root)}>
        <div className={classes.controller}>
          <SdsScale />
          <Control />
          <ControlToggle />
        </div>
      </Box>
    }
    {/* EMBED VIEW */}
    {activeView === 'embed' && 
      <Box className={clsx('map-legend', classes.root)}>
        <div className={classes.controller}>
          <SdsScale />
        </div>
      </Box>
    }
    </>
  )
}

Legend.propTypes = {}

Legend.defaultProps = {}

export default Legend
