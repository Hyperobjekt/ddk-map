import { fromJS } from 'immutable'

export const getPolygonLines = (
  type,
  context,
  activeLayers,
) => {
  console.log('getPolygonLines(), ', context)
  const isVisible = true
  // activeLayers[
  //   UNTD_LAYERS.findIndex(el => el.id === type)
  // ] === 1
  return fromJS({
    id: `${type}Lines`,
    source: type,
    type: 'line',
    layout: {
      visibility: !!isVisible ? 'visible' : 'none',
    },
    interactive: true,
    paint: {
      'line-color': [
        'case',
        ['==', type, 'states'],
        'red',
        ['==', type, 'metros'],
        'blue',
        ['==', type, 'tracts'],
        'yellow',
        'orange',
      ],
      // 'line-color': polygonColors.find(
      //   el => el.type === type,
      // ).color,
      'line-width': 2,
    },
    // filter: getFilter(
    //   type,
    //   context.metric,
    //   context.activeQuintiles,
    // ),
  })
}

export const getPolygonShapes = (
  type,
  context,
  // activeLayers,
) => {
  console.log(
    'getPolygonShapes(), ',
    type,
    context,
    // activeLayers,
  )
  const isVisible = true
  // activeLayers[
  //   UNTD_LAYERS.findIndex(el => el.id === type)
  // ] === 1
  // console.log('isVisible, ', isVisible)
  return fromJS({
    id: `${type}Shapes`,
    source: type,
    type: 'fill',
    layout: {
      visibility: !!isVisible ? 'visible' : 'none',
    },
    interactive: true,
    paint: {
      'fill-color': [
        'case',
        ['==', type, 'states'],
        'red',
        ['==', type, 'metros'],
        'blue',
        ['==', type, 'tracts'],
        'yellow',
        'orange',
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.4,
        0.6,
      ],
    },
  })
}

let z = 20

export const getPolygonLayers = (
  type,
  context,
  activeLayers,
) => {
  // console.log('getRedlineLayers', context)
  z = z + 2
  return [
    {
      z: z,
      style: getPolygonShapes(type, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Shapes`,
    },
    {
      z: z + 1,
      style: getPolygonLines(type, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Lines`,
    },
  ]
}

export const getLayers = (
  sources,
  context,
  // activeLayers,
  // activePointTypes,
  // activePointTypesKey,
) => {
  console.log('getLayers', sources, context)
  const layers = []
  layers.push(...getPolygonLayers('states', context))
  layers.push(...getPolygonLayers('metros', context))
  layers.push(...getPolygonLayers('tracts', context))
  // layers.push(
  //   ...getPointLayers(
  //     'points',
  //     context,
  //     activePointTypes,
  //     activePointTypesKey,
  //   ),
  // )
  return layers
}
