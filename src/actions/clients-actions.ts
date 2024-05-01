'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import axiosInstance, { Params, endpoints } from 'src/utils/axios';

export const fetchClients = async ({
  page = 1,
  limit = 5,
  filters,
  status,
  created_at,
}: Params): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance(endpoints.clients.fetch, {
      params: {
        page,
        limit,
        client_search: filters,
        created_at,
        status: status || undefined,
      },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchClientsCardsData = async (): Promise<any> => {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance(endpoints.clients.details, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchSingleClient = async (clientId: string): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance(`${endpoints.clients.fetchSingle}/${clientId}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res.data;
  } catch (error) {
    return undefined;
  }
};

export const blockClient = async (clientId: string): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.put(
      `${endpoints.clients.updateClientStatus}?user_id=${clientId}&status=BlockedClient`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    revalidatePath(`${paths.dashboard.clients}/${clientId}`);
    return res.data;
  } catch (error) {
    revalidatePath(`${paths.dashboard.clients}/${clientId}`);
    return error;
  }
};

export const unblockClient = async (clientId: string): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    const res = await axiosInstance.put(
      `${endpoints.clients.updateClientStatus}?user_id=${clientId}&status=ActiveClient`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );
    revalidatePath(`${paths.dashboard.clients}/${clientId}`);
    return res.data;
  } catch (error) {
    revalidatePath(`${paths.dashboard.clients}/${clientId}`);
    return error;
  }
};

export const deleteClient = async (clientId: string): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    const res = await axiosInstance.delete(`${endpoints.clients.delete}/${clientId}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath(`${paths.dashboard.clients}`);
    return res.data;
  } catch (error) {
    revalidatePath(`${paths.dashboard.clients}/${clientId}`);
    return error;
  }
};
