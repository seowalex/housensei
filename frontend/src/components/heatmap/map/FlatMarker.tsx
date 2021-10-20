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

const markerOptions: google.maps.MarkerOptions = {
  opacity: 0,
};

const FlatMarker = ({ address, coordinates, transactions }: Props) => {
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
                <TableCell>Flat Type</TableCell>
                <TableCell align="right">Resale Price</TableCell>
                <TableCell align="right">Resale Registration Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
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
