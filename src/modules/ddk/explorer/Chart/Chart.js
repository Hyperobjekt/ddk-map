import React, { useEffect } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import * as lodash from 'lodash'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Customized,
} from 'recharts';

const Chart = ({ ...props }) => {

  const styles = makeStyles(theme => ({
    legendIndicator: {
      verticalAlign: 'middle',
      display: "inline-block",
      width: '15px',
      height: '7px',
      marginRight: '3px',
      borderRadius: '2px',
      '&.ai':{
        backgroundColor: theme.extras.demos.ai
      },
      '&.ap':{
        backgroundColor: theme.extras.demos.ap
      },
      '&.b':{
        backgroundColor: theme.extras.demos.b
      },
      '&.hi':{
        backgroundColor: theme.extras.demos.hi
      },
      '&.w':{
        backgroundColor: theme.extras.demos.w
      }
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
    },
    background: {
      '&.vl': {fill: theme.extras.SDScale.onColors[0]},
      '&.l': {fill: theme.extras.SDScale.onColors[1]},
      '&.m': {fill: theme.extras.SDScale.onColors[2]},
      '&.h': {fill: theme.extras.SDScale.onColors[3]},
      '&.vh': {fill: theme.extras.SDScale.onColors[4]}
    },
    ai:{
      fill: theme.extras.demos.ai
    },
    ap:{
      fill: theme.extras.demos.ap
    },
    b:{
      fill: theme.extras.demos.b
    },
    hi:{
      fill: theme.extras.demos.hi
    },
    w:{
      fill: theme.extras.demos.w
    }
  }))

  // const processData = (data, geo, year) => {
  //   var struct = [];
  //   var selected = [];
  //   switch(geo.type){
  //     case 'national':
  //       selected = data.barcharts.data[`20${year}`][props.geo.type]
  //     default:
  //       selected = data.barcharts.data[`20${year}`][geo.type][geo.id]
  //   }
  //   selected.map(el => {
  //     struct.push({
  //       ai: el.ai,
  //       ap: el.ap,
  //       w: el.w,
  //       b: el.b,
  //       hi: el.hi,
  //     })
  //   })
  //   return struct
  // }

  const addPercent = (el) => {
    return `${el}%`
  }

  const renderLegend = (props) => {
    const { payload } = props;
  
    return (
      <div className={classes.legend}>
        {
          payload.map((entry, index) => (
            <div key={`item-${index}`} style={{display: 'inline-block', padding: '0px 5px'}}>
              <div className={clsx(classes.legendIndicator, `${entry.value}`)}></div>
              <span>{i18n.translate(`POP_${entry.value.toUpperCase()}`)}</span>
            </div>
          ))
        }
      </div>
    );
  }

  const Background = () => {
    const bgWidth = 311
    const bgHeight = 225
    const xOffset = 36
    const yOffset = 5
    const indexes = ['vl', 'l', 'm', 'h', 'vh']

    return(
      <>
        <rect style={{fill: "#fff"}} x={xOffset - 2} y={yOffset - 2} height={bgHeight + 4} width={bgWidth + 4}></rect>
        {indexes.map((val, i) => {
          return <rect key={i} className={clsx(classes.background, val)} x={(i * bgWidth/indexes.length) + xOffset} y={yOffset} height={bgHeight} width={bgWidth - (i * bgWidth/indexes.length)}></rect>
        })}
      </>
    )
  }

  const classes = styles()
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={props.data}
        // data={processData(props.data, props.geo, props.year)}
        margin={{ top: 5, right: 5, bottom: 5, left: -24 }}
        barCategoryGap='5%'
        barGap='0'
        height={200}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis axisLine={false} tickLine={false} domain={[0, 70]} tickCount={8} tickFormatter={addPercent}/>
        <Legend 
          content={renderLegend}
        />
        <Customized component={Background} />
        {props.activeBars.map((el, i) => {
          return <Bar key={i} radius={[2,2,0,0]} dataKey={el} className={classes[el]} />
        })}
      </BarChart>
    </ResponsiveContainer>
  )
}

Chart.propTypes = {
  data: PropTypes.array,
  activeBars: PropTypes.array,
}

Chart.defaultProps = {}

export default Chart