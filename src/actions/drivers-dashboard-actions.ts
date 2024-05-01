'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

import { IWarehouse } from 'src/@types/warehouse';
import { City, Region } from 'src/@types/dashboard-drivers';
import {
  getDriversViewRequiredContentForTheTable,
  getSingleDriverOrdersRequiredDataForTheTable,
} from 'src/helper-functions/drivers-dashboard-actions';

import { fetchCities } from './cities-actions';
import { fetchRegions } from './region-actions';

export const getAllDrivers = async ({
  page = '1',
  limit = '5',
  created_at = '',
  driver_search = '',
  status = '',
  country_id = '',
  city_id = '',
  region_id = '',
  vehicle_type = '',
}) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  const searchString = `?page=${page}&limit=${limit}${vehicle_type ? `&vehicle_type=${vehicle_type}` : ''}${created_at ? `&created_at=${created_at}` : ''}&driver_search=${driver_search}${status ? `&status=${status}` : ''}&country_id=${country_id}&city_id=${city_id}&region_id=${region_id}`;

  try {
    const res = await axiosInstance.get(`${endpoints.driversDashboard.getAll}${searchString}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    const META = res.data.data.meta;
    const DATA = res.data.data.data;
    const handledData = getDriversViewRequiredContentForTheTable(DATA, META);
    return handledData;
  } catch (error) {
    throw new Error(error);
  }
};

export const getDriversAnalytics = async () => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.get(`${endpoints.driversDashboard.getTotal}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSingleDriver = async (id: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.get(`${endpoints.driversDashboard.getSingle}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });

    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCities = async (countryId: string) => {
  const res = await fetchCities({ country_id: countryId });
  return res.data.map((city: City) => ({
    id: city.id,
    name_ar: city.name_ar,
    name_en: city.name_en,
  }));
};
export const getRegions = async (cityId: string) => {
  const res = await fetchRegions({ city_id: cityId });
  return res.map((region: Region) => ({
    id: region.id,
    name_ar: region.name_ar,
    name_en: region.name_en,
  }));
};

export const changeDriverStatus = async (reqBody: {
  driver_id: string;
  status: string;
  status_reason: string;
}) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(
      `${endpoints.driversDashboard.manipulateDriverStatus}`,
      reqBody,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );

    revalidatePath('/drivers');
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

// eslint-disable-next-line consistent-return
export const deleteDriver = async (id: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    await axiosInstance.delete(`${endpoints.driversDashboard.delete}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const getDriverOrders = async ({
  page = '1',
  limit = '5',
  driver_id,
  status = '',
  order_date = '',
  order_search = '',
}: {
  [key: string]: string;
}) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  const searchString = `?page=${page}&limit=${limit}&driver_id=${driver_id}${order_date ? `&order_date=${order_date}` : ''}${status ? `&status=${status}` : ''}${order_search ? `&order_search=${order_search}` : ''}`;

  try {
    const res = await axiosInstance.get(
      `${endpoints.driversDashboard.getDriverOrders}${searchString}`,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      }
    );

    //  SEND THE DATA RECIVED FROM THE END POINT TO BE HANDLED AND FILTERED TO RETURN THE ONLY REQUIRED DATA FOR THE TABLE
    const ORDERS = getSingleDriverOrdersRequiredDataForTheTable(res.data.data.data);
    const META = res.data.data.meta;
    return { ORDERS, META };
  } catch (error) {
    throw new Error(error);
  }
};

export const editDriverProfile = async (reqBody: FormData) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.put(`${endpoints.driversDashboard.updateProfile}`, reqBody, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath(paths.dashboard.drivers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const getRequiredWarehouseDataForDrivers = async () => {
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await axiosInstance.get(endpoints.warehouse.fetch, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': 'ar' },
    });
    const reqData = res?.data?.data?.map((warehouse: IWarehouse) => {
      const { id, name, name_en } = warehouse;
      return { id, name, name_en };
    });
    return reqData;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const assignDriverToWarehouse = async (warehouse_id: string, driver_id: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.post(
      `${endpoints.warehouse.attach}/${warehouse_id}/${driver_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
      }
    );
    revalidatePath(paths.dashboard.drivers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
