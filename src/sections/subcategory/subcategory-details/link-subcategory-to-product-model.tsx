import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, ReactElement } from 'react';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { getNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { IProduct, ProductImage, ISingleProduct } from 'src/@types/products';
import {
  EditLinkedProduct,
  linkProductToSubcategory,
  linkProductToSubcategoryBody,
} from 'src/actions/sub-categories-actions';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  children: ReactElement;
  LinkedProducts: IProduct[];
  selectedProduct?: ISingleProduct;
  itemCount: number;
  subcategoryId: string;
  categorySubcategoryId: string;
};

export default function LinkProductToSubcategoryForm({
  open,
  onClose,
  children,
  LinkedProducts = [],
  selectedProduct,
  itemCount,
  subcategoryId: id,
  categorySubcategoryId,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const searchparams = useSearchParams();
  const limit =
    typeof searchparams?.get('limit') === 'string' ? Number(searchparams?.get('limit')) : 5;
  const NewUserSchema = Yup.object().shape({
    product_id: Yup.object()
      .shape({ product_id: Yup.string() })
      .required(t('category_id_is_required')),
    is_active: Yup.boolean().required(t('status_is_required')),
    order_by: Yup.number().required(t('order_is_required')),
  });
  const defaultValues = useMemo(
    () => ({
      product_id: {
        product_id: selectedProduct?.product?.product_sub_category_id,
        name: selectedProduct?.product?.name_ar,
      } || {
        id: '',
      },
      is_active: selectedProduct?.product_sub_category?.product_sub_category_is_active || false,
      order_by: selectedProduct?.product_sub_category?.product_sub_category_order_by || 0,
    }),
    [selectedProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: selectedProduct ? defaultValues : undefined,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (selectedProduct) {
      const dataBody = {
        product_id: data?.product_id?.product_id,
        order_by: data?.order_by,
        is_active: data?.is_active,
      };
      const res = await EditLinkedProduct(dataBody as linkProductToSubcategoryBody, id);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        reset();
        enqueueSnackbar(t('Updated success!'));
        onClose();
      }
    } else {
      const dataBody = {
        categorySubCategory_id: categorySubcategoryId,
        product_id: data?.product_id?.product_id,
        order_by: data?.order_by,
        is_active: data?.is_active,
      };
      const res = await linkProductToSubcategory(dataBody as linkProductToSubcategoryBody, id);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        reset();
        enqueueSnackbar(t('Linked success!'));
        onClose();
      }
    }
  });

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
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {t(!selectedProduct ? 'link_subcategory_to_product' : 'edit_linked_product')}
        </DialogTitle>
        <DialogContent>
          <Box rowGap={3} columnGap={2} display="grid">
            {!selectedProduct ? (
              <>
                <Box sx={{ display: { xs: 'block', sm: 'block' } }} />
                {children}
              </>
            ) : (
              <Stack flexDirection="row" sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={
                    selectedProduct?.product?.product_images.find((x: ProductImage) => x.is_logo)
                      ?.url
                  }
                  alt={selectedProduct?.product[getNameKeyLang()]}
                  sx={{ mr: 2 }}
                />
                <Typography variant="h6">{selectedProduct?.product[getNameKeyLang()]}</Typography>
              </Stack>
            )}
            {!selectedProduct && LinkedProducts?.length > 0 && (
              <Stack flexDirection="row" gap={1} sx={{ maxWidth: '100%' }} flexWrap="wrap">
                {LinkedProducts?.map((cate: IProduct) => (
                  <Chip
                    key={cate.product_sub_category_id}
                    label={cate[getNameKeyLang()]}
                    icon={
                      <Iconify
                        icon={`circle-flags:${cate.product_sub_category_id?.toLowerCase()}`}
                      />
                    }
                    size="small"
                    variant="soft"
                    color="info"
                  />
                ))}
                {itemCount > limit && (
                  <Chip
                    label={`+${itemCount - limit} Products`}
                    size="small"
                    variant="soft"
                    color="info"
                  />
                )}
              </Stack>
            )}
            <RHFTextField
              name="order_by"
              label={t('Order by')}
              placeholder="0"
              type="number"
              InputLabelProps={{ shrink: true }}
            />

            <RHFRadioGroup
              row
              name="is_active"
              label={t('is active')}
              options={[
                { label: t('Active'), value: true },
                { label: t('inactive'), value: false },
              ]}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('Cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('Save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
