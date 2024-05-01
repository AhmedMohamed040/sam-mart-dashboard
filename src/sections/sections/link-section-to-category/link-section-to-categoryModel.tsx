import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, ReactElement } from 'react';
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

import { useTranslate } from 'src/locales';
import { ICategory } from 'src/@types/categories';
import {
  linkSectionToMainCategory,
  EditLinkedCategoryInSection,
  linkSectionToMainCategoryBody,
} from 'src/actions/sections-actions';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

import { ISectionCategory } from 'src/types/section-category';

export type section = {
  id?: string;
  section_id: string | undefined;
  category_id?: string;
  is_active?: boolean;
  order_by?: number;
};
type Props = {
  open: boolean;
  onClose: VoidFunction;
  section?: section;
  children: ReactElement;
  LinkedCategories: ICategory[];
  selectedCategory: ISectionCategory | undefined;
};

export default function LinkSectionToCategoryForm({
  section,
  open,
  onClose,
  children,
  LinkedCategories = [],
  selectedCategory,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const NewUserSchema = Yup.object().shape({
    category_id: Yup.object().shape({ id: Yup.string() }).required(t('category_id_is_required')),
    is_active: Yup.boolean().required(t('status_is_required')),
    order_by: Yup.number()
      .min(1, t("can't_be_less_than_1"))
      .required(t('order_is_required'))
      .integer(t('must_be_an_integer'))
      .typeError(t('must_be_a_valid_number')),
  });

  const defaultValues = useMemo(
    () => ({
      category_id: { id: selectedCategory?.id, name: selectedCategory?.name } || {
        id: '',
      },
      is_active: selectedCategory?.is_active || false,
      order_by: selectedCategory?.order_by || 0,
    }),
    [selectedCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: selectedCategory ? defaultValues : undefined,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();

  const onSubmit = handleSubmit(async (data) => {
    if (selectedCategory) {
      const dataBody = {
        id: selectedCategory?.id,
        is_active: data.is_active,
        order_by: data?.order_by,
      };
      const res = await EditLinkedCategoryInSection(dataBody as linkSectionToMainCategoryBody);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Updated success!'));
        onClose();
      }
    } else {
      const dataBody = {
        section_id: section?.section_id,
        category_id: data?.category_id?.id,
        is_active: data.is_active,
        order_by: data?.order_by,
      };
      const res = await linkSectionToMainCategory(dataBody as linkSectionToMainCategoryBody);
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
          {t(!selectedCategory ? 'link_section_to_main_category' : 'edit_linked_category')}
        </DialogTitle>
        <DialogContent>
          <Box rowGap={3} columnGap={2} display="grid">
            {!selectedCategory ? (
              <>
                <Box sx={{ display: { xs: 'block', sm: 'block' } }} />
                {children}
              </>
            ) : (
              <Stack flexDirection="row" sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={selectedCategory?.logo} alt={selectedCategory?.name} sx={{ mr: 2 }} />
                <Typography variant="h6">{selectedCategory?.name}</Typography>
              </Stack>
            )}
            {!selectedCategory && section && LinkedCategories?.length > 0 && (
              <Stack flexDirection="row" gap={1} sx={{ maxWidth: '100%' }} flexWrap="wrap">
                {LinkedCategories?.map((cate: ICategory) => (
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
              label={t(`is active`)}
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
