import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

const DriversViewSearch = () => {
  const [param, setParam] = useState('');
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const T = setTimeout(() => {
      createQueryString('driver_search', param);
    }, 100);
    return () => {
      clearTimeout(T);
    };
  }, [param, createQueryString]);
  return (
    <TextField
      fullWidth
      onChange={(e) => {
        setParam(e.target.value);
      }}
      value={param}
      placeholder={t('name_phone_email')}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default DriversViewSearch;
