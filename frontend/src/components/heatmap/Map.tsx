import { Fragment, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import {
  GoogleMap,
  HeatmapLayer,
  InfoBox,
  Polygon,
  TransitLayer,
} from '@react-google-maps/api';
import { InfoBoxOptions } from '@react-google-maps/infobox';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectTown, selectYear, setTown } from '../../reducers/heatmap';
import {
  selectDarkMode,
  selectShowHeatmap,
  selectShowHeatmapPrices,
} from '../../reducers/settings';
import {
  useGetIslandHeatmapQuery,
  useGetTownHeatmapQuery,
} from '../../api/heatmap';

import { currencyFormatter, useDebounce } from '../../app/utils';
import {
  singaporeCoordinates,
  townBoundaries,
  townCoordinates,
} from '../../app/constants';
import { Town } from '../../types/towns';

const infoBoxOptions: InfoBoxOptions = {
  boxStyle: {
    overflow: 'visible',
  },
  closeBoxURL: '',
  disableAutoPan: true,
  enableEventPropagation: true,
};

const formatPrice = (price?: number) =>
  price ? currencyFormatter.format(price) : '';

const normaliseHeatmap = <T extends { resalePrice: number }>(heatmap?: T[]) => {
  if (!heatmap) {
    return [];
  }

  const minPrice = Math.min(...heatmap.map((point) => point.resalePrice));
  const maxPrice = Math.max(...heatmap.map((point) => point.resalePrice));

  return heatmap.map((point) =>
    Object.fromEntries(
      Object.entries(point).map(([key, value]) => [
        key,
        key === 'resalePrice'
          ? (value - minPrice) / (maxPrice - minPrice) + Number.MIN_VALUE
          : value,
      ])
    )
  ) as T[];
};

const Map = () => {
  const { google } = window;

  const dispatch = useAppDispatch();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkMode = useAppSelector(selectDarkMode) ?? prefersDarkMode;
  const showHeatmap = useAppSelector(selectShowHeatmap);
  const showHeatmapPrices = useAppSelector(selectShowHeatmapPrices);
  const town = useAppSelector(selectTown);
  const year = useAppSelector(selectYear);

  const [map, setMap] = useState<google.maps.Map>();
  const [polygons, setPolygons] = useState<{
    [K in Town]?: google.maps.Polygon;
  }>({});
  const [infoBoxes, setInfoBoxes] = useState<{
    [K in Town]?: boolean;
  }>({});

  const debouncedYear = useDebounce(year, 500);

  const { data: islandHeatmap } = useGetIslandHeatmapQuery(
    town === 'Islandwide' ? debouncedYear : skipToken
  );
  const { data: townHeatmap } = useGetTownHeatmapQuery(
    town === 'Islandwide'
      ? skipToken
      : {
          year: debouncedYear,
          town,
        }
  );

  const mapOptions: google.maps.MapOptions = useMemo(
    () => ({
      mapId: darkMode ? '9bc9cb34c7dac68c' : null,
      center: singaporeCoordinates,
      clickableIcons: false,
      disableDefaultUI: true,
      zoom: 12,
    }),
    [darkMode]
  );

  const polygonOptions: google.maps.PolygonOptions = useMemo(
    () => ({
      fillColor: darkMode ? '#9e9e9e' : '#757575',
      fillOpacity: 0,
      strokeColor: darkMode ? '#757575' : '#616161',
      strokeWeight: 2,
      strokeOpacity: 0,
    }),
    [darkMode]
  );

  const heatmapLayerOptions: google.maps.visualization.HeatmapLayerOptions =
    useMemo(
      () => ({
        dissipating: false,
        radius: town === 'Islandwide' ? 0.035 : 0.001,
      }),
      [town]
    );

  const heatmapData = useMemo(() => {
    if (!google) {
      return [];
    }

    return town === 'Islandwide'
      ? normaliseHeatmap(islandHeatmap).map((point) => ({
          location: new google.maps.LatLng(townCoordinates[point.town as Town]),
          weight: point.resalePrice,
        }))
      : normaliseHeatmap(townHeatmap).map((point) => ({
          location: new google.maps.LatLng({
            lat: point.coordinates[0],
            lng: point.coordinates[1],
          }),
          weight: point.resalePrice,
        }));
  }, [google, town, islandHeatmap, townHeatmap]);

  useEffect(() => {
    map?.setCenter(townCoordinates[town as Town] ?? singaporeCoordinates);
    map?.setZoom(town === 'Islandwide' ? 12 : 15);
  }, [map, town]);

  useEffect(() => {
    for (const polygon of Object.values(polygons)) {
      polygon?.setOptions({
        fillOpacity: showHeatmapPrices ? 0.4 : 0,
        strokeOpacity: showHeatmapPrices ? 1 : 0,
      });
    }

    setInfoBoxes(
      Object.fromEntries(
        Object.values(Town).map((key) => [key, showHeatmapPrices])
      )
    );
  }, [showHeatmapPrices, polygons]);

  const handlePolygonMouseOver = (townName: string) => {
    if (!showHeatmapPrices) {
      polygons[townName as Town]?.setOptions({
        fillOpacity: 0.4,
        strokeOpacity: 1,
      });
      setInfoBoxes((prevInfoBoxes) => ({
        ...prevInfoBoxes,
        [townName]: true,
      }));
    }
  };

  const handlePolygonMouseOut = (townName: string) => {
    if (!showHeatmapPrices) {
      polygons[townName as Town]?.setOptions({
        fillOpacity: 0,
        strokeOpacity: 0,
      });
      setInfoBoxes((prevInfoBoxes) => ({
        ...prevInfoBoxes,
        [townName]: false,
      }));
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={{ height: '100%' }}
      options={mapOptions}
      onLoad={setMap}
    >
      <TransitLayer />
      {showHeatmap && (
        <HeatmapLayer data={heatmapData} options={heatmapLayerOptions} />
      )}
      {town === 'Islandwide' &&
        Object.entries(townBoundaries).map(([townName, paths]) => (
          <Fragment key={townName}>
            <Polygon
              paths={paths}
              options={polygonOptions}
              onLoad={(polygon) =>
                setPolygons((prevPolygons) => ({
                  ...prevPolygons,
                  [townName]: polygon,
                }))
              }
              onMouseOver={() => handlePolygonMouseOver(townName)}
              onMouseOut={() => handlePolygonMouseOut(townName)}
              onClick={() => dispatch(setTown(townName as Town))}
            />
            <InfoBox
              position={townCoordinates[townName as Town]}
              options={{
                ...infoBoxOptions,
                visible: infoBoxes[townName as Town],
              }}
            >
              <Card
                sx={{
                  backgroundColor: darkMode
                    ? 'rgba(18, 18, 18, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  m: '-25% 50% 0 -50%',
                }}
              >
                <CardContent
                  sx={{ p: (theme) => `${theme.spacing(1)} !important` }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {townName}
                  </Typography>
                  <Typography variant="caption">
                    {formatPrice(
                      islandHeatmap?.find((point) => point.town === townName)
                        ?.resalePrice
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </InfoBox>
          </Fragment>
        ))}
    </GoogleMap>
  );
};

export default Map;
