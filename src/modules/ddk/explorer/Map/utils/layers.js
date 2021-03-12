import { fromJS } from 'immutable'

import {
  POINT_TYPES,
  OPTIONS_ACTIVE_POINTS,
  CHOROPLETH_COLORS,
  SHAPE_ZOOM_LEVELS,
  FULL_FUNCT_ZOOM_THRESHOLD,
} from './../../../../../constants/map'
import { theme } from './../../theme'

// let z = 150
// const dotSize = 2

const getDemographic = layer => {
  return layer.substring(0, layer.length - 2)
}

export const getPoints = (source, layer, context) => {
  // console.log('getPoints, ', source, context)
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
        el => el.id === layer,
      ).color,
      'circle-opacity': 1,
      // If it's 'ai', make larger, else standard size.
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        [
          'case',
          ['==', layer, 'ai'],
          0.5,
          ['==', layer, 'w'],
          0.01,
          0.01,
        ],
        3,
        [
          'case',
          ['==', layer, 'ai'],
          1,
          ['==', layer, 'w'],
          0.5,
          0.5,
        ],
        6.5,
        [
          'case',
          ['==', layer, 'ai'],
          2.2,
          ['==', layer, 'w'],
          1.2,
          1.2,
        ],
        9.5,
        [
          'case',
          ['==', layer, 'ai'],
          2,
          ['==', layer, 'w'],
          1,
          1,
        ],
        11.5,
        [
          'case',
          ['==', layer, 'ai'],
          1,
          ['==', layer, 'w'],
          0.75,
          0.75,
        ],
      ],
    },
    filter: [
      'case',
      // If you're a tract in another state and norming is set to state...
      // [
      //   'all',
      //   ['==', ['string', context.activeNorm], 's'],
      //   ['!=', ['get', 's'], context.centerState],
      // ],
      // false,
      // If you're a tract not in a metro and norming is set to metro...
      [
        'all',
        ['==', ['string', context.activeNorm], 'm'],
        ['==', ['get', 'i'], 1],
      ],
      true,
      [
        'all',
        ['==', ['string', context.activeNorm], 'm'],
        ['!=', ['get', 'i'], 1],
      ],
      false,
      // Only display dots in the active metro area.
      // [
      //   'all',
      //   ['==', ['string', context.activeNorm], 'm'],
      //   ['==', ['get', 'm'], 0],
      // ],
      // false,
      true,
    ],
  })
}

const pointIndex = 35 // 200
const pointsArray = OPTIONS_ACTIVE_POINTS.options.slice()
const getPointIndex = layer => {
  const ind =
    pointsArray.length - pointsArray.indexOf(layer)
  // console.log('getting point layer index, ', layer, ind)
  return pointIndex + ind * 10
}

export const getPointLayers = (source, layer, context) => {
  // console.log('getPointLayers', layer, context)
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
const getShapeFilters = (type, context) => {
  const minZoom = SHAPE_ZOOM_LEVELS.find(el => {
    return el.id === type
  }).minZoom
  switch (true) {
    case type === 'tracts':
      return [
        'case',
        // If you're a tract in another state and norming is set to state...
        // [
        //   'all',
        //   ['==', ['string', context.activeNorm], 's'],
        //   ['!=', ['get', 's'], context.centerState],
        // ],
        // false,
        // If zoom is lower than min zoom set for shape type...
        // ['<', ['zoom'], minZoom],
        // false,
        // If you're a tract not in a metro and norming is set to metro...
        [
          'all',
          ['==', ['string', context.activeNorm], 'm'],
          ['!=', ['number', ['get', 'i']], 1],
        ],
        false,
        // If you're a tract not in the centered metro,
        // and norming is set to metro, don't display.
        // [
        //   'all',
        //   ['>', ['zoom'], 5],
        //   ['==', ['string', context.activeNorm], 'm'],
        //   [
        //     '!=',
        //     ['number', ['get', 'm']],
        //     context.centerMetro,
        //   ],
        // ],
        // false,
        ['==', ['number', ['get', 's']], ['number', 43]],
        false,
        true,
      ]
      break
    case type === 'metros':
      return [
        'case',
        ['==', ['number', ['get', 's']], ['number', 43]],
        false,
        // National norming, don't display.
        // ['==', ['string', context.activeNorm], 'n'],
        // false,
        // State norming, don't display.
        // ['==', ['string', context.activeNorm], 's'],
        // false,
        // Not in top 100, don't display.
        ['!=', ['get', 'i'], 1],
        false,
        true,
      ]
      break
    case type === 'states':
      return [
        'case',
        // If puerto rico, filter out.
        ['==', ['number', ['get', 'fips']], ['number', 43]],
        false,
        true,
      ]
      break
    default:
  }
}

export const getPolygonLines = (source, type, context) => {
  // console.log('getPolygonLines(), ', source, type, context)
  return fromJS({
    id: `${type}Lines`,
    source: source,
    'source-layer': type,
    type: 'line',
    layout: {
      visibility: 'visible',
      'line-cap': 'round',
      'line-join': 'round',
      'line-round-limit': 0.2,
    },
    interactive: type === 'tracts' ? true : false,
    paint: {
      'line-color': [
        'case',
        ['==', type, 'states'],
        theme.extras.variables.colors.ddkRed,
        // ['==', type, 'metros'],
        // theme.extras.SDScale.onColors[4],
        [
          'all',
          ['==', type, 'metros'],
          ['==', context.activeNorm, 'm'],
          ['!=', ['feature-state', 'centered'], true],
          [
            '>=',
            context.viewport.zoom,
            FULL_FUNCT_ZOOM_THRESHOLD,
          ],
        ],
        theme.extras.SDScale.onColors[4],
        [
          'all',
          ['==', type, 'metros'],
          ['==', context.activeNorm, 'm'],
          ['==', ['feature-state', 'centered'], true],
          [
            '>=',
            context.viewport.zoom,
            FULL_FUNCT_ZOOM_THRESHOLD,
          ],
        ],
        theme.extras.variables.colors.ddkRed,
        ['==', type, 'tracts'],
        [
          'case',
          // Tract that is hovered or clicked/active/
          [
            'all',
            ['==', type, 'tracts'],
            [
              'any',
              ['==', ['feature-state', 'hovered'], true],
              ['==', ['feature-state', 'active'], true],
            ],
          ],
          theme.extras.variables.colors.ddkRed,
          [
            '==',
            [
              'to-number',
              [
                'get',
                context.activeMetric + context.activeNorm,
              ],
            ],
            0,
          ],
          CHOROPLETH_COLORS[0],
          [
            '==',
            [
              'to-number',
              [
                'get',
                context.activeMetric + context.activeNorm,
              ],
            ],
            1,
          ],
          CHOROPLETH_COLORS[1],
          [
            '==',
            [
              'to-number',
              [
                'get',
                context.activeMetric + context.activeNorm,
              ],
            ],
            2,
          ],
          CHOROPLETH_COLORS[2],
          [
            '==',
            [
              'to-number',
              [
                'get',
                context.activeMetric + context.activeNorm,
              ],
            ],
            3,
          ],
          CHOROPLETH_COLORS[3],
          [
            '==',
            [
              'to-number',
              [
                'get',
                context.activeMetric + context.activeNorm,
              ],
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
        // State that is centered (when norming is set to state).
        [
          'all',
          ['==', type, 'states'],
          ['==', context.activeNorm, 's'],
          ['==', ['feature-state', 'centered'], true],
          [
            '>=',
            context.viewport.zoom,
            FULL_FUNCT_ZOOM_THRESHOLD,
          ],
        ],
        6,
        // State that is not centered.
        ['all', ['==', type, 'states']],
        0,
        // Metro area that is centered.
        [
          'all',
          ['==', type, 'metros'],
          ['==', context.activeNorm, 'm'],
          ['==', ['feature-state', 'centered'], true],
          [
            '>=',
            context.viewport.zoom,
            FULL_FUNCT_ZOOM_THRESHOLD,
          ],
        ],
        6,
        [
          'all',
          ['==', type, 'metros'],
          ['!=', context.activeNorm, 'm'],
        ],
        0,
        // Metro area that is not centered.
        ['all', ['==', type, 'metros']],
        1,
        // Tract that is clicked/active/
        [
          'all',
          ['==', type, 'tracts'],
          ['==', ['feature-state', 'active'], true],
        ],
        6,
        // Tract that is hovered
        [
          'all',
          ['==', type, 'tracts'],
          ['==', ['feature-state', 'hovered'], true],
        ],
        3,
        0,
      ],
      // 2, // Line width adjusted if centered.
    },
    filter: getShapeFilters(type, context),
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
              context.activeMetric + context.activeNorm,
            ],
            0,
          ],
          CHOROPLETH_COLORS[0],
          [
            '==',
            [
              'to-number',
              [
                'get',
                context.activeMetric + context.activeNorm,
              ],
            ],
            1,
          ],
          CHOROPLETH_COLORS[1],
          [
            '==',
            [
              'to-number',
              [
                'get',
                context.activeMetric + context.activeNorm,
              ],
            ],
            2,
          ],
          CHOROPLETH_COLORS[2],
          [
            '==',
            [
              'to-number',
              [
                'get',
                context.activeMetric + context.activeNorm,
              ],
            ],
            3,
          ],
          CHOROPLETH_COLORS[3],
          [
            '==',
            [
              'to-number',
              [
                'get',
                context.activeMetric + context.activeNorm,
              ],
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
    filter: getShapeFilters(type, context),
  })
}

const shapeIndex = 40
const lineIndex = 50
export const getPolygonLayers = (source, type, context) => {
  const shapeLayerOrder = ['states', 'metros', 'tracts']
  // context.activeNorm === 's'
  //   ? ['metros', 'states', 'tracts']
  //   : ['states', 'metros', 'tracts']
  // console.log('getPolygonLayers', type, context)
  const sIndex = shapeIndex + shapeLayerOrder.indexOf(type)
  const lIndex = lineIndex + shapeLayerOrder.indexOf(type)
  return [
    {
      z: sIndex,
      style: getPolygonShapes(source, type, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Shapes`,
    },
    {
      z: type === 'tracts' ? 100 : lIndex,
      style: getPolygonLines(source, type, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Lines`,
    },
  ]
}

export const getLayers = (sources, context) => {
  // console.log('getLayers', sourcest, context)
  const layers = []
  layers.push(
    ...getPolygonLayers('ddkids_shapes', 'states', context),
  )
  layers.push(
    ...getPolygonLayers('ddkids_shapes', 'metros', context),
  )
  // layers.push(
  //   ...getPolygonLayers('ddkids_tracts', 'tracts', context),
  // )
  if (context.activePointLayers.length > 0) {
    context.activePointLayers.reverse().forEach(point => {
      // console.log('adding active point layer for ', point)
      layers.push(
        ...getPointLayers(
          `ddkids_points_${point}`,
          `${point}`,
          context,
        ),
      )
    })
  }
  layers.push(
    ...getPolygonLayers('ddkids_tracts', 'tracts', context),
  )
  return layers
}
