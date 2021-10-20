import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { InfoBox, Polygon } from '@react-google-maps/api';
import { InfoBoxOptions } from '@react-google-maps/infobox';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectDarkMode } from '../../../reducers/settings';
import { setTown } from '../../../reducers/heatmap';

import {
  singaporeCoordinates,
  townBoundaries,
  townCoordinates,
} from '../../../app/constants';
import type { Town } from '../../../types/towns';
import { currencyFormatter } from '../../../app/utils';

interface Props {
  town: string;
  resalePrice: number;
  showHeatmapPrices: boolean;
  map?: google.maps.Map;
}

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

const TownPolygon = ({ town, resalePrice, showHeatmapPrices, map }: Props) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkMode = useAppSelector(selectDarkMode) ?? prefersDarkMode;

  const [polygon, setPolygon] = useState<google.maps.Polygon>();
  const [showInfoBox, setShowInfoBox] = useState<boolean>(false);

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

  useEffect(() => {
    polygon?.setOptions({
      fillOpacity: showHeatmapPrices ? 0.4 : 0,
      strokeOpacity: showHeatmapPrices ? 1 : 0,
    });

    setShowInfoBox(showHeatmapPrices);
  }, [polygon, showHeatmapPrices]);

  const handleMouseOver = () => {
    if (!showHeatmapPrices) {
      polygon?.setOptions({
        fillOpacity: 0.4,
        strokeOpacity: 1,
      });
      setShowInfoBox(true);
    }
  };

  const handleMouseOut = () => {
    if (!showHeatmapPrices) {
      polygon?.setOptions({
        fillOpacity: 0,
        strokeOpacity: 0,
      });
      setShowInfoBox(false);
    }
  };

  const handleClick = () => {
    dispatch(setTown(town as Town));
    map?.setCenter(townCoordinates[town as Town] ?? singaporeCoordinates);
    map?.setZoom(15);
  };

  return (
    <>
      <Polygon
        paths={townBoundaries[town as Town]}
        options={polygonOptions}
        onLoad={setPolygon}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleClick}
      />
      <InfoBox
        position={townCoordinates[town as Town]}
        options={{
          ...infoBoxOptions,
          visible: showInfoBox,
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
              {town}
            </Typography>
            <Typography variant="caption">
              {formatPrice(resalePrice)}
            </Typography>
          </CardContent>
        </Card>
      </InfoBox>
    </>
  );
};

export default TownPolygon;
