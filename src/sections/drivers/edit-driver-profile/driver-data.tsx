import { useState, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import { DatePicker } from '@mui/x-date-pickers';
import Typography from '@mui/material/Typography';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { City, Region, Country } from 'src/@types/dashboard-drivers';
import { getCities, getRegions } from 'src/actions/drivers-dashboard-actions';

import { RHFSelect, RHFUpload, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

interface Props {
  countries: Country[];
  cities: City[] | [];
  regions: Region[] | [];
}

const DriverData = ({ countries, cities, regions }: Props) => {
  const { control, watch, setValue } = useFormContext();
  const [allCities, setCities] = useState<City[] | []>(cities);
  const [allRegions, setRegions] = useState<Region[] | []>(regions);
  const { t } = useTranslate();
  const countryId = watch('country_id');

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarFile', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  const handleIDDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('id_card_image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <Card sx={{ p: 3, ml: 3, mb: 1 }}>
      <Typography variant="h4" mb={4}>
        {t('driver_data')}
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
        <Grid
          item
          gridColumn={{
            xs: 'span 1',
            md: 'span 2',
          }}
          mb={4}
        >
          <RHFUploadAvatar
            name="avatarFile"
            onDrop={handleDrop}
            helperText={
              <Typography
                variant="caption"
                sx={{
                  mt: 3,
                  mx: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.disabled',
                }}
              >
                {t('driver_picture')}
              </Typography>
            }
          />
        </Grid>
        <Grid item display="flex" flexDirection="column" gap={4}>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: '1fr',
              md: '0.5fr 1fr',
            }}
            rowGap={2}
            alignItems="center"
          >
            <FormLabel htmlFor="DRIVER_NAME">
              <Typography>{t('driver_name')}</Typography>
            </FormLabel>
            <RHFTextField autoComplete="off" autoCorrect="off" id="DRIVER_NAME" name="username" />
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
            <FormLabel htmlFor="DRIVER_ID">
              <Typography>{t('national_residence_id')}</Typography>
            </FormLabel>
            <RHFTextField
              autoComplete="off"
              autoCorrect="off"
              id="DRIVER_ID"
              name="id_card_number"
              type="number"
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
            <FormLabel htmlFor="DRIVER_PHONE">
              <Typography>{t('phone')}</Typography>
            </FormLabel>
            <RHFTextField
              autoComplete="off"
              autoCorrect="off"
              id="DRIVER_PHONE"
              name="phone"
              sx={{
                '& .MuiOutlinedInput-input': {
                  textAlign: 'left',
                  direction: getCustomNameKeyLang('ltr', 'rtl'),
                },
              }}
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
            <FormLabel htmlFor="DRIVER_EMAIL">
              <Typography>{t('email')}</Typography>
            </FormLabel>
            <RHFTextField
              autoComplete="off"
              autoCorrect="off"
              id="DRIVER_EMAIL"
              name="email"
              type="email"
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
            <FormLabel htmlFor="DRIVER_BIRTHDATE">
              <Typography>{t('birth_date')}</Typography>
            </FormLabel>
            <Controller
              name="birth_date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  format="dd-MM-yyyy"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
          </Box>
        </Grid>
        <Grid item display="flex" flexDirection="column" gap={4}>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: '1fr',
              md: '0.5fr 1fr',
            }}
            rowGap={2}
            alignItems="center"
          >
            <FormLabel htmlFor="COUNTRY">
              <Typography>{t('country')}</Typography>
            </FormLabel>
            <RHFSelect
              id="COUNTRY"
              name="country_id"
              onChange={async (e) => {
                setValue('country_id', e.target.value, { shouldValidate: true });
                setValue('city_id', '', { shouldValidate: true });
                setValue('region_id', '', { shouldValidate: true });
                const resCities = await getCities(e.target.value);
                setCities(resCities);
                setRegions([]);
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.id}>
                  {getCustomNameKeyLang(country.name_en, country.name_ar)}
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
            <FormLabel htmlFor="CITY">
              <Typography>{t('city')}</Typography>
            </FormLabel>
            <RHFSelect
              id="CITY"
              name="city_id"
              disabled={!countryId || allCities.length === 0}
              variant={!countryId || allCities.length === 0 ? 'filled' : 'outlined'}
              onChange={async (e) => {
                setValue('city_id', e.target.value, { shouldValidate: true });
                setValue('region_id', '', { shouldValidate: true });
                const resRegions = await getRegions(e.target.value);
                setRegions(resRegions);
              }}
            >
              {(!countryId || allCities.length === 0) && <MenuItem value="" />}
              {countryId &&
                allCities.length !== 0 &&
                allCities?.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {getCustomNameKeyLang(city.name_en, city.name_ar)}
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
            <FormLabel htmlFor="REGION">
              <Typography>{t('region')}</Typography>
            </FormLabel>
            <RHFSelect
              id="REGION"
              name="region_id"
              disabled={!countryId || allCities.length === 0 || allRegions.length === 0}
              variant={
                !countryId || allCities.length === 0 || allRegions.length === 0
                  ? 'filled'
                  : 'outlined'
              }
            >
              {(!countryId || allCities.length === 0 || allRegions.length === 0) && (
                <MenuItem value="" />
              )}
              {countryId &&
                allCities.length !== 0 &&
                allRegions.length !== 0 &&
                allRegions?.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {getCustomNameKeyLang(region.name_en, region.name_ar)}
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
            <FormLabel htmlFor="DRIVER_REGDATE">
              <Typography>{t('registration_date')}</Typography>
            </FormLabel>
            <Controller
              name="created_at"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  format="dd-MM-yyyy"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
          </Box>
        </Grid>
        <Grid
          item
          gridColumn={{
            xs: 'span 1',
          }}
          mb={4}
        >
          <Box display="grid" gap={2}>
            <FormLabel htmlFor="ID_CARD_IMAGE">
              <Typography>{t('id_picture')}</Typography>
            </FormLabel>
            <RHFUpload name="id_card_image" onDrop={handleIDDrop} />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default DriverData;
