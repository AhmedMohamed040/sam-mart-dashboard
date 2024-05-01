'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { User, Address } from 'src/@types/orders';

import { GoogleMap } from 'src/components/map';

// ----------------------------------------------------------------------

type Props = {
  clientData: User;
  address: Address;
};
export default function ClientData({ clientData, address }: Props) {
  const { t } = useTranslate();
  return (
    <Card sx={{ py: 5, px: 3, minHeight: { md: '750px', xs: 'auto' } }}>
      <Box display="grid" alignItems="center">
        <Stack spacing={4}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {t('Client Data')}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('client name')}{' '}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {clientData?.username}{' '}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('phone number')}{' '}
            </Typography>{' '}
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              <Typography component="span" style={{ direction: 'ltr', display: 'inline-block' }}>
                {clientData?.phone}
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Email')}{' '}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {clientData?.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('address')}{' '}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {address.name}
            </Typography>
          </Box>
          <Box height="20rem">
            <GoogleMap
              staticPosition
              defaultPosition={{ lat: address.latitude, lng: address.longitude }}
              defaultZoom={15}
            />
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}
