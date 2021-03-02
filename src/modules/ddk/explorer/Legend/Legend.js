import React, { useEffect } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import shallow from 'zustand/shallow'
import {
  Box,
  FormControlLabel,
  IconButton,
  Button,
  Switch,
} from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import Chart from '../Chart'
import Arrow from '../Icons'
import useStore from './../store'
import { STATES } from './../../../../constants/map'
import LegendScale from './LegendScale'
import LegendControl from './LegendControl'
import LegendChartHeaders from './LegendChartHeaders'

// Styles for this component.
const useLegendStyles = makeStyles(theme => ({
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
      width: 284,
      position: 'absolute',
      right: theme.extras.Legend.cushionRight,
      top: 80,
      borderRadius: 5,
    },
  },
  /** styles when legendPanel.active is truthy */
  active: {
    '& $showButton': {
      transform: 'rotate(180deg)',
    },
    [theme.breakpoints.up('sm')]: {
      width: 668,
    },
  },
  controlGuts: {
    transition: 'height 300ms ease-in-out',
    height: 0,
    [theme.breakpoints.up('sm')]: {
      height: '243px',
    },
    overflow: 'hidden',
  },
  controlActive: {
    height: 243,
  },
  row: {
    width: '100%',
    '&:nth-child(n+2)': {
      paddingTop: '7px',
    },
  },
  col6: {
    width: '100%',
    display: 'block',
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
  col4: {
    boxSizing: 'border-box',
    width: '66%',
    display: 'inline-block',
    padding: '0px 2px 0px 0px',
    '&:nth-child(2)': {
      padding: '0px 0px 0px 2px',
    },
  },
  col2: {
    boxSizing: 'border-box',
    width: '33%',
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
  showChart: {
    color: '#C9422C',
    fontSize: '14px',
    verticalAlign: 'middle',
    letterSpacing: '1.25px',
    fontWeight: '500',
    paddingLeft: '3px',
    '&.disabled': {
      color: '#616161',
    },
  },
  showControl: {
    textAlign: 'center',
    borderTop: '1px solid #EEE',
  },
  controlIcon: {
    transition: 'transform 300ms ease-in-out',
    transform: 'rotate(180deg)',
  },
  controlIconActive: {
    transform: 'rotate(0deg)',
  },
  controlButton: {
    textAlign: 'center',
  },
  controlBtnLabel: {
    color: theme.extras.variables.colors.ddkRed,
    fontSize: '14px',
    letterSpacing: '1.25px',
    verticalAlign: 'middle',
  },
  switchContainer: {
    float: 'right',
  },
  switchLabel: {
    fontSize: '14px',
    letterSpacing: '1.25px',
    color: theme.extras.variables.colors.lightGray,
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
    },
  },
  panel: {
    top: '0px',
    right: '284px',
    height: '352px',
    width: '352px',
    padding: '16px 16px',
    zIndex: '-1',
    background:
      theme.extras.variables.colors.lightLightGray,
    position: 'absolute',
  },
  panelChart: {
    width: '100%',
    height: '270px',
  },
  panelName: {
    fontSize: '14px',
    padding: '6px 0px 10px 34px',
    letterSpacing: '.1px',
    color: theme.extras.variables.colors.darkGray,
  },
  panelLabel: {
    padding: '0px 0px 0px 34px',
    height: '39px',
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
    width: '20%',
  },
  showButton: {
    width: '27px',
    height: '27px',
    padding: '0px',
    marginLeft: '-2px',
    transition: 'transform 300ms ease-in-out',
    transform: 'rotate(0deg)',
    cursor: 'pointer',
  },
  showButtonDisabled: {
    stroke: theme.extras.variables.colors.lightGray,
  },
  showButtonGlow: {
    position: 'absolute',
    borderRadius: '50%',
    width: '100%',
    height: '100%',
    transition: 'opacity 300ms ease-in-out',
    backgroundColor: '#fff',
    boxShadow: `0 0 4px 2px #fff, 0 0 20px 12px ${theme.extras.SDScale.onColors[1]}, 0 0 28px 18px ${theme.extras.SDScale.onColors[2]}`,
    opacity: 0,
    zIndex: -1,
  },
  showButtonGlowVisible: {
    opacity: 1,
  },
}))

const processData = (
  data,
  geo,
  year,
  centerState,
  centerMetro,
) => {
  var struct = []
  var selected = []
  switch (geo) {
    case 'n':
      selected = data.barcharts.data[`20${year}`].nation
      break
    case 's':
      if (centerState > 0) {
        selected =
          data.barcharts.data[`20${year}`].states[
            STATES[centerState].abbr
          ]
      }
      break
    case 'm':
      if (centerMetro > 0) {
        selected =
          data.barcharts.data[`20${year}`].metros[
            centerMetro
          ]
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

const Legend = ({ ...props }) => {
  const {
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
    displayPopup,
    setStoreValues,
  } = useStore(
    state => ({
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
      displayPopup: state.displayPopup,
      setStoreValues: state.setStoreValues,
    }),
    shallow,
  )

  const handleEvent = (val, e) => {
    var data = {}
    if (val === 'showPopup') {
      return setStoreValues({ displayPopup: !displayPopup })
    }
    if (val === 'showControl') {
      const data = { active: !legendControl.active }
      return setStoreValues({ legendControl: data })
    }
    if (val === 'showChart') {
      const data = { active: !legendPanel.active }
      return setStoreValues({ legendPanel: data })
    }
    // console.log('hit')
    data[val] = e.target.value
    setStoreValues(data)
  }

  useEffect(() => {
    if (
      activeNorm === 'm' &&
      centerMetro === 0 &&
      legendPanel.active
    ) {
      const data = { active: !legendPanel.active }
      setStoreValues({ legendPanel: data })
    } else if (
      activeNorm === 's' &&
      centerState === 0 &&
      legendPanel.active
    ) {
      const data = { active: !legendPanel.active }
      setStoreValues({ legendPanel: data })
    } else if (activeNorm === 'n' && legendPanel.active) {
      const data = { active: !legendPanel.active }
      setStoreValues({ legendPanel: data })
    }
  }, [centerMetro, centerState, activeNorm])

  const renderChart = () => {
    if (
      remoteJson.barcharts &&
      ((activeNorm === 'm' && centerMetro > 0) ||
        (activeNorm === 's' && centerState > 0))
    ) {
      if (legendPanel.activated === false) {
        var data = {
          active: legendPanel.active,
          activated: true,
          glow: true,
        }
        setStoreValues({ legendPanel: data })
        setTimeout(function () {
          data = {
            active: legendPanel.active,
            activated: true,
            glow: false,
          }
          setStoreValues({ legendPanel: data })
        }, 1500)
      }
      return true
    } else {
      if (legendPanel.activated === true) {
        var data = {
          active: legendPanel.active,
          activated: false,
          glow: false,
        }
        setStoreValues({ legendPanel: data })
      }
      return false
    }
  }

  const classes = useLegendStyles()

  return (
    <>
      {/* DESKTOP VIEW */}
      {breakpoint != 'xs' && activeView === 'explorer' && (
        <Box
          className={clsx('map-legend', classes.root, {
            [classes.active]: legendPanel.active,
          })}
        >
          <div className={classes.controller}>
            <div className={classes.row}>
              <IconButton
                disabled={!renderChart()}
                className={classes.showButton}
                onClick={e => {
                  handleEvent('showChart', e)
                }}
              >
                <div
                  className={clsx(classes.showButtonGlow, {
                    [classes.showButtonGlowVisible]:
                      legendPanel.glow,
                  })}
                ></div>
                <Arrow disabled={!renderChart()} />
              </IconButton>
              <span
                className={clsx(
                  classes.showChart,
                  !renderChart() ? 'disabled' : '',
                )}
              >
                {i18n.translate(
                  legendPanel.active
                    ? `LEGEND_CHART_TOGGLE_OFF`
                    : `LEGEND_CHART_TOGGLE_ON`,
                )}
              </span>
              <FormControlLabel
                classes={{ label: classes.switchLabel }}
                className={classes.switchContainer}
                control={
                  <Switch
                    size="small"
                    checked={displayPopup}
                    onChange={e => {
                      handleEvent('showPopup', e)
                    }}
                    name="ToolCheck"
                    color="primary"
                  />
                }
                label="Tooltip"
              />
            </div>
            <LegendScale
              activeMetric={activeMetric}
              activeNorm={activeNorm}
              classes={{
                root: classes.row,
                label: classes.labelText,
              }}
            />
            <div
              className={clsx(classes.controlGuts, {
                [classes.controlActive]:
                  legendControl.active,
              })}
            >
              <LegendControl />
            </div>
          </div>
          <div className={classes.panel}>
            {renderChart() && (
              <div className={classes.panelChart}>
                <LegendChartHeaders
                  classes={{
                    title: classes.panelName,
                    subtitle: clsx(
                      classes.labelText,
                      classes.panelLabel,
                    ),
                    panel: classes.panelSds,
                    cell: classes.sdsCell,
                  }}
                />
                <Chart
                  data={processData(
                    remoteJson,
                    activeNorm,
                    activeYear,
                    centerState,
                    centerMetro,
                  )}
                  activeBars={activePointLayers}
                />
              </div>
            )}
          </div>
        </Box>
      )}
      {/* MOBILE VIEW */}
      {breakpoint === 'xs' && activeView === 'explorer' && (
        <Box className={clsx('map-legend', classes.root)}>
          <div className={classes.controller}>
            <LegendScale
              activeMetric={activeMetric}
              activeNorm={activeNorm}
              classes={{
                root: classes.row,
                label: classes.labelText,
              }}
            />
            <div
              className={clsx(classes.controlGuts, {
                [classes.controlActive]:
                  legendControl.active,
              })}
            >
              <LegendControl />
            </div>
            <div className={clsx(classes.row)}>
              <div className={classes.controlButton}>
                <Button
                  onClick={e => {
                    handleEvent('showControl', e)
                  }}
                  classes={{
                    label: classes.controlBtnLabel,
                  }}
                >
                  <ExpandLessIcon
                    className={clsx(classes.controlIcon, {
                      [classes.controlIconActive]:
                        legendControl.active,
                    })}
                  />
                  <span>
                    {i18n.translate(
                      `LEGEND_CONTROL_${legendControl.active
                        .toString()
                        .toUpperCase()}`,
                    )}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </Box>
      )}
      {/* EMBED VIEW */}
      {activeView === 'embed' && (
        <Box className={clsx('map-legend', classes.root)}>
          <div className={classes.controller}>
            <LegendScale
              activeMetric={activeMetric}
              activeNorm={activeNorm}
              classes={{
                root: classes.row,
                label: classes.labelText,
              }}
            />
          </div>
        </Box>
      )}
    </>
  )
}

Legend.propTypes = {}

Legend.defaultProps = {}

export default Legend
