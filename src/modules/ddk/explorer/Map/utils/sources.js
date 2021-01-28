import { fromJS } from 'immutable'
import { OPTIONS_DEMOGRAPHICS } from './../../../../../constants/map'

/**
 * Return object of map sources, one for each
 * point tileset, and one for the shapes tileset.
 * @param  {String} mapboxUser  Mapbox username
 * @param  {String} mapboxToken Mapbox api token
 * @param  {String} dataVersion Data version indicated for app to load and use
 * @param  {String} loadYears   Years of data to load for potential use
 * @return {Object}
 */
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
    OPTIONS_DEMOGRAPHICS.forEach(demo => {
      obj[`ddkids_points_${demo}${year}`] = {
        url: `mapbox://${mapboxUser}.points_${demo}${year}_${versionStr}?access_token=${mapboxToken}`,
        type: 'vector',
      }
    })
  })
  // console.log('source object: ', obj)
  return fromJS(obj)
}
