'use server';

import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

export const getImageUrl = async ({ image }: { image: FormData }): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const endpoint = endpoints.storage;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(endpoint.base_storage, image, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    return res.data.data.path;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
