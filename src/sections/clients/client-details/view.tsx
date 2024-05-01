'use client';

import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { getErrorMessage } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { IClient } from 'src/@types/clients';
import { blockClient, deleteClient, unblockClient } from 'src/actions/clients-actions';

import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { convertDate } from '../../offers/view';

interface Props {
  client?: IClient;
}

export default function ClientsDetails({ client }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { value: isDialogOpen, onTrue: openDialog, onFalse: closeDialog } = useBoolean(false);
  const [dialogType, setDialogType] = useState<'deleteClient' | 'blockClient' | 'unblockClient'>();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const openDeleteDailog = () => {
    setDialogType('deleteClient');
    openDialog();
  };
  const openBlockDailog = () => {
    setDialogType('blockClient');
    openDialog();
  };
  const openUnblockDailog = () => {
    setDialogType('unblockClient');
    openDialog();
  };

  const handleConfirmDelete = async () => {
    closeDialog();
    const res = client && (await deleteClient(client.id));
    if (res?.message === 'Success') {
      enqueueSnackbar(t('Deleted success!'), {
        variant: 'success',
      });
      router.back();
    } else {
      enqueueSnackbar(`${getErrorMessage(res?.message)}`, { variant: 'error' });
    }
  };
  const handleConfirmBlock = async () => {
    closeDialog();
    const res = client && (await blockClient(client.id));
    if (res?.message === 'Success') {
      enqueueSnackbar(t('Blocked success!'), {
        variant: 'success',
      });
    } else {
      enqueueSnackbar(`${getErrorMessage(res?.message)}`, { variant: 'error' });
    }
  };
  const handleConfirmUnBlock = async () => {
    closeDialog();
    const res = client?.id && (await unblockClient(client.id));
    if (res?.message === 'Success') {
      enqueueSnackbar(t('Unblocked success!'), {
        variant: 'success',
      });
    } else {
      enqueueSnackbar(`${getErrorMessage(res?.message)}`, { variant: 'error' });
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={client?.username}
        links={[
          {
            name: t('clients'),
            href: paths.dashboard.clients,
          },
          { name: client?.username },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card sx={{ py: 5, px: 3 }}>
        <Grid container spacing={2}>
          {/* First Col */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Grid container spacing={1}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle1" component="span">
                    {t('Client Name')}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={8}>
                  <Typography>{client?.username}</Typography>
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle1" component="span">
                    {t('Phone')}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={8}>
                  <Typography dir="ltr" width="fit-content">
                    {client?.phone}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle1" component="span">
                    {t('Email')}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={8}>
                  <Typography>{client?.email}</Typography>
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle1" component="span">
                    {t('Birth Date')}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={8}>
                  {client?.birth_date ? convertDate(client?.birth_date) : null}
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          {/* Second Col */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Grid container spacing={1}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle1" component="span">
                    {t('Adress')}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={8}>
                  <Typography>{client?.main_address?.address}</Typography>
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle1" component="span">
                    {t('Registeration Date')}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={8}>
                  <Typography>
                    {client?.created_at ? convertDate(client?.created_at) : null}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle1" component="span">
                    {t('Registeration Status')}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={8}>
                  {client?.user_status === 'BlockedClient' ? (
                    <Chip
                      label={t('Blocked')}
                      color="error"
                      size="small"
                      sx={{ borderRadius: '100rem', px: 1 }}
                    />
                  ) : (
                    <Chip
                      label={t('Active')}
                      color="success"
                      size="small"
                      sx={{ borderRadius: '100rem', px: 1 }}
                    />
                  )}
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle1" component="span">
                    {t('Wallet')}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={8}>
                  <Typography>{client?.wallet_balance}</Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      {/* Actions */}
      {client ? (
        <Stack direction="row" spacing={1} mt={3} marginInlineStart="auto" width="fit-content">
          {client?.user_status === 'BlockedClient' ? (
            <Button variant="contained" color="success" onClick={() => openUnblockDailog()}>
              {t('unblock')}
            </Button>
          ) : (
            <Button variant="contained" color="error" onClick={() => openBlockDailog()}>
              {t('block')}
            </Button>
          )}

          <Button variant="contained" color="error" onClick={() => openDeleteDailog()}>
            {t('delete')}
          </Button>
        </Stack>
      ) : null}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isDialogOpen}
        onClose={closeDialog}
        title={t(
          // eslint-disable-next-line no-nested-ternary
          dialogType === 'blockClient'
            ? 'block'
            : dialogType === 'unblockClient'
              ? 'unblock'
              : 'delete'
        )}
        content={t(
          // eslint-disable-next-line no-nested-ternary
          dialogType === 'blockClient'
            ? 'block_confirm'
            : dialogType === 'unblockClient'
              ? 'unblock_confirm'
              : 'delete_confirm'
        )}
        action={
          <Button
            variant="contained"
            color={dialogType === 'unblockClient' ? 'success' : 'error'}
            onClick={
              // eslint-disable-next-line no-nested-ternary
              dialogType === 'blockClient'
                ? handleConfirmBlock
                : dialogType === 'unblockClient'
                  ? handleConfirmUnBlock
                  : handleConfirmDelete
            }
          >
            {t(
              // eslint-disable-next-line no-nested-ternary
              dialogType === 'blockClient'
                ? 'block'
                : dialogType === 'unblockClient'
                  ? 'unblock'
                  : 'delete'
            )}
          </Button>
        }
      />
    </Container>
  );
}
