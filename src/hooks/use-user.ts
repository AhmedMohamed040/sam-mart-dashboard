import { cookies } from 'next/headers';

import { USER_KEY } from '../auth/constants';

export type User = {
  id: string;
  name: string;
  avatar: any;
  username: string;
  email: string;
  email_verified_at: any;
  phone: string;
  phone_verified_at: any;
  roles: string[];
  access_token: string;
};

export const useUser = (): User => {
  const cookieStore = cookies();
  const { value } = cookieStore.get(USER_KEY) as Record<string, string>;
  return JSON.parse(value) as User;
};
