'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

export interface Services {
  name_en: string;
  name_ar: string;
  id?: string;
}

export const fetchServices = async (): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance(endpoints.additionalServices.fetch, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
// eslint-disable-next-line consistent-return
export const addService = async ({ service }: { service: Services }): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(endpoints.additionalServices.add_service, service, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath('/dashboard/additional-services');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
// eslint-disable-next-line consistent-return
export const updateService = async ({ service }: { service: Services }): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.put(
      `${endpoints.additionalServices.base_service}/${service?.id}/${endpoints.additionalServices.update_service}`,
      service,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    revalidatePath('/dashboard/additional-services');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

// eslint-disable-next-line consistent-return
export const deleteService = async (id: string): Promise<any> => {
  try {
    const accessToken = cookies().get('accessToken')?.value;
    const lang = cookies().get('Language')?.value;

    const res = await axiosInstance.delete(
      `${endpoints.additionalServices.base_service}/${id}/${endpoints.additionalServices.delete_service}`,
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
  revalidatePath('/dashboard/additional-services');
};
