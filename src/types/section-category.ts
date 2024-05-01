export type ISectionCategory = {
  id: string;
  category_id: string;
  logo: string;
  name: string;
  name_en: string;
  name_ar: string;
  is_active: boolean;
  order_by?: number;
  section_id: string | undefined;
};
