import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';

import { RHFSelect, RHFTextField } from 'src/components/hook-form';

const ProductInputs = ({ index }: { index: number }) => {
  const { t } = useTranslate();
  const { watch, getValues } = useFormContext();

  const isProductValid = watch(`products[${index}].readOnly`);
  const mesurements = getValues(`products[${index}].mesurements`);

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        sx: 'repeat(1, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
      gap={2}
    >
      <RHFTextField
        label={t('product')}
        name={`products[${index}].readOnly`}
        aria-readonly
        disabled
        aria-disabled
      />
      <RHFSelect
        label={t('unit')}
        name={`products[${index}].unitSelect`}
        disabled={!isProductValid}
      >
        {isProductValid ? (
          mesurements.map((measure: any) => (
            <MenuItem key={measure.product_measurement_id} value={measure.product_measurement_id}>
              {getCustomNameKeyLang(measure.measurement_unit_en, measure.measurement_unit_ar)}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="" />
        )}
      </RHFSelect>
      <RHFTextField
        name={`products[${index}].quantity`}
        type="number"
        label={t('quantity')}
        disabled={!isProductValid}
      />
    </Box>
  );
};

export default ProductInputs;
