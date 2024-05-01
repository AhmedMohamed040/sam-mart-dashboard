import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { ProductMeasurement } from 'src/@types/products';

import SinglePriceForm from './singlePriceForm';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  ProductMeasurements: ProductMeasurement[] | undefined;
  ProductImage: string;
  ProductName: string;
  product_id: string;
};

export default function LinkToPriceForm({
  open,
  onClose,
  ProductMeasurements,
  ProductImage,
  ProductName,
  product_id,
}: Props) {
  const { t } = useTranslate();
  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>{t('Add Product Price')}</DialogTitle>
      <DialogContent>
        <Stack flexDirection="row" sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={ProductImage} alt={ProductName} sx={{ mr: 2 }} />
          <Typography variant="h6">{ProductName}</Typography>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            marginY: '20px',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {ProductMeasurements !== undefined &&
            ProductMeasurements?.map((measurement, index) => (
              <Box
                display="flex"
                alignItems="start"
                key={measurement?.product_measurement_id}
                order={measurement?.is_main_unit ? 0 : 1}
                gap={4}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '12%' }}>
                  <InputLabel>
                    {measurement?.is_main_unit ? t('main_unit') : t('sub_unit')}
                  </InputLabel>
                  <Typography variant="subtitle2">
                    {getCustomNameKeyLang(
                      measurement?.measurement_unit_ar,
                      measurement?.measurement_unit_en
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    alignItems: 'flex-start',
                    flexGrow: 1,
                  }}
                >
                  <SinglePriceForm
                    price={Number(measurement?.product_category_price?.product_price)}
                    max_order_quantity={Number(
                      measurement?.product_category_price?.max_order_quantity
                    )}
                    min_order_quantity={Number(
                      measurement?.product_category_price?.min_order_quantity
                    )}
                    product_measurement_id={measurement?.product_measurement_id}
                    product_sub_category_id={product_id}
                    onClose={onClose}
                  />
                </Box>
              </Box>
            ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
