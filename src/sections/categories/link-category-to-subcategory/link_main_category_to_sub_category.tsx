import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, ReactElement } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { ICategory } from 'src/@types/categories';
import { SubCategories } from 'src/@types/sub-categories';
import {
  linkMainCategoryToSubCategory,
  EditLinkedCategoryToSubCategory,
  EditMainCategoryToSubCategoryBody,
  linkMainCategoryToSubCategoryBody,
} from 'src/actions/categories-actions';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

export type section = {
  id?: string;
  section_id?: string | undefined;
  category_id?: string;
  is_active?: boolean;
  order_by?: number;
};
type Props = {
  open: boolean;
  onClose: VoidFunction;
  category?: section;
  children: ReactElement;
  LinkedSubCategories: SubCategories[];
  selectedSubcategory: ICategory | undefined;
  sectionCategoryId: string;
};

export default function LinkSectionToCategoryForm({
  category,
  open,
  onClose,
  children,
  LinkedSubCategories = [],
  selectedSubcategory,
  sectionCategoryId,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const NewUserSchema = Yup.object().shape({
    subcategory_id: Yup.object().shape({ id: Yup.string() }).required(t('category_id_is_required')),
    is_active: Yup.boolean().required(t('status_is_required')),
    order_by: Yup.number().required(t('order_is_required')),
  });
  const defaultValues = useMemo(
    () => ({
      subcategory_id: { id: selectedSubcategory?.id, name: selectedSubcategory?.name } || {
        id: '',
      },
      is_active: selectedSubcategory?.is_active || false,
      order_by: selectedSubcategory?.order_by || 0,
    }),
    [selectedSubcategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: selectedSubcategory ? defaultValues : undefined,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();

  const onSubmit = handleSubmit(async (data) => {
    if (selectedSubcategory) {
      const dataBody = {
        id: selectedSubcategory?.id,
        is_active: data.is_active,
        order_by: data?.order_by,
      };

      const res = await EditLinkedCategoryToSubCategory(
        dataBody as EditMainCategoryToSubCategoryBody
      );
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Updated success!'));
        onClose();
      }
    } else {
      const dataBody = {
        section_category_id: sectionCategoryId,
        subcategory_id: data?.subcategory_id?.id,
        is_active: data.is_active,
        order_by: data?.order_by,
      };

      const res = await linkMainCategoryToSubCategory(
        dataBody as linkMainCategoryToSubCategoryBody
      );
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
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
          {t(!selectedSubcategory ? 'link_category_to_subcategory' : 'edit_linked_category')}
        </DialogTitle>
        <DialogContent>
          <Box rowGap={3} columnGap={2} display="grid">
            {!selectedSubcategory ? (
              <>
                <Box sx={{ display: { xs: 'block', sm: 'block' } }} />
                {children}
              </>
            ) : (
              <Stack flexDirection="row" sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={selectedSubcategory?.logo}
                  alt={selectedSubcategory?.name}
                  sx={{ mr: 2 }}
                />
                <Typography variant="h6">{selectedSubcategory?.name_en}</Typography>
              </Stack>
            )}
            {!selectedSubcategory && category && LinkedSubCategories?.length > 0 && (
              <Stack flexDirection="row" gap={1} sx={{ maxWidth: '100%' }} flexWrap="wrap">
                {LinkedSubCategories?.map((cate: SubCategories) => (
                  <Chip
                    key={cate.id}
                    label={cate.name}
                    icon={<Iconify icon={`circle-flags:${cate.id?.toLowerCase()}`} />}
                    size="small"
                    variant="soft"
                    color="info"
                  />
                ))}
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
              label={t('state')}
              options={[
                { label: t(`Active`), value: true },
                { label: t(`inactive`), value: false },
              ]}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
