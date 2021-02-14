import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import Mapbox, { useMapStore } from '@hyperobjekt/mapbox'

import useStore from './../store'
import { getRoundedValue, useDebounce } from './../utils'
import {
  DEFAULT_ROUTE,
  DEFAULT_VIEWPORT,
  OPTIONS_MAP,
  ROUTE_VIEW,
  ROUTE_ACTIVE_SHAPE,
  ROUTE_ACTIVE_YEAR,
  ROUTE_LOAD_YEARS,
  ROUTE_ACTIVE_POINTS,
  ROUTE_METRIC,
  ROUTE_NORM,
  ROUTE_DATA_VERSION,
} from './../../../../constants/map'
import { validateRouteOption } from './utils/utils'

/**
 * Get a route parameters object based on the string
 * @param {string} path
 * @returns {object} e.g. { region: 'counties', metric: 'avg', ... }
 */
export const getParamsFromPathname = (path, routeVars) => {
  // console.log('getParamsFromPathname()')
  // strip starting "#" and "/" chars
  const route = path.replace(/^#\/+/g, '')
  // Construct object from hash
  return route.split('/').reduce(
    (acc, curr, i) => ({
      ...acc,
      [routeVars[i]]:
        ['zoom', 'lat', 'lng'].indexOf(routeVars[i]) > -1
          ? parseFloat(curr)
          : curr,
    }),
    {},
  )
}

export const getStrippedRoute = route =>
  route.replace(/^#[/]+/g, '').replace(/\/$/g, '')

export const isEmptyRoute = route =>
  getStrippedRoute(route).length === 0

/**
 * Verify that the route value is valid.
 * @param  {String} route
 * @param  {String} value
 * @return {Boolean}
 */
const isRouteOptionValid = (item, value) => {
  // console.log(
  //   'isRouteOptionValid, ',
  //   OPTIONS_MAP,
  //   item,
  //   value,
  // )
  const optionsItem = OPTIONS_MAP[item]
  const isValid = validateRouteOption(optionsItem, value)
  // if (!isValid) {
  //   console.log('invalid hash item: ', optionsItem, value)
  // }
  return isValid
}

const isLatLngValid = (lat, lng) => {
  // console.log('isLatLngValid()')
  // Make sure they're inside the bounds.
  if (!lat && !lng) return true
  lat = Number(lat)
  lng = Number(lng)
  let isValid = true
  if (
    lat < DEFAULT_VIEWPORT.maxBounds[0][1] ||
    lat > DEFAULT_VIEWPORT.maxBounds[1][1]
  ) {
    // console.log('lat out of bounds')
    isValid = false
  }
  if (
    lng < DEFAULT_VIEWPORT.maxBounds[0][0] ||
    lng > DEFAULT_VIEWPORT.maxBounds[1][0]
  ) {
    // console.log('lng out of bounds')
    isValid = false
  }
  return isValid
}

const isZoomValid = zoom => {
  // console.log('isZoomValid, ', zoom)
  if (!zoom) return true
  // Make sure it's within the zoom min and max.
  return (
    zoom > DEFAULT_VIEWPORT.minZoom &&
    zoom < DEFAULT_VIEWPORT.maxZoom
  )
}

/**
 * Validates all route params
 * @param  {Object}  params [description]
 * @return {Boolean}        [description]
 */
const isRouteValid = params => {
  // console.log('isRouteValid(), ', params)
  const enumerableRoutes = [
    ROUTE_VIEW,
    ROUTE_ACTIVE_SHAPE,
    ROUTE_ACTIVE_YEAR,
    ROUTE_LOAD_YEARS,
    ROUTE_ACTIVE_POINTS,
    ROUTE_METRIC,
    ROUTE_NORM,
    ROUTE_DATA_VERSION,
  ] // routes with discrete options

  let isValid = true
  if (
    !enumerableRoutes.every(el =>
      isRouteOptionValid(el, params[el]),
    ) ||
    !isLatLngValid(params.lat, params.lng) ||
    !isZoomValid(params.zoom)
  ) {
    isValid = false
  }
  console.log('hash is valid = ', isValid)
  return isValid
}

/**
 * Constructs a comma-delineated string from array of active layers.
 * @param  {Array} activeLayers
 * @return {String}
 */
// const getLayersString = activeLayers => {
//   // console.log('getLayersString(), ', activeLayers)
//   return activeLayers.toString()
// }

const RouteManager = props => {
  // console.log('RouteManager!!!!!')
  // track if initial route has loaded
  const isLoaded = useRef(false)
  // Values from store.
  const {
    activeView,
    activeShape,
    activeYear,
    loadYears,
    activePointLayers,
    activeMetric,
    activeNorm,
    dataVersion,
    setStoreValues,
    viewport,
    setViewport,
    shareHash,
  } = useStore(
    state => ({
      activeView: state.activeView,
      activeShape: state.activeShape,
      activeYear: state.activeYear,
      loadYears: state.loadYears,
      activePointLayers: state.activePointLayers,
      activeMetric: state.activeMetric,
      activeNorm: state.activeNorm,
      dataVersion: state.dataVersion,
      setStoreValues: state.setStoreValues,
      viewport: state.viewport,
      setViewport: state.setViewport,
      shareHash: state.shareHash,
    }),
    shallow,
  )

  const setMapViewport = useMapStore(
    state => state.setViewport,
  )

  /**
   * Returns a hash based on state
   * @return {String} [description]
   */
  const getHashFromState = () => {
    const hash = `${activeView}/${activeShape}/${activeYear}/${loadYears.toString()}/${activePointLayers.toString()}/${activeMetric}/${activeNorm}/${dataVersion}/${getRoundedValue(
      viewport.latitude,
      4,
    )}/${getRoundedValue(
      viewport.longitude,
      4,
    )}/${getRoundedValue(viewport.zoom, 2)}/`
    return hash
  }

  // get the route params based on current view
  const route = getHashFromState()
  // debounce the route so it updates every 1 second max
  const debouncedRoute = useDebounce(route, 500)

  /**
   * Sets state from route params
   * @param {[type]} params [description]
   */
  const setStateFromHash = params => {
    // console.log('setStateFromHash(), ', params)
    if (params.hasOwnProperty(ROUTE_VIEW)) {
      setStoreValues({ activeView: params[ROUTE_VIEW] })
    }
    if (params.hasOwnProperty(ROUTE_ACTIVE_SHAPE)) {
      setStoreValues({
        activeShape: Number(params[ROUTE_ACTIVE_SHAPE]),
      })
    }
    if (params.hasOwnProperty(ROUTE_ACTIVE_YEAR)) {
      setStoreValues({
        activeYear: params[ROUTE_ACTIVE_YEAR],
      })
    }
    if (params.hasOwnProperty(ROUTE_LOAD_YEARS)) {
      setStoreValues({
        loadYears: params[ROUTE_LOAD_YEARS].split(','),
      })
    }
    if (params.hasOwnProperty(ROUTE_ACTIVE_POINTS)) {
      // If empty string, set empty array.
      if (params[ROUTE_ACTIVE_POINTS] === '') {
        setStoreValues({
          activePointLayers: [],
        })
      } else {
        setStoreValues({
          activePointLayers: params[
            ROUTE_ACTIVE_POINTS
          ].split(','),
        })
      }
    }
    if (params.hasOwnProperty(ROUTE_METRIC)) {
      setStoreValues({ activeMetric: params[ROUTE_METRIC] })
    }
    if (params.hasOwnProperty(ROUTE_NORM)) {
      setStoreValues({ activeNorm: params[ROUTE_NORM] })
    }
    if (params.hasOwnProperty(ROUTE_DATA_VERSION)) {
      setStoreValues({
        dataVersion: params[ROUTE_DATA_VERSION],
      })
    }

    let resetViewport = false
    if (!!params.lat && !!params.lng) {
      viewport.latitude = Number(params.lat)
      viewport.longitude = Number(params.lng)
      resetViewport = true
    }
    if (!!params.zoom) {
      viewport.zoom = Number(params.zoom)
      resetViewport = true
    }
    if (!!resetViewport) {
      // console.log('resetting viewport')
      setViewport(viewport)
      setMapViewport(viewport)
    }
    setStoreValues({ initialStateSetFromHash: true })
  }

  useEffect(() => {
    if (isLoaded.current) {
      // When hash changes, if route is valid, update route for sharing.
      window.addEventListener('hashchange', () => {
        // console.log('hashchange')
        const path = window.location.hash
        // Construct params object from hash.
        const params = getParamsFromPathname(
          path,
          props.routeSet,
        )
        if (
          !isEmptyRoute(path) &&
          isRouteValid(params, props.routeSet) &&
          path !== shareHash
        ) {
          // console.log('updating hash')
          setStoreValues({
            shareHash: window.location.hash,
          })
        }
      })
    }
  }, [isLoaded.current])

  // update the hash when debounced route changes
  useEffect(() => {
    // only change the hash if the initial route has loaded
    if (isLoaded.current) {
      // window.location.hash = '#/' + debouncedRoute
      // console.log('Route change')
      window.history.replaceState(
        { hash: '#/' + debouncedRoute },
        'Explorer state update',
        window.location.origin +
          window.location.pathname +
          '#/' +
          debouncedRoute,
      )
      localStorage.setItem(
        'ddk_hash',
        '#/' + debouncedRoute,
      )
      setStoreValues({ shareHash: '#/' + debouncedRoute })
    }
  }, [debouncedRoute])

  // load the route when the application mounts
  useEffect(() => {
    async function loadRoute() {
      // console.log('loadRoute')
      isLoaded.current = true
      // Get path.
      const path = window.location.hash
      // Construct params object from hash.
      const params = getParamsFromPathname(
        path,
        props.routeSet,
      )
      const localStorageHash = localStorage.getItem(
        'ddk_hash',
      )
      if (
        !isEmptyRoute(path) &&
        isRouteValid(params, props.routeSet)
      ) {
        // Update state based on params
        // console.log(
        //   'hash is valid, setting state from hash.',
        // )
        setStateFromHash(params)
      } else if (!!localStorageHash) {
        if (localStorageHash.length > 0) {
          // console.log('localStorage exists')
          const lsparams = getParamsFromPathname(
            localStorageHash,
            props.routeSet,
          )
          if (isRouteValid(lsparams, props.routeSet)) {
            // console.log(
            //   'localStorage is valid, setting state from localStorage',
            // )
            setStateFromHash(lsparams)
          } else {
            // If a hash was passed in, but there is
            // no valid hash in path or localStorage,
            // set the hash from the default route and proceed.
            setStateFromHash(DEFAULT_ROUTE)
            setStoreValues({
              showIntroModal: true,
              initialStateSetFromHash: true,
            })
          }
        }
      }
      if (isEmptyRoute(path) && !localStorageHash) {
        // console.log('showing intro modal')
        setStoreValues({
          showIntroModal: true,
          initialStateSetFromHash: true,
        })
      }
    }
    loadRoute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // this component doesn't render anything
  return null
}

RouteManager.propTypes = {
  routeSet: PropTypes.array, // Constants listing params and allowable options.
}

export default RouteManager
