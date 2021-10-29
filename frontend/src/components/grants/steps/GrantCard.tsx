import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { displayGrantRange } from '../calculation/GrantsDisplayHelper';
import NewTabLink from '../../common/Link';

interface Props {
  grantName: string;
  description: string;
  grantRange: { min: number; max: number };
  linkToHDB?: string | Record<string, string>;
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
        <Typography variant="h5">{grantName}</Typography>
        <Typography gutterBottom variant="h5">
          Eligible value: {displayGrantRange(grantRange)}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        {typeof linkToHDB === 'string' && (
          <NewTabLink link={linkToHDB} label="HDB Website" />
        )}
        {typeof linkToHDB === 'object' && (
          <Grid container direction="column">
            {Object.keys(linkToHDB).map((condition) => (
              <Grid item>
                <NewTabLink
                  link={linkToHDB[condition]}
                  label={`HDB Website for ${condition}`}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </CardActions>
    </Card>
  );
};

export default GrantCard;
