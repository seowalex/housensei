import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import {
  GoogleMap,
  HeatmapLayer,
  Marker,
  Polygon,
  TransitLayer,
} from '@react-google-maps/api';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectFlatTypes,
  selectTown,
  selectYear,
  setTown,
} from '../../../reducers/heatmap';
import {
  selectDarkMode,
  selectHeatmapPriceRangeLower,
  selectHeatmapPriceRangeUpper,
  selectShowHeatmap,
  selectShowHeatmapPrices,
} from '../../../reducers/settings';
import {
  useGetIslandHeatmapQuery,
  useGetTownHeatmapQuery,
} from '../../../api/heatmap';

import { useDebounce } from '../../../app/utils';
import {
  singaporeCoordinates,
  townBoundaries,
  townCoordinates,
} from '../../../app/constants';
import { Town } from '../../../types/towns';

import MapOverlay from '../overlay/MapOverlay';
import TownPolygon from './TownPolygon';
import FlatMarker from './FlatMarker';
import { EventCategory, HeatmapEventAction } from '../../../app/analytics';

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
  const flatTypes = useAppSelector(selectFlatTypes);
  const year = useAppSelector(selectYear);

  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [searchMarkers, setSearchMarkers] = useState<google.maps.LatLng[]>([]);

  const debouncedFlatTypes = useDebounce(flatTypes, 500);
  const debouncedYear = useDebounce(year, 500);

  const { data: islandHeatmap, isFetching: isIslandFetching } =
    useGetIslandHeatmapQuery(
      town === 'Islandwide'
        ? { flatTypes: debouncedFlatTypes, year: debouncedYear }
        : skipToken
    );
  const { data: townHeatmap, isFetching: isTownFetching } =
    useGetTownHeatmapQuery(
      town === 'Islandwide'
        ? skipToken
        : {
            flatTypes: debouncedFlatTypes,
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

  const selectedPolygonOptions: google.maps.PolygonOptions = useMemo(
    () => ({
      clickable: false,
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

  const handleMapIdle = () => {
    const zoom = map?.getZoom();

    if (google && zoom) {
      if (zoom < 15) {
        if (town !== 'Islandwide') {
          ReactGA.event({
            category: EventCategory.Heatmap,
            action: HeatmapEventAction.ZoomIsland,
          });
        }
        dispatch(setTown('Islandwide'));
        setSearchMarkers([]);
      } else {
        if (town === 'Islandwide') {
          ReactGA.event({
            category: EventCategory.Heatmap,
            action: HeatmapEventAction.ZoomTown,
          });
        }
        for (const [townName, paths] of Object.entries(townBoundaries)) {
          const polygon = new google.maps.Polygon({ paths });
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

  return (
    <>
      <GoogleMap
        mapContainerStyle={{ height: '100%' }}
        options={mapOptions}
        onBoundsChanged={() => searchBox?.setBounds(map?.getBounds() ?? null)}
        onLoad={setMap}
        onIdle={handleMapIdle}
      >
        <TransitLayer />
        {showHeatmap && (
          <HeatmapLayer data={heatmapData} options={heatmapLayerOptions} />
        )}
        {town === 'Islandwide' &&
          islandHeatmap?.map((point) => (
            <TownPolygon
              key={point.town}
              town={point.town}
              resalePrice={point.resalePrice}
              showHeatmapPrices={showHeatmapPrices}
              map={map}
            />
          ))}
        {town !== 'Islandwide' && (
          <Polygon
            paths={townBoundaries[town as Town]}
            options={selectedPolygonOptions}
          />
        )}
        {searchMarkers.map((position) => (
          <Marker
            key={position.toString()}
            position={position}
            clickable={false}
          />
        ))}
        {town !== 'Islandwide' &&
          townHeatmap?.map((point) => (
            <FlatMarker
              key={point.address}
              town={town}
              address={point.address}
              coordinates={{
                lat: point.coordinates[0],
                lng: point.coordinates[1],
              }}
              transactions={point.transactions}
            />
          ))}
      </GoogleMap>
      {(town === 'Islandwide' ? isIslandFetching : isTownFetching) && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            backgroundColor: 'rgba(117, 117, 117, 0.2)',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <MapOverlay
        map={map}
        searchBox={searchBox}
        setSearchBox={setSearchBox}
        setSearchMarkers={setSearchMarkers}
      />
    </>
  );
};

export default Map;
