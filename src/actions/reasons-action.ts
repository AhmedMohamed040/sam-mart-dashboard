'use server';

import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';



export const fetchReasons = async ({page=1,limit=5,type,search}:{page:number,limit:number,type:string,search:string|undefined}) => {
    const accessToken = cookies().get('accessToken')?.value;
    const lang = cookies().get('Language')?.value;
    try {
      const res = await axiosInstance.get(`${endpoints.reason.fetchByName}?${search?`name=${search}`:''}`, {
        params: { page, limit, type },
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      });
      return res?.data;
    } catch (error) {
      return {
        error: getErrorMessage(error),
      };
    }
}
export const fetchSingleReasons = async ({id}:{id:string}) => {
  const accessToken = cookies().get('accessToken')?.value;
  const lang = cookies().get('Language')?.value;
  try {
    const res = await axiosInstance.get(`${endpoints.reason.single}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
export const deleteReasons = async ({id}:{id:string}) => {
    const accessToken = cookies().get('accessToken')?.value;
    const lang = cookies().get('Language')?.value;
  
    try {
      const res = await axiosInstance.delete(`${endpoints.reason.delete}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      });
      return res.data;
    } catch (error) {
      return {
        error: getErrorMessage(error),
      };
    }
}
export const addReason = async ({ reason }: { reason: {[key:string]:string} }): Promise<any> => {
    const accessToken = cookies().get('accessToken')?.value;
    const lang = cookies().get('Language')?.value;
  
    try {
      const res = await axiosInstance.post(endpoints.reason.create, reason, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      });
      return res.data.data;
    } catch (error) {
      return {
        error: getErrorMessage(error),
      };
    }
  };
  export const editReason = async ({ reason,id }: { reason: {[key:string]:string},id:string }): Promise<any> => {
    const accessToken = cookies().get('accessToken')?.value;
    const lang = cookies().get('Language')?.value;
  
    try {
      const res = await axiosInstance.patch(`${endpoints.reason.update}/${id}`, reason, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
      });
      return res?.data;
    } catch (error) {
      return {
        error: getErrorMessage(error),
      };
    }
  };