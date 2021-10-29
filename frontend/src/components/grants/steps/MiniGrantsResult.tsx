import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import {
  getEHGGrant,
  getFamilyGrant,
  getHalfHousingGrant,
  getProximityGrant,
  getSingleEHGGrant,
  getSingleGrant,
} from '../calculation/GrantCalculation';
import {
  displayGrantRange,
  getTotalGrant,
  parseFormValues,
} from '../calculation/ParseGrantsForm';

interface Props {
  form: UseFormReturn<FieldValues>;
}

const MiniGrantsResult = (props: Props) => {
  const { form } = props;
  const values = form.watch();
  const fieldValues = parseFormValues(values);

  const ehgGrant = getEHGGrant(fieldValues);
  const familyGrant = getFamilyGrant(fieldValues);
  const halfHousingGrant = getHalfHousingGrant(fieldValues);
  const proximityGrant = getProximityGrant(fieldValues);
  const singleEhgGrant = getSingleEHGGrant(fieldValues);
  const singleGrant = getSingleGrant(fieldValues);

  const totalGrantRange = getTotalGrant([
    ehgGrant,
    familyGrant,
    halfHousingGrant,
    proximityGrant,
    singleEhgGrant,
    singleGrant,
  ]);

  // TODO grant amount is not stackable

  const rowData = [
    {
      grantName: 'EHG Grant',
      grantRange: ehgGrant,
    },
    {
      grantName: 'EHG Single Grant',
      grantRange: singleEhgGrant,
    },
    {
      grantName: 'Family Grant',
      grantRange: familyGrant,
    },
    {
      grantName: 'Half Housing Grant',
      grantRange: halfHousingGrant,
    },
    {
      grantName: 'Proximity Housing Grant',
      grantRange: proximityGrant,
    },
    {
      grantName: 'Singles Grant',
      grantRange: singleGrant,
    },
  ];

  const rows = rowData.map((row) => ({
    ...row,
    grantRange: displayGrantRange(row.grantRange),
  }));

  // rows.forEach((row) => (row.grantRange = displayGrantRange(row.grantRange)));

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Grant</TableCell>
            <Tooltip
              title="Range of grant value that you're eligible for based on current selection"
              placement="top"
            >
              <TableCell>Eligible Value</TableCell>
            </Tooltip>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.grantName}>
              <TableCell component="th" scope="row">
                {row.grantName}
              </TableCell>
              <TableCell>{row.grantRange}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Total Grant</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              {displayGrantRange(totalGrantRange)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="h6" />
    </TableContainer>
  );
};

export default MiniGrantsResult;
