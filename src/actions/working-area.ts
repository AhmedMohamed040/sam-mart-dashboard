'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

import type { WorkingArea, POSTReqBody } from 'src/@types/working-area';

import { fetchCountries } from './countries';
import { fetchCities, fetchSingleCity } from './cities-actions';

export const getWorkingAreas = async (name: string): Promise<any> => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  const filters: string[] = [`name=${name}`, `city.name_ar=${name}`, `city.name_en=${name}`];
  try {
    const res = await axiosInstance.get(`${endpoints.workingArea.get}`, {
      params: { filters },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    //
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getWorkingAreaNames = async (search: string) => {
  const Areas = await getWorkingAreas(search);
  return Areas.data.map((area: WorkingArea) => area.name);
};
export const getTableContent = async (AreaName = '') => {
  const tableContent = await getWorkingAreas(AreaName);
  const specificFields = tableContent.data;
  const requiredFields = await Promise.all(
    specificFields.map(async (eachArea: WorkingArea) => {
      const { id, is_active, name, address, city_id, range, latitude, longitude } = eachArea;
      const city = await fetchSingleCity({
        city_id,
      });
      return {
        latitude,
        longitude,
        id,
        is_active,
        name,
        address,
        city,
        range,
      };
    })
  );
  return requiredFields;
};

export const getAllCities = async () => {
  const countries = await fetchCountries();
  const Cities = await Promise.all(
    countries.data.data.map(async (country: any) => {
      const singleContryCities = await fetchCities({ country_id: country.id });
      const requiredCityData = singleContryCities.data.map((city: any) => {
        const { id, name_ar, name_en } = city;
        return {
          id,
          name_ar,
          name_en,
        };
      });
      return requiredCityData;
    })
  );
  return Cities.flat();
};

// eslint-disable-next-line consistent-return
export const setWorkArea = async (reqBody: POSTReqBody) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    await axiosInstance.post(`${endpoints.workingArea.post}`, reqBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath(`/dashboard/working-area`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
// eslint-disable-next-line consistent-return
export const deleteWorkingArea = async (id: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    await axiosInstance.delete(`${endpoints.workingArea.delete}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    revalidatePath(`/dashboard/working-area`);
  } catch (error) {
    revalidatePath(`/dashboard/working-area`);

    return {
      error: getErrorMessage(error),
    };
  }
};

export const toggleWorkArea = async (targetedId: string, newStatus: boolean) => {
  const singleArea = await getSingleWorkArea(targetedId);
  const { id, latitude, longitude, range, city_id, name, address } = singleArea;
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  const data = {
    latitude,
    longitude,
    range,
    is_active: newStatus,
    id,
    city_id,
    name,
    address,
  };
  try {
    const res = await axiosInstance.put(`${endpoints.workingArea.put}`, data, {
      params: { id },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath(`/dashboard/working-area`);

    return res.data.message;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const getSingleWorkArea = async (id: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.get(`${endpoints.workingArea.get}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

// eslint-disable-next-line consistent-return
export const editExistingWorkArea = async (reqBody: any) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    await axiosInstance.put(`${endpoints.workingArea.put}`, reqBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    revalidatePath(`dashboard/working-area`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
