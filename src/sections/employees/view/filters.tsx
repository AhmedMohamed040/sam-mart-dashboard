import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';

import uuidv4 from 'src/utils/uuidv4';
import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import { City, Country } from 'src/@types/dashboard-drivers';

const REG_STATUS: { [key: string]: string }[] = [
  {
    id: uuidv4(),
    label: 'all',
    value: '',
  },
];

const EmployeesViewFilters = ({
  cities,
  countries,
}: {
  cities: City[] | [];
  countries: Country[];
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
  });
  const [status, setStatus] = useState('');
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
      params.set(name, value);
      if (name === 'country_id') {
        params?.delete('city_id');
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );
  return (
    <Stack
      justifyContent="space-between"
      alignItems="center"
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)',
      }}
      gap={1}
      my={4}
    >
      <Box>
        <TextField
          select
          fullWidth
          label={t('permissions')}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            createQueryString('permissions', e.target.value);
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
          format="dd-MM-yyyy"
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
      </Box>
      <Box>
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
      </Box>
    </Stack>
  );
};

export default EmployeesViewFilters;
