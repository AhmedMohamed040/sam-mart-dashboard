'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { useTranslate } from 'src/locales';
import {
  City,
  META,
  Region,
  Country,
  Analytics,
  DriverViewTableRow,
} from 'src/@types/dashboard-drivers';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DriversViewTable from './view/table';
import DriversViewSearch from './view/search';
import DriversViewFilters from './view/filters';
import DriversViewAnalytics from './view/analytics';

type Prop = {
  meta: META;
  tableContent: DriverViewTableRow[] | [];
  allCountries: Country[];
  allCities: City[] | [];
  allRegions: Region[] | [];
  analytics: Analytics;
  warehouses: { [key: string]: string }[];
};
const DriversView = ({
  tableContent,
  meta,
  allCities,
  allCountries,
  allRegions,
  analytics,
  warehouses,
}: Prop) => {
  const { t } = useTranslate();
  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        <CustomBreadcrumbs heading={t('drivers')} links={[{}]} />
        <DriversViewAnalytics analytics={analytics} />
        <Box maxWidth="100%" mx="auto" width={800}>
          <DriversViewSearch />
          <DriversViewFilters cities={allCities} countries={allCountries} regions={allRegions} />
        </Box>
        <DriversViewTable content={tableContent} meta={meta} warehouses={warehouses} />
      </Stack>
    </Container>
  );
};

export default DriversView;
