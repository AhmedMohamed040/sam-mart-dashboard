import * as Yup from 'yup';
import { toFormData } from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { Product } from 'src/@types/products';
import {
  addProductImage,
  updateProductLogo,
  deleteProductImage,
} from 'src/actions/product-actions';

import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFUpload } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export interface Image {
  file: File;
  is_logo: boolean;
}

interface OldImage {
  url: string;
  is_logo: boolean;
  id: string;
}
type Props = {
  product?: Product;
};

export default function ProductEditImages({ product }: Props) {
  const { t } = useTranslate();
  const confirm = useBoolean();
  const [isLogoIndex, setIsLogoIndex] = useState(
    product?.product_images?.findIndex((x) => x.is_logo) ?? 0
  );
  const [idToDelete, setIdToDelete] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const SectionSchema = Yup.object().shape({
    file: Yup.array().min(1, t('images_are_required')),
  });
  const methods = useForm({
    resolver: yupResolver(SectionSchema),
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    setValue('file', product?.product_images || []);
  }, [product, setValue]);

  const values = watch();
  const onSubmit = handleSubmit(async (data) => {
    const newImages: File[] = data?.file?.filter((item: any) => !item?.url) || [];
    const oldImagess: OldImage[] = data?.file?.filter((item: any) => item?.url) || [];
    const finalImages: (File | OldImage)[] = [...oldImagess, ...newImages];
    const formData = new FormData();
    // eslint-disable-next-line no-unsafe-optional-chaining

    if (newImages && newImages.length > 0) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      if (isLogoIndex <= oldImagess?.length - 1) {
        const res = await updateProductLogo(oldImagess[isLogoIndex]?.id, product?.product_id);
        if (res?.error) {
          enqueueSnackbar(`${res?.error}`, { variant: 'error' });
        }
      }
      // eslint-disable-next-line no-plusplus, no-unsafe-optional-chaining
      for (let i = 0; i < finalImages.length; i++) {
        if (!(finalImages[i] as OldImage)?.url) {
          const image = finalImages[i] as File;
          const dataBody: Image = {
            file: image,
            is_logo: i === isLogoIndex,
          };
          formData.delete('file');
          formData.delete('is_logo');

          toFormData(dataBody, formData);

          // eslint-disable-next-line no-await-in-loop
          const res = await addProductImage(formData, product?.product_id);
          if (res?.error) {
            enqueueSnackbar(`${res?.error}`, { variant: 'error' });
          }
        }
      }

      enqueueSnackbar(t('Added success!'));
    } else {
      const res = await updateProductLogo(oldImagess[isLogoIndex]?.id, product?.product_id);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Update success!'));
      }
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.file || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('file', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.file]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string | { url?: string; id?: string }) => {
      if (typeof inputFile === 'object' && inputFile !== null && 'url' in inputFile) {
        if ('id' in inputFile && typeof inputFile.id === 'string') {
          setIdToDelete(inputFile.id);
          confirm.onTrue();
        }
      } else {
        const filtered = values.file && values.file?.filter((file: any) => file !== inputFile);
        setValue('file', filtered);
      }
    },
    [confirm, setValue, values.file]
  );

  const handleConfirmDelete = async () => {
    const res = await deleteProductImage(idToDelete, product?.product_id);
    if (res?.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(t('Deleted success!'));
    }
    confirm.onFalse();
  };
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ paddingTop: '20px', p: 3 }}>
            <Box>
              <RHFUpload
                multiple
                thumbnail
                name="file"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                // onRemoveAll={handleRemoveAllFiles}
                isLogoIndex={isLogoIndex}
                setIsLogoIndex={setIsLogoIndex}
              />
            </Box>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'end',
                paddingX: {
                  xs: '30px',
                  md: '8px',
                },
              }}
            >
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!product ? t('add') : t('save')}
              </LoadingButton>
            </Box>
          </Card>
          <ConfirmDialog
            open={confirm.value}
            onClose={confirm.onFalse}
            title={t('delete')}
            content={t('delete_confirm')}
            action={
              <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                {t('delete')}
              </Button>
            }
          />
        </Grid>
      </Grid>
    </FormProvider>
  );
}
