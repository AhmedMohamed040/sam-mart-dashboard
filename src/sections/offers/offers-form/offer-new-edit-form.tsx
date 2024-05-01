import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { Offers } from 'src/@types/offers';
import { ISingleProduct, ProductMeasurement } from 'src/@types/products';
import { addOffer, editOffer, OfferFormBody } from 'src/actions/offers-actions';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';
import CutomAutocompleteView from 'src/components/AutoComplete/CutomAutocompleteView';

import {
  endDateCheckTest,
  quantityCheckTest,
  startDateCheckTest,
  discountValueCheckTest,
  maxOrderQuantityCheckTest,
  minOrderQuantityCheckTest,
} from './view/validation-schemas-for-offers';
// ----------------------------------------------------------------------

type AutoCompleteItem = { id: string; name: string; name_ar: string; name_en: string };
const emptyAutoCompleteItem = {
  id: '',
  name: '',
  name_ar: '',
  name_en: '',
};
export type OfferFormProps = {
  offer?: Offers;
  product?: ISingleProduct;
  nameSuggestions?: AutoCompleteItem[];
};

export default function OfferForm({ offer, product, nameSuggestions }: OfferFormProps) {
  const { t } = useTranslate();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { enqueueSnackbar } = useSnackbar();

  // Static AutoComplete Items
  const discountTypeItems: AutoCompleteItem[] = useMemo(
    () => [
      { id: 'value', name: 'VALUE', name_ar: 'قيمة محددة', name_en: 'Fixed Value' },
      { id: 'percentage', name: 'PERCENTAGE', name_ar: 'نسبة مئوية', name_en: 'Percentage' },
    ],
    []
  );

  const unitItems: AutoCompleteItem[] = useMemo(
    () =>
      product?.product_measurements.map((item: ProductMeasurement) => ({
        id: item.measurement_unit_id,
        name: item.measurement_unit_en,
        name_ar: item.measurement_unit_ar,
        name_en: item.measurement_unit_en,
      })) || [emptyAutoCompleteItem],
    [product]
  );
  const autoCompleteYupType = Yup.object().shape({
    id: Yup.string().required(),
    name: Yup.string().required(),
    name_ar: Yup.string().required(),
    name_en: Yup.string().required(),
  });

  const schema = Yup.object().shape({
    product: autoCompleteYupType.required(t('Product is required')),
    unit: autoCompleteYupType.required(t('Unit is required')),
    unitPrice: Yup.string().required(t('Unit is required to display the price')),
    discountType: autoCompleteYupType.required(),
    discountValue: discountValueCheckTest,
    newPrice: Yup.string().required(t('Unit is required to display the price')),
    quantity: quantityCheckTest,
    startDate: startDateCheckTest,
    endDate: endDateCheckTest,
    minOrderQuantity: minOrderQuantityCheckTest,
    maxOrderQuantity: maxOrderQuantityCheckTest,
    is_active: Yup.boolean().required(t('this is required')),
    description_ar: Yup.string().required(t('this is required')),
    description_en: Yup.string().required(t('this is required')),
  });
  const defaultValues = useMemo(
    () => ({
      product: {
        id: product?.product?.product_id || '',
        name: product?.product?.name_en || '',
        name_ar: product?.product?.name_ar || '',
        name_en: product?.product?.name_en || '',
      },
      unit: unitItems.find((item) => item.id === offer?.measurement_unit_id) || unitItems[0],
      unitPrice: '0',
      discountType:
        discountTypeItems.find((item) => item.name === offer?.offer_discount_type) ||
        discountTypeItems[0],
      discountValue: offer ? Number(offer?.offer_discount_value) : 0,
      newPrice: '0',
      quantity: offer?.offer_quantity || 0,
      startDate: offer?.offer_start_date || '',
      endDate: offer?.offer_end_date || '',
      minOrderQuantity: offer?.min_order_quantity || 0,
      maxOrderQuantity: offer?.mix_order_quantity || 0,
      is_active: offer?.offer_is_active || false,
      description_ar: offer?.product_offer_description_ar || '',
      description_en: offer?.product_offer_description_en || '',
    }),
    [product, offer, unitItems, discountTypeItems]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    trigger,
    formState: { isSubmitting, isValid, touchedFields },
  } = methods;

  const {
    minOrderQuantity: Least,
    maxOrderQuantity: Highest,
    quantity: Original,
    discountType: D_T,
    newPrice: NEW_PRICE,
  } = watch();
  useEffect(() => {
    if (
      touchedFields.minOrderQuantity ||
      touchedFields.maxOrderQuantity ||
      touchedFields.quantity
    ) {
      trigger(['minOrderQuantity', 'maxOrderQuantity', 'quantity']);
    }
    if (touchedFields.discountType && touchedFields.discountValue) {
      trigger(['discountValue']);
    }
  }, [Least, Highest, Original, D_T, trigger, touchedFields]);

  // Set UnitPrice
  const currentUnit = watch('unit')?.name_en;
  useEffect(() => {
    let currentUnitPrice = 'Choose a product to display the price';

    if (unitItems[0].id) {
      const productUnit = product?.product_measurements?.find(
        (item: any) => item.measurement_unit_en === currentUnit
      );
      if (productUnit) {
        currentUnitPrice =
          productUnit?.product_category_price?.product_price || "Unit doesn't have a price";
      } else {
        currentUnitPrice = 'Choose a unit to display the price';
      }
    }

    setValue('unitPrice', t(currentUnitPrice));
  }, [currentUnit, product?.product_measurements, setValue, unitItems, t]);

  // Reset currentUnit when change units
  useEffect(() => {
    const updatedUnit = unitItems.find((item: AutoCompleteItem) => item.name_en === currentUnit);
    if (updatedUnit) {
      setValue('unit', updatedUnit);
    } else {
      setValue('unit', emptyAutoCompleteItem);
    }
  }, [currentUnit, setValue, unitItems]);

  // Set NewPrice
  const unitPrice = watch('unitPrice');
  const discountValue = watch('discountValue');
  const discountType = watch('discountType')?.name;
  useEffect(() => {
    let newPrice = Number(unitPrice);
    if (unitPrice && discountValue) {
      newPrice =
        discountType === 'VALUE'
          ? +unitPrice - discountValue
          : +((+unitPrice * (100 - discountValue)) / 100).toFixed(2);
    }
    setValue(
      'newPrice',
      // eslint-disable-next-line no-nested-ternary
      (newPrice < 0 ? 0 : newPrice > +unitPrice ? unitPrice : newPrice).toString()
    );
  }, [discountType, discountValue, setValue, unitPrice]);

  const onSubmit = handleSubmit(async (data) => {
    const {
      startDate: start_date,
      endDate: end_date,
      quantity,
      minOrderQuantity,
      maxOrderQuantity,
      discountType: discount_type,
      discountValue: discount_value,
      is_active,
      unit,
      description_ar,
      description_en,
    } = data;

    const dataBody: OfferFormBody = {
      start_date: fDate(new Date(start_date).toISOString()),
      end_date: fDate(new Date(end_date).toISOString()),
      offer_quantity: quantity,
      min_offer_quantity: minOrderQuantity,
      max_offer_quantity: maxOrderQuantity,
      discount_type: discount_type.name,
      discount_value,
      is_active: is_active || false,
      description_ar,
      description_en,
    };

    if (offer) {
      const res = await editOffer({ OfferID: offer.offer_id || '', dataBody });
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Edit success!'));
        router.back();
      }
    } else {
      const productCategoryPriceId =
        product?.product_measurements?.find((item) => item.measurement_unit_id === unit.id)
          ?.product_category_price?.product_category_price_id || '';
      const res = await addOffer({ productCategoryPriceId, dataBody });
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Added success!'));
        router.push(paths.dashboard.offers);
      }
    }
  });

  // Search for product
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, mb: 1 }}>
        <Grid container spacing={2}>
          {/* Col One */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <CutomAutocompleteView
                name="product"
                items={nameSuggestions || ([] as AutoCompleteItem[])}
                label={t('Choose a product')}
                placeholder={t('Choose a product')}
                onCustomChange={(value: any) => createQueryString('product', value?.id)}
                isDisabled={Boolean(offer)}
                searchQuery={!product ? 'search' : undefined}
              />
              <CutomAutocompleteView
                name="unit"
                items={unitItems}
                label={t('unit')}
                placeholder={t('unit')}
                isDisabled={!product || Boolean(offer)}
              />
              <RHFTextField
                disabled
                name="unitPrice"
                fullWidth
                type="text"
                label={t('Unit price')}
                placeholder={t('Unit price')}
                inputProps={{ readOnly: true }}
              />
              <CutomAutocompleteView
                name="discountType"
                items={discountTypeItems}
                label={t('discount_type')}
                placeholder={t('discount_type')}
              />
              <RHFTextField
                name="discountValue"
                fullWidth
                type="number"
                label={t('Percentage / Value')}
                placeholder={t('Percentage / Value')}
              />
              <RHFTextField
                disabled
                name="newPrice"
                fullWidth
                type="number"
                label={t('New price')}
                placeholder={t('New price')}
                inputProps={{ readOnly: true }}
              />
              <RHFTextField
                label={t('Description in Arabic')}
                name="description_ar"
                defaultValue={offer?.product_offer_description_ar}
                multiline
                rows={10}
                dir="rtl"
              />
            </Stack>
          </Grid>

          {/* Col Two */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              {/* Date */}
              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label={t('start_date')}
                    format="dd-MM-yyyy"
                    value={new Date(field.value)}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      trigger(['startDate', 'endDate']);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                      actionBar: { actions: ['clear'] },
                    }}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label={t('end_date')}
                    format="dd-MM-yyyy"
                    value={new Date(field.value)}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      trigger(['startDate', 'endDate']);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                      actionBar: { actions: ['clear'] },
                    }}
                  />
                )}
              />
              {/* Orders Count */}
              <RHFTextField
                fullWidth
                name="quantity"
                type="number"
                label={t('quantity')}
                placeholder={t('quantity')}
              />
              <RHFTextField
                fullWidth
                name="maxOrderQuantity"
                type="number"
                label={t('Max order quantity')}
                placeholder={t('Max order quantity')}
              />
              <RHFTextField
                fullWidth
                name="minOrderQuantity"
                type="number"
                label={t('Min order quantity')}
                placeholder={t('Min order quantity')}
              />
              {/* Is Active */}
              <RHFRadioGroup
                row
                name="is_active"
                options={[
                  { label: t('Active'), value: true },
                  { label: t('Disabled'), value: false },
                ]}
                label={t('state')}
              />
              <RHFTextField
                label={t('Description in English')}
                name="description_en"
                defaultValue={offer?.product_offer_description_en}
                multiline
                rows={10}
                dir="ltr"
              />
            </Stack>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box width="fit-content" marginInlineStart="auto" sx={{ mt: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={!isValid && !(+NEW_PRICE >= 0)}
            loading={isSubmitting}
          >
            {!offer ? t('add') : t('edit')}
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}
