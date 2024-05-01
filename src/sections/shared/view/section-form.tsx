'use client';

import { usePathname } from 'next/navigation';

import Container from '@mui/material/Container';
// import { paths  } from 'src/routes/paths';

import { useState } from 'react';

import { useTranslate } from 'src/locales';
import { Section } from 'src/@types/section';
import { AddSection, EditSection } from 'src/actions/sections-actions';

import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { Input } from 'src/types/form';

import SharedNewEditForm from '../shared-new-edit-form';

// ----------------------------------------------------------------------

export default function FormView(section: any) {
  const { singleSection } = section;
  const pathname = usePathname();
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const hasEdit = pathname.includes('edit');
  const settings = useSettingsContext();
  const [sectionData, setSectionData] = useState<Section>({
    allowed_roles: singleSection?.allowed_roles,
    delivery_price: singleSection?.delivery_price,
    delivery_type: singleSection?.delivery_type,
    id: singleSection?.id,
    is_active: singleSection?.is_active,
    logo: singleSection?.logo,
    min_order_price: singleSection?.min_order_price,
    name: singleSection?.name,
    name_en: singleSection?.name_en,
  });

  const editForm: Input[] = [
    {
      name: 'logo',
      inputType: 'uploadImage',
      value: sectionData.logo || '',
      fullGrid: 12,

      label: t('image'),
      rules: {
        required: t(`item is required`, { item: t('image') }),
      },
    },
    {
      name: 'is_active',
      inputType: 'radioGroup',
      value: sectionData.is_active || false,
      fullGrid: 6,
      options: [
        { label: t('show'), value: true },
        { label: t('hide'), value: false },
      ],
      label: t('status'),
      rules: {
        required: t(`item is required`, { item: t('status') }),
      },
    },
    {
      name: 'delivery_type',
      inputType: 'radioGroup',
      value: sectionData.delivery_type || '',
      fullGrid: 6,
      options: [
        { label: t('express delivery'), value: 'FAST' },
        { label: t('scheduled delivery'), value: 'SCHEDULED' },
        { label: t('scheduled & fast delivery'), value: 'SCHEDULED&FAST' },
      ],
      label: t('delivery type'),
      rules: {
        required: t(`item is required`, { item: t('status') }),
      },
    },
    {
      label: t('delivery price'),
      name: 'delivery_price',
      inputType: 'textField',
      value: sectionData.delivery_price || '',
      fullGrid: 6,
      rules: {
        required: t(`item is required`, { item: t('price') }),
      },
      type: 'number',
    },
    {
      label: t('min order price'),
      name: 'min_order_price',
      inputType: 'textField',
      value: sectionData.min_order_price || '',
      fullGrid: 6,
      rules: {
        required: t(`item is required`, { item: t('min order price') }),
      },
      type: 'number',
    },
    {
      name: 'allowed_roles',
      inputType: 'select',
      value: sectionData.allowed_roles || '',
      fullGrid: 6,
      options: [
        { label: t('client'), value: 'CLIENT' },
        { label: t('restaurant'), value: 'RESTURANT' },
      ],
      label: t('allowed roles'),
      rules: {
        required: t(`item is required`, { item: t('allowed roles') }),
      },
    },
  ];
  const newForm: Input[] = [
    {
      name: 'logo',
      inputType: 'uploadImage',
      value: sectionData.logo,
      fullGrid: 12,

      label: t('image'),
      rules: {
        required: t(`item is required`, { item: t('image') }),
      },
    },
    {
      name: 'is_active',
      inputType: 'radioGroup',
      value: sectionData.is_active,
      fullGrid: 6,
      options: [
        { label: t('show'), value: true },
        { label: t('hide'), value: false },
      ],
      label: t('status'),
      rules: {
        required: t(`item is required`, { item: t('status') }),
      },
    },
    {
      name: 'delivery_type',
      inputType: 'radioGroup',
      value: sectionData.delivery_type,
      fullGrid: 6,
      options: [
        { label: t('express delivery'), value: 'FAST' },
        { label: t('scheduled delivery'), value: 'SCHEDULED' },
        { label: t('scheduled & fast delivery'), value: 'SCHEDULED&FAST' },
      ],
      label: t('delivery type'),
      rules: {
        required: t(`item is required`, { item: t('status') }),
      },
    },

    {
      label: t('Name in Arabic'),
      name: 'name_ar ',
      inputType: 'textField',
      value: '',
      fullGrid: 6,
      rules: {
        required: t(`item is required`, { item: t('Name in Arabic') }),
      },
    },
    {
      label: t('Name in English'),
      name: 'name_en ',
      inputType: 'textField',
      value: '',
      fullGrid: 6,
      rules: {
        required: t(`item is required`, { item: t('Name in English') }),
      },
    },
    {
      label: t('delivery price'),
      name: 'delivery_price',
      inputType: 'textField',

      fullGrid: 6,
      rules: {
        required: t(`item is required`, { item: t('price') }),
        pattern: {
          value: /^[0-9]+$/,
          message: 'Please enter only numbers.',
        },
      },
      type: 'number',
    },
    {
      label: t('min order price'),
      name: 'min_order_price',
      inputType: 'textField',

      fullGrid: 6,

      rules: {
        required: t(`item is required`, { item: t('min order price') }),
        pattern: {
          value: /^[0-9]+$/,
          message: 'Please enter only numbers.',
        },
      },
      type: 'number',
    },
    {
      name: 'allowed_roles',
      inputType: 'select',
      value: sectionData.allowed_roles,
      fullGrid: 6,
      options: [
        { label: t('client'), value: 'CLIENT' },
        { label: t('restaurant'), value: 'RESTURANT' },
      ],
      label: t('allowed roles'),
      rules: {
        required: t(`item is required`, { item: t('allowed roles') }),
      },
    },
  ];

  const submitData = async (event: any) => {
    const { id } = sectionData;
    const order_by = 1;

    if (hasEdit) {
      const edit = await EditSection({ ...event, id, order_by })
        .then((res) => enqueueSnackbar(t('Update success!')))
        .catch((error) => {
          enqueueSnackbar(t('something_went_wrong'), { variant: 'error' });
        });
    } else {
      const add = await AddSection({ ...event, order_by })
        .then((res) => enqueueSnackbar(t('Create success!')))
        .catch((error) => {
          enqueueSnackbar(t('something_went_wrong'), { variant: 'error' });
        });
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('sections')}
        links={[
          {
            name: t('sections'),
            href: '#' /* paths.dashboard.root */,
          },
          {
            name: hasEdit ? t('edit') : t('new'),
            href: '#' /* paths.dashboard.user.root */,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {hasEdit && (
        <SharedNewEditForm
          inputs={editForm}
          submitFunc={submitData}
          mood={hasEdit ? 'edit' : 'create'}
        />
      )}

      {!hasEdit && (
        <SharedNewEditForm
          inputs={newForm}
          submitFunc={submitData}
          mood={hasEdit ? 'edit' : 'create'}
        />
      )}
    </Container>
  );
}
