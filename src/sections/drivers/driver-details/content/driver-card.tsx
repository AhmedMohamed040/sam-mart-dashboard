import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import uuidv4 from 'src/utils/uuidv4';
import { fDate } from 'src/utils/format-time';

import { Driver } from 'src/@types/dashboard-drivers';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Label, { LabelColor } from 'src/components/label';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

const STATUS_COLOR: { [key: string]: LabelColor } = {
  PENDING: 'warning',
  VERIFIED: 'success',
  INACTIVE: 'secondary',
  SUSPENDED: 'default',
  BLOCKED: 'error',
};
const DriverCard = ({ driver }: { driver: Driver }) => {
  const { currentLang } = useLocales();
  const { t } = useTranslate();
  const DRIVER_ST_COLUMN: { id: string; label: string; value: any }[] = [
    {
      id: uuidv4(),
      label: 'driver_name',
      value: driver?.username,
    },
    {
      id: uuidv4(),
      label: 'national_residence_id',
      value: driver?.idCard.id_card_number,
    },
    {
      id: uuidv4(),
      label: 'phone_number',
      value: driver?.phone ? (
        <Box style={{ direction: 'ltr', display: 'inline-block' }} component="span">
          {driver.phone}
        </Box>
      ) : (
        ''
      ),
    },
    {
      id: uuidv4(),
      label: 'email',
      value: driver?.email,
    },
    {
      id: uuidv4(),
      label: 'date_of_birth',
      value: driver?.birth_date ? driver.birth_date : '',
    },
    {
      id: uuidv4(),
      label: 'city',
      value: currentLang.value === 'en' ? driver.city.name_en : driver.city.name_ar,
    },
    {
      id: uuidv4(),
      label: 'country',
      value: currentLang.value === 'en' ? driver.country.name_en : driver.country.name_ar,
    },
  ];
  const DRIVER_ND_COLUMN: {
    id: string;
    label: string;
    value: any;
  }[] = [
    {
      id: uuidv4(),
      label: 'registration_date',
      value: driver?.created_at ? driver.created_at : '',
    },
    {
      id: uuidv4(),
      label: 'registration_status',
      value: driver?.driver_status,
    },
    {
      id: uuidv4(),
      label: 'wallet',
      value: driver?.wallet_balance,
    },
    {
      id: uuidv4(),
      label: 'driver_picture',
      value: driver?.avatar,
    },
  ];

  const DRIVER_DETAILS = (
    <Stack my={4}>
      <Grid
        container
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
        gap={2}
      >
        <Grid item>
          {DRIVER_ST_COLUMN.map((field) => (
            <Stack direction="row" gap={4} key={field.id} mb={2}>
              <Typography width="35%">{t(field.label)}</Typography>
              <Typography>
                : {field.label === 'date_of_birth' ? fDate(field.value, 'dd-MM-yyyy') : field.value}
              </Typography>
            </Stack>
          ))}
        </Grid>
        <Grid item>
          {DRIVER_ND_COLUMN.map((field) => {
            if (field.label === 'registration_status') {
              return (
                <Stack direction="row" gap={4} key={field.id} mb={2}>
                  <Typography width="30%">{t(field.label)}</Typography>:{' '}
                  <Label variant="filled" color={STATUS_COLOR[field.value]}>
                    {t(field.value)}
                  </Label>
                </Stack>
              );
            }
            if (field.label === 'driver_picture') {
              return (
                <Stack direction="row" gap={4} key={field.id} mb={2}>
                  <Typography width="30%">{t(field.label)}:</Typography>
                  <Box width="50%">
                    <Image src={field.value} ratio="1/1" />
                  </Box>
                </Stack>
              );
            }
            return (
              <Stack direction="row" gap={4} key={field.id} mb={2}>
                <Typography width="30%">{t(field.label)}</Typography>
                <Typography>
                  :{' '}
                  {field.label === 'registration_date'
                    ? fDate(field.value, 'dd-MM-yyyy')
                    : field.value}
                </Typography>
              </Stack>
            );
          })}
        </Grid>
      </Grid>
    </Stack>
  );

  return (
    <Stack>
      <CustomBreadcrumbs
        heading={driver?.username ? driver?.username : t('driver_details')}
        links={[
          {
            name: t('drivers'),
            href: paths.dashboard.drivers,
          },
          {
            name: driver?.username ? driver?.username : t('unknown'),
          },
        ]}
      />
      <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
        <Box flexGrow={1}>{DRIVER_DETAILS}</Box>
        <Stack width="30%" direction="row" gap={4}>
          <Typography width="25%">{t('id_picture')}:</Typography>
          <Box flexGrow={1}>
            <Image src={driver?.idCard.id_card_image} ratio="16/9" />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DriverCard;
