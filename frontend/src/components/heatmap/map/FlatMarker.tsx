import { useState } from 'react';
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
} from '@mui/material';
import { Marker } from '@react-google-maps/api';
import { Close as CloseIcon } from '@mui/icons-material';
import { format, parse } from 'date-fns';

import { FlatTransaction } from '../../../api/heatmap';
import { currencyFormatter } from '../../../app/utils';
import { convertFlatTypeToFrontend } from '../../../utils/groups';

interface Props {
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

const FlatMarker = ({ address, coordinates, transactions }: Props) => {
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
            onClick={() => setShowTransactions(false)}
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
