import React, { useEffect } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import { Box, FormControl, FormControlLabel, FormHelperText, Checkbox } from '@material-ui/core'
import { AiOutlineColumnHeight, AiOutlineControl } from 'react-icons/ai'

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
    checkbox: {
      display: 'block',
      justifyContent: 'left'
    }
  }))

  const loadYears = useStore(
    state => state.loadYears
  )
  const activeYear = useStore(
    state => state.activeYear
  )
  const optionsNorm = useStore(
    state => state.optionsNorm.options
  )
  const activeNorm = useStore(
    state => state.activeNorm
  )
  const optionsDemos = useStore(
    state => state.optionsPointLayers.options
  )
  const activeDemos = useStore(
    state => state.activePointsLayers
  )
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )

  const classes = styles()

  const handleChange = (val, e) => {
    const data = {}
    data[val] = e.target.value
    setStoreValues(data)
  }

  const form = {
    index: ''
  }

  return (
    <Box className={clsx('map-legend', classes.root)}>
      <div>
        <span>Neighborhood opportunity levels</span>
        <SDScale
          active={[1,1,1,1,1]}
          type={'legend'}
        ></SDScale>
      </div>
      <div className={classes.row}>
        <SelectButton
          options={loadYears}
          current={activeYear}
          handleChange={(e) => handleChange('activeYear', e)}
          label={'Select an Index:'}
        >
        </SelectButton>
      </div>
      <div className={classes.row}>
        <div className={classes.col2}>
          <SelectButton
            options={optionsNorm}
            current={activeNorm}
            handleChange={(e) => handleChange('activeNorm', e)}
            label={'Compare to:'}
          >
          </SelectButton>
        </div>
        <div className={classes.col2}>
          <SelectButton
            options={loadYears}
            current={activeYear}
            handleChange={(e) => handleChange('activeYear', e)}
            label={'Time Period:'}
          >
          </SelectButton>
        </div>
      </div>
      <div className={classes.row}>
        <span>Select a race/ethnicity:</span>
        <div>
          {optionsDemos.map((el, i) => {
            return <FormControlLabel
              className={classes.checkbox} control={<Checkbox checked={el} name={el} />}
              label={el}
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
