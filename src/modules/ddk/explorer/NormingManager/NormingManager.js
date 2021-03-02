import { useEffect } from 'react'

import useStore from '../store'

/**
 * Manages norming when auto-norming is called for.
 */
const NormingManager = () => {
  // Go to my location and search
  // If within a metro location, set norming to metro.
  // If not within a metro location and within a state location,
  // set norming to state.
  const doUpdateNorming = useStore(
    state => state.doUpdateNorming,
  )

  const updateNorming = () => {
    console.log('updateNorming()')
  }

  useEffect(() => {
    console.log('doUpdateNorming changed')
  }, [doUpdateNorming])

  // Returns nothing. Manages norming.
  return ''
}

export default NormingManager
