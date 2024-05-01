export interface IWarehouse {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  name: string;
  name_en?: string;
  is_active: boolean;
  region_id: string;
  location: string;
  latitude: number;
  longitude: number;
  region: Region;
}

export interface Region {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  name: string;
  name_en?: string;
  city_id: string;
  city: City;
}

export interface City {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  name: string;
  name_en?: string;
  country_id: string;
  country: Country;
}

export interface Country {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  name: string;
  name_en?: string;
}
