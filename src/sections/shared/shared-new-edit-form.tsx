import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import FormProvider, {
  RHFCode,
  RHFSelect,
  RHFSwitch,
  RHFUpload,
  RHFCheckbox,
  RHFTextarea,
  RHFRadioGroup,
  RHFAutocomplete,
  RHFTextFieldForm,
  RHFUploadProduct,
} from 'src/components/hook-form';

import { Input } from 'src/types/form';

// ----------------------------------------------------------------------

type Props = {
  inputs: Input[];
  submitFunc: (data: any) => void;
  mood: string;
};

export default function SharedNewEditForm({ submitFunc, mood, inputs }: Props) {
  const { t } = useTranslate();

  const methods = useForm({
    // resolver: yupResolver(NewUserSchema) as any,
    // defaultValues,
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      //  await new Promise((resolve) => setTimeout(resolve, 500));
      //    enqueueSnackbar(mood === 'edit' ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard?.user.list);
      submitFunc(data);
      //
      // reset();
    } catch (error) {
      console.error(error);
    }
  });
  const deleteImage = (name?: string) => {
    setValue(name || 'avatarUrl', null, { shouldValidate: false });
  };
  const handleDrop = useCallback(
    (acceptedFiles: File[], name?: string) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue(name || 'prodectImage', newFile as any, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {inputs?.map((item: any, index: number) => (
                <Grid
                  item
                  key={index}
                  xs={12}
                  md={item?.fullGrid ? item.fullGrid : 6}
                  sx={{ '& .MuiFormHelperText-root': { textAlign: 'left' } }}
                >
                  {item?.inputType === 'textField' && (
                    <RHFTextFieldForm name={item?.name} {...item} />
                  )}
                  {item?.inputType === 'switch' && (
                    <RHFSwitch name={item?.name} label={item?.label} />
                  )}
                  {item?.inputType === 'select' && (
                    <RHFSelect name={item?.name} {...item}>
                      {item?.options.map((option: any, optionIndex: number) => (
                        <MenuItem key={optionIndex} value={option?.value}>
                          {option?.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  )}
                  {item?.inputType === 'uploadFile' && (
                    <RHFUpload
                      name={item?.name}
                      maxSize={3145728}
                      onDrop={(acceptedFiles) => handleDrop(acceptedFiles, item?.name)}
                      helperText={
                        mood === 'edit' ? (
                          <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                            <Button
                              onClick={() => deleteImage(item?.name)}
                              variant="soft"
                              color="error"
                            >
                              {t('delete image')}
                            </Button>
                          </Stack>
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{
                              mt: 3,
                              mx: 'auto',
                              display: 'block',
                              textAlign: 'center',
                              color: 'text.disabled',
                            }}
                          >
                            {t('allowed')} *.jpeg, *.jpg, *.png, *.gif
                            <br /> {t('max size of')} {fData(3145728)}
                          </Typography>
                        )
                      }
                    />
                  )}
                  {item?.inputType === 'uploadImage' && (
                    <Controller
                      name={item?.name}
                      control={control}
                      rules={item?.rules}
                      defaultValue={item?.value}
                      render={({ field, fieldState: { error } }) => (
                        <RHFUploadProduct
                          name={item?.name}
                          {...item}
                          error={!!error}
                          maxSize={3145728}
                          onDrop={(acceptedFiles) => handleDrop(acceptedFiles, item?.name)}
                        />
                      )}
                    />
                  )}
                  {item?.inputType === 'otpInput' && <RHFCode name={item?.name} />}
                  {item?.inputType === 'checkbox' && <RHFCheckbox name={item?.name} {...item} />}
                  {item?.inputType === 'radioGroup' && (
                    <RHFRadioGroup name={item?.name} {...item} options={item?.options} />
                  )}
                  {item?.inputType === 'autocomplete' && (
                    <RHFAutocomplete
                      name={item?.name}
                      {...item}
                      options={item?.options?.map((option: any) => option.label)}
                      getOptionLabel={(option) => `${option}`}
                    />
                  )}
                  {item?.inputType === 'textarea' && <RHFTextarea name={item?.name} {...item} />}
                  {/*   {item?.inputType === 'multiCheckbox' && (

                  <RHFMultiCheckbox name={item?.name} label={item?.label}  />
                )} */}
                </Grid>
              ))}
            </Grid>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {mood === 'create' ? t('add') : t('edit')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
