import React, { useRef, useEffect, useState } from 'react'
import i18n from '@pureartisan/simple-i18n'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Autosuggest from 'react-autosuggest'
import { FiSearch } from 'react-icons/fi'
import { MdClose } from 'react-icons/md'
import { fade, makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import shallow from 'zustand/shallow'

import { FULL_FUNCT_ZOOM_THRESHOLD } from './../../../../constants/map'
import useStore from '../store'
import { DEFAULT_VIEWPORT } from './../../../../constants/map'

/**
 * MenuSearch: Autosuggest search input for header.
 */
const GeocodeSearch = ({ ...props }) => {
  const isLoaded = useRef(false)

  const classes = useStyles()

  const {
    setStoreValues,
    showIntroModal,
    eventGeocodeSearch,
    viewport,
    flyToBounds,
    flyToLatLon,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      showIntroModal: state.showIntroModal,
      eventGeocodeSearch: state.eventGeocodeSearch,
      viewport: state.viewport,
      flyToBounds: state.flyToBounds,
      flyToLatLon: state.flyToLatLon,
    }),
    shallow,
  )

  // console.log('geocodeSearch, ', viewport)

  // Tracking autosuggest suggestions
  const [suggestions, setSuggestions] = useState([])
  const [value, setValue] = useState('')

  // Update the UI according to the context.
  const updateUIWithResult = suggestion => {
    console.log('updateUIWithResult, ', suggestion)
    // If feature has a bounding box, use the
    // bounding box to fly, otherwise treat it
    // like a point.
    if (!!suggestion.suggestion.bbox) {
      flyToBounds([
        [
          suggestion.suggestion.bbox[0],
          suggestion.suggestion.bbox[1],
        ],
        [
          suggestion.suggestion.bbox[2],
          suggestion.suggestion.bbox[3],
        ],
      ])
    } else {
      flyToLatLon(
        suggestion.suggestion.center[1],
        suggestion.suggestion.center[0],
        12,
      )
    }
    // If intro panel is dsplayed, hide it.
    if (!!showIntroModal) {
      setStoreValues({ showIntroModal: false })
    }
    handleClear()
    setStoreValues({
      eventGeocodeSearch: eventGeocodeSearch + 1,
    })
  }

  const getSuggestions = value => {
    // console.log('getSuggestions, ', value)
    const inputValue = encodeURIComponent(value)
    // console.log('inputValue, ', inputValue)
    // If not a very long string, just return empty array.
    if (inputValue.length < 3) {
      return setSuggestions([])
    } else {
      // console.log('making query')
      // Construct query path.
      const path = `https://api.mapbox.com/geocoding/v5/mapbox.places/${inputValue}.json?access_token=${
        process.env.MAPBOX_API_TOKEN
      }&cachebuster=${Math.floor(
        Date.now(),
      )}&autocomplete=true&country=US${
        viewport.zoom > FULL_FUNCT_ZOOM_THRESHOLD
          ? `&proximity=${viewport.longitude},${viewport.latitude}`
          : ``
      }`
      // Get request for autosuggest results.
      fetch(path)
        .then(r => r.json())
        .then(json => {
          setSuggestions(json.features)
        })
    }
  }

  /**
   * Clear the suggestions list.
   */
  const handleClearRequested = () => {
    setSuggestions([])
  }

  /**
   * When item is selected, do something.
   * @param  Object e          Event
   * @param  Object suggestion Object of suggestion nodes
   */
  const handleSelection = (e, suggestion) => {
    // console.log('handleSelection, ', e, suggestion)
    updateUIWithResult(suggestion)
  }

  /**
   * When input value changes, reset value
   * @param  Object e        Event
   * @param  String newValue String value of input
   */
  const handleChange = (e, { newValue }) => {
    // console.log('handleChange, ', e, newValue)
    setValue(newValue)
  }

  const handleBlur = e => {
    // console.log('handleBlur, ', e)
  }

  const handleFetchRequested = ({ value }) => {
    // console.log('handleFetchRequested()')
    getSuggestions(value)
  }

  const getSuggestionValue = suggestion => {
    // console.log('getSuggestionValue(), ', suggestion)
    return suggestion.place_name
  }

  const handleClear = () => {
    // reset value and suggestions
    setValue('')
    setSuggestions([])
  }

  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => {
    // console.log('renderSuggestion, ', suggestion)
    return (
      <div id={suggestion.id} key={suggestion.id}>
        {suggestion.place_name}
      </div>
    )
  }

  const inputProps = {
    value: value, // usually comes from the application state
    onChange: handleChange, // called every time the input value changes
    onBlur: handleBlur, // called when the input loses focus, e.g. when user presses Tab
    type: 'search',
    placeholder: i18n.translate(`SEARCH_PROMPT`),
    'aria-label': i18n.translate(`BTN_SEARCH`),
  }

  return (
    <div
      className={clsx('search-autosuggest', classes.root)}
    >
      <Autosuggest
        suggestions={suggestions}
        onSuggestionSelected={handleSelection}
        onSuggestionsFetchRequested={handleFetchRequested}
        onSuggestionsClearRequested={handleClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <FiSearch
        className={clsx('icon-search', classes.searchIcon)}
        aria-hidden="true"
        style={{ display: !!value ? 'none' : 'block' }}
      />
      <Button
        id="button_search_clear"
        aria-label={i18n.translate(`BTN_SEARCH`)}
        onClick={handleClear}
        className={clsx(
          'button-search-clear',
          classes.clearButton,
        )}
        style={{ display: !!value ? 'flex' : 'none' }}
      >
        <MdClose />
      </Button>
    </div>
  )
}

// Styles for component.
const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '338px',
    border: `1px solid ${theme.extras.variables.colors.lightLightGray}`,
    color: theme.extras.variables.colors.lightGray,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(
        theme.palette.common.white,
        0.25,
      ),
    },
    marginRight: theme.spacing(1),
    marginLeft: 'auto',
    width: '100%',
    height: '40px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: 'auto',
      marginRight: theme.spacing(1),
      width: 'auto',
    },
    '& .react-autosuggest__container': {
      flex: '1 1 80%',
      width: '338px',
      '& .react-autosuggest__input': {
        fontFamily: 'Fira Sans',
        height: '40px',
        width: '100%',
        border: 0,
        padding: '0 34px 0 16px',
        fontSize: '14px',
        color: theme.extras.variables.colors.lightGray,
        '&:focus': {
          border: 0,
          outline: 'none',
        },
        '&::-webkit-search-cancel-button': {
          display: 'none',
        },
      },
      '& .react-autosuggest__suggestions-container': {
        top: '20px',
        zIndex: '3000',
        backgroundColor: 'transparent',
        width: '100%',
        '& .react-autosuggest__suggestions-list': {
          border: '1px solid #ddd',
          backgroundColor: '#fff',
          listStyleType: 'none',
          padding: 0,
          marginBlockStart: '4px',
          '& .react-autosuggest__suggestion': {
            height: 'auto',
            lineHeight: '1.5',
            padding: '8px 8px 8px 16px',
            fontSize: '14px',
            textOverflow: 'ellipsis',
            fontWeight: '300',
            '& > div': {
              width: '100%',
              whiteSpace: 'wrap',
              overflow: 'hidden',
            },
          },
          '& .react-autosuggest__suggestion--highlighted': {
            backgroundColor:
              theme.extras.SDScale.offColors[1],
          },
          '& .react-autosuggest__suggestions-container--open': {
            top: 'auto',
          },
        },
      },
    },
    '& .react-autosuggest__container--open': {
      '& ~ svg.icon-search': {
        // display: 'none',
      },
      '& .button-search-clear': {
        display: 'none',
      },
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '40px',
    minWidth: '40px',
    height: '40px',
    // display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

// container:                'react-autosuggest__container',
//   containerOpen:            'react-autosuggest__container--open',
//   input:                    'react-autosuggest__input',
//   inputOpen:                'react-autosuggest__input--open',
//   inputFocused:             'react-autosuggest__input--focused',
//   suggestionsContainer:     'react-autosuggest__suggestions-container',
//   suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
//   suggestionsList:          'react-autosuggest__suggestions-list',
//   suggestion:               'react-autosuggest__suggestion',
//   suggestionFirst:          'react-autosuggest__suggestion--first',
//   suggestionHighlighted:    'react-autosuggest__suggestion--highlighted',
//   sectionContainer:         'react-autosuggest__section-container',
//   sectionContainerFirst:    'react-autosuggest__section-container--first',
//   sectionTitle:             'react-autosuggest__section-title'

GeocodeSearch.propTypes = {}

export default GeocodeSearch
