import React, { useEffect, useMemo } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'
import {
  FormControlLabel,
  Checkbox,
  withStyles,
  Switch,
  Button,
  Tooltip,
} from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

import Arrow from '../Icons'
import SelectBox from '../App/components/SelectBox'

import {
  OPTIONS_ACTIVE_POINTS,
  OPTIONS_METRIC,
  OPTIONS_NORM,
} from './../../../../constants/map'
import useStore from '../store'
import { Block } from '@material-ui/icons'

// Styles for this component.
const styles = theme => ({
  row: {
    width: '100%',
    '&:nth-child(n+2)': {
      paddingTop: '8px',
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
    '& svg': {
      width: '14px',
      height: '14px',
      marginLeft: '3px',
      marginBottom: '-2px',
    },
  },
  checkboxContainer: {
    display: 'block',
    justifyContent: 'left',
    paddingLeft: '9px',
  },
  checkboxLabel: {
    fontFamily: 'Fira Sans',
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
  tooltipSwitchRow: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  switchLabel: {},
  switchContainer: {
    marginLeft: '-6px',
    fontSize: '12px',
    '& .MuiFormControlLabel-label': {
      fontSize: '12px',
      fontFamily: 'Fira Sans',
      color: theme.extras.variables.colors.lightGray,
    },
    '& .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track': {
      backgroundColor: `${theme.extras.variables.colors.ddkRed} !important`,
      opacity: `0.8 !important`,
    },
    '& .MuiIconButton-label': {
      color: '#fff',
    },
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
  showButton: {
    padding: '6px 0',
    cursor: 'pointer',
    '& svg': {
      width: '27px',
      height: '27px',
      padding: '0px',
      marginLeft: '-2px',
      transition: 'transform 300ms ease-in-out',
      transform: 'rotate(0deg)',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  showButtonActive: {
    '& svg': {
      width: '27px',
      height: '27px',
      padding: '0px',
      marginLeft: '-2px',
      transform: 'rotate(180deg)',
      transition: 'transform 300ms ease-in-out',
    },
  },
  showButtonDisabled: {
    '& svg circle, & svg path': {
      stroke: theme.extras.variables.colors.lightGray,
    },
    color: theme.extras.variables.colors.lightGray,
  },
  showButtonGlow: {
    position: 'absolute',
    left: 0,
    borderRadius: '50%',
    width: '24px', // '100%',
    height: '24px', // '100%',
    transition: 'opacity 300ms ease-in-out',
    backgroundColor: '#fff',
    boxShadow: `0 0 4px 2px #fff, 0 0 10px 16px ${theme.extras.SDScale.onColors[0]}, 0 0 2px 8px ${theme.extras.SDScale.onColors[1]}`,
    // boxShadow: `0 0 4px 2px #fff, 0 0 20px 12px ${theme.extras.SDScale.onColors[0]}, 0 0 28px 18px ${theme.extras.SDScale.onColors[1]}`,
    opacity: 0,
    // zIndex: -1,
  },
  showButtonGlowVisible: {
    opacity: 0.8,
  },
  showChartRow: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
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

const LegendControl = ({
  classes,
  parentClasses,
  ...props
}) => {
  const {
    loadYears,
    activeYear,
    activeNorm,
    activePointLayers,
    activeMetric,
    setStoreValues,
    displayPopup,
    legendPanel,
  } = useStore(
    state => ({
      loadYears: state.loadYears,
      activeYear: state.activeYear,
      activeNorm: state.activeNorm,
      activePointLayers: state.activePointLayers,
      activeMetric: state.activeMetric,
      setStoreValues: state.setStoreValues,
      displayPopup: state.displayPopup,
      legendPanel: state.legendPanel,
    }),
    shallow,
  )

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
    let layers =
      activePointLayers.length > 0
        ? activePointLayers.slice()
        : []
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

  const toggleShowPopup = () => {
    setStoreValues({
      displayPopup: !displayPopup,
    })
  }

  const handleEvent = (val, e) => {
    // var data = {}
    if (val === 'showChart') {
      const data = {
        active: legendPanel.active,
        open: !legendPanel.open,
        glow: legendPanel.glow + 1,
      }
      return setStoreValues({ legendPanel: data })
    }
  }

  // useEffect(() => {
  //   console.log('legendPanel changed ', legendPanel)
  // }, [legendPanel])

  return (
    <>
      <div
        className={clsx(
          classes.row,
          classes.tooltipSwitchRow,
        )}
      >
        <FormControlLabel
          classes={{ label: classes.switchLabel }}
          className={classes.switchContainer}
          control={
            <Switch
              checked={displayPopup}
              onChange={toggleShowPopup}
              name="ToolCheck"
              color="primary"
            />
          }
          label={i18n.translate(`LEGEND_TOOLTIP_LABEL`)}
        />
      </div>
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
            showHelp={i18n.translate(`LEGEND_NORM_HELP`)}
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
        <div className={classes.labelText}>
          <span>{i18n.translate(`LEGEND_DEMO`)}</span>
          <Tooltip
            // title={i18n.translate(`LEGEND_DEMO_TIP`)}
            title={
              <React.Fragment>
                <span
                  dangerouslySetInnerHTML={{
                    __html: i18n.translate(
                      `LEGEND_DEMO_TIP`,
                    ),
                  }}
                ></span>
              </React.Fragment>
            }
            arrow
          >
            <HelpOutlineIcon />
          </Tooltip>
        </div>
        <div>
          {OPTIONS_ACTIVE_POINTS.options
            .slice()
            .reverse()
            .map((el, i) => {
              return (
                <FormControlLabel
                  className={classes.checkboxContainer}
                  classes={{ label: classes.checkboxLabel }}
                  control={
                    <Checkbox
                      className={classes.checkbox}
                      classes={{
                        root:
                          classes[`checkboxColor_${el}`],
                      }}
                      checked={
                        activePointLayers.indexOf(el) > -1
                      }
                      onChange={handleActivePointLayers}
                      name={el}
                    />
                  }
                  label={
                    i18n
                      .translate(
                        `POP_LONG_${String(
                          el,
                        ).toUpperCase()}`,
                      )
                      .indexOf('missing') < 0
                      ? i18n.translate(
                          `POP_LONG_${String(
                            el,
                          ).toUpperCase()}`,
                        )
                      : i18n.translate(
                          `POP_${String(el).toUpperCase()}`,
                        )
                  }
                  key={el}
                />
              )
            })}
        </div>
      </div>
      <div className={(classes.row, classes.showChartRow)}>
        <Button
          disabled={!legendPanel.active}
          disableRipple={true}
          className={clsx(
            classes.showButton,
            !!legendPanel.open
              ? classes.showButtonActive
              : '',
            !legendPanel.active
              ? classes.showButtonDisabled
              : '',
          )}
          onClick={e => {
            handleEvent('showChart', e)
          }}
        >
          <div
            className={clsx(classes.showButtonGlow, {
              [classes.showButtonGlowVisible]:
                legendPanel.active &&
                legendPanel.glow === 0,
            })}
          ></div>
          <Arrow disabled={!legendPanel.active} />
          <span
            className={clsx(
              classes.showChart,
              !legendPanel.active ? 'disabled' : '',
            )}
          >
            {i18n.translate(
              legendPanel.open
                ? `LEGEND_CHART_TOGGLE_OFF`
                : `LEGEND_CHART_TOGGLE_ON`,
            )}
          </span>
        </Button>
      </div>
    </>
  )
}

export default withStyles(styles)(LegendControl)
