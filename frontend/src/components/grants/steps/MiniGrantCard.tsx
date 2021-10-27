import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { displayRange } from '../calculation/ParseGrantsForm';

interface Props {
  grantName: string;
  grantRange: { min: number; max: number };
}

const GrantCard = (props: Props) => {
  const { grantName, grantRange } = props;

  return (
    <Card
      sx={
        {
          // display: 'flex',
          // flexDirection: 'column',
          // justifyContent: 'space-between',
        }
      }
    >
      <CardContent>
        <Typography>
          {grantName} : {displayRange(grantRange)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GrantCard;
