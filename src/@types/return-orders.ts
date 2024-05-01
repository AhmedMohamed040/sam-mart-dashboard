import { Driver } from './driver';

export interface IReturnOrder {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  status: string;
  admin_note: any;
  customer_note: string;
  order_id: string;
  driver_id: any;
  order: Order;
  returnOrderProducts: ReturnOrderProduct[];
  driver: Driver;
}

export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  user_id: string;
  warehouse_id: string;
  address_id: string;
  section_id: string;
  total_price: string;
  delivery_fee: string;
  payment_method: string;
  is_paid: boolean;
  number: string;
  delivery_type: string;
  estimated_delivery_time: string;
  delivery_day: string;
  slot_id: any;
  user: User;
}

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  username: string;
  name: string;
  password: string;
  email: string;
  email_verified_at: any;
  phone: string;
  phone_verified_at: any;
  avatar: string;
  gender: string;
  user_status: string;
  birth_date: string;
  allow_notification: boolean;
  roles: string[];
  fcm_token: any;
  notification_is_active: boolean;
  language: string;
}

export interface ReturnOrderProduct {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  status: string;
  quantity: number;
  shipment_product_id: string;
  return_product_reason_id: any;
  return_order_id: string;
  shipmentProduct: ShipmentProduct;
}

export interface ShipmentProduct {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  shipment_id: string;
  product_id: string;
  section_id: string;
  quantity: number;
  main_measurement_id: string;
  conversion_factor: number;
  product_category_price_id: string;
  is_offer: boolean;
  price: string;
  can_return: boolean;
  additions: string[];
}

export interface ReturnOrderProducts {
  id: string;
  shipment_product_id: string;
  status: string;
  quantity: number;
  conversion_factor: number;
  price: string | number;
}
export interface USER_IN_ORDER {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  birth_date: string | null;
  gender: 'male' | 'female';
  name: string;
}
export interface ORDER {
  id: string;
  user: USER_IN_ORDER;
  total_price: string;
  payment_method: string;
  is_paid: boolean;
  delivery_type: string;
  estimated_delivery_time: string | null;
  slot_id: string | null;
  delivery_day: string | null;
  number: string | number;
  delivery_fee: string | number;
}
export interface RETURN_ORDER {
  id: string;
  return_number: string;
  status: string;
  admin_note: string | null;
  customer_note: string | null;
  order: ORDER;
  returnOrderProducts: ReturnOrderProducts[];
  driver: D_ReturnOrder_Driver;
  request_accepted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// RETURN ORDER DETIALS
export interface D_ProductLogo {
  id: string;
  is_logo: boolean;
  url: string;
}
export interface D_returnProductReason {
  id: string;
  name: string;
  type: string;
}
export interface D_returnOrderProducts {
  id: string;
  product_barcode: string;
  shipment_product_id: string;
  status: string;
  product_id: string;
  product_name: string;
  description: string;
  quantity: number;
  conversion_factor: number;
  price: string | number;
  product_logo: D_ProductLogo;
  returnProductReason: D_returnProductReason;
}

export interface D_Order_User {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  birth_date: string | null;
  gender: string;
  name: string;
}
export interface D_ReturnOrder_Order {
  id: string;
  user: D_Order_User;
  total_price: string;
  payment_method: string;
  is_paid: boolean;
  delivery_type: string;
  estimated_delivery_time: string | null;
  slot_id: string | null;
  delivery_day: string | null;
  number: string;
  delivery_fee: string;
}
export interface D_ReturnOrder_Driver {
  id: string;
  avatar: null | string;
  created_at: string | null;
  is_receive_orders: boolean;
  username: string;
  email: string;
  phone: string;
  birth_date: string;
  driver_status: 'VERIFIED' | 'PENDING' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED';
}
export interface D_returnOrder {
  id: string;
  return_number: string;
  status: string;
  admin_note: string | null;
  customer_note: string | null;
  order: D_ReturnOrder_Order;
  returnOrderProducts: D_returnOrderProducts[];
  driver?: D_ReturnOrder_Driver;
  request_accepted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}
