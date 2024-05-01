import * as Yup from 'yup';

import i18n from 'src/locales/i18n';
import { EditExistingEmployee } from 'src/@types/employees';

export const EmpDataSchema = Yup.object().shape({
  city_id: Yup.string().required(i18n.t('city_is_required')),
  country_id: Yup.string().required(i18n.t('country_is_required')),
  email: Yup.string().email(i18n.t('invalid_email')).required(i18n.t('email_required')),
  gender: Yup.string()
    .required(i18n.t('gender_is_required'))
    .oneOf(['male', 'female'], i18n.t('invalid_gender')),
  name_ar: Yup.string()
    .matches(/^[\u0600-\u06FF\s]+$/, i18n.t('only_arabic'))
    .required(i18n.t('employee_name_is_required')),
  name_en: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, i18n.t('only_english'))
    .required(i18n.t('employee_name_is_required')),
  phone: Yup.string()
    .matches(/^\+(?:[0-9]●?){6,14}[0-9]$/, i18n.t('invalid_phone_number'))
    .required(i18n.t('phone_number_is_required')),
  qualification: Yup.string(),
  is_active: Yup.boolean()
    .required(i18n.t('status_is_required'))
    .oneOf([true, false], i18n.t('invalid_status')),
});
export const DepsSchema = Yup.object().shape({
  accounting: Yup.boolean().oneOf([true, false]),
  customerService: Yup.boolean().oneOf([true, false]),
  hr: Yup.boolean().oneOf([true, false]),
  marketing: Yup.boolean().oneOf([true, false]),
});
/**
 ########################################################
 ################### DEFAULT VALUES #####################
 ######################################################## 
 */
export const getDefValues = () => {
  const employeeData = {
    avatar_file: null,
    city_id: '',
    country_id: '',
    email: '',
    gender: 'male',
    name_ar: '',
    name_en: '',
    phone: '',
    qualification: '',
    is_active: false,
  };
  const departements = {
    accounting: false,
    customerService: false,
    hr: false,
    marketing: false,
  };
  const permissions = {
    sections: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    categories: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    clients: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    clientsWallet: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    couponsAndDiscounts: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    currencies: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    drivers: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    driversWallet: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    employees: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    notifications: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    offers: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    orders: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    products: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    reports: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    returnRequests: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    sub_categories: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    transactions: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    warehouses: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    advertisements: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
  };
  return {
    EmpDATA: employeeData,
    Deps: departements,
    Perms: permissions,
  };
};
export const getEditDefValues = (employee: EditExistingEmployee) => {
  const employeeData = {
    avatar_file: employee?.avatar || null,
    city_id: employee?.city_id || '',
    country_id: employee?.country_id || '',
    email: employee?.email || '',
    gender: employee?.gender || 'male',
    name_ar: employee?.name_ar || '',
    name_en: employee?.name_en || '',
    phone: employee?.phone || '',
    qualification: employee?.qualification || '',
    is_active: employee?.is_active || false,
  };
  const departements = {
    accounting: employee?.departements?.includes('Accounting') || false,
    customerService: employee?.departements?.includes('Customer Service') || false,
    hr: employee?.departements?.includes('HR') || false,
    marketing: employee?.departements?.includes('Marketing') || false,
  };
  const permissions = {
    sections: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    categories: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    clients: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    clientsWallet: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    couponsAndDiscounts: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    currencies: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    drivers: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    driversWallet: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    employees: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    notifications: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    offers: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    orders: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    products: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    reports: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    returnRequests: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    sub_categories: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    transactions: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    warehouses: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    advertisements: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
  };
  return {
    EmpDATA: employeeData,
    Deps: departements,
    Perms: permissions,
  };
};
