import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';

interface Props {
  grantName: string;
  description: string;
  grantRange: { min: number; max: number };
  linkToHDB: string;
}

const GrantCard = (props: Props) => {
  const { grantName, description, grantRange, linkToHDB } = props;

  const grantRangeDisplay = `$${
    grantRange.min === grantRange.max
      ? grantRange.min
      : `${grantRange.min} - ${grantRange.max}`
  }`;

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {grantName} - {grantRangeDisplay}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`Sth here${description}`}
        </Typography>
        <Link href={linkToHDB} target="_blank" rel="noopener">
          HDB Website
        </Link>
      </CardContent>
      <CardActions />
    </Card>
  );
};

export default GrantCard;
