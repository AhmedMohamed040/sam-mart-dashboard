'use client';

import * as Yup from 'yup';
import { Fragment } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { IWarehouse } from 'src/@types/warehouse';
import { WarehouseProductOperation } from 'src/actions/warehouse-actions';

import Iconify from 'src/components/iconify/iconify';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductInputs from './product';
import BarcodeSearchInput from './barcode-search-input';

interface Props {
  warehouseId: string;
  type: 'IMPORT' | 'EXPORT';
  warehouse: IWarehouse & { name_en: string };
}
const InitialValue = {
  barcode: '',
  readOnly: '',
  mesurements: [],
  quantity: 0,
  unitSelect: '',
  productId: '',
  isValid: undefined,
};

const ImportExport = ({ warehouseId, type, warehouse }: Props) => {
  const router = useRouter();
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = {
    products: [InitialValue],
  };
  const yupSchema = Yup.object().shape({
    products: Yup.array()
      .of(
        Yup.object().shape({
          unitSelect: Yup.string().required(t(`Unit is required`)),
          quantity: Yup.number()
            .typeError(t(`Quantity must be a number`))
            .required(t(`Quantity is required`))
            .positive(t('Quantity must be positive'))
            .integer(t(`Quantity must be an integer`)),
        })
      )
      .required(),
  });

  const methods = useForm({ defaultValues, resolver: yupResolver(yupSchema) });
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'products',
  });
  const onSubmit = methods.handleSubmit(async (data) => {
    const handledProducts = data.products.map((e: any) => ({
      product_id: e.productId,
      product_measurement_id: e.unitSelect,
      quantity: e.quantity,
    }));
    const dataBody = {
      warehouse_id: warehouseId,
      type,
      products: handledProducts,
    };
    const res = await WarehouseProductOperation({ dataBody });
    methods.reset();
    if (res?.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(
        t(
          `${type === 'IMPORT' ? 'products_were_imported_successfully' : 'products_were_exported_successfully'}`
        )
      );
      router.push(`${paths.dashboard.warehousesAndDeliveryLocations}/${warehouseId}`);
    }
  });
  return (
    <Container maxWidth="xl">
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <CustomBreadcrumbs
          heading={
            warehouse ? getCustomNameKeyLang(warehouse.name_en, warehouse.name) : t('unknown')
          }
          links={[
            {
              name: t('warehouses'),
              href: paths.dashboard.warehousesAndDeliveryLocations,
            },
            {
              name: warehouse
                ? getCustomNameKeyLang(warehouse.name_en, warehouse.name)
                : t('unknown'),
              href: warehouse
                ? `${paths.dashboard.warehousesAndDeliveryLocations}/${warehouseId}`
                : '',
            },
            {
              name: t(`${type} products`),
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card sx={{ p: 3, ml: 3, mb: 1 }}>
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <Box
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: '1fr 0.01fr' }}
                alignItems={{
                  xs: 'center',
                }}
                gap={2}
                my={2}
              >
                <Box my={2} gridColumn={index === 0 ? 'span 2' : 'span 1'}>
                  <BarcodeSearchInput index={index} />
                  <ProductInputs index={index} />
                </Box>
                {!!index && (
                  <IconButton
                    sx={{
                      ':hover': {
                        backgroundColor: 'grey.900',
                      },
                      borderRadius: 1,
                      backgroundColor: 'grey.900',
                      width: {
                        sm: 'fit-content',
                      },
                    }}
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <Iconify icon="material-symbols:close" color="white" />
                  </IconButton>
                )}
              </Box>
              {index + 1 === fields.length ? null : <Divider sx={{ borderColor: 'grey.900' }} />}
            </Fragment>
          ))}
          <Stack direction="row" gap={1} justifyContent="flex-end" mt={2}>
            <Button
              onClick={() => {
                append({ ...InitialValue });
              }}
              variant="contained"
            >
              {t('add')}
            </Button>
            <Button type="submit" variant="contained">
              {t('save')}
            </Button>
          </Stack>
        </Card>
      </FormProvider>
    </Container>
  );
};

export default ImportExport;
