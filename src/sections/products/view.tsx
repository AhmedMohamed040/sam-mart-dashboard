'use client';

import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { getCustomNameKeyLang } from 'src/utils/helperfunction';
import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { IProduct } from 'src/@types/products';
import { ICategory } from 'src/@types/categories';
import { deleteProduct } from 'src/actions/product-actions';

import Iconify from 'src/components/iconify';
import SharedTable from 'src/components/shared-table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CutomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

import { ISection } from 'src/types/sections';

import { ISubcategoryForm } from '../subcategory/sub-categories-form/sub-categories-new-edit-form';

type props = {
  products: IProduct[];
  count: number;
  sections: ISection[];
  title?: string;
  categories?: ICategory[];
  subCategories?: ISubcategoryForm[];
};
type ProductState = {
  product_id: string;
  product_sub_category_id: string;
};
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'barcode', label: 'barcode' },
  { id: 'logo', label: 'image' },
  { id: 'name', label: 'name' },
  { id: 'unit', label: 'unit' },
  { id: 'status', label: 'status' },
  { id: 'quantity_available', label: 'totalQuantity' },
  { id: 'is_recovered', label: 'is_recovered' },
];

export default function ProductsView({
  products,
  count,
  sections,
  categories,
  subCategories,
  title = 'Products',
}: Readonly<props>) {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const router = useRouter();
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const section = searchParams?.get('section');
  const category = searchParams?.get('category');
  const subCategory = searchParams?.get('subCategory');
  const [filters, setFilters] = useState({
    name: '',
    sectionID: '',
    section_category_id: '',
    category_sub_category_id: '',
  });
  const [selectedProductID, setSelectedProductID] = useState<ProductState | undefined>(undefined);
  const pathname = usePathname();
  const methods = useForm({
    defaultValues: {
      sectionId: { id: section },
      categoryId: { id: category },
      subCategoryId: { id: subCategory },
    },
  });
  const { setValue } = methods;
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      if (name === 'section') {
        setValue('categoryId', { id: null });
        setValue('subCategoryId', { id: null });
        params?.delete('category');
        params?.delete('subCategory');
      } else if (name === 'category') {
        setValue('subCategoryId', { id: null });
        params?.delete('subCategory');
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, setValue]
  );

  const dataFiltered = applyFilter({
    inputData: products,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });
  const handleConfirmDelete = useCallback(async () => {
    if (selectedProductID?.product_sub_category_id) {
      enqueueSnackbar(t("product_shouldn't_be_linked_to_any_subcategory"), {
        variant: 'error',
      });
      confirm.onFalse();
      return;
    }
    if (typeof selectedProductID?.product_id === 'string') {
      const res = await deleteProduct({ productID: selectedProductID.product_id });
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Deleted success!'), {
          variant: 'success',
        });
      }
    }

    confirm.onFalse();
    setSelectedProductID(undefined);
  }, [
    confirm,
    enqueueSnackbar,
    selectedProductID?.product_id,
    selectedProductID?.product_sub_category_id,
    t,
  ]);
  const additionalTableProps = {
    onRenderbarcode: (item: IProduct) => item?.barcode,
    onRenderlogo: (item: IProduct) => (
      <Avatar src={item?.product_logo} alt={item?.name_en?.charAt(0)?.toUpperCase()} sx={{ mr: 2 }}>
        {item?.name_en?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
    onRenderunit: (item: IProduct) =>
      getCustomNameKeyLang(item?.measurement_unit_en, item?.measurement_unit_ar),
    onRenderstatus: (item: IProduct) => t(item?.product_is_active ? 'Active' : 'Disabled'),
    onRenderis_recovered: (item: IProduct) => t(item?.product_is_recovered ? 'yes' : 'no'),
    onRendername: (item: IProduct) => getCustomNameKeyLang(item?.name_en, item?.name_ar),
  };

  const exportProducts = async () => {
    const accessToken = Cookies.get('accessToken');
    const lang = Cookies.get('Language');

    try {
      const res = await axiosInstance.get(endpoints.product.export, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': lang,
        },
        responseType: 'blob',
      });
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('products')}.xlsx`; // Specify the filename for the downloaded file
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    }
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={t(title)}
        links={[{}]}
        action={
          <Button
            component={RouterLink}
            href={`${paths.dashboard.productsGroup.root}/new`}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('New product')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <FormProvider methods={methods}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, ml: 3, mb: 1 }}>
              <Box
                rowGap={1}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                <CutomAutocompleteView
                  items={sections as ITems[]}
                  label={t('section')}
                  placeholder={t('section')}
                  name="sectionId"
                  onCustomChange={(selectedCountryId: any) =>
                    createQueryString('section', selectedCountryId?.id ?? '')
                  }
                />
                <CutomAutocompleteView
                  items={categories as unknown as ITems[]}
                  label={t('category')}
                  placeholder={t('category')}
                  name="categoryId"
                  isDisabled={categories === undefined || categories.length === 0}
                  onCustomChange={(selectedCityId: any) =>
                    createQueryString('category', selectedCityId?.id ?? '')
                  }
                />
                <CutomAutocompleteView
                  items={subCategories as unknown as ITems[]}
                  label={t('subCategory')}
                  placeholder={t('subCategory')}
                  name="subCategoryId"
                  isDisabled={subCategories === undefined || subCategories.length === 0}
                  onCustomChange={(selectedCityId: any) =>
                    createQueryString('subCategory', selectedCityId?.id ?? '')
                  }
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <SharedTable
        dataFiltered={dataFiltered.map((product) => ({ id: product.product_id, ...product }))}
        custom_add_title={t('export_products_to_excel')}
        addButtonCustomizations={{
          icon: 'bi:download',
        }}
        count={count}
        table={table}
        enableAdd
        handleAdd={exportProducts}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        filters={filters}
        enableActions
        actions={[
          {
            label: t('edit'),
            icon: 'solar:pen-bold',
            onClick: (item: IProduct) =>
              router.push(`/dashboard/products/edit/${item?.product_id}`),
          },
          {
            label: t('delete'),
            icon: 'solar:trash-bin-trash-bold',
            onClick: (product) => {
              confirm.onTrue();

              setSelectedProductID({
                product_id: product?.product_id,
                product_sub_category_id: product?.product_sub_category_id,
              });
            },
            sx: { color: 'error.main' },
          },
        ]}
      />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete')}
        content={t('delete_confirm')}
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            {t('delete')}
          </Button>
        }
      />
    </Container>
  );
}

interface IFilters {
  name: string;
  sectionID: string;
  section_category_id: string;
  category_sub_category_id: string;
}
function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IProduct[];
  comparator: (a: any, b: any) => number;
  filters: IFilters;
  dateError: boolean;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (product) =>
        product.name_ar.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        product.name_en.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
