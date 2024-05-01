import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { RHFUpload, RHFSelect, RHFTextField } from 'src/components/hook-form';

const VEHICLE_TYPES = ['TRUCK', 'SADAN', 'VAN'];

const VehicleData = () => {
  const { t } = useTranslate();
  const { setValue } = useFormContext();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('license_image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  return (
    <Card sx={{ p: 3, ml: 3, mb: 1 }}>
      <Typography variant="h4" mb={4}>
        {t('vehicle_data')}
      </Typography>
      <Grid
        container
        width="100%"
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          md: 'repeat(2, 1fr)',
        }}
        gap={4}
      >
        <Grid display="flex" flexDirection="column" gap={4}>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: '1fr',
              md: '0.5fr 1fr',
            }}
            rowGap={2}
            alignItems="center"
          >
            <FormLabel htmlFor="VEHICLE_TYPE">
              <Typography>{t('vehicle_type')}</Typography>
            </FormLabel>
            <RHFSelect id="VEHICLE_TYPE" name="vehicle_type">
              {VEHICLE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </RHFSelect>
          </Box>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: '1fr',
              md: '0.5fr 1fr',
            }}
            rowGap={2}
            alignItems="center"
          >
            <FormLabel htmlFor="VEHICLE_COLOR">
              <Typography>{t('vehicle_color')}</Typography>
            </FormLabel>
            <RHFTextField
              id="VEHICLE_COLOR"
              autoComplete="off"
              autoCorrect="off"
              name="vehicle_color"
            />
          </Box>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: '1fr',
              md: '0.5fr 1fr',
            }}
            rowGap={2}
            alignItems="center"
          >
            <FormLabel htmlFor="VEHICLE_ID">
              <Typography>{t('license_number')}</Typography>
            </FormLabel>
            <RHFTextField
              id="VEHICLE_ID"
              autoComplete="off"
              autoCorrect="off"
              name="license_number"
            />
          </Box>
        </Grid>
        <Grid item>
          <Box display="grid" gap={2}>
            <FormLabel htmlFor="VEHICLE_LICENSE">
              <Typography>{t('license_image')}</Typography>
            </FormLabel>
            <RHFUpload name="license_image" onDrop={handleDrop} />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default VehicleData;
