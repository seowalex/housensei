import { useState } from 'react';
import ReactGA from 'react-ga';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import { Marker } from '@react-google-maps/api';
import {
  Addchart as AddchartIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format, parse } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { FlatTransaction } from '../../../api/heatmap';
import { createGroup, selectGroups } from '../../../reducers/history';

import { currencyFormatter } from '../../../app/utils';
import {
  convertFlatTypeToFrontend,
  getGroupColor,
} from '../../../utils/groups';
import type { Town } from '../../../types/towns';
import { selectColorCount } from '../../../reducers/colors';
import { EventCategory, HeatmapEventAction } from '../../../app/analytics';

interface Props {
  town: Town;
  address: string;
  coordinates: google.maps.LatLngLiteral;
  transactions: FlatTransaction[];
}

type Order = 'asc' | 'desc';
type OrderBy = 'flatType' | 'resalePrice' | 'transactionMonth';

const markerOptions: google.maps.MarkerOptions = {
  opacity: 0,
};

const descendingComparator = <T extends unknown>(
  a: T,
  b: T,
  orderBy: keyof T
) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = <Key extends keyof FlatTransaction>(
  order: Order,
  orderBy: Key
): ((
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number) =>
  order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

const FlatMarker = ({ town, address, coordinates, transactions }: Props) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const groups = useAppSelector(selectGroups);
  const colorCount = useAppSelector(selectColorCount);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('transactionMonth');
  const [marker, setMarker] = useState<google.maps.Marker>();
  const [showTransactions, setShowTransactions] = useState(false);

  const handleMouseOver = () => {
    marker?.setOptions({
      opacity: 1,
    });
  };

  const handleMouseOut = () => {
    marker?.setOptions({
      opacity: 0,
    });
  };

  const handleAddGroup = (transaction: FlatTransaction) => {
    dispatch(
      createGroup({
        type: 'resale',
        id: uuidv4(),
        name: `${town} (${convertFlatTypeToFrontend(transaction.flatType)})`,
        color: getGroupColor(colorCount),
        filters: {
          towns: [town],
          flatTypes: [transaction.flatType],
        },
      })
    );

    ReactGA.event({
      category: EventCategory.Heatmap,
      action: HeatmapEventAction.AddToPriceHistory,
    });

    enqueueSnackbar(
      <span>
        Added{' '}
        <strong>
          {town} ({convertFlatTypeToFrontend(transaction.flatType)})
        </strong>{' '}
        resale flats to Price History.
      </span>,
      {
        variant: 'success',
      }
    );
  };

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <>
      <Marker
        position={coordinates}
        title={address}
        options={markerOptions}
        onLoad={setMarker}
        onClick={() => setShowTransactions(true)}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
      <Dialog
        open={showTransactions}
        onClose={() => setShowTransactions(false)}
        fullWidth
      >
        <DialogTitle>
          {address}
          <IconButton
            onClick={() => {
              ReactGA.event({
                category: EventCategory.Heatmap,
                action: HeatmapEventAction.ViewBlock,
              });
              setShowTransactions(false);
            }}
            sx={{
              position: 'absolute',
              top: (theme) => theme.spacing(1),
              right: (theme) => theme.spacing(1),
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sortDirection={orderBy === 'flatType' ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === 'flatType'}
                    direction={orderBy === 'flatType' ? order : 'asc'}
                    onClick={() => handleSort('flatType')}
                  >
                    Flat Type
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === 'resalePrice' ? order : false}
                  align="right"
                >
                  <TableSortLabel
                    active={orderBy === 'resalePrice'}
                    direction={orderBy === 'resalePrice' ? order : 'asc'}
                    onClick={() => handleSort('resalePrice')}
                  >
                    Resale Price
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === 'transactionMonth' ? order : false}
                  align="right"
                >
                  <TableSortLabel
                    active={orderBy === 'transactionMonth'}
                    direction={orderBy === 'transactionMonth' ? order : 'asc'}
                    onClick={() => handleSort('transactionMonth')}
                  >
                    Resale Registration Date
                  </TableSortLabel>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions
                .slice()
                .sort(getComparator(order, orderBy))
                .map((transaction) => (
                  <TableRow
                    key={JSON.stringify(transaction)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      {convertFlatTypeToFrontend(transaction.flatType)}
                    </TableCell>
                    <TableCell align="right">
                      {currencyFormatter.format(transaction.resalePrice)}
                    </TableCell>
                    <TableCell align="right">
                      {format(
                        parse(
                          transaction.transactionMonth,
                          'yyyy-MM',
                          new Date()
                        ),
                        'MMM yyyy'
                      )}
                    </TableCell>
                    <TableCell padding="none">
                      <Tooltip
                        title="Add to Price History"
                        placement="top"
                        disableInteractive
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleAddGroup(transaction)}
                        >
                          <AddchartIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FlatMarker;
