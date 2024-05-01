import { t } from "i18next"

import { ITems } from "src/components/AutoComplete/CutomAutocompleteView"

export interface IReason {
  id?: string
  created_at: string
  updated_at: string
  deleted_at: string
  name_en: string
  name_ar: string
  type: string
  roles: string[]
  }
  export const ROLE_OPTIONS = [
    { label: t('Client'), value: 'CLIENT' },
    { label: t('Driver'), value: 'DRIVER' },
  ];

  export const REASON_TYPES:ITems[] = [
      {
        id: 'SUPPORT_TICKET',
        name: 'SUPPORT_TICKET',
        name_ar: 'الدعم الفنى',
        name_en: 'SUPPORT_TICKET',
      },
      {
        id: 'RETURN_ORDER',
        name: 'RETURN_ORDER',
        name_ar: 'الطلبات المرتجعه',
        name_en: 'RETURN_ORDER',
      },
      {
        id: 'CANCEL_ORDER',
        name: 'CANCEL_ORDER',
        name_ar: 'الطلبات الملغاه',
        name_en: 'CANCEL_ORDER',
      },
  ]