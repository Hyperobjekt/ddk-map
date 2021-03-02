import React, { useEffect } from 'react'
import i18n from '@pureartisan/simple-i18n'

import useStore from './../../store'

/**
 * This component manages the language set.
 * If the active language or the language set
 * are updated, it re-initializes the translation object.
 */
const Language = props => {
  console.log('language(), ', props.lang, props.langSet)
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  // Language management.
  const activeLang = useStore(state => state.activeLang)
  const langs = useStore(state => state.langs)
  const setLang = useStore(state => state.setLang)
  const cmsStringsLoaded = useStore(
    state => state.cmsStringsLoaded,
  )

  // Initializes the languages in use.
  const initLang = () => {
    // console.log('initLang')
    i18n.init({
      locale: activeLang,
      languages: langs,
    })
  }
  useEffect(() => {
    // console.log('change to languages. re-initializing.')
    initLang()
  }, [activeLang, langs])

  if (!cmsStringsLoaded) {
    if (!!props.lang) {
      setStoreValues({
        activeLang: props.lang,
        cmsStringsLoaded: true,
      })
    }
    // let lang
    if (!!props.langSet) {
      console.log('setting langset', props.langSet)
      setLang(props.langSet)
    }
    initLang()
  }

  return ''
}

export default Language
