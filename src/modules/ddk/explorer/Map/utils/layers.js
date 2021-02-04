import { fromJS } from 'immutable'

import {
  POINT_TYPES,
  OPTIONS_ACTIVE_POINTS,
  CHOROPLETH_COLORS,
  CENTER_TRACKED_SHAPES,
} from './../../../../../constants/map'

let z = 150
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
        'interpolate',
        ['linear'],
        ['zoom'],
        3,
        // 0.5,
        ['case', ['in', ['get', 'type'], 'ai'], 14, 0.5],
        6,
        // 1,
        ['case', ['in', ['get', 'type'], 'ai'], 2, 1],
        13,
        // 2,
        ['case', ['in', ['get', 'type'], 'ai'], 4, 2],
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
const getShapeFilters = (type, context) => {
  const minZoom = CENTER_TRACKED_SHAPES.find(el => {
    return el.id === type
  }).minZoom
  switch (true) {
    case type === 'tracts':
      return [
        'case',
        // If you're a tract in another state and norming is set to state...
        [
          'all',
          ['==', ['string', context.activeNorm], 's'],
          ['!=', ['get', 'statefips'], context.centerState],
        ],
        false,
        // If zoom is lower than min zoom set for shape type...
        ['<', ['zoom'], minZoom],
        false,
        // If you're a tract not in a metro and norming is set to metro...
        [
          'all',
          ['==', ['string', context.activeNorm], 'm'],
          ['!=', ['number', ['get', 'in100']], 1],
        ],
        false,
        [
          '!=',
          ['number', ['get', 'statefips']],
          ['number', 43],
        ],
        true,
        true,
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

export const getPolygonLines = (source, type, context) => {
  // console.log('getPolygonLines(), ', source, type, context
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
              'to-number',
              [
                'get',
                context.activeMetric +
                  context.activeNorm +
                  context.activeYear,
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
                context.activeMetric +
                  context.activeNorm +
                  context.activeYear,
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
                context.activeMetric +
                  context.activeNorm +
                  context.activeYear,
              ],
            ],
            2,
          ],
          CHOROPLETH_COLORS[1],
          [
            '==',
            [
              'to-number',
              [
                'get',
                context.activeMetric +
                  context.activeNorm +
                  context.activeYear,
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
                context.activeMetric +
                  context.activeNorm +
                  context.activeYear,
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
        // Tract that is clicked/active/
        [
          'all',
          ['==', type, 'tracts'],
          [
            'any',
            ['==', ['id'], ['number', context.activeShape]],
          ],
        ],
        6,
        // Tract that is hovered
        [
          'all',
          ['==', type, 'tracts'],
          [
            'any',
            [
              '==',
              ['id'],
              ['number', context.hoveredTract],
            ],
          ],
        ],
        3,
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
              'to-number',
              [
                'get',
                context.activeMetric +
                  context.activeNorm +
                  context.activeYear,
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
                context.activeMetric +
                  context.activeNorm +
                  context.activeYear,
              ],
            ],
            2,
          ],
          CHOROPLETH_COLORS[1],
          [
            '==',
            [
              'to-number',
              [
                'get',
                context.activeMetric +
                  context.activeNorm +
                  context.activeYear,
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
                context.activeMetric +
                  context.activeNorm +
                  context.activeYear,
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

const shapeIndex = 20
const lineIndex = 100
export const getPolygonLayers = (source, type, context) => {
  const shapeLayerOrder =
    context.activeNorm === 's'
      ? ['metros', 'states', 'tracts']
      : ['states', 'metros', 'tracts']
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
      z: lIndex,
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
    ...getPolygonLayers('ddkids_tracts', 'tracts', context),
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
