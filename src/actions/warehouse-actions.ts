'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

type NewWarehouseBody = {
  name_ar: string;
  name_en: string;
  region_id: string;
  latitude: string;
  longitude: string;
  is_active: boolean;
};
// eslint-disable-next-line consistent-return
export const newWarehouse = async (dataBody: NewWarehouseBody): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    const res = await axiosInstance.post(`${endpoints.warehouse.new}`, dataBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const fetchWarehouses = async ({
  page = 1,
  limit = 5,
  country_id,
  city_id,
  region_id,
  search,
  warehouseId,
  staticLang,
}: {
  search: string;
  page: number;
  limit: number;
  country_id?: string;
  city_id?: string;
  region_id?: string;
  warehouseId?: string;
  staticLang?: string;
}): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = staticLang || cookies().get('Language')?.value;

  let filters: string = '';
  if (region_id) {
    filters += `region_id=${region_id}`;
  } else if (city_id) {
    filters += `region.city_id=${city_id}`;
  } else if (country_id) {
    filters += `region.city.country_id=${country_id}`;
  }
  if (search) {
    if (filters) filters += ',';
    filters += `name_${lang}=${search}`;
  }
  if (warehouseId) {
    filters += `id=${warehouseId}`;
  }
  try {
    const res = await axiosInstance(endpoints.warehouse.fetch, {
      params: { page, limit, filters },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const editWarehouse = async ({
  dataBody,
  id,
}: {
  dataBody: { [key: string]: string };
  id: string;
}) => {
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.patch(`${endpoints.warehouse.edit}/{id}`, dataBody, {
      params: { id },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    revalidatePath('/dashboard/warehouses-and-delivery-locations');
    return res.data.message;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const EditWarehouseCities = async ({
  dataBody,
  id,
}: {
  dataBody: { [key: string]: string };
  id: string;
}) => {
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.patch(`${endpoints.warehouse.fetch}/{id}`, dataBody, {
      params: { id },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data.message;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const fetchSingleWarehouse = async (id: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  try {
    const res = await axiosInstance.get(`${endpoints.warehouse.fetch}`, {
      params: { filters: `id=${id}` },
      headers: {
        'Accept-Language': 'ar',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const fetchWarehouseProduct = async ({
  page = 1,
  limit = 5,
  search,
  id,
}: {
  id: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  const name = search ?? '';
  try {
    const res = await axiosInstance.get(`${endpoints.warehouse.products}?warehouse_id=${id}`, {
      params: { page, limit, name },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    return { data: res?.data?.data?.data, count: res?.data?.data.meta?.itemCount };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const ToggleWarehouse = async (formData: FormData) => {
  const id = formData.get('id');
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  const is_active = formData.get('is_active');
  const data = {
    is_active: is_active === 'false',
  };

  try {
    const res = await axiosInstance.patch(`${endpoints.warehouse.fetch}/{id}`, data, {
      params: { id },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath('/dashboard/warehouses-and-delivery-locations');

    return res.data.message;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
interface IDataBody {
  warehouse_id: string;
  type: string;
  products: Product[];
}
interface Product {
  product_id: string;
  product_measurement_id: string;
  quantity: number;
}
export const WarehouseProductOperation = async ({ dataBody }: { dataBody: IDataBody }) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(`${endpoints.warehouse.operation}`, dataBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath(paths.dashboard.productsGroup.root);
    revalidatePath(paths.dashboard.warehousesAndDeliveryLocations);
    return res.data.message;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteWarehouse = async (id: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    const res = await axiosInstance.delete(`${endpoints.warehouse.delete}/{id}`, {
      params: { id },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });

    return res.data.message;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  } finally {
    revalidatePath(paths.dashboard.warehousesAndDeliveryLocations);
  }
};
