import * as Yup from 'yup';
import { toFormData } from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { getNameKeyLang } from 'src/utils/helperfunction';

import { Units } from 'src/@types/units';
import { useTranslate } from 'src/locales';
import { addProduct } from 'src/actions/product-actions';
import { getImageUrl } from 'src/actions/storage-actions';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFUpload, RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export interface IProductForm {
  id?: string;
  name_ar: string;
  name_en: string;
  barcode: string;
  description_ar?: string;
  description_en?: string;
  is_active: boolean;
  is_recovered: boolean;
  product_images: ProductImage[];
  measurements: Measurement[];
}

export interface ProductImage {
  url: string;
  is_logo: boolean;
}

export interface Measurement {
  conversion_factor: number;
  measurement_unit_id: string;
  is_main_unit: boolean;
}

type Props = {
  product?: IProductForm;
  units: Units[];
};

export default function ProductForm({ product, units }: Props) {
  const { t } = useTranslate();
  const router = useRouter();
  const [state, setState] = useState([{ unitId: '', factor: '1' }]);
  const [measurementErrors, setMeasurementErrors] = useState<string[]>([]);
  const [isLogoIndex, setIsLogoIndex] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const SectionSchema = Yup.object().shape({
    name_ar: Yup.string().required(t('Name in Arabic is required')),
    name_en: Yup.string().required(t('Name in English is required')),
    barcode: Yup.string().required(t('Barcode is required')),
    description_ar: Yup.string(),
    description_en: Yup.string(),
    file: Yup.array().min(1, t('images_are_required')),
    is_recovered: Yup.boolean().required(t('this is required')),
    is_active: Yup.boolean().required(t('this is required')),
  });
  const defaultValues = useMemo(
    () => ({
      name_ar: product?.name_ar || '',
      name_en: product?.name_en || '',
      barcode: product?.barcode || '',
      file: product?.product_images || [],
      is_active: product?.is_active || false,
      is_recovered: product?.is_recovered || false,
      description_ar: product?.description_ar || '',
      description_en: product?.description_en || '',
      measurements: product?.measurements || [],
    }),
    [product]
  );

  const methods = useForm({
    resolver: yupResolver(SectionSchema),
    defaultValues: product ? defaultValues : { file: [] },
  });
  useEffect(() => {
    setMeasurementErrors([]);
  }, [state]);
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const onSubmit = handleSubmit(async (data) => {
    if (state[0]?.unitId === '') {
      setMeasurementErrors(['At least one measurement is required']);
      return;
    }
    setMeasurementErrors([]);

    const formData = new FormData();
    toFormData(data, formData);
    const images = formData.getAll('file[]') as File[];
    const image: FormData[] = [];
    images.forEach((i) => {
      image.push(new FormData());
      image[image.length - 1].set('file', i);
    });
    const imagesUrl: string[] = await Promise.all(
      image.map(async (i) => (await getImageUrl({ image: i })) as string)
    );
    try {
      const dataBody: IProductForm = {
        name_ar: data.name_ar,
        name_en: data.name_en,
        barcode: data.barcode,
        description_ar: data.description_ar,
        description_en: data.description_en,
        is_active: data.is_active,
        is_recovered: data.is_recovered,
        product_images: imagesUrl.map((imageUrl, index) => ({
          url: imageUrl,
          is_logo: !!(index === isLogoIndex),
        })),
        measurements: state.map((measurement, i) => ({
          conversion_factor: +measurement.factor,
          measurement_unit_id: measurement.unitId,
          is_main_unit: i === 0,
        })),
      };

      const res = await addProduct({ formData: dataBody });
      if (res === 200) {
        router.push('/dashboard/products/total');
      }
      if (res?.error) {
        enqueueSnackbar(res.error, { variant: 'error' });
      } else enqueueSnackbar(t(product ? t('Update success!') : t('Added success!')));
      // reset();
    } catch (error) {
      console.error(error);
    }
  });
  const handleDeleteUnit = (indexToDelete: Number) => {
    setState((prevState) => prevState.filter((_, index) => index !== indexToDelete));
  };
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
    (inputFile: File | string) => {
      const filtered = values.file && values.file?.filter((file: any) => file !== inputFile);
      setValue('file', filtered);
    },
    [setValue, values.file]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('file', []);
  }, [setValue]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUpload
                multiple
                thumbnail
                name="file"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                isLogoIndex={isLogoIndex}
                setIsLogoIndex={setIsLogoIndex}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container rowSpacing={3} columnSpacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="name_ar" label={t('Name in Arabic')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="name_en" label={t('Name in English')} />
              </Grid>
              <Grid item xs={12}>
                <RHFTextField name="barcode" label={t('Product Code')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="description_ar"
                  rows={3}
                  multiline
                  label={t('Description in Arabic')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="description_en"
                  rows={3}
                  multiline
                  label={t('Description in English')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFRadioGroup
                  row
                  name="is_active"
                  options={[
                    { label: t('Active'), value: true },
                    { label: t('Disabled'), value: false },
                  ]}
                  label={t('state')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFRadioGroup
                  row
                  name="is_recovered"
                  options={[
                    { label: t('yes'), value: true },
                    { label: t('no'), value: false },
                  ]}
                  label={t('is_recovered')}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                marginY: '20px',
                flexDirection: 'column',
              }}
            >
              {state.map((s, i) => (
                <Box
                  key={i}
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)', // 9 parts: 8 for input field and 1 for delete button
                  }}
                  sx={{ width: '100%', marginY: '10px' }}
                  position="relative"
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <InputLabel id={i as unknown as string}>
                      {i === 0 ? t('main_unit') : t('sub_unit')}
                    </InputLabel>
                    <Select
                      key={i}
                      labelId={i as unknown as string}
                      value={s.unitId}
                      onChange={(e) => {
                        const oldState = [...state];
                        oldState[i].unitId = e.target.value as string;
                        setState(oldState);
                      }}
                      name="measurements"
                    >
                      {units.map((u, j) => (
                        <MenuItem key={j} value={u?.id}>
                          {u[getNameKeyLang()]}
                        </MenuItem>
                      ))}
                    </Select>
                    {measurementErrors.length > 0 && (
                      <Box sx={{ color: 'red' }}>
                        {measurementErrors.map((error, index) => (
                          <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                            {error}
                          </span>
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      alignItems: 'flex-start',
                    }}
                  >
                    <InputLabel>{t('unit')} </InputLabel>
                    <TextField
                      disabled={i === 0}
                      type="number"
                      value={s?.factor}
                      sx={{ width: '100%' }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(event) => {
                        const { value } = event.target;
                        setState((prevState) => {
                          const newState = [...prevState];
                          newState[i] = { ...newState[i], factor: value };
                          return newState;
                        });
                      }}
                    />
                  </Box>
                  {i > 0 && (
                    <Box
                      sx={{
                        gridColumn: {
                          xs: '1',
                          sm: '3',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteUnit(i)}
                        sx={{
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '20px',
                          width: '20px',
                          height: '20px',
                        }}
                      >
                        X
                      </IconButton>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            {state[0].unitId !== '' && (
              <Button
                variant="contained"
                onClick={() => {
                  setState((prevState) => [...prevState, { unitId: '', factor: '' }]);
                }}
              >
                {t('add_new_unit')}
              </Button>
            )}
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!product ? t('add') : t('edit')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
