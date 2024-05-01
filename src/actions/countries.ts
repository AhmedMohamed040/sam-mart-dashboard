'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

import { Countries } from 'src/@types/countries';

export const fetchCountries = async (): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance(endpoints.countries.fetch, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
// eslint-disable-next-line consistent-return
export const addCountry = async ({ country }: { country: Countries }): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(endpoints.countries.add_country, country, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath('/dashboard/countries');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
// eslint-disable-next-line consistent-return
export const updateCountry = async ({ country }: { country: Countries }): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.put(
      `${endpoints.countries.base_country}/${country?.id}/${endpoints.countries.update_country}`,
      country,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    revalidatePath('/dashboard/countries');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

// eslint-disable-next-line consistent-return
export const deleteCountry = async (id: string): Promise<any> => {
  const lang = cookies().get('Language')?.value;

  try {
    const accessToken = cookies().get('accessToken')?.value;
    const res = await axiosInstance.delete(
      `${endpoints.countries.base_country}/${id}/${endpoints.countries.delete_country}`,
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
  revalidatePath('/dashboard/countries');
};
export const fetchSingleCountry = async ({ id }: { id: string }): Promise<any> => {
  const lang = cookies().get('Language')?.value;

  try {
    const accessToken = cookies().get('accessToken')?.value;
    const res = await axiosInstance.get(
      `${endpoints.countries.base_country}/${id}/${endpoints.countries.single_country}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    return res.data;
  } catch (error) {
    return Promise.reject(error?.message);
  }
};
