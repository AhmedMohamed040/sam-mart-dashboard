export interface PaymentMethod {
  id: string;
  type: string;
  logo: string;
  name: string;
  is_active: boolean;
  wallet_number: string;
}
