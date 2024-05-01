'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

interface IParams {
  country_id: string;
}
interface IAddEditProps {
  dataBody: { [key: string]: string | string[] | undefined };
  id: string | undefined;
  countryID?: string | undefined;
}

export const fetchCities = async ({ country_id }: IParams): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.get(
      `${endpoints.city.base_city}/${country_id}/${endpoints.city.fetch}`,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchSingleCity = async ({ city_id }: { city_id: string }): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.get(
      `${endpoints.city.base_city}/${city_id}/single-city-dashboard`,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};
// eslint-disable-next-line consistent-return
export const addCity = async ({ dataBody, id }: IAddEditProps): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(
      `${endpoints.city.base_city}/${id}/${endpoints.city.add}`,
      dataBody,
      {
        params: { counrty_id: id },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(`dashboard/countries/${id}`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
// eslint-disable-next-line consistent-return
export const editCity = async ({ id, dataBody, countryID }: IAddEditProps): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.put(
      `${endpoints.city.base_city}/${id}/${endpoints.city.edit}`,
      dataBody,
      {
        params: { city_id: id },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(`dashboard/countries/${countryID}`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const deleteCity = async ({
  id,
  countryID,
}: {
  id: string;
  countryID: string;
  // eslint-disable-next-line consistent-return
}): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const use = endpoints.city;
    await axiosInstance.delete(`${use.base_city}/${id}/${use.delete}`, {
      params: { city_id: id },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath(`dashboard/countries/${countryID}`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
