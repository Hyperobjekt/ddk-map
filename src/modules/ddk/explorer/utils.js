import i18n from '@pureartisan/simple-i18n'
import { useEffect, useRef, useState } from 'react'

import useStore from './store.js'
import {
  BOUNDS,
  DEFAULT_ROUTE,
} from './../../../constants/map'

export const getActiveArray = index => {
  const arr = [0, 0, 0, 0, 0]
  arr[Math.round(index)] = 1
  return arr
}

/**
 * Loads map features based on a string of locations
 * @param {string} locations locations formed as `{id},{lat},{lon}` separated by a `+`
 * @returns {Promise<Array<Feature>>}
 */
export const loadFeaturesFromRoute = locations =>
  loadFeaturesFromCoords(parseLocationsString(locations))

/**
 * Loads map features from location parameter
 * @param {*} params
 * @returns {Promise<Array<Feature>>}
 */
export const loadFeaturesFromRouteParams = params =>
  params.locations
    ? loadFeaturesFromRoute(params.locations)
    : Promise.resolve([])

/**
 * Returns the feature with an id property that matches the
 * provided ID
 * @param {string} id
 * @param {FeatureCollection} collection
 * @returns {Feature}
 */
const getFeatureFromCollection = (id, collection) => {
  const feature = collection.find(
    f => f.properties.id === id,
  )
  if (!feature) {
    throw new Error(
      'feature ' + id + ' not found from tilequery API',
    )
  }
  return feature
}

/**
 * Converts string to title case
 * @param  String str String input
 * @return String
 */
export const toTitleCase = str => {
  str = str.toLowerCase().split(' ')
  for (var i = 0; i < str.length; i++) {
    str[i] =
      str[i].charAt(0).toUpperCase() + str[i].slice(1)
  }
  return str.join(' ')
}

/**
 * Returns a value rounded to the indicated number of decimals
 * @param  String value     Number or string, value passed to function
 * @param  Number decimals  Number of decimals to round to
 * @param  Boolan padZeroes If true, pad with extra zeroes to fill empty decimal spots
 * @return Number
 */
export const getRoundedValue = (
  value,
  decimals,
  padZeroes = false,
  isCurrency = false,
  isPercent = false,
) => {
  // console.log(
  //   'getRoundedValue(), ',
  //   value,
  //   decimals,
  //   isCurrency,
  // )
  const type = typeof value
  if (!!isPercent) {
    value = value * 100
  }
  let fixed = null
  if (type === 'string') {
    if (padZeroes) {
      fixed = parseFloat(value)
        .toFixed(decimals)
        .toLocaleString()
    } else {
      fixed = +parseFloat(value)
        .toFixed(decimals)
        .toLocaleString()
    }
  } else {
    if (padZeroes) {
      fixed = Number(
        value.toFixed(decimals),
      ).toLocaleString()
    } else {
      fixed = Number(
        +value.toFixed(decimals),
      ).toLocaleString()
    }
  }
  if (!!isCurrency) {
    fixed = '$' + fixed
  }
  if (!!isPercent) {
    fixed = fixed + '%'
  }
  return fixed
}

/**
 * Calculates hash position (percent from left/0 based on min/max)
 * @param  Number value Value of metric
 * @param  Number min   Minimum of range for metric
 * @param  Number max   Maximum of range for metric
 * @return {[type]}       [description]
 */
export const getHashLeft = (value, min, max) => {
  return ((value - min) / (max - min)) * 100
}

/**
 * Filters an array of metrics, returns an object of metric data
 * @param  String metric string for metric
 * @return {[type]}        [description]
 */
export const getMetric = (metric, metrics) => {
  // console.log('getMetric, ', metric)
  const metricData = metrics.find(m => {
    return m.id === metric
  })
  if (!!metricData) {
    return metricData
  } else {
    console.error(`Unable to get metric ${metric}.`)
  }
}

/**
 * Returns string placeholder based on quintile provided
 * @param  Number quintile Quintile 0 - 4
 * @return String          String referncing translation file constant
 */
export const getQuintileDesc = quintile => {
  switch (true) {
    case quintile === 0: {
      return 'FIRST'
    }
    case quintile === 1: {
      return 'SECOND'
    }
    case quintile === 2: {
      return 'THIRD'
    }
    case quintile === 3: {
      return 'FOURTH'
    }
    case quintile === 4: {
      return 'FIFTH'
    }
  }
}

/**
 * Gets a property from a feature, returns null if not found
 * @param {Feature} feature GeoJSON feature
 * @param {string} propName property name to grab
 */
export const getFeatureProperty = (feature, propName) => {
  if (
    feature &&
    feature.properties &&
    feature.properties[propName] !== -999
  ) {
    return feature.properties[propName]
  }
  return null
}

// Hook
export const usePrevious = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef()

  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}

// https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
export const useDebounce = (value, delay) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(
    value,
  )

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler)
      }
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [value, delay],
  )

  return debouncedValue
}
