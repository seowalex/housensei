import { AddRounded as AddRoundedIcon } from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import { GroupFilters } from '../../types/history';
import { FlatType, Town } from '../../types/property';
import GroupCard from './GroupCard';

const AddGroupCard = styled(Card)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  borderStyle: 'dashed',
  height: '100%',
}));

const GroupList = () => {
  const filters: GroupFilters = {
    towns: [Town.AMK, Town.BDK, Town.PSR],
    flatTypes: [
      FlatType.ROOM_2,
      FlatType.ROOM_4,
      FlatType.GEN_3,
      FlatType.ROOM_4,
    ],
    minStorey: 13,
    maxStorey: 20,
    minFloorArea: 100,
    maxFloorArea: 120,
    minLeasePeriod: 80,
    maxLeasePeriod: 99,
    startYear: 2010,
    endYear: 2022,
  };

  return (
    <Paper sx={{ p: '1rem 0rem' }}>
      <Box sx={{ p: '1rem', maxHeight: '15rem', overflow: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <AddGroupCard>
              <CardActionArea sx={{ height: '100%' }}>
                <CardContent>
                  <Grid container alignItems="center" justifyContent="center">
                    <Grid item>
                      <AddRoundedIcon sx={{ fontSize: 100 }} color="primary" />
                    </Grid>
                    <Grid item>
                      <Typography variant="h4" color="primary">
                        Add Group
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardActionArea>
            </AddGroupCard>
          </Grid>
          <Grid item xs={6} md={3}>
            <GroupCard name="Group 1" filters={filters} />
          </Grid>
          <Grid item xs={6} md={3}>
            <GroupCard name="Group 1" filters={filters} />
          </Grid>
          <Grid item xs={6} md={3}>
            <GroupCard name="Group 1" filters={filters} />
          </Grid>
          <Grid item xs={6} md={3}>
            <GroupCard name="Group 1" filters={filters} />
          </Grid>
          <Grid item xs={6} md={3}>
            <GroupCard name="Group 1" filters={filters} />
          </Grid>
          <Grid item xs={6} md={3}>
            <GroupCard name="Group 1" filters={filters} />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default GroupList;
