import { useState } from 'react';
import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { IOrderDetails } from 'src/@types/orders';

import { getInvoice } from './orders-helper-function';
import InvoicePreviewDialog from './invoice-pdf-viewer';
// ----------------------------------------------------------------------
type Props = {
  order: IOrderDetails;
};

export default function OrderSummary({ order }: Props) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<string | undefined>(undefined);
  const invoiceController = useBoolean();

  const handleInvoice = async () => {
    setLoading(true);
    const res = await getInvoice(order.order_id);
    if (res?.error) {
      setLoading(false);
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      invoiceController.onTrue();
      setLoading(false);
      setPdfFile(res.url);
    }
  };
  return (
    <Card sx={{ pt: 4, pb: 2, px: 3, minHeight: '750px' }}>
      <Box display="grid" alignItems="center">
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {t('Order Summary')}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Payment Status')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {order?.is_paid === false ? t('unpaid') : t('Paid')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Order Number')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {order?.order_number}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Order Date')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {order?.delivery_day}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Section')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {order?.section.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Warehouse')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {order?.warehouse.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Number of Products')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {order?.order_products}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Delivery type')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {t(`${order?.delivery_type}`)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Delivery Fees')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {order?.delivery_fee}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Coupon')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              -
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Total')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {(Number(order?.total_price) + Number(order?.delivery_fee)).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Payment Method')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {t(`${order?.payment_method}`)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Order Status')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {t(`${order?.shipments.status}`)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Driver')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              {order?.shipments?.driver?.username
                ? order?.shipments?.driver?.username
                : t('No driver has been assigned yet')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle1" sx={{ mr: '10px' }}>
              {t('Payment process number')}
            </Typography>
            :
            <Typography variant="body1" sx={{ textAlign: 'end', flexGrow: 1, mr: 5 }}>
              -
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingButton variant="contained" loading={isLoading} onClick={handleInvoice}>
              {t('preview_invoice')}
            </LoadingButton>
          </Box>
          {pdfFile && (
            <InvoicePreviewDialog
              open={invoiceController.value}
              onClose={invoiceController.onFalse}
              src={pdfFile}
            />
          )}
        </Stack>
      </Box>
    </Card>
  );
}
