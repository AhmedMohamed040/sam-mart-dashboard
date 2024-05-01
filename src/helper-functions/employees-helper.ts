import { Employee } from 'src/@types/employees';
import { fetchSingleCity } from 'src/actions/cities-actions';

export const getEmployeesReturnRequiredDataForTheTable = async (employees: Employee[] | []) => {
  const EMPLOYEES = await Promise.all(
    employees.map(async (employee) => {
      const {
        id,
        name_ar,
        name_en,
        user: { id: userId, email, gender, phone, avatar },
        qualification,
        created_at,
        country_id,
        city_id,
        is_active,
      } = employee;

      const getCity = await fetchSingleCity({
        city_id,
      });
      const {
        name_ar: city_name_ar,
        name_en: city_name_en,
        country: { name_ar: country_name_ar, name_en: country_name_en },
      } = getCity;
      return {
        id,
        name_ar,
        name_en,
        userId,
        email,
        gender,
        qualification,
        created_at,
        country_id,
        city_id,
        is_active,
        phone,
        city_name_ar,
        city_name_en,
        country_name_ar,
        country_name_en,
        avatar,
      };
    })
  );
  return EMPLOYEES;
};

const DEPARTEMENTS_KEYS: { [key: string]: string } = {
  accounting: 'Accounting',
  customerService: 'Customer Service',
  hr: 'HR',
  marketing: 'Marketing',
};
export const handleDeps = (deps: { [key: string]: boolean }) => {
  const RegisteredDeps = Object.keys(deps)
    .map((dep) => (deps[dep] ? DEPARTEMENTS_KEYS[dep] : null))
    .filter((dep) => dep !== null);

  return RegisteredDeps;
};

export const handleSingleEmployee = (employeeObject: Employee) => {
  const {
    id,
    name_ar,
    name_en,
    qualification,
    is_active,
    departements,
    country_id,
    city_id,
    user: { avatar, phone, gender, email },
  } = employeeObject;
  return {
    id,
    name_ar,
    name_en,
    qualification,
    is_active,
    departements,
    country_id,
    city_id,
    avatar,
    phone,
    gender,
    email,
  };
};
