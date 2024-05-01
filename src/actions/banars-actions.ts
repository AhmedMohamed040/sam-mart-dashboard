'use server';

/* eslint-disable consistent-return */

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import axiosInstance, { Params, endpoints, getErrorMessage } from 'src/utils/axios';

export const fetchBanars = async ({ page = 1, limit = 5, filters }: Params): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance(endpoints.banars, {
      params: {
        page,
        limit,
        filters: filters ? [`name_en=${filters}`, `name_ar=${filters}`] : null,
        sortBy: 'created_at=desc',
      },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchSingleBanar = async ({ banarId }: { banarId: string }): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance(`${endpoints.banars}/${banarId}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const addBanar = async (formData: FormData): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    await axiosInstance.post(endpoints.banars, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });

    revalidatePath('/dashboard/categories');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const ToggleBanar = async (formData: FormData) => {
  const id = formData.get('id');
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  const is_active = formData.get('is_active');
  const data = {
    is_active: is_active === 'false',
  };

  try {
    const res = await axiosInstance.patch(`${endpoints.banars}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/banars');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const editBanar = async (formData: FormData, id: string): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    await axiosInstance.patch(`${endpoints.banars}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/banars');
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const deleteBanar = async (id: string): Promise<any> => {
  try {
    const accessToken = cookies().get('accessToken')?.value;
    const lang = cookies().get('Language')?.value;

    const res = await axiosInstance.delete(`${endpoints.banars}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
  revalidatePath('/dashboard/banars');
};
