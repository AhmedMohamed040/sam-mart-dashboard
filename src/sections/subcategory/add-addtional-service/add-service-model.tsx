'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { Services } from 'src/@types/services';
import { ProductMeasurement } from 'src/@types/products';

import AddServiceToMeasurement from './add-service-to-measurement';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  ProductMeasurements: ProductMeasurement[] | undefined;
  ProductImage: string;
  ProductName: string;
  product_id: string;
  services: Services[];
};

export default function AddServiceModel({
  open,
  onClose,
  ProductMeasurements,
  ProductImage,
  ProductName,
  product_id,
  services,
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
      <DialogTitle>{t('add_service')}</DialogTitle>
      <DialogContent>
        <Stack flexDirection="row" sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={ProductImage} alt={ProductName} sx={{ mr: 2 }} />
          <Typography variant="h6">{ProductName}</Typography>
        </Stack>
        <Box rowGap={3} columnGap={2}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              marginY: '20px',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {ProductMeasurements?.map((measurement) => (
              <AddServiceToMeasurement
                measurement={measurement}
                product_id={product_id}
                services={services}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
