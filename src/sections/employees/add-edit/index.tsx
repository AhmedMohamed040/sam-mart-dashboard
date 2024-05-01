'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { toFormData } from 'axios';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { Country } from 'src/@types/dashboard-drivers';
import { EditExistingEmployee } from 'src/@types/employees';
import { handleDeps } from 'src/helper-functions/employees-helper';
import { patchEmployee, createNewEmployee } from 'src/actions/employees-actions';

import FormProvider from 'src/components/hook-form/form-provider';

import EmployeeData from './employee-data';
import EmployeesFormActions from './actions';
import EmployeeSectionsTable from './employee-sections';
import EmployeePermissionsTable from './employee-permissions';
import { DepsSchema, getDefValues, EmpDataSchema, getEditDefValues } from './values-and-schemas';

interface Prop {
  allCountries: Country[] | [];
  employee?: EditExistingEmployee;
}
const AddEditEmployeeForm = ({ allCountries, employee }: Prop) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const router = useRouter();
  const [phase, setPhase] = useState<string>('0');
  const { EmpDATA, Deps, Perms } = employee?.id ? getEditDefValues(employee) : getDefValues();

  const defaultValues = {
    employeeData: EmpDATA,
    departements: Deps,
    permissions: Perms,
  };
  const yupSchema = Yup.object().shape({
    employeeData: EmpDataSchema,
    departements: DepsSchema,
  });
  const changePhase = (recivedPhase: string) => {
    setPhase(recivedPhase);
  };
  const methods = useForm({ defaultValues, resolver: yupResolver(yupSchema), mode: 'onChange' });
  const { handleSubmit } = methods;
  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    const choosenDeps = handleDeps(data.departements);
    const reqBody = { ...data.employeeData };
    toFormData(reqBody, formData);
    formData.append('departements', JSON.stringify(choosenDeps));

    if (employee?.id) {
      if (employee.email === reqBody.email) formData.delete('email');
      if (employee.phone === reqBody.phone) formData.delete('phone');
      const res = await patchEmployee(employee.id, formData);
      if (res?.error) {
        enqueueSnackbar(`${res.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('employee_was_updated_successfully'));
        router.back();
      }
    } else {
      const res = await createNewEmployee(formData);
      if (res?.error) {
        enqueueSnackbar(`${res.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('employee_was_added_successfully'));
        router.push(paths.dashboard.employees);
      }
    }
  });
  return (
    <Container maxWidth="xl">
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <TabContext value={phase}>
          <TabPanel value="0">
            <EmployeeData countries={allCountries} isEditing={!!employee?.id} />
          </TabPanel>
          <TabPanel value="1">
            <EmployeeSectionsTable />
          </TabPanel>
          <TabPanel value="2">
            <EmployeePermissionsTable />
          </TabPanel>
        </TabContext>
        <EmployeesFormActions onPhaseChange={changePhase} phase={phase} />
      </FormProvider>
    </Container>
  );
};

export default AddEditEmployeeForm;
