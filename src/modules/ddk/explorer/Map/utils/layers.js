import { fromJS } from 'immutable'

import {
  POINT_TYPES,
  OPTIONS_ACTIVE_POINTS,
  CHOROPLETH_COLORS,
} from './../../../../../constants/map'

let z = 50
const dotSize = 2

const getDemographic = layer => {
  return layer.substring(0, layer.length - 2)
}

export const getPoints = (source, layer, context) => {
  // console.log('getPoints, ', source, context)
  // const isVisible =
  //   activeLayers[
  //     UNTD_LAYERS.findIndex(el => el.id === type)
  //   ] === 1
  // console.log('isVisible, ', isVisible)
  const demographic = getDemographic(layer)
  // console.log(
  //   'demographic, ',
  //   demographic,
  //   POINT_TYPES.find(el => el.id === demographic),
  // )
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
        4, // If AI/NA
        2, // All others
      ],
    },
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

/**
 * Returns mapbox expression to filter
 * a provided type of shape.
 * @param  {String} type Type of shape
 * @return {Array}      Mapbox expression
 */
const getShapeFilters = type => {
  switch (true) {
    case type === 'tracts':
      return [
        'all',
        [
          '!=',
          ['number', ['get', 'statefips']],
          ['number', 43],
        ],
      ]
      break
    case type === 'metros':
      return [
        'all',
        [
          '!=',
          ['number', ['get', 'statefips']],
          ['number', 43],
        ],
        ['==', ['get', 'in100'], 1],
      ]
      break
    case type === 'states':
      return [
        'all',
        ['!=', ['number', ['get', 'fips']], ['number', 43]],
      ]
      break
    default:
  }
}

export const getPolygonLines = (
  source,
  type,
  context,
  activeLayers,
) => {
  // console.log('getPolygonLines(), ', source, type, context)
  return fromJS({
    id: `${type}Lines`,
    source: source,
    'source-layer': type,
    type: 'line',
    layout: {
      visibility: 'visible',
      'line-cap': 'round',
    },
    interactive: true,
    paint: {
      'line-color': [
        'case',
        ['==', type, 'states'],
        '#fff',
        ['==', type, 'metros'],
        '#D65743',
        ['==', type, 'tracts'],
        [
          'case',
          // Tract that is hovered or clicked/active/
          [
            'all',
            ['==', type, 'tracts'],
            [
              'any',
              // ['==', ['id'], ['number', context.centerTract]], // Tract that is centered.
              [
                '==',
                ['id'],
                ['number', context.hoveredTract],
              ],
              [
                '==',
                ['id'],
                ['number', context.activeShape],
              ],
            ],
          ],
          CHOROPLETH_COLORS[4],
          [
            '==',
            [
              'get',
              context.activeMetric +
                context.activeNorm +
                context.activeYear,
            ],
            0,
          ],
          CHOROPLETH_COLORS[0],
          [
            '==',
            [
              'get',
              context.activeMetric +
                context.activeNorm +
                context.activeYear,
            ],
            1,
          ],
          CHOROPLETH_COLORS[1],
          [
            '==',
            [
              'get',
              context.activeMetric +
                context.activeNorm +
                context.activeYear,
            ],
            2,
          ],
          CHOROPLETH_COLORS[1],
          [
            '==',
            [
              'get',
              context.activeMetric +
                context.activeNorm +
                context.activeYear,
            ],
            3,
          ],
          CHOROPLETH_COLORS[3],
          [
            '==',
            [
              'get',
              context.activeMetric +
                context.activeNorm +
                context.activeYear,
            ],
            4,
          ],
          CHOROPLETH_COLORS[4],
          '#ccc',
        ],
        '#ccc',
      ],
      'line-width': [
        'case',
        // State that is centered.
        [
          'all',
          ['==', type, 'states'],
          ['==', ['id'], ['number', context.centerState]],
        ],
        6,
        // State that is not centered.
        [
          'all',
          ['==', type, 'states'],
          ['!=', ['id'], ['number', context.centerState]],
        ],
        2,
        // Metro area that is centered.
        [
          'all',
          ['==', type, 'metros'],
          ['==', ['id'], ['number', context.centerMetro]],
        ],
        10,
        // Metro area that is not centered.
        [
          'all',
          ['==', type, 'metros'],
          ['!=', ['id'], ['number', context.centerMetro]],
        ],
        3,
        // Tract that is hovered or clicked/active/
        [
          'all',
          ['==', type, 'tracts'],
          [
            'any',
            // ['==', ['id'], ['number', context.centerTract]], // Tract that is centered.
            [
              '==',
              ['id'],
              ['number', context.hoveredTract],
            ],
            ['==', ['id'], ['number', context.activeShape]],
          ],
        ],
        6,
        // Tract that is not centered.
        // [
        //   'all',
        //   ['==', type, 'tracts'],
        //   ['!=', ['id'], ['number', context.centerTract]],
        // ],
        // 1,
        0,
      ],
      // 2, // Line width adjusted if centered.
    },
    filter: getShapeFilters(type),
  })
}

export const getPolygonShapes = (source, type, context) => {
  // console.log('getPolygonShapes(), ', source, type, context)
  return fromJS({
    id: `${type}Shapes`,
    source: source,
    'source-layer': type,
    type: 'fill',
    layout: {
      visibility: 'visible',
    },
    interactive: type === 'tracts' ? true : false,
    paint: {
      'fill-color': [
        'case',
        ['==', type, 'states'],
        'transparent', // Use this to toggle on fill for testing.
        ['==', type, 'metros'],
        'transparent',
        ['==', type, 'tracts'],
        [
          'case',
          [
            '==',
            [
              'get',
              context.activeMetric +
                context.activeNorm +
                context.activeYear,
            ],
            0,
          ],
          CHOROPLETH_COLORS[0],
          [
            '==',
            [
              'get',
              context.activeMetric +
                context.activeNorm +
                context.activeYear,
            ],
            1,
          ],
          CHOROPLETH_COLORS[1],
          [
            '==',
            [
              'get',
              context.activeMetric +
                context.activeNorm +
                context.activeYear,
            ],
            2,
          ],
          CHOROPLETH_COLORS[1],
          [
            '==',
            [
              'get',
              context.activeMetric +
                context.activeNorm +
                context.activeYear,
            ],
            3,
          ],
          CHOROPLETH_COLORS[3],
          [
            '==',
            [
              'get',
              context.activeMetric +
                context.activeNorm +
                context.activeYear,
            ],
            4,
          ],
          CHOROPLETH_COLORS[4],
          '#ccc',
        ],
        'transparent',
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.6,
        0.9,
      ],
    },
    filter: getShapeFilters(type),
  })
}

const shapeLayerOrder = ['states', 'metros', 'tracts']
export const getPolygonLayers = (source, type, context) => {
  // console.log('getPolygonLayers', type, context)
  const zIndex = z + shapeLayerOrder.indexOf(type)
  return [
    {
      z: zIndex,
      style: getPolygonShapes(source, type, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Shapes`,
    },
    {
      z: zIndex + 20,
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
  if (context.activePointLayers.length > 0) {
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
  }
  return layers
}
