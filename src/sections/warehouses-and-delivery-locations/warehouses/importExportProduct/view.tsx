'use client';

import * as Yup from 'yup';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, Fragment, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { getErrorMessage } from 'src/utils/axios';

import { Units } from 'src/@types/units';
import { WarehouseProductOperation } from 'src/actions/warehouse-actions';
import { fetchProducts, fetchSingleProduct } from 'src/actions/product-actions';

import { useSnackbar } from 'src/components/snackbar';
import { RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CutomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

interface IDataBody {
  warehouse_id: string;
  type: string;
  products: Product[];
}
interface Product {
  product_id: string;
  product_measurement_id: string;
  quantity: number;
}

export function ImportExportWarehouseProduct({
  warehouseId,
  products,
  typee,
}: {
  warehouseId: string;
  products: any;
  typee: 'IMPORT' | 'EXPORT';
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const [fields, setFields] = useState<
    {
      uiId: number;
      barcode?: string;
      isLoading?: boolean;
      products: any[];
      search?: string;
      productId?: string;
      measureId?: string;
      quantity: number;
    }[]
  >([
    {
      uiId: 0,
      barcode: undefined,
      isLoading: false,
      products,
      search: undefined,
      productId: undefined,
      measureId: undefined,
      quantity: 0,
    },
  ]);

  const [units, setUnits] = useState<{ [key: string]: Units[] }>({});

  const settings = useSettingsContext();

  const generateSchema = () => {
    const fieldSchema = fields.reduce(
      (schema, field, index) => ({
        ...schema,
        [`product${index}`]: Yup.mixed<any>().required(t(`Product is required`)),
        [`unit${index}`]: Yup.mixed<any>().required(t(`Unit is required`)),
        [`quantity${index}`]: Yup.number()
          .typeError(t(`Quantity must be a number`))
          .required(t(`Quantity is required`))
          .positive(t('Quantity must be positive'))
          .integer(t(`Quantity must be an integer`)),
      }),
      {}
    );
    return Yup.object().shape({
      ...fieldSchema,
    });
  };

  const methods = useForm({
    resolver: yupResolver(generateSchema()),
    defaultValues: {
      ...fields.reduce(
        (values, field, index) => ({
          ...values,
          [`product${field.uiId}`]: field.productId,
          [`unit${field.uiId}`]: field.measureId,
          [`quantity${field.uiId}`]: field.quantity,
        }),
        {}
      ),
    },
  });
  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    const dataBody: IDataBody = {
      type: typee,
      warehouse_id: warehouseId,
      products: fields.map((field) => ({
        product_id: field.productId ?? '',
        product_measurement_id: field.measureId ?? '',
        quantity: field.quantity ?? 0,
      })),
    };
    const res = await WarehouseProductOperation({ dataBody });
    if (res?.error) {
      enqueueSnackbar(`${res?.error}`, { variant: 'error' });
    } else {
      enqueueSnackbar(t('Saved successfuly!'));
      router.push('/dashboard/warehouses-and-delivery-locations');
    }
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // fetch Products
  useEffect(() => {
    fields.forEach((item, i) => {
      const search = searchParams.get(`search_${item.uiId}`) || undefined;
      // fetch for only changed field
      if (item.search !== search) {
        const update = async () => {
          if (search) {
            const itemProducts = await fetchProducts({ page: 1, limit: 10, filters: search });

            // Update Fields
            setFields((prev) => {
              prev[i].search = search;
              prev[i].products = itemProducts?.data?.data;
              return prev;
            });
          } else {
            setFields((prev) => {
              prev[i].search = search;
              prev[i].products = products;
              return prev;
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          searchParams.get('refresh_string') !== '1'
            ? createQueryString('refresh_string', '1')
            : createQueryString('refresh_string', '2');
        };
        update();
      }
    });
  }, [createQueryString, fields, products, searchParams, setFields]);

  // fetch Products by barcode
  const fetchBarcode = useCallback(
    (uiId: number) => {
      (async () => {
        const field = fields.find((item) => item.uiId === uiId);
        const index = field ? fields.findIndex((el) => el === field) : -1;
        if (index === -1) {
          enqueueSnackbar('error');
          return;
        }
        setFields((prev) => {
          const newState = [...prev];
          newState[index].isLoading = true;
          return newState;
        });
        try {
          const itemProducts = await fetchProducts({ page: 1, limit: 10, barcode: field?.barcode });
          setFields((prev) => {
            const newState = [...prev];
            newState[index].products = itemProducts?.data?.data;
            return newState;
          });
        } catch (err) {
          enqueueSnackbar(getErrorMessage(err));
        } finally {
          setFields((prev) => {
            const newState = [...prev];
            newState[index].isLoading = false;
            return newState;
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          searchParams.get('refresh_string') !== '1'
            ? createQueryString('refresh_string', '1')
            : createQueryString('refresh_string', '2');
        }
      })();
    },
    [createQueryString, enqueueSnackbar, fields, searchParams]
  );

  const handleProductUnits = async ({ id }: { id: string }) => {
    if (id) {
      if (!units[id]) {
        const res = await fetchSingleProduct({ productID: id });
        //
        const newObj: ITems[] = res.product_measurements.map((item: any) => ({
          id: item.product_measurement_id,
          name_ar: item.measurement_unit_ar,
          name_en: item.measurement_unit_en,
        }));
        setUnits((prevState) => ({
          ...prevState,
          [id]: newObj,
        }));
      }
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t('warehouses')}
        links={[
          {
            name: t('warehouses'),
            href: paths.dashboard.warehousesAndDeliveryLocations,
          },
          {
            name: t(`${typee} products`),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, ml: 3, mb: 1 }}>
              {fields.map((item, i) => (
                <Fragment key={item.uiId}>
                  <Box
                    rowGap={1}
                    columnGap={2}
                    display="grid"
                    sx={{ pt: i > 0 ? 4 : 0 }}
                    gridTemplateColumns={{
                      xs: '4fr 4fr 4fr 1fr',
                    }}
                  >
                    <TextField
                      label={t('Product Code')}
                      placeholder={t('Product Code')}
                      onChange={(e) => {
                        setFields((prev) => {
                          const newState = [...prev];
                          newState[i].barcode = e.target.value;
                          return newState;
                        });
                      }}
                    />
                    {/* <Box> */}
                    <LoadingButton
                      loading={item.isLoading}
                      onClick={() => {
                        fetchBarcode(item.uiId);
                      }}
                      variant="contained"
                    >
                      {t('Find Product')}
                    </LoadingButton>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setFields((prev) => {
                          const newState = [...prev];
                          newState[i].barcode = '';
                          newState[i].products = products;
                          return newState;
                        });
                      }}
                    >
                      {t('Clear Value')}
                    </Button>
                    {/* </Box> */}
                  </Box>
                  <Box
                    rowGap={1}
                    columnGap={2}
                    display="grid"
                    sx={{ pt: 1 }}
                    gridTemplateColumns={{
                      xs: '4fr 4fr 4fr 1fr',
                      sm: '4fr 4fr 4fr 1fr',
                    }}
                  >
                    <CutomAutocompleteView
                      items={item.products as ITems[]}
                      label={t('product')}
                      placeholder={t('product')}
                      name={`product${item.uiId}`}
                      searchQuery={`search_${item.uiId}`}
                      onCustomChange={async (it: any) => {
                        await handleProductUnits({ id: it?.id ?? it?.product_id });
                        setValue(`unit${i}` as never, '' as never, { shouldValidate: true });
                        setFields((prevState) => {
                          const newState = [...prevState];
                          newState[i].productId = it?.id ?? it?.product_id;
                          //
                          return newState;
                        });
                      }}
                    />
                    <CutomAutocompleteView
                      items={
                        units[item.productId ?? '']
                          ? (units[item.productId ?? ''] as unknown as ITems[])
                          : []
                      }
                      label={t('unit')}
                      placeholder={t('unit')}
                      name={`unit${item.uiId}`}
                      isDisabled={!item.productId}
                      onCustomChange={async (it: any) => {
                        setFields((prevState) => {
                          const newState = [...prevState];
                          newState[i].measureId = it?.id;
                          return newState;
                        });
                      }}
                    />
                    <RHFTextField
                      name={`quantity${item.uiId}`}
                      label={t('quantity')}
                      placeholder={t('quantity')}
                      type="number"
                      fullWidth
                      onChange={(e) => {
                        setValue(`quantity${i}` as never, e.target.value as never, {
                          shouldValidate: true,
                        });
                        setFields((prevState) => {
                          const newState = [...prevState];
                          newState[i].quantity = Number(e.target.value);
                          return newState;
                        });
                      }}
                    />
                    {i > 0 && (
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          setFields((prevState) => prevState.filter((_, index) => index !== i));
                        }}
                        sx={{
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '20px',
                          width: '20px',
                          height: '20px',
                        }}
                      >
                        X
                      </IconButton>
                    )}
                  </Box>
                </Fragment>
              ))}
              <Stack alignItems="flex-end" direction="row-reverse" spacing="0.25rem" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {t('save')}
                </LoadingButton>
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={() => {
                    setFields((prevState) => {
                      const newState = [...prevState];
                      let uiId = fields.length;
                      // eslint-disable-next-line @typescript-eslint/no-loop-func
                      while (prevState.some((item) => item.uiId === uiId)) {
                        uiId += 1;
                      }
                      newState.push({
                        uiId,
                        barcode: undefined,
                        search: undefined,
                        products,
                        productId: '',
                        measureId: '',
                        quantity: 0,
                      });
                      return newState;
                    });
                  }}
                >
                  {t('add')}
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
