import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import uuidv4 from 'src/utils/uuidv4';

import { useTranslate } from 'src/locales';
import { VEHICLE } from 'src/@types/dashboard-drivers';

import Image from 'src/components/image';

const VehicleData = ({ vehicle }: { vehicle: VEHICLE }) => {
  const {
    vehicle: { vehicle_type, vehicle_color, license_image, license_number },
  } = vehicle;
  const { t } = useTranslate();

  const VEHICLE_: { id: string; label: string; value: string }[] = [
    {
      id: uuidv4(),
      label: 'vehicle_type',
      value: vehicle_type,
    },
    {
      id: uuidv4(),
      label: 'vehicle_color',
      value: vehicle_color,
    },
    {
      id: uuidv4(),
      label: 'license_number',
      value: license_number,
    },
  ];
  const DRIVER_DETAILS = (
    <Stack>
      <Typography my={2}>{t('vehicle_details')}</Typography>
      <Grid
        container
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
        }}
        gap={2}
      >
        {VEHICLE_.map((_) => (
          <Grid item key={_.id}>
            <Stack direction="row" gap={4}>
              <Typography width="20%">{t(_.label)}:</Typography>
              <Typography>{_.value}</Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );

  return (
    <Stack direction="row" justifyContent="space-between">
      <Box flexGrow={1}>{DRIVER_DETAILS}</Box>
      <Stack width="50%" direction="row" gap={4}>
        <Typography>{t('license_image')}:</Typography>
        <Box width="70%">
          <Image src={license_image} ratio="16/9" />
        </Box>
      </Stack>
    </Stack>
  );
};

export default VehicleData;
