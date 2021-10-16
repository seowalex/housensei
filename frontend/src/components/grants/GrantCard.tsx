import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
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
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image="/static/images/cards/contemplative-reptile.jpg"
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {grantName}
        </Typography>
        <Typography variant="h6" component="div">
          Value: ${value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={linkToHDB} />
      </CardActions>
    </Card>
  );
};

export default GrantCard;
