import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import { isMobile } from 'react-device-detect'
import { ThemeProvider } from '@material-ui/core/styles'
import * as merge from 'deepmerge'

import Layout from '../Layout/Layout'
import { DataLoader } from './../DataLoader'
import RouteManager from './../RouteManager/RouteManager'
import { Tracking } from './../Tracking'

import useStore from './../store'
import { theme } from './../theme'
import { langSet } from './../../../../constants/lang'
import { ROUTE_SET } from './../../../../constants/map'

import 'mapbox-gl/dist/mapbox-gl.css'
import 'fontsource-roboto' // TODO: Remove when our own fonts are added.

/**
 * App is the base component for the explorer.
 * @param Object props Any props passed into the component
 */
const App = props => {
  console.log('App, theme: ', theme)

  const BREAKPOINTS = theme.breakpoints.keys
  const BREAKPOINTS_OBJ = theme.breakpoints.values

  const setStoreValues = useStore(
    state => state.setStoreValues,
  )

  // Language management.
  const activeLang = useStore(state => state.activeLang)
  if (!!props.lang) {
    setStoreValues({
      activeLang: props.lang,
    })
  }
  let lang
  if (!!props.langSet) {
    lang = merge(langSet, props.langSet)
  }
  i18n.init({
    locale: activeLang,
    languages: {
      en_US: lang['en_US'],
    },
  })

  // Updates menu state and calls handler in parent component.
  // if (!!props.toggleMenu) {
  //   // console.log(
  //   //   'props.toggleMenu exists, ',
  //   //   props.toggleMenu,
  //   // )
  //   setStoreValues({ handleToggleMenu: props.toggleMenu })
  // }

  const setBrowserWidthAndBreakpoint = () => {
    // console.log('setBrowserWidthAndBreakpoint')
    let breakpoint
    BREAKPOINTS.forEach((el, i) => {
      if (
        window.innerWidth >= BREAKPOINTS_OBJ[el] &&
        (!BREAKPOINTS[i + 1] ||
          window.innerWidth <
            BREAKPOINTS_OBJ[BREAKPOINTS[i + 1]])
      ) {
        breakpoint = el
      }
    })
    // console.log('breakpoint is, ', breakpoint)
    setStoreValues({
      breakpoint: breakpoint,
      browserWidth: window.innerWidth,
      interactionsMobile: !!(
        isMobile ||
        breakpoint === 'xs' ||
        breakpoint === 'sm' ||
        breakpoint === 'md'
      ),
    })
  }

  useEffect(() => {
    // console.log('useEffect')
    setBrowserWidthAndBreakpoint()
    window.addEventListener('resize', () => {
      // console.log('resize, ', window.innerWidth)
      setBrowserWidthAndBreakpoint()
    })
  }, [])

  // const setEventError = useStore(
  //   state => state.setEventError,
  // )
  useEffect(() => {
    window.addEventListener('error', e => {
      setStoreValues({
        eventError:
          e.message +
          ', in ' +
          e.filename +
          ', ' +
          e.lineno +
          ':' +
          e.colno +
          ', at ' +
          e.timeStamp +
          '.',
      })
    })
    // Test error logging by throwing an error after map loads.
    // setTimeout(() => {
    //   console.log('trial var, ', mooMooMoo)
    // }, 3000)
  }, [])

  useEffect(() => {
    window.DDK = (function () {
      // stores the browser name and version for reporting
      var browser = (function () {
        var ua = navigator.userAgent,
          tem,
          M =
            ua.match(
              /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i,
            ) || []
        if (/trident/i.test(M[1])) {
          tem = /\brv[ :]+(\d+)/g.exec(ua) || []
          return { name: 'IE', version: tem[1] || '' }
        }
        if (M[1] === 'Chrome') {
          tem = ua.match(/\b(OPR|Edge)\/(\d+)/)
          if (tem != null)
            return {
              name: tem[1].replace('OPR', 'Opera'),
              version: tem[2],
            }
        }
        M = M[2]
          ? [M[1], M[2]]
          : [navigator.appName, navigator.appVersion, '-?']
        if ((tem = ua.match(/version\/(\d+)/i)) != null)
          M.splice(1, 1, tem[1])
        return { name: M[0], version: M[1] }
      })()

      // returns true if webgl is supported
      function webgl_support() {
        try {
          var canvas = document.createElement('canvas')
          return (
            !!window.WebGLRenderingContext &&
            (canvas.getContext('webgl') ||
              canvas.getContext('experimental-webgl'))
          )
        } catch (e) {
          return false
        }
      }

      // returns true if the browser is internet explorer
      function isIE() {
        var ua = window.navigator.userAgent
        var msie = ua.indexOf('MSIE ')
        if (msie > 0) {
          // IE 10 or older => return version number
          return parseInt(
            ua.substring(msie + 5, ua.indexOf('.', msie)),
            10,
          )
        }
        var trident = ua.indexOf('Trident/')
        if (trident > 0) {
          // IE 11 => return version number
          var rv = ua.indexOf('rv:')
          return parseInt(
            ua.substring(rv + 3, ua.indexOf('.', rv)),
            10,
          )
        }
        return false
      }

      // returns true if the browser is not supported
      function unsupportedBrowser() {
        return !webgl_support() || isIE()
      }
    })()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <DataLoader />
      <RouteManager routeSet={ROUTE_SET} />
      <Tracking />
      <Layout></Layout>
    </ThemeProvider>
  )
}

App.propTypes = {
  lang: PropTypes.string,
  langSet: PropTypes.object,
  toggleMenu: PropTypes.func,
}

App.defaultProps = {
  lang: 'en_US',
  langSet: {},
  toggleMenu: () => {},
}

export default App
