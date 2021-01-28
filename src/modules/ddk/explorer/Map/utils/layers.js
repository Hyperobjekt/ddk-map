import { fromJS } from 'immutable'

import {
  POINT_TYPES,
  OPTIONS_ACTIVE_POINTS,
} from './../../../../../constants/map'

let z = 50
const dotSize = 2

const getDemographic = layer => {
  return layer.substring(0, layer.length - 2)
}

export const getPoints = (source, layer, context) => {
  console.log('getPoints, ', source, context)
  // const isVisible =
  //   activeLayers[
  //     UNTD_LAYERS.findIndex(el => el.id === type)
  //   ] === 1
  // console.log('isVisible, ', isVisible)
  const demographic = getDemographic(layer)
  console.log(
    'demographic, ',
    demographic,
    POINT_TYPES.find(el => el.id === demographic),
  )
  return fromJS({
    id: `${source}-${layer}-points`,
    source: source,
    'source-layer': layer,
    type: 'circle', //
    layout: {
      visibility: 'visible', // isVisible ? 'visible' : 'none',
    },
    interactive: false,
    paint: {
      'circle-color': POINT_TYPES.find(
        el => el.id === demographic,
      ).color,
      'circle-opacity': 1,
      // If it's 'ai', make larger, else standard size.
      'circle-radius': [
        'case',
        ['in', ['get', 'type'], 'ai'],
        4, // Hover color
        2, // Normal color
      ],
      // 'circle-radius': [
      //   'interpolate',
      //   ['linear'],
      //   ['zoom'],
      //   11.99999, // At or below zoom level of 11.999, smaller school dots.
      //   [
      //     'case',
      //     ['==', ['feature-state', 'hover'], true],
      //     7,
      //     5,
      //   ],
      //   12, // At or above zoom level of 12, larger school dots.
      //   [
      //     'case',
      //     ['==', ['feature-state', 'hover'], true],
      //     16,
      //     12,
      //   ],
      // ],
      // 'circle-stroke-opacity': 1,
      // 'circle-stroke-color': [
      //   'case',
      //   ['boolean', ['feature-state', 'hover'], false],
      //   '#fff', // Hover color
      //   '#fff', // Normal color
      // ],
      // 'circle-stroke-width': [
      //   'interpolate',
      //   ['linear'],
      //   ['zoom'],
      //   4,
      //   0.25,
      //   6,
      //   0.5, // 1.5,
      //   14,
      //   1,
      // ],
    },
    // filter: [
    //   '==',
    //   [
    //     'at',
    //     [
    //       'index-of',
    //       ['get', 'variable'],
    //       ['literal', activePointTypesKey],
    //     ],
    //     ['literal', activePointTypes],
    //   ],
    //   1,
    // ],
  })
}

const pointIndex = 100
const getPointIndex = layer => {
  const ind =
    OPTIONS_ACTIVE_POINTS.options.length -
    OPTIONS_ACTIVE_POINTS.options.indexOf(
      getDemographic(layer),
    )
  return pointIndex + ind
}

export const getPointLayers = (source, layer, context) => {
  // console.log('getRedlineLayers', context)
  // z = z + 3
  return [
    {
      z: getPointIndex(layer),
      style: getPoints(source, layer, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${source}-${layer}-points`, // `${source}Points`,
    },
    // {
    //   z: z + 1,
    //   style: getPointLines(type, context, activeLayers),
    //   idMap: true,
    //   hasFeatureId: true, // isCircleId,
    //   type: `${type}Lines`,
    // },
  ]
}

export const getPolygonLines = (
  source,
  type,
  context,
  activeLayers,
) => {
  console.log('getPolygonLines(), ', source, type, context)
  const isVisible = true
  // TODO: Visibility will be determined by the norming,
  // and the kind of display will be determined by the norming and
  // whether the map is centered over the tract/metro/state.
  // activeLayers[
  //   UNTD_LAYERS.findIndex(el => el.id === type)
  // ] === 1
  return fromJS({
    id: `${type}Lines`,
    source: source,
    'source-layer': type,
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
  source,
  type,
  context,
  // activeLayers,
) => {
  // TODO: Visibility will be determined by the norming,
  // and the kind of display will be determined by the norming and
  // whether the map is centered over the tract/metro/state.
  console.log(
    'getPolygonShapes(), ',
    source,
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
    source: source,
    'source-layer': type,
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

export const getPolygonLayers = (
  source,
  type,
  context,
  activeLayers,
) => {
  // console.log('getRedlineLayers', context)
  z = z + 2
  return [
    {
      z: z,
      style: getPolygonShapes(source, type, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Shapes`,
    },
    {
      z: z + 1,
      style: getPolygonLines(source, type, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Lines`,
    },
  ]
}

export const getLayers = (sources, context) => {
  console.log('getLayers', sources, context)
  const layers = []
  layers.push(
    ...getPolygonLayers('ddkids_shapes', 'states', context),
  )
  layers.push(
    ...getPolygonLayers('ddkids_shapes', 'metros', context),
  )
  layers.push(
    ...getPolygonLayers('ddkids_shapes', 'tracts', context),
  )
  context.activePointLayers.forEach(point => {
    // console.log('adding active point layer for ', point)
    layers.push(
      ...getPointLayers(
        `ddkids_points_${point}${context.activeYear}`,
        `${point}${context.activeYear}`,
        context,
      ),
    )
  })
  return layers
}
