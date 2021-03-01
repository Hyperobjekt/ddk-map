import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import shallow from 'zustand/shallow'
import Papa from 'papaparse'

import useStore from './../store'
import { theme } from './../theme'
import { DATA_FILES } from './../../../../constants/map'

// TODO:
// - Error notification if data loading fails.

const useLoaderStyles = makeStyles({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100vh',
    width: '100vw',
    backgroundColor: theme.palette.common.white,
    zIndex: 5000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'top 1000ms ease-in-out',
  },
  dataLoaded: {
    top: `-100vh`,
  },
  content: {
    display: 'block',
    width: '90%',
    [theme.breakpoints.up('md')]: {
      width: '60%',
    },
  },
  hideContent: {
    display: 'none',
  },
  '@global': {
    '@keyframes fadeIn': {
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    },
  },
  dots: {
    animationName: 'fadeIn',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
  },
})

const DataLoaderContent = ({ ...props }) => {
  // console.log('DataLoaderContent, ', variables)
  // Values from store.
  const { dataLoadedPercent, allDataLoaded } = useStore(
    state => ({
      dataLoadedPercent: state.dataLoadedPercent,
      allDataLoaded: state.allDataLoaded,
    }),
    shallow,
  )

  // Hack, hide this for a bit to avoid flashing empty string var.
  const [showContent, setShowContent] = useState(false)
  setTimeout(() => {
    setShowContent(true)
  }, 500)

  const styles = useLoaderStyles()

  return (
    <Box
      className={clsx(styles.root, {
        [styles.dataLoaded]: allDataLoaded,
      })}
    >
      {/* hideContent Hack, hide this for a bit to avoid flashing empty string var. */}
      <Box
        className={clsx(styles.content, {
          [styles.hideContent]: !showContent,
        })}
      >
        <Typography variant="h4" gutterBottom>
          {i18n.translate(`MAP_LOADING_DATA`)}
          <Box component="span" className={styles.dots}>
            .
          </Box>
          <Box
            component="span"
            style={{
              animationDelay: '200ms',
            }}
            className={clsx(styles.dots)}
          >
            .
          </Box>
          <Box
            component="span"
            style={{
              animationDelay: '400ms',
            }}
            className={clsx(styles.dots)}
          >
            .
          </Box>
        </Typography>
        <LinearProgress
          variant="determinate"
          value={dataLoadedPercent}
        />
      </Box>
    </Box>
  )
}

const DataLoader = ({ ...props }) => {
  // console.log("Hey, it's the DataLoader!!!!!!")
  // Values from store.
  const {
    initialStateSetFromHash,
    setStoreValues,
    setRemoteJson,
    dataVersion,
    setLang,
    activeYear,
    // remoteJson,
  } = useStore(
    state => ({
      initialStateSetFromHash:
        state.initialStateSetFromHash,
      // Generic store value setter.
      setStoreValues: state.setStoreValues,
      // Special setter to merge loaded json into existing obj.
      setRemoteJson: state.setRemoteJson,
      dataVersion: state.dataVersion,
      setLang: state.setLang,
      activeYear: state.activeYear,
      // remoteJson: state.remoteJson,
    }),
    shallow,
  )

  const s3Path = `${process.env.AWS_ENDPOINT}${dataVersion}/gzip/`

  // Fetch each file, and update the objects you need to update.
  const files = DATA_FILES
  // Counter for loaded files.
  let loadedCount = 0
  // Process a downloaded file outside of synch request.
  const processFile = (el, response) => {
    if (el.type === 'data' && el.ext === 'json') {
      // console.log('parsing data.')
      let obj = {}
      obj[el.id] = {
        type: el.type,
        data: JSON.parse(response),
      }
      // obj[el.id] = JSON.parse(xhr.responseText)
      // console.log('json file parsed, ', el.id)
      setRemoteJson(obj)
    }
    // Parse CSV into JSON before sticking it into the store.
    if (el.type === 'data' && el.ext === 'csv') {
      // console.log('parsing csv.')
      let obj = {}
      // Parse asynchronously using papaparse to prevent UI from locking up.
      const parsed = Papa.parse(response, {
        header: true,
        worker: true,
        complete: function (results) {
          // console.log('file parsed, ', el.id, results)
          obj[el.id] = {
            type: el.type,
            data: results.data,
          }
          // console.log('csv file parsed, ', el.id)
          setRemoteJson(obj)
        },
      })
    }
    if (el.type === 'dict') {
      // Merge loaded dictionary values with existing dictionary.
      const strings = { en_US: JSON.parse(response) }
      // console.log('lang file parsed, ', el.id)
      // console.log('strings,', strings)
      setLang(strings)
    }
    // console.log('remoteJSON, ', remoteJson)
  }

  const loadYearFiles = () => {
    // console.log('loadYearFiles')
    // Load each file.
    // Set each file to the store.
    // Update loaded percent.
    // Update overall loading tracking.
    const yearFiles = files.filter(el => {
      return el.yearDependent === 1
    })
    yearFiles.forEach((el, i) => {
      const xhr = new XMLHttpRequest()
      const path = `${s3Path}${el.filename}${
        !!el.yearDependent ? activeYear : ''
      }.${el.ext}.gz`
      // console.log('path, ', path)
      xhr.open('GET', path, true)
      xhr.onload = function (e) {
        // console.log('loaded, ', xhr)
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // console.log(`year file ${el.id} loaded.`)
            processFile(el, xhr.responseText)
          } else {
            // console.error(xhr.statusText)
            // Flag something failed.
            setStoreValues({
              dataLoaderFailed: true,
            })
          }
        }
      }
      xhr.onerror = function (e) {
        // console.error(xhr.statusText)
        // Flag something failed.
        setStoreValues({
          dataLoaderFailed: true,
        })
      }
      xhr.send(null)
    })
  }

  const loadFiles = () => {
    // console.log('loadFiles')
    // Load each file.
    // Set each file to the store.
    // Update loaded percent.
    // Update overall loading tracking.
    files.forEach((el, i) => {
      const xhr = new XMLHttpRequest()
      const path = `${s3Path}${el.filename}${
        !!el.yearDependent ? activeYear : ''
      }.${el.ext}.gz`
      // console.log('path, ', path)
      xhr.open('GET', path, true)
      xhr.onload = function (e) {
        // console.log('loaded, ', xhr)
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Increment counter for loaded files.
            loadedCount++
            // console.log(
            //   'file loaded ',
            //   el.id,
            //   (loadedCount / files.length) * 100,
            // )
            setStoreValues({
              dataLoadedPercent:
                (loadedCount / files.length) * 100,
              allDataLoaded:
                loadedCount === files.length ? true : false,
            })
            processFile(el, xhr.responseText)
          } else {
            // console.error(xhr.statusText)
            // Flag something failed.
            setStoreValues({
              dataLoaderFailed: true,
            })
          }
        }
      }
      xhr.onerror = function (e) {
        // console.error(xhr.statusText)
        // Flag something failed.
        setStoreValues({
          dataLoaderFailed: true,
        })
      }
      xhr.send(null)
    })
  }

  useEffect(() => {
    if (!initialStateSetFromHash) {
      return
    } else {
      // console.log('initial state set.')
      // console.log('activeYear, ', activeYear)
      loadFiles()
    }
  }, [initialStateSetFromHash])

  useEffect(() => {
    if (!initialStateSetFromHash) {
      return
    } else {
      // console.log('activeYear, ', activeYear)
      loadYearFiles()
    }
  }, [activeYear])

  return <DataLoaderContent />
}

export default DataLoader
