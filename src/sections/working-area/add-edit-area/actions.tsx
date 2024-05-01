import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

const AddNewAreaActions = () => {
  const { t } = useTranslate();
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <Stack direction="row" alignSelf="end" gap={1}>
      <LoadingButton
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          paddingInline: '3rem',
        }}
      >
        {t('save')}
      </LoadingButton>
      <Button
        LinkComponent={RouterLink}
        href="/dashboard/working-area"
        variant="contained"
        sx={{
          paddingInline: '3rem',
        }}
      >
        <Typography>{t('cancel')}</Typography>
      </Button>
    </Stack>
  );
};

export default AddNewAreaActions;
