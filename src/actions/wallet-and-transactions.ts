'use server';

import { cookies } from 'next/headers';

import axiosInstance, { endpoints } from 'src/utils/axios';

export async function getUserTransactions({
  page = '1',
  limit = '5',
  user_id,
}: {
  [key: string]: string;
}) {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  const filters = {
    filters: `user_id=${user_id}`,
  };
  const pagination = {
    page,
    limit,
  };
  try {
    const res = await axiosInstance.get(endpoints.transactions.getAll, {
      params: {
        ...pagination,
        ...filters,
      },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    const { data, meta } = res.data;
    return {
      TRANSACTIONS: data,
      META: meta,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function getWalletInformation(user_id: string) {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.get(endpoints.transactions.getWallet, {
      params: {
        user_id,
      },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    const { data } = res.data;
    return data;
  } catch (err) {
    throw new Error(err);
  }
}
