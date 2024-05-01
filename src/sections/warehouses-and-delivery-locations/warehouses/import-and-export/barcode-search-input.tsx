import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useDebounce } from 'use-debounce';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { getSingleProductWithBarCode } from 'src/actions/product-actions';

import { RHFTextField } from 'src/components/hook-form';

const BarcodeSearchInput = ({ index }: { index: number }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { setValue, watch } = useFormContext();
  const code = watch(`products[${index}].barcode`);
  const isValid = watch(`products[${index}].isValid`);
  const [value] = useDebounce(code, 500);

  useEffect(() => {
    const getProduct = async () => {
      const singleProductRes = await getSingleProductWithBarCode({
        product_id_or_barcode: value,
      });
      if (singleProductRes?.error) {
        enqueueSnackbar(singleProductRes.error, { variant: 'error' });
        setValue(`products[${index}].productId`, '');
        setValue(`products[${index}].readOnly`, '');
        setValue(`products[${index}].mesurements`, []);
        setValue(`products[${index}].isValid`, false);
        return;
      }
      const {
        product: { product_id, name_ar, name_en },
        product_measurements,
      } = singleProductRes;
      const mesurements = product_measurements.map((measure: any) => {
        const { product_measurement_id, measurement_unit_ar, measurement_unit_en } = measure;
        return { product_measurement_id, measurement_unit_ar, measurement_unit_en };
      });

      setValue(`products[${index}].isValid`, true);
      setValue(`products[${index}].productId`, product_id);
      setValue(`products[${index}].readOnly`, getCustomNameKeyLang(name_en, name_ar));
      setValue(`products[${index}].mesurements`, mesurements);
    };

    if (value) {
      getProduct();
    } else {
      if (isValid === undefined) return;
      setValue(`products[${index}].productId`, '');
      setValue(`products[${index}].readOnly`, '');
      setValue(`products[${index}].mesurements`, []);
      setValue(`products[${index}].isValid`, false);
    }
  }, [value, setValue, index, enqueueSnackbar, isValid]);

  return (
    <Box my={2}>
      <RHFTextField
        label={t('barcode')}
        name={`products[${index}].barcode`}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor:
              value && isValid !== undefined && (isValid ? 'success.main' : 'error.main'),
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor:
              value && isValid !== undefined && (isValid ? 'success.main' : 'error.main'),
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor:
              value && isValid !== undefined && (isValid ? 'success.main' : 'error.main'),
          },
        }}
      />
    </Box>
  );
};

export default BarcodeSearchInput;
