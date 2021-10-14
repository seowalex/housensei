import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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
  selectHeatmapPriceRangeLower,
  selectHeatmapPriceRangeUpper,
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

import MapOverlay from './MapOverlay';

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

const Map = () => {
  const { google } = window;

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkMode = useAppSelector(selectDarkMode) ?? prefersDarkMode;
  const showHeatmap = useAppSelector(selectShowHeatmap);
  const showHeatmapPrices = useAppSelector(selectShowHeatmapPrices);
  const heatmapPriceRangeLower = useAppSelector(selectHeatmapPriceRangeLower);
  const heatmapPriceRangeUpper = useAppSelector(selectHeatmapPriceRangeUpper);
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
      fillColor: darkMode ? theme.palette.grey[500] : theme.palette.grey[600],
      fillOpacity: 0,
      strokeColor: darkMode ? theme.palette.grey[600] : theme.palette.grey[700],
      strokeWeight: 2,
      strokeOpacity: 0,
    }),
    [theme, darkMode]
  );

  const selectedPolygonOptions: google.maps.PolygonOptions = useMemo(
    () => ({
      fillOpacity: 0,
      strokeColor: theme.palette.error.light,
      strokeWeight: 3,
      strokeOpacity: 1,
    }),
    [theme]
  );

  const heatmapLayerOptions: google.maps.visualization.HeatmapLayerOptions =
    useMemo(
      () => ({
        dissipating: false,
        maxIntensity: 1,
        radius: town === 'Islandwide' ? 0.035 : 0.001,
      }),
      [town]
    );

  const normaliseHeatmap = useCallback(
    <T extends { resalePrice: number }>(heatmap?: T[]) => {
      if (!heatmap) {
        return [];
      }

      const heatmapMinPrice = Math.min(
        ...heatmap.map((point) => point.resalePrice)
      );
      const heatmapMaxPrice = Math.max(
        ...heatmap.map((point) => point.resalePrice)
      );

      const minPrice = heatmapPriceRangeLower
        ? Math.max(heatmapPriceRangeLower, heatmapMinPrice)
        : heatmapMinPrice;
      const maxPrice = heatmapPriceRangeUpper ?? heatmapMaxPrice;

      return heatmap.map((point) =>
        Object.fromEntries(
          Object.entries(point).map(([key, value]) => [
            key,
            key === 'resalePrice'
              ? Math.max((value - minPrice) / (maxPrice - minPrice), 0) +
                Number.MIN_VALUE
              : value,
          ])
        )
      ) as T[];
    },
    [heatmapPriceRangeLower, heatmapPriceRangeUpper]
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
  }, [google, town, islandHeatmap, townHeatmap, normaliseHeatmap]);

  useEffect(() => {
    map?.setCenter(townCoordinates[town as Town] ?? singaporeCoordinates);
    map?.setZoom(town === 'Islandwide' ? 12 : 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

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

  const handleMapIdle = () => {
    const zoom = map?.getZoom();

    if (google && zoom) {
      if (zoom < 15) {
        dispatch(setTown('Islandwide'));
      } else {
        for (const [townName, polygon] of Object.entries(polygons)) {
          if (
            google.maps.geometry.poly.containsLocation(
              map?.getCenter() ?? null,
              polygon
            )
          ) {
            dispatch(setTown(townName as Town));
          }
        }
      }
    }
  };

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

  const handlePolygonClick = (townName: string) => {
    dispatch(setTown(townName as Town));
    map?.setCenter(townCoordinates[townName as Town] ?? singaporeCoordinates);
    map?.setZoom(15);
  };

  return (
    <>
      <GoogleMap
        mapContainerStyle={{ height: '100%' }}
        options={mapOptions}
        onLoad={setMap}
        onIdle={handleMapIdle}
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
                onClick={() => handlePolygonClick(townName)}
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
                  <CardContent sx={{ p: `${theme.spacing(1)} !important` }}>
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
        {town !== 'Islandwide' && (
          <Polygon
            paths={townBoundaries[town as Town]}
            options={selectedPolygonOptions}
          />
        )}
      </GoogleMap>
      <MapOverlay map={map} />
    </>
  );
};

export default Map;
