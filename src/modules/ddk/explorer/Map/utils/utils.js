export const getMouseXY = (element, event) => {
  console.log('getMouseXY', element, event)
}

/**
 * Queries a provided map to get features at that point.
 * @param  {[type]} mapRef       [description]
 * @param  {[type]} point        [description]
 * @param  {[type]} layersObject [description]
 * @return {[type]}              [description]
 */
export const getFeaturesAtPoint = (
  mapRef,
  point,
  layersObject,
) => {
  return mapRef.queryRenderedFeatures(
    [point[0], point[1]],
    {
      layers: layersObject,
    },
  )
}
