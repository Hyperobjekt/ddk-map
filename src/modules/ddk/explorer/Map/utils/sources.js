import { fromJS } from 'immutable'
import { OPTIONS_DEMOGRAPHICS } from './../../../../../constants/map'

/**
 * Builds tilesets URL based on years to load
 * and demographics to load.
 * @param  {[type]} mapboxUser  [description]
 * @param  {[type]} mapboxToken [description]
 * @param  {[type]} dataVersion [description]
 * @param  {[type]} loadYears   [description]
 * @return {[type]}             [description]
 */
const buildTilesetsURL = (
  mapboxUser,
  mapboxToken,
  dataVersion,
  loadYears,
) => {
  const versionStr = dataVersion.replace(/\./g, '-')
  let urlStr = `mapbox://${mapboxUser}.shapes_${versionStr}?access_token=${mapboxToken}`
  const demos = OPTIONS_DEMOGRAPHICS
  loadYears.forEach(year => {
    const yr = year.slice(2, 4)
    demos.forEach(demo => {
      urlStr += `,${mapboxUser}.points_${demo}${yr}_${versionStr}?access_token=${mapboxToken}`
    })
  })
  console.log('completed urlStr to load = ', urlStr)
  return urlStr
}

export const getSources = (
  mapboxUser,
  mapboxToken,
  dataVersion,
  loadYears,
) => {
  return fromJS({
    ddkids: {
      url: buildTilesetsURL(
        mapboxUser,
        mapboxToken,
        dataVersion,
        loadYears,
      ),
      type: 'vector',
    },
  })
}
