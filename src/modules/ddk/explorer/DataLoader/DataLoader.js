import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import shallow from 'zustand/shallow'

import useStore from './../store'
import { theme } from './../theme'
import { DATA_FILES } from './../../../../constants/map'

// TODO:
// - Error notification
// - Hide animation
// - Why is the percent thing running twice?

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
  const [showContent, setShowContent] = useState(0)
  setTimeout(() => {
    setShowContent(1)
  }, 500)

  const loaderStyles = makeStyles({
    root: {
      position: 'absolute',
      left: 0,
      top: allDataLoaded ? '-100vh' : 0,
      height: '100vh',
      width: '100vw',
      backgroundColor: theme.palette.common.white,
      zIndex: 5000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'top 1000ms ease-in-out 1500ms',
    },
    content: {
      display: !!showContent ? 'block' : 'none', // Hack, hide this for a bit to avoid flashing empty string var.
      width: '90%',
      [theme.breakpoints.up('md')]: {
        width: '60%',
      },
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

  const styles = loaderStyles()

  return (
    <Box className={clsx(styles.root)}>
      <Box className={styles.content}>
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
    }),
    shallow,
  )

  const s3Path = `${process.env.AWS_ENDPOINT}${dataVersion}/`

  // Fetch each file, and update the objects you need to update.
  const files = DATA_FILES
  // Counter for loaded files.
  let loadedCount = 0

  // For testing. Remove when you load actual files.
  // TODO: Comment this out once we are loading actual data.
  // setTimeout(() => {
  //   console.log('timeout')
  //   setStoreValues({
  //     dataLoadedPercent: 20,
  //     allDataLoaded: false,
  //   })
  // }, 1000)
  // setTimeout(() => {
  //   console.log('timeout')
  //   setStoreValues({
  //     dataLoadedPercent: 70,
  //     allDataLoaded: true,
  //   })
  // }, 3000)

  const loadFiles = () => {
    // TODO: uncomment the request below to load files, once we have them.
    // Load each file.
    // Set each file to the store.
    // Update loaded percent.
    // Update overall loading tracking.
    files.forEach((el, i) => {
      const xhr = new XMLHttpRequest()
      const path = s3Path + el.filename + '.' + el.ext
      console.log('path, ', path)
      xhr.open('GET', path, true)
      xhr.onload = function (e) {
        // console.log('loaded, ', xhr)
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Increment counter for loaded files.
            loadedCount++
            console.log(
              'file loaded ',
              el.id,
              (loadedCount / files.length) * 100,
            )
            if (el.type === 'data') {
              let obj = {}
              obj[el.id] = {
                type: el.type,
                data: JSON.parse(xhr.responseText),
              }
              // obj[el.id] = JSON.parse(xhr.responseText)
              setRemoteJson(obj)
              setStoreValues({
                dataLoadedPercent:
                  (loadedCount / files.length) * 100,
                allDataLoaded:
                  loadedCount === files.length
                    ? true
                    : false,
              })
            }
            if (el.type === 'dict') {
              // Merge loaded dictionary values with existing dictionary.
              const strings = JSON.parse(xhr.responseText)
              setLang('en_US', strings)
            }
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
        console.error(xhr.statusText)
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
      loadFiles()
    }
  }, [initialStateSetFromHash])

  return <DataLoaderContent />
}

export default DataLoader
