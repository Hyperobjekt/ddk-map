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

// https://gomakethings.com/how-to-get-the-closest-parent-element-with-a-matching-selector-using-vanilla-javascript/
export const getClosest = (elem, selector) => {
  // console.log('getClosest')
  // Element.matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        var matches = (
            this.document || this.ownerDocument
          ).querySelectorAll(s),
          i = matches.length
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1
      }
  }
}
