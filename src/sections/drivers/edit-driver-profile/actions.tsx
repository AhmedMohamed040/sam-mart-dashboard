import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

const EditDriverProfileActions = () => {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const {
    formState: { isSubmitting, errors },
  } = useFormContext();
  const handleErrorsSnackbar = () => {
    if (Object.keys(errors).length) {
      enqueueSnackbar(t('please_check_the_validity_of_all_fields'), { variant: 'error' });
    }
  };
  return (
    <Stack direction="row" gap={1} justifyContent="flex-end" alignItems="center" my={4}>
      <LoadingButton
        type="submit"
        variant="contained"
        loading={isSubmitting}
        onClick={handleErrorsSnackbar}
      >
        {t('save')}
      </LoadingButton>
      <Button
        variant="contained"
        onClick={() => {
          router.back();
        }}
      >
        {t('cancel')}
      </Button>
    </Stack>
  );
};

export default EditDriverProfileActions;
