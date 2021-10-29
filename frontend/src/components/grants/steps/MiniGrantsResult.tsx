import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { FieldValues, UseFormWatch } from 'react-hook-form';
import {
  getEHGGrant,
  getFamilyGrant,
  getHalfHousingGrant,
  getProximityGrant,
  getSingleEHGGrant,
  getSingleGrant,
} from '../calculation/GrantCalculation';
import { parseFormValues } from '../calculation/GrantTreeRecursion';
import { displayGrantRange } from '../calculation/GrantsDisplayHelper';

interface Props {
  formWatch: UseFormWatch<FieldValues>;
}

const MiniGrantsResult = (props: Props) => {
  const { formWatch } = props;
  const values = formWatch();
  const fieldValues = parseFormValues(values);

  const ehgGrant = getEHGGrant(fieldValues);
  const familyGrant = getFamilyGrant(fieldValues);
  const halfHousingGrant = getHalfHousingGrant(fieldValues);
  const proximityGrant = getProximityGrant(fieldValues);
  const singleEhgGrant = getSingleEHGGrant(fieldValues);
  const singleGrant = getSingleGrant(fieldValues);

  const rows = [
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

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Grant</TableCell>
            <Tooltip
              title="Range of grant values that you're eligible for based on current selection"
              placement="top"
            >
              <TableCell>Eligible Value</TableCell>
            </Tooltip>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.grantName}
              sx={
                row.grantRange.max === 0
                  ? { textDecoration: 'line-through' }
                  : null
              }
            >
              <TableCell component="th" scope="row">
                {row.grantName}
              </TableCell>
              <TableCell sx={{ width: '120px', whiteSpace: 'nowrap' }}>
                {displayGrantRange(row.grantRange)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MiniGrantsResult;
