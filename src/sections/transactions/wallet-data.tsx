'use client';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import uuidv4 from 'src/utils/uuidv4';
import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { WalletInformation } from 'src/@types/walelt-and-transactions';

interface Props {
  wallet: WalletInformation;
  userType: 'client' | 'driver';
}

export default function WalletData({ wallet, userType }: Props) {
  const { t } = useTranslate();

  const RIGHT_COLUMN = [
    {
      id: uuidv4(),
      label: userType,
      value: wallet.user.name,
    },
    {
      id: uuidv4(),
      label: 'email',
      value: wallet.user.email,
    },
    {
      id: uuidv4(),
      label: 'wallet_balance',
      value: (
        <Typography component="span" style={{ display: 'inline-block', direction: 'ltr' }}>
          {wallet.balance}
        </Typography>
      ),
    },
    {
      id: uuidv4(),
      label: 'limit',
      value: wallet.limit,
    },
  ];
  const LEFT_COLUMN = [
    {
      id: uuidv4(),
      label: 'created_at',
      value: fDate(wallet.created_at || '', 'dd-MM-yyyy'),
    },
    {
      id: uuidv4(),
      label: 'updated_at',
      value: fDate(wallet.updated_at || '', 'dd-MM-yyyy'),
    },
    {
      id: uuidv4(),
      label: 'deleted_at',
      value: fDate(wallet.deleted_at || '', 'dd-MM-yyyy'),
    },
  ];

  return (
    <Card sx={{ p: 3, mb: 1 }}>
      <Typography variant="h4" mb={4}>
        {t('wallet_information')}
      </Typography>
      <Grid
        container
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        gap={4}
      >
        <Grid item display="grid" gap={4}>
          {RIGHT_COLUMN.map((cell) => (
            <Stack key={cell.id} direction="row" alignItems="center">
              <Typography minWidth="35%">{t(cell.label)}</Typography>
              <Typography>: {cell.value}</Typography>
            </Stack>
          ))}
        </Grid>
        <Grid item display="grid" gap={4}>
          {LEFT_COLUMN.map((cell) => (
            <Stack key={cell.id} direction="row" alignItems="center">
              <Typography minWidth="35%">{t(cell.label)}</Typography>
              <Typography>: {cell.value}</Typography>
            </Stack>
          ))}
        </Grid>
      </Grid>
    </Card>
  );
}
