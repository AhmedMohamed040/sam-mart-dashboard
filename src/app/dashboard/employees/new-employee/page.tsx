import { fetchCountries } from 'src/actions/countries';

import AddEditEmployeeForm from 'src/sections/employees/add-edit';

export const metadata = {
  title: 'Add Employee',
};
const Page = async () => {
  const COUNTRIES = await fetchCountries();
  return <AddEditEmployeeForm allCountries={COUNTRIES.data.data} />;
};

export default Page;
