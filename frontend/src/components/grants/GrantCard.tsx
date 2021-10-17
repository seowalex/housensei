import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';

interface Props {
  grantName: string;
  description: string;
  value: number;
  linkToHDB: string;
}

const GrantCard = (props: Props) => {
  const { grantName, description, value, linkToHDB } = props;
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {grantName}
        </Typography>
        <Typography variant="body1" component="div">
          Estimated Grant: ${value}
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
