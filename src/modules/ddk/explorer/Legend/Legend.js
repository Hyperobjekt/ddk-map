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
} from '@material-ui/core'
import {
  AiOutlineColumnHeight,
  AiOutlineControl,
} from 'react-icons/ai'

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
      width: theme.extras.Legend.width,
      height: theme.extras.Legend.height,
      // Adjust for different app bar height.
      top: theme.extras.Legend.cushionTop,
      padding: theme.spacing(2),
      boxShadow: theme.shadows[3],
      display: 'relative',
      justifyContent: 'center',
      alignItems: 'flex-start',
      borderRadius: 5,
      fontFamily: 'Fira Sans',
      fontSize: '12px',
      cursor: 'default'
      // pointerEvents: 'none',
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
      fontWeight: 500
    },
    img: {
      width: '27px',
      verticalAlign: 'middle',
      marginLeft: '-2px'
    },
    checkboxColor_w: {
      color: '#66CC00',
      '&.Mui-checked': {
        color: '#66CC00',
      },
    },
    checkboxColor_hi: {
      color: '#7401B1',
      '&.Mui-checked': {
        color: '#7401B1',
      },
    },
    checkboxColor_b: {
      color: '#FFC31A',
      '&.Mui-checked': {
        color: '#FFC31A',
      },
    },
    checkboxColor_ap: {
      color: '#FF730C',
      '&.Mui-checked': {
        color: '#FF730C',
      },
    },
    checkboxColor_ai: {
      color: '#FF00CC',
      '&.Mui-checked': {
        color: '#FF00CC',
      },
    },
    indexSelect: {
      fontWeight: '500',
    },
    modal: {
      top: '10vh !important',
      bottom: '10vh !important',
      left: '10vw !important',
      right: '10vw !important',
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
      boxShadow: theme.shadows[3],
      outline: 0,
    }
  }))

  const {
    loadYears,
    activeYear,
    activeNorm,
    activePointLayers,
    activeMetric,
    legendPanel,
    setStoreValues,
  } = useStore(state => ({
    loadYears: state.loadYears,
    activeYear: state.activeYear,
    activeNorm: state.activeNorm,
    activePointLayers: state.activePointLayers,
    activeMetric: state.activeMetric,
    legendPanel: state.legendPanel,
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

  const handleChange = (val, e) => {
    var data = {}
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

  const classes = styles()

  return (
    <>
    <Box className={clsx('map-legend', classes.root)}>
      <div className={classes.row}>
        <img className={classes.img} src={arrow}></img>
        <span className={classes.showChart}>{i18n.translate(`LEGEND_CHART_TOGGLE`)}</span>
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
            handleChange('activeMetric', e)
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
              handleChange('activeNorm', e)
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
              handleChange('activeYear', e)
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
                      handleChange('activePointLayers', e)
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
    </Box>
    <Box>
      <Modal
        className={clsx(classes.modal)}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >

      </Modal>
    </Box>
    </>
  )
}

Legend.propTypes = {}

Legend.defaultProps = {}

export default Legend
