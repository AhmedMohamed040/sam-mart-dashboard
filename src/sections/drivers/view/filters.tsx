import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';

import uuidv4 from 'src/utils/uuidv4';
import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import { City, Region, Country } from 'src/@types/dashboard-drivers';

const REG_STATUS: { [key: string]: string }[] = [
  {
    id: uuidv4(),
    label: 'all',
    value: '',
  },
  {
    id: uuidv4(),
    label: 'VERIFIED',
    value: 'VERIFIED',
  },
  {
    id: uuidv4(),
    label: 'PENDING',
    value: 'PENDING',
  },
  {
    id: uuidv4(),
    label: 'INACTIVE',
    value: 'INACTIVE',
  },
  {
    id: uuidv4(),
    label: 'SUSPENDED',
    value: 'SUSPENDED',
  },
  {
    id: uuidv4(),
    label: 'BLOCKED',
    value: 'BLOCKED',
  },
];

const DriversViewFilters = ({
  cities,
  countries,
  regions,
}: {
  cities: City[] | [];
  countries: Country[];
  regions: Region[] | [];
}) => {
  const [places, setPlaces] = useState({
    country: {
      value: '',
      disabled: false,
    },
    city: {
      value: '',
      disabled: true,
    },
    region: {
      value: '',
      disabled: true,
    },
  });
  const [status, setStatus] = useState('');
  const [vehicleType, setVehilceType] = useState('');
  const [vehicleTypeValue] = useDebounce(vehicleType, 500);
  const [date, setDate] = useState<null | Date>(null);
  const { currentLang } = useLocales();
  const { t } = useTranslate();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (name === 'removeDate') {
        params?.delete('created_at');
        router.push(`${pathname}?${params.toString()}`);
        return;
      }
      if (name === 'removeVehicle') {
        params?.delete('vehicle_type');
        router.push(`${pathname}?${params.toString()}`);
        return;
      }
      params.set(name, value);
      if (name === 'country_id') {
        params?.delete('city_id');
        params?.delete('region_id');
      } else if (name === 'city_id') {
        params?.delete('region_id');
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );
  useEffect(() => {
    if (vehicleTypeValue) {
      createQueryString('vehicle_type', vehicleTypeValue);
    }
    if (vehicleTypeValue === '') {
      createQueryString('removeVehicle', vehicleTypeValue);
    }
  }, [vehicleTypeValue, createQueryString]);
  return (
    <Stack
      justifyContent="space-between"
      alignItems="center"
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
      }}
      gap={1}
      my={4}
    >
      <Box>
        <TextField
          select
          fullWidth
          label={t('status')}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            createQueryString('status', e.target.value);
          }}
        >
          {REG_STATUS.map((eachStatus) => (
            <MenuItem key={eachStatus.id} value={eachStatus.value}>
              {t(eachStatus.label)}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box>
        <DatePicker
          label={t('registration_date')}
          value={date}
          onChange={(value) => {
            if (value === null) {
              setDate(null);
              createQueryString('removeDate', '');
            } else {
              setDate(value);
              createQueryString('created_at', fDate(new Date(value)));
            }
          }}
          format="dd/MM/yyyy"
          slotProps={{
            actionBar: {
              actions: ['clear'],
            },
          }}
          sx={{
            backgroundColor: 'OsolColors.grey.lighter',
            width: '100%',
          }}
        />
      </Box>
      <Box>
        <TextField select fullWidth label={t('maximum_orders')} value="">
          <MenuItem value="">0</MenuItem>
        </TextField>
      </Box>
      <Box>
        <TextField
          fullWidth
          label={t('vehicle_type')}
          value={vehicleType}
          onChange={(e) => {
            setVehilceType(e.target.value);
          }}
        />
      </Box>
      <Box
        rowGap={1}
        columnGap={2}
        display="grid"
        gridColumn={{ sm: 'span 3', md: 'span 4' }}
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}
      >
        <TextField
          select
          fullWidth
          label={t('country')}
          value={places.country.value}
          onChange={(e) => {
            setPlaces((prev) => ({
              ...prev,
              country: {
                value: e.target.value,
                disabled: false,
              },
              city: {
                value: '',
                disabled: e.target.value === '',
              },
              region: {
                value: '',
                disabled: true,
              },
            }));
            createQueryString('country_id', e.target.value);
          }}
        >
          <MenuItem value="">{t('all')}</MenuItem>
          {countries.map((singleCountry) => (
            <MenuItem key={singleCountry.id} value={singleCountry.id}>
              {currentLang.value === 'en' ? singleCountry.name_en : singleCountry.name_ar}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label={t('city')}
          value={places.city.value}
          disabled={places.city.disabled || cities.length === 0}
          variant={places.city.disabled || cities.length === 0 ? 'filled' : 'outlined'}
          onChange={(e) => {
            setPlaces((prev) => ({
              ...prev,
              city: {
                value: e.target.value,
                disabled: prev.city.disabled,
              },
              region: {
                value: e.target.value === '' ? '' : prev.region.value,
                disabled: e.target.value === '',
              },
            }));
            createQueryString('city_id', e.target.value);
          }}
          sx={{
            opacity: places.city.disabled ? 0.4 : 1,
            borderRadius: 1,
          }}
        >
          <MenuItem value="">{t('all')}</MenuItem>
          {cities.map((singleCity) => (
            <MenuItem key={singleCity.id} value={singleCity.id}>
              {currentLang.value === 'en' ? singleCity.name_en : singleCity.name_ar}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label={t('region')}
          value={places.region.value}
          disabled={places.region.disabled || regions.length === 0}
          variant={places.region.disabled || regions.length === 0 ? 'filled' : 'outlined'}
          onChange={(e) => {
            setPlaces((prev) => ({
              ...prev,
              region: {
                value: e.target.value,
                disabled: prev.region.disabled,
              },
            }));
            createQueryString('region_id', e.target.value);
          }}
          sx={{
            opacity: places.region.disabled ? 0.4 : 1,
            borderRadius: 1,
          }}
        >
          <MenuItem value="">{t('all')}</MenuItem>
          {regions.map((singleRegion) => (
            <MenuItem key={singleRegion.id} value={singleRegion.id}>
              {currentLang.value === 'en' ? singleRegion.name_en : singleRegion.name_ar}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Stack>
  );
};

export default DriversViewFilters;
