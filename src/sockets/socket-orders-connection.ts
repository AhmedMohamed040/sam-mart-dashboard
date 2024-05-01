'use client';

import Cookies from 'js-cookie';
import { io } from 'socket.io-client';

const accessToken = Cookies?.get('accessToken') || '';

export const socket = io(`${process.env.NEXT_PUBLIC_HOST_DOMAIN}/order`, {
  extraHeaders: {
    Authorization: `Bearer ${accessToken}`,
  },
});
