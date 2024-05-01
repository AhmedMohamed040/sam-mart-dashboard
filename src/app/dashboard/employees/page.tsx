import { fetchCountries } from 'src/actions/countries';
import { getAllEmployees } from 'src/actions/employees-actions';
import { getCities } from 'src/actions/drivers-dashboard-actions';

import EmployeesView from 'src/sections/employees/view';

export const metadata = {
  title: 'Employees',
};
const Page = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const EMPLOYEE_SEARCH =
    searchParams?.employee_search && typeof searchParams?.employee_search === 'string'
      ? searchParams.employee_search
      : '';
  const COUNTRY_ID =
    searchParams?.country_id && typeof searchParams?.country_id === 'string'
      ? searchParams.country_id
      : '';
  const CITY_ID =
    searchParams?.city_id && typeof searchParams?.city_id === 'string' ? searchParams.city_id : '';
  const CREATED_AT =
    searchParams?.created_at && typeof searchParams?.created_at === 'string'
      ? searchParams.created_at
      : '';
  const PAGE =
    searchParams?.page && typeof searchParams?.page === 'string' ? searchParams.page : '1';
  const LIMIT =
    searchParams?.limit && typeof searchParams?.limit === 'string' ? searchParams.limit : '5';
  const { EMPLOYEES, META } = await getAllEmployees({
    page: PAGE,
    limit: LIMIT,
    created_at: CREATED_AT,
    employee_search: EMPLOYEE_SEARCH,
    country_id: COUNTRY_ID,
    city_id: CITY_ID,
  });
  const COUNTRIES = await fetchCountries();
  let CITIES = [];
  if (COUNTRY_ID) {
    CITIES = await getCities(COUNTRY_ID);
  }

  return (
    <EmployeesView
      employees={EMPLOYEES}
      meta={META}
      allCountries={COUNTRIES.data.data}
      allCities={CITIES}
    />
  );
};
export default Page;
