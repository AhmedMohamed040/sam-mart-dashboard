'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

export interface Unit {
  name_en: string;
  name_ar: string;
  id?: string;
}

export const fetchUnits = async (): Promise<any> => {
  const lang = cookies().get('Language')?.value;

  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance(endpoints.units.fetch, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};
// eslint-disable-next-line consistent-return
export const addUnit = async ({ unit }: { unit: Unit }): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(endpoints.units.add_unit, unit, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath('/dashboard/units');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
// eslint-disable-next-line consistent-return
export const updateUnit = async ({ unit }: { unit: Unit }): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.put(
      `${endpoints.units.base_unit}/${unit?.id}/${endpoints.units.update_unit}`,
      unit,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    revalidatePath('/dashboard/units');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

// eslint-disable-next-line consistent-return
export const deleteUnit = async (id: string): Promise<any> => {
  try {
    const accessToken = cookies().get('accessToken')?.value;
    const lang = cookies().get('Language')?.value;

    const res = await axiosInstance.delete(
      `${endpoints.units.base_unit}/${id}/${endpoints.units.delete_unit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
  revalidatePath('/dashboard/units');
};
