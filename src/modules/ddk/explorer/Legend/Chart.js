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
  ComposedChart
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
        backgroundColor: '#FF00CC'
      },
      '&.ap':{
        backgroundColor: '#FF730C'
      },
      '&.b':{
        backgroundColor: '#FFC31A'
      },
      '&.hi':{
        backgroundColor: '#7401B1'
      },
      '&.w':{
        backgroundColor: '#66CC00'
      }
    },
    legendName: {

    },
    
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
        hi: el.hi,
        bg: 70
      })
    })
    return struct
  }

  const addPercent = (el) => {
    return `${el}%`
  }

  const renderLegend = (props) => {
    const { payload } = props;
  
    return (
      <div style={{
        margin: '-20px 10px auto 65px',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: '2px',
        fontSize: '9px',
        padding: '4px'
      }}
        >
        {
          payload.map((entry, index) => (
            <div style={{display: 'inline-block', padding: '0px 5px'}}>
              {/* <div style={{verticalAlign: 'middle', display: "inline-block", backgroundColor: "#000", width: '15px', height: '7px', marginRight: '3px', borderRadius: '2px'}}></div> */}
              <div className={clsx(classes.legendIndicator, `${entry.value}`)}></div>
              <span key={`item-${index}`}>{i18n.translate(`POP_${entry.value.toUpperCase()}`)}</span>
            </div>
          ))
        }
      </div>
    );
  }

  const Background = () => {
    return(
      <>
        <rect style={{fill: "#C9E8F8"}} x={(0 * 311/5) + 34} y="5" height="230" width={311 - (0 * 311/5)}></rect>
        <rect style={{fill: '#8DD4F9'}} x={(1 * 311/5) + 34} y="5" height="230" width={311 - (1 * 311/5)}></rect>
        <rect style={{fill: '#73A0C9'}} x={(2 * 311/5) + 34} y="5" height="230" width={311 - (2 * 311/5)}></rect>
        <rect style={{fill: '#588DA8'}} x={(3 * 311/5) + 34} y="5" height="230" width={311 - (3 * 311/5)}></rect>
        <rect style={{fill: '#56778D'}} x={(4 * 311/5) + 34} y="5" height="230" width={313 - (4 * 311/5)}></rect>
      </>
    )
  }

  const classes = styles()
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={processData(props.data, props.geo, props.year)}
        margin={{ top: 5, right: 5, bottom: 5, left: -24 }}
        barCategoryGap='10%'
        barGap='0'
        height={200}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <XAxis dataKey="name" xAxisId={1} tickLine={false} axisLine={false} />
        <YAxis axisLine={false} tickLine={false} domain={[0, 70]} tickCount={8} tickFormatter={addPercent}/>
        <Legend 
          content={renderLegend}
        />
        <Customized component={Background} />
        <Bar radius={[2,2,0,0]} xAxisId={1} dataKey="ai" fill="#FF00CC" />
        <Bar radius={[2,2,0,0]} xAxisId={1} dataKey="ap" fill="#FF730C" />
        <Bar radius={[2,2,0,0]} xAxisId={1} dataKey="b" fill="#FFC31A" />
        <Bar radius={[2,2,0,0]} xAxisId={1} dataKey="hi" fill="#7401B1" />
        <Bar radius={[2,2,0,0]} xAxisId={1} dataKey="w" fill="#66CC00" />
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