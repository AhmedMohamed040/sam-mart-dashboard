export interface IClient {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  birth_date: string;
  created_at: string;
  user_status: string;
  wallet_balance: number;
  main_address: MainAddress;
}

export interface MainAddress {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  name: string;
}

export interface Client {
  id?: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  birth_date?: string;
  created_at?: string;
  user_status?: string;
  wallet_balance?: string;
  main_address?: {
    id?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    name?: string;
  };
}

export interface ClientsCardsData {
  active: number;
  blocked: number;
  purchased: number;
  total: number;
}
