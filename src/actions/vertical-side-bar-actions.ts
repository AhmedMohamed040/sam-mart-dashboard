'use server';

import { cookies } from 'next/headers';

import axiosInstance, { endpoints } from 'src/utils/axios';

export const getTotalOrders = async () => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.get(`${endpoints.orders.details}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};
