import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

const EmployeesFormActions = ({
  phase,
  onPhaseChange,
}: {
  phase: string;
  onPhaseChange: (recivedPhase: string) => void;
}) => (
  <>
    {phase === '0' && <DataButtons onPhaseChange={onPhaseChange} />}
    {phase === '1' && <SectionsButtons onPhaseChange={onPhaseChange} />}
    {phase === '2' && <PermissionsButtons onPhaseChange={onPhaseChange} />}
  </>
);

export default EmployeesFormActions;

const DataButtons = ({ onPhaseChange }: { onPhaseChange: (recivedPhase: string) => void }) => {
  const { t } = useTranslate();
  const router = useRouter();
  return (
    <Stack direction="row" gap={1} justifyContent="flex-end" my={4}>
      <Button
        variant="contained"
        onClick={() => {
          onPhaseChange('1');
        }}
      >
        {t('next')}
      </Button>
      <Button
        type="submit"
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
const SectionsButtons = ({ onPhaseChange }: { onPhaseChange: (recivedPhase: string) => void }) => {
  const { t } = useTranslate();
  return (
    <Stack direction="row" gap={1} justifyContent="flex-end" my={4}>
      <Button
        variant="contained"
        onClick={() => {
          onPhaseChange('2');
        }}
      >
        {t('next')}
      </Button>
      <Button
        type="submit"
        variant="contained"
        onClick={() => {
          onPhaseChange('0');
        }}
      >
        {t('previous')}
      </Button>
    </Stack>
  );
};
const PermissionsButtons = ({
  onPhaseChange,
}: {
  onPhaseChange: (recivedPhase: string) => void;
}) => {
  const { t } = useTranslate();
  const {
    formState: { isValid, errors, isSubmitting },
  } = useFormContext();
  return (
    <Stack direction="row" gap={1} justifyContent="flex-end" my={4}>
      <LoadingButton
        type="submit"
        variant="contained"
        onClick={() => {
          if (!isValid && Object.keys(errors).length > 0) {
            enqueueSnackbar(t('please_fill_in_all_the_required_fields'), {
              variant: 'error',
            });
          }
        }}
        loading={isSubmitting}
      >
        {t('save')}
      </LoadingButton>
      <Button
        variant="contained"
        onClick={() => {
          onPhaseChange('1');
        }}
      >
        {t('previous')}
      </Button>
    </Stack>
  );
};
