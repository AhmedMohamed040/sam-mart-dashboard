'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { D_Order_User } from 'src/@types/return-orders';

// ----------------------------------------------------------------------

type Props = {
  clientData: D_Order_User;
};
export default function ReturnOrderClientData({ clientData }: Props) {
  const { t } = useTranslate();
  return (
    <Card sx={{ py: 5, px: 3, height: '100%' }}>
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
              {clientData?.name}{' '}
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
        </Stack>
      </Box>
    </Card>
  );
}
