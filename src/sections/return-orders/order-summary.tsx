'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { D_ReturnOrder_Driver } from 'src/@types/return-orders';
// ----------------------------------------------------------------------
type Props = {
  order: {
    orderId: string;
    number: string;
    return_number: string;
    created_at: string | null;
    customer_note: string | null;
    quantity: number;
    totalPrice: string | number;
  };
  theDriver?: D_ReturnOrder_Driver;
};

export default function ReturnOrderSummary({ order, theDriver }: Props) {
  const { t } = useTranslate();
  return (
    <Card sx={{ pt: 4, pb: 2, px: 3, height: '100%' }}>
      <Box display="grid" alignItems="center">
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {t('Order Summary')}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('main_order_number')}
            </Typography>
            :
            <Typography
              component={RouterLink}
              href={`${paths.dashboard.ordersGroup.root}/${order.orderId}`}
              variant="body1"
              sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}
            >
              {order.number}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('return_order_number')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {order.return_number}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('return_order_date')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {fDate(order.created_at || '', 'dd-MM-yyyy')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('number_of_returned_products')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {order.quantity}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('returned_order_total_price')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {Number(order.totalPrice).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('customer_note')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {order.customer_note || '-'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Driver')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {theDriver?.username || '-'}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}
