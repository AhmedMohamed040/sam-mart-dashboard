import { Position } from 'src/types/map';

interface City {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  name_ar: string;
  name_en: string;
  country_id: string;
}
export interface WorkingArea {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  address: string;
  is_active: boolean;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  range: number;
  city_id: string;
  city: City;
}
export interface TableContent {
  latitude: string | number;
  longitude: string | number;
  id: string;
  is_active: boolean;
  name: string;
  address: string;
  city: City;
  range: number;
}
export interface ItemContent {
  city: {
    country: {
      id: string;
      name_ar: string;
      name_en: string;
    };
    id: string;
    name_ar: string;
    name_en: string;
  };
  id: string;
  is_active: boolean;
  latitude: string | number;
  longitude: string | number;
  name: string;
  range: number;
}
export interface CityOption {
  id: string;
  name_ar: string;
  name_en: string;
}
export interface MapData {
  coords: Position;
  address: {
    add_ar: string;
    add_en: string;
  };
}
export interface POSTReqBody {
  latitude: number | string;
  longitude: number | string;
  range: number;
  name: string;
  address: string;
  city_id: string;
  is_active: boolean;
}
