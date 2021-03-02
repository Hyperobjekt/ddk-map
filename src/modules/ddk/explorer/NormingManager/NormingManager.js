import { useEffect } from 'react'
import shallow from 'zustand/shallow'

import useStore from '../store'

/**
 * Manages norming when auto-norming is called for.
 */
const NormingManager = () => {
  // Go to my location and search
  // If within a metro location, set norming to metro.
  // If not within a metro location and within a state location,
  // set norming to state.
  const {
    doUpdateNorming,
    centerMetro,
    centerState,
    setStoreValues,
    viewport,
  } = useStore(
    state => ({
      doUpdateNorming: state.doUpdateNorming,
      centerMetro: state.centerMetro,
      centerState: state.centerState,
      setStoreValues: state.setStoreValues,
      viewport: state.viewport,
    }),
    shallow,
  )

  const updateNorming = () => {
    // console.log('updateNorming()', centerMetro, centerState)
    if (centerMetro !== 0) {
      setStoreValues({ activeNorm: 'm' })
    } else {
      if (centerState !== 0) {
        setStoreValues({ activeNorm: 's' })
      }
    }
  }

  useEffect(() => {
    // console.log('viewport changed')
    if (doUpdateNorming) {
      updateNorming()
      // setTimeout(updateNorming(), 3000)
      setStoreValues({ doUpdateNorming: false })
    }
  }, [viewport])

  // Returns nothing. Manages norming.
  return ''
}

export default NormingManager
