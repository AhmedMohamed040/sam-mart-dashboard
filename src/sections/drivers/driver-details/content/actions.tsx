import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { deleteDriver, changeDriverStatus } from 'src/actions/drivers-dashboard-actions';

import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider from 'src/components/hook-form/form-provider';

const DriverDetailActions = ({ status, id }: { status: string; id: string }) => {
  let RETURNED_ACTIONS;
  if (status === 'PENDING') {
    RETURNED_ACTIONS = (
      <>
        <AcceptDriver id={id} />
        <DeclineDriver id={id} />
      </>
    );
  }
  if (status === 'BLOCKED') {
    RETURNED_ACTIONS = (
      <>
        <UnblockDriver id={id} />
        <DeleteDriver id={id} />
      </>
    );
  }
  if (status !== 'PENDING' && status !== 'BLOCKED') {
    RETURNED_ACTIONS = (
      <>
        <BanDriver id={id} />
        <DeleteDriver id={id} />
      </>
    );
  }
  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {RETURNED_ACTIONS}
    </Stack>
  );
};
export default DriverDetailActions;

// ACTION COMPONENTS

const AcceptDriver = ({ id }: { id: string }) => {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({});
  const router = useRouter();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async () => {
    const res = await changeDriverStatus({
      driver_id: id,
      status: 'VERIFIED',
      status_reason: 'NOT SPECIFIED',
    });
    if (res?.error) {
      enqueueSnackbar(res?.error, {
        variant: 'error',
      });
    } else {
      enqueueSnackbar(t('driver_was_accepted_successfully'));
      router.push(paths.dashboard.drivers);
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <LoadingButton
        variant="contained"
        color="success"
        sx={{
          paddingInline: '3rem',
        }}
        loading={isSubmitting}
        type="submit"
      >
        {t('accept')}
      </LoadingButton>
    </FormProvider>
  );
};
const DeclineDriver = ({ id }: { id: string }) => {
  const { t } = useTranslate();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useBoolean();
  const methods = useForm({});
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async () => {
    const res = await deleteDriver(id);
    if (res?.error) {
      enqueueSnackbar(res?.error, {
        variant: 'error',
      });
    } else {
      enqueueSnackbar(t('driver_was_declined_successfully'));
      router.push(paths.dashboard.drivers);
    }
  });
  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Button
          variant="contained"
          color="error"
          sx={{
            paddingInline: '3rem',
          }}
          onClick={confirm.onTrue}
        >
          {t('decline')}
        </Button>
      </FormProvider>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('decline')}
        content={t('are_you_sure_you_want_to_decline_that_driver')}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={() => {
              onSubmit();
            }}
            loading={isSubmitting}
          >
            {t('decline')}
          </LoadingButton>
        }
      />
    </>
  );
};
const BanDriver = ({ id }: { id: string }) => {
  const { t } = useTranslate();
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({});
  const router = useRouter();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async () => {
    const res = await changeDriverStatus({
      driver_id: id,
      status: 'BLOCKED',
      status_reason: 'NOT SPECIFIED',
    });
    if (res?.error) {
      enqueueSnackbar(res?.error, {
        variant: 'error',
      });
    } else {
      enqueueSnackbar(t('driver_was_blocked_successfully'));
      router.push(paths.dashboard.drivers);
    }
  });
  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Button
          variant="contained"
          color="error"
          sx={{
            paddingInline: '3rem',
          }}
          onClick={confirm.onTrue}
        >
          {t('block')}
        </Button>
      </FormProvider>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('block')}
        content={t('are_you_sure_you_want_to_block_that_driver')}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={() => {
              onSubmit();
            }}
            loading={isSubmitting}
          >
            {t('block')}
          </LoadingButton>
        }
      />
    </>
  );
};
const DeleteDriver = ({ id }: { id: string }) => {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const confirm = useBoolean();
  const methods = useForm({});
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async () => {
    const res = await deleteDriver(id);
    if (res?.error) {
      enqueueSnackbar(res?.error, {
        variant: 'error',
      });
    } else {
      enqueueSnackbar(t('driver_was_deleted_successfully'));
      router.push(paths.dashboard.drivers);
    }
  });
  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Button
          variant="contained"
          color="error"
          sx={{
            paddingInline: '3rem',
          }}
          onClick={confirm.onTrue}
        >
          {t('delete')}
        </Button>
      </FormProvider>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete')}
        content={t('are_you_sure_you_want_to_delete_that_driver')}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={() => {
              onSubmit();
            }}
            loading={isSubmitting}
          >
            {t('delete')}
          </LoadingButton>
        }
      />
    </>
  );
};
const UnblockDriver = ({ id }: { id: string }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const methods = useForm({});
  const router = useRouter();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async () => {
    const res = await changeDriverStatus({
      driver_id: id,
      status: 'VERIFIED',
      status_reason: 'NOT SPECIFIED',
    });
    if (res?.error) {
      enqueueSnackbar(res?.error, {
        variant: 'error',
      });
    } else {
      enqueueSnackbar(t('driver_was_successfully_unblocked'));
      router.push(paths.dashboard.drivers);
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <LoadingButton
        variant="contained"
        color="success"
        sx={{
          paddingInline: '3rem',
        }}
        loading={isSubmitting}
        type="submit"
      >
        {t('unblock')}
      </LoadingButton>
    </FormProvider>
  );
};
