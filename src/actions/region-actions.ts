'use server';

/* eslint-disable consistent-return */

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

interface IParams {
  city_id: string;
}
interface IAddEditProps {
  dataBody: { [key: string]: string | string[] | undefined };
  id: string | undefined;
  cityID?: string | undefined;
}

export const fetchRegions = async ({ city_id }: IParams): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.get(
      `${endpoints.region.base_region}/${city_id}/${endpoints.region.fetch}`,
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
export const addRegion = async ({ dataBody, id }: IAddEditProps): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(
      `${endpoints.region.base_region}/${endpoints.region.add}`,
      dataBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(`dashboard/countries/city/${id}`);
  } catch (error) {
    revalidatePath(`dashboard/countries/city/${id}`);
    return {
      error: getErrorMessage(error),
    };
  }
};
export const editRegion = async ({ id, dataBody, cityID }: IAddEditProps): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.put(
      `${endpoints.region.base_region}/${id}/${endpoints.region.edit}`,
      dataBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(`dashboard/countries/city/${cityID}`);
  } catch (error) {
    revalidatePath(`dashboard/countries/city/${cityID}`);

    return {
      error: getErrorMessage(error),
    };
  }
};
export const deleteRegion = async ({
  id,
  cityID,
}: {
  id: string;
  cityID: string;
}): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const use = endpoints.region;
    await axiosInstance.delete(`${use.base_region}/${id}/${use.delete}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath(`dashboard/countries/city/${cityID}`);
  } catch (error) {
    revalidatePath(`dashboard/countries/city/${cityID}`);

    return {
      error: getErrorMessage(error),
    };
  }
};
