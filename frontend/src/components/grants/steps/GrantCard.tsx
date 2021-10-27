import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';
import { displayGrantRange } from '../calculation/ParseGrantsForm';

interface Props {
  grantName: string;
  description: string;
  grantRange: { min: number; max: number };
  linkToHDB?: string;
}

const GrantCard = (props: Props) => {
  const { grantName, description, grantRange, linkToHDB } = props;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5">
          {grantName} : {displayGrantRange(grantRange)}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        {linkToHDB && (
          <Link
            href={`//${linkToHDB.slice(12)}`}
            target="_blank"
            rel="noopener"
            sx={{ paddingLeft: 1 }}
          >
            HDB Website
          </Link>
        )}
      </CardActions>
    </Card>
  );
};

export default GrantCard;
