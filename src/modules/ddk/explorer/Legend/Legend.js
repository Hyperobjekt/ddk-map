import React, { useEffect } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Box, FormControl, FormControlLabel, FormHelperText, Checkbox } from '@material-ui/core'
import { AiOutlineColumnHeight, AiOutlineControl } from 'react-icons/ai'

import arrow from './arrow.svg'
import SelectButton from '../App/components/SelectButton'
import useStore from './../store'
import theme from './../theme'
import SDScale from '../SDScale'

const Legend = ({ ...props }) => {
  // Header is not displayed if the view type is 'embed'
  const activeView = useStore(state => state.activeView)
  // Source data
  // const remoteJson = useStore(state => state.remoteJson)
  // useEffect(() => {
  //   console.log('remoteJson changed, ', remoteJson)
  // }, [remoteJson])
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
      padding: theme.spacing(3),
      boxShadow: theme.shadows[3],
      display: 'relative',
      justifyContent: 'center',
      alignItems: 'flex-start',
      borderRadius: 5,
      fontFamily: 'Fira Sans',
      fontSize: '12px'
      // pointerEvents: 'none',
    },
    formControl: {
      width: '100%'
    },
    row: {
      paddingTop: '5px',
      width: '100%',
    },
    col1: {
      width: '100%',
      display: 'block'
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
    },
    checkboxLabel: {
      verticalAlign: 'middle'
    },
    checkbox: {
      padding: '0px 9px',
      verticalAlign: 'middle',
    },
    labelText: {
      color: '#616161'
    },
    showChart: {
      color: '#C9422C',
      fontSize: '16px',
      verticalAlign: 'middle',
    },
    img: {
      width: '27px',
      verticalAlign: 'middle',
    },
    checkboxColor_w: {
      color: '#66CC00',
      '&.Mui-checked': {
        color: '#66CC00'
      }
    },
    checkboxColor_hi: {
      color: '#7401B1',
      '&.Mui-checked': {
        color: '#7401B1'
      }
    },
    checkboxColor_b: {
      color: '#FFC31A',
      '&.Mui-checked': {
        color: '#FFC31A'
      }
    },
    checkboxColor_ap: {
      color: '#FF730C',
      '&.Mui-checked': {
        color: '#FF730C'
      }
    },
    checkboxColor_ai: {
      color: '#FF00CC',
      '&.Mui-checked': {
        color: '#FF00CC'
      }
    }
  }))

  const {
    loadYears,
    activeYear,
    optionsNorm,
    activeNorm,
    optionsPointLayers,
    activePointLayers,
    activeMetric,
    optionsMetric,
    setStoreValues
  } = useStore(state => ({
    loadYears: state.loadYears,
    activeYear: state.activeYear,
    optionsNorm: state.optionsNorm.options,
    activeNorm: state.activeNorm,
    optionsPointLayers: state.optionsPointLayers.options,
    activePointLayers: state.activePointLayers,
    activeMetric: state.activeMetric,
    optionsMetric: state.optionsMetric.options,
    setStoreValues: state.setStoreValues,
  }))

  const makeOptionsObject = (options, active) => {
    var diff = {};
    options.forEach(el => {
      diff[el] = false;
    })
    if (active) {
      active.forEach(el => {
        diff[el] = true;
      })
    }
    return diff;
  }

  const createOptions = (prefix, options) => {
    return options.map(el => {
      return {val: el, display: i18n.translate(`${prefix}${el.toUpperCase()}`)}
    })
  }

  const handleChange = (val, e) => {
    var data = {}
    if (val === 'activePointLayers') {
      demos[e.target.name] = e.target.checked
      var layers = [];
      Object.entries(demos).forEach(el => {
        if (el[1] === true) {
          layers.push(el[0])
        }
      })
      data[val] = layers
      setStoreValues(data)
    } else {
      console.log('hit')
      data[val] = e.target.value
      setStoreValues(data)
    }
  }

  const classes = styles()
  var demos = makeOptionsObject(optionsPointLayers, activePointLayers)


  return (
    <Box className={clsx('map-legend', classes.root)}>
      <div className={classes.row}>
      <img className={classes.img} src={arrow}></img><div className={classes.showChart}>SHOW CHART</div>
      </div>
      <div className={classes.row}>
        <span className={classes.labelText}>{i18n.translate(`${activeMetric}${activeNorm}`)}</span>
        <SDScale
          active={[1,1,1,1,1]}
          type={'legend'}
        ></SDScale>
      </div>
      <div className={classes.row}>
        <SelectButton
          options={createOptions('LEGEND_', optionsMetric)}
          current={activeMetric}
          handleChange={(e) => handleChange('activeMetric', e)}
          label={'Select an Index:'}
        >
        </SelectButton>
      </div>
      <div className={classes.row}>
        <div className={classes.col2}>
          <SelectButton
            options={createOptions('LEGEND_', optionsNorm)}
            current={activeNorm}
            handleChange={(e) => handleChange('activeNorm', e)}
            label={'Compare to:'}
          >
          </SelectButton>
        </div>
        <div className={classes.col2}>
          <SelectButton
            options={createOptions('LEGEND_', loadYears)}
            current={activeYear}
            handleChange={(e) => handleChange('activeYear', e)}
            label={'Time Period:'}
          >
          </SelectButton>
        </div>
      </div>
      <div className={classes.row}>
        <span className={classes.labelText}>Select a race/ethnicity:</span>
        <div>
          {optionsPointLayers.map((el) => {
            return <FormControlLabel
              className={classes.checkboxContainer} classes={{label: classes.checkboxLabel}} control={<Checkbox className={classes.checkbox} classes={{root: classes[`checkboxColor_${el}`]}} checked={demos.el} onChange={(e) => handleChange('activePointLayers', e)} name={el} />}
              label={i18n.translate(`POP_${el.toUpperCase()}`)}
              key={el}
            />
          })}
        </div>
      </div>
    </Box>
  )
}

Legend.propTypes = {}

Legend.defaultProps = {}

export default Legend
