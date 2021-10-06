/* eslint-disable import/prefer-default-export */
export const getPolygonCenter = (polygon?: google.maps.Polygon) => {
  const bounds = new google.maps.LatLngBounds();
  const paths = polygon?.getPaths().getArray();

  if (paths) {
    for (const path of paths) {
      for (const coordinates of path.getArray()) {
        bounds.extend(coordinates);
      }
    }
  }

  return bounds.getCenter();
};
