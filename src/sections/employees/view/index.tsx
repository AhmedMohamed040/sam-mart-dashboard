'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { City, Country } from 'src/@types/dashboard-drivers';
import { META, EmployeeTableRow } from 'src/@types/employees';

import EmployeesViewTable from './table';
import EmployeesViewHeader from './header';
import EmployeesViewSearch from './search';
import EmployeesViewFilters from './filters';

const EmployeesView = ({
  employees,
  meta,
  allCountries,
  allCities,
}: {
  employees: EmployeeTableRow[] | [];
  meta: META;
  allCountries: Country[] | [];
  allCities: City[] | [];
}) => (
  <Container maxWidth="xl">
    <Box>
      <EmployeesViewHeader />
      <Box maxWidth="100%" width="800px" mx="auto">
        <EmployeesViewSearch />
        <EmployeesViewFilters cities={allCities} countries={allCountries} />
      </Box>
    </Box>
    <EmployeesViewTable employees={employees} meta={meta} />
  </Container>
);

export default EmployeesView;
