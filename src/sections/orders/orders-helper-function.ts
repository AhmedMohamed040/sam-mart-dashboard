import Cookies from 'js-cookie';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

export const getInvoice = async (orderId: string) => {
  const lang = Cookies.get('Language');
  const accessToken = Cookies.get('accessToken');

  try {
    const res = await axiosInstance.get(`${endpoints.orders.getInvoice}/${orderId}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
      },
    });
    const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    // window.open(pdfUrl);
    return {
      url: pdfUrl,
    };
  } catch (err) {
    return {
      error: getErrorMessage(err),
    };
  }
};
