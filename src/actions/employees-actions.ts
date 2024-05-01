'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

import {
  handleSingleEmployee,
  getEmployeesReturnRequiredDataForTheTable,
} from 'src/helper-functions/employees-helper';

export const getAllEmployees = async ({
  page = '1',
  limit = '5',
  created_at = '',
  employee_search = '',
  country_id = '',
  city_id = '',
}) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  const emp_search = employee_search.split('.')[0];
  const FILTERS = [
    `filters=name_en=${emp_search},country_id=${country_id},city_id=${city_id}${created_at ? `,created_at=${created_at}` : ''}`,
    `filters=name_ar=${emp_search},country_id=${country_id},city_id=${city_id}${created_at ? `,created_at=${created_at}` : ''}`,
    `filters=user.email=${emp_search},country_id=${country_id},city_id=${city_id}${created_at ? `,created_at=${created_at}` : ''}`,
    `filters=user.phone=${emp_search},country_id=${country_id},city_id=${city_id}${created_at ? `,created_at=${created_at}` : ''}`,
  ];
  const SEARCH = FILTERS.join('&');
  const searchString = `?page=${page}&limit=${limit}${SEARCH}`;
  try {
    const res = await axiosInstance.get(`${endpoints.employees.get}${searchString}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    const handledEmployeesData = await getEmployeesReturnRequiredDataForTheTable(res.data.data);
    return {
      EMPLOYEES: handledEmployeesData,
      META: res.data.meta,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const createNewEmployee = async (reqBody: FormData) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    const res = await axiosInstance.post(`${endpoints.employees.post}`, reqBody, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/employees');
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteEmployee = async (id: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.delete(`${endpoints.employees.delete}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath('/dashboard/employees');
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const patchEmployee = async (id: string, reqBody: FormData) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.patch(`${endpoints.employees.patch}/${id}`, reqBody, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/employees');
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const getEmployee = async (id: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    const res = await axiosInstance.get(`${endpoints.employees.getSingleEmployee}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    const reqEmployeeData = handleSingleEmployee(res.data.data);
    return reqEmployeeData;
  } catch (error) {
    throw new Error(error);
  }
};
