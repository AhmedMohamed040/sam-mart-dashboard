export interface META {
  page: number;
  limit: number;
  total: number;
}
export interface USER_IN_EMPLOYEE {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string | null;
  birth_date: string | Date | null;
  gender: 'male' | 'female';
  name: string;
}
export interface Employee {
  id: string;
  name_ar: string;
  name_en: string;
  qualification: string;
  is_active: boolean;
  departements: string[];
  user_id: string;
  country_id: string;
  city_id: string;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  user: USER_IN_EMPLOYEE;
}
export interface EmployeeTableRow {
  id: string;
  name_ar: string;
  name_en: string;
  userId: string;
  email: string;
  gender: 'male' | 'female';
  qualification: string;
  created_at: Date | string | null;
  country_id: string;
  city_id: string;
  is_active: boolean;
  phone: string;
  city_name_ar: string;
  city_name_en: string;
  country_name_ar: string;
  country_name_en: string;
  avatar: string | null;
}

export interface ReturnedSingleEmployee {
  id: string;
  name_ar: string;
  name_en: string;
  qualification: string | null;
  is_active: boolean;
  departements: string[];
  user_id: string;
  country_id: string;
  city_id: string;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  user: {
    id: string;
    username: string;
    email: string;
    phone: string | number | null;
    avatar: string | null;
    birth_date: Date | string | null;
    gender: 'male' | 'female';
    name: string;
  };
}

export interface EditExistingEmployee {
  id: string;
  name_ar: string;
  name_en: string;
  qualification: string | null;
  departements: string[];
  country_id: string;
  city_id: string;
  avatar: string | null;
  is_active: boolean;
  phone: string;
  gender: 'male' | 'female';
  email: string;
}
