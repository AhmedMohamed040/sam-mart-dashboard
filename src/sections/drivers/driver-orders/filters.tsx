import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';

import uuidv4 from 'src/utils/uuidv4';
import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

const REG_STATUS: { [key: string]: string }[] = [
  {
    id: uuidv4(),
    label: 'all',
    value: '',
  },
  {
    id: uuidv4(),
    label: 'PENDING',
    value: 'PENDING',
  },
  {
    id: uuidv4(),
    label: 'CONFIRMED',
    value: 'CONFIRMED',
  },
  {
    id: uuidv4(),
    label: 'PROCESSING',
    value: 'PROCESSING',
  },
  {
    id: uuidv4(),
    label: 'PICKED_UP',
    value: 'PICKED_UP',
  },
  {
    id: uuidv4(),
    label: 'DELIVERED',
    value: 'DELIVERED',
  },
  {
    id: uuidv4(),
    label: 'COMPLETED',
    value: 'COMPLETED',
  },
  {
    id: uuidv4(),
    label: 'RETURNED',
    value: 'RETRUNED',
  },
  {
    id: uuidv4(),
    label: 'CANCELLED',
    value: 'CANCELED',
  },
];

const DriverOrdersFilter = () => {
  const [status, setStatus] = useState('');
  const [date, setDate] = useState<null | Date>(null);
  const { t } = useTranslate();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (name === 'removeDate') {
        params?.delete('order_date');
        router.push(`${pathname}?${params.toString()}`);
        return;
      }
      params.set(name, value);
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
      }}
      gap={1}
      my={4}
      width={500}
      maxWidth="100%"
      mx="auto"
    >
      <Box>
        <TextField
          fullWidth
          select
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
          label={t('order_date')}
          value={date}
          onChange={(value) => {
            if (value === null) {
              setDate(null);
              createQueryString('removeDate', '');
            } else {
              setDate(value);
              createQueryString('order_date', fDate(value));
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
    </Stack>
  );
};

export default DriverOrdersFilter;
