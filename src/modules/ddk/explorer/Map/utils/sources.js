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
  versionStr,
  year,
) => {
  let urlStr = `mapbox://`
  const demos = OPTIONS_DEMOGRAPHICS
  // loadYears.forEach(year => {
  // const yr = year.slice(2, 4)
  demos.forEach(demo => {
    urlStr += `${mapboxUser}.points_${demo}${year}_${versionStr},`
  })
  // })
  console.log('completed urlStr to load = ', urlStr)
  return urlStr + `?access_token=${mapboxToken}`
}

export const getSources = (
  mapboxUser,
  mapboxToken,
  dataVersion,
  loadYears,
) => {
  const versionStr = dataVersion.replace(/\./g, '-')
  const obj = {
    ddkids_shapes: {
      url: `mapbox://${mapboxUser}.shapes_${versionStr}?access_token=${mapboxToken}`,
      type: 'vector',
    },
  }
  loadYears.forEach(year => {
    obj[`ddkids_points_${year}`] = {
      url: buildTilesetsURL(
        mapboxUser,
        mapboxToken,
        versionStr,
        year,
      ),
      type: 'vector',
    }
  })
  return fromJS(obj)
}
