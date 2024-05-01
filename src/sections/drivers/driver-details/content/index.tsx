import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { SingleDriver } from 'src/@types/dashboard-drivers';
import {
  getDriverDetails,
  getVehicleDetails,
} from 'src/helper-functions/drivers-dashboard-actions';

import DriverCard from './driver-card';
import VehicleData from './vehicle-data';
import DriverDetailActions from './actions';

const DriverDetails = ({ details }: { details: SingleDriver }) => {
  const driver = getDriverDetails(details);
  const vehicle = getVehicleDetails(details);
  return (
    <Container maxWidth="xl">
      <Stack spacing={8}>
        <DriverCard driver={driver} />
        <VehicleData vehicle={vehicle} />
        <Box alignSelf="end">
          <DriverDetailActions status={driver.driver_status} id={driver.id} />
        </Box>
      </Stack>
    </Container>
  );
};

export default DriverDetails;
