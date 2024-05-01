import { fetchCountries } from 'src/actions/countries';
import { getEmployee } from 'src/actions/employees-actions';

import AddEditEmployeeForm from 'src/sections/employees/add-edit';

export const metadata = {
  title: 'Edit Employee',
};
const Page = async ({ params }: { params: { [key: string]: string } }) => {
  const EMPLOYEE_ID = params['employee-id'];

  const COUNTRIES = await fetchCountries();
  const employee = await getEmployee(EMPLOYEE_ID);

  return <AddEditEmployeeForm allCountries={COUNTRIES.data.data} employee={employee} />;
};

export default Page;
