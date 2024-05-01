interface Order {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  user_id: string;
  warehouse_id: string;
  address_id: string;
  section_id: string;
  total_price: string | number;
  delivery_fee: string | number;
  payment_method: string;
  is_paid: boolean;
  number: string | number;
  delivery_type: string;
  estimated_delivery_time: string | null;
  payment_method_id: string;
  transaction_number: string | number | null;
  delivery_day: string | null;
  slot_id: string | null;
}
export type WalletInformation = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  user_id: string;
  balance: string | number;
  limit: string | number | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
export interface Transaction {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  amount: string | number;
  wallet_id: string;
  type: string;
  order_id: string;
  user_id: string;
  number: string | number;
  order: Order;
}
export interface META {
  page: number;
  limit: number;
  total: number;
}
