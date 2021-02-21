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
} from 'recharts';

const Chart = ({ ...props }) => {

  const styles = makeStyles(theme => ({
    dataViz: {
      height: '100%',
      width: '100%',
    }
  }))

  const processData = (data, geo, year) => {
    var struct = [];
    var selected = [];
    switch(geo.type){
      case 'national':
        selected = data.barcharts.data[`20${year}`][props.geo.type]
      default:
        selected = data.barcharts.data[`20${year}`][geo.type][geo.id]
        console.log(`20${year}`,geo.type,geo.id)
    }
    selected.map(el => {
      struct.push({
        grp: el.grp,
        ai: el.ai,
        ap: el.ap,
        w: el.w,
        b: el.b,
        hi: el.hi
      })
    })
    return struct
  }

  const classes = styles()
  
  return (
    <ResponsiveContainer className={classes.dataViz}>
      <BarChart
        data={processData(props.data, props.geo, props.year)}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Legend />
        <Bar dataKey="ai" fill="#FF00CC" />
        <Bar dataKey="ap" fill="#FF730C" />
        <Bar dataKey="b" fill="#FFC31A" />
        <Bar dataKey="hi" fill="#7401B1" />
        <Bar dataKey="w" fill="#66CC00" />
      </BarChart>
    </ResponsiveContainer>
  )
}

Chart.propTypes = {
  data: PropTypes.object,
  year: PropTypes.string,
  geo: PropTypes.object
}

Chart.defaultProps = {}

export default Chart