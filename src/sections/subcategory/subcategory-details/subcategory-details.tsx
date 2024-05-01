'use client';

import { useSnackbar } from 'notistack';
import { useState, useCallback, ReactElement } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import useCostomSearchParams from 'src/hooks/use-searchParams';

import { getNameKeyLang, getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { Services } from 'src/@types/services';
import { fetchSingleProduct } from 'src/actions/product-actions';
import { IProduct, ProductImage, ISingleProduct } from 'src/@types/products';
import { ToggleProduct, unlinkProduct } from 'src/actions/sub-categories-actions';

import Label from 'src/components/label';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { ISection } from 'src/types/sections';

import LinkToPriceForm from '../link-price/link-price-to-product-model';
import AddServiceModel from '../add-addtional-service/add-service-model';
import LinkProductToSubcategoryForm from './link-subcategory-to-product-model';

// ----------------------------------------------------------------------
type Props = {
  subcategory: ISection;
  products: IProduct[];
  children: ReactElement;
  categorySubcategoryId: string;
  subcategoryId: string;
  itemCount: number;
  services: Services[];
  breadCrumbObj: {
    sectionId: string;
    sectionName: { sectionNameAr: string; sectionNameEn: string };
    categoryId: string;
    categoryName: { categoryNameAr: string; categoryNameEn: string };
    sectionCategoryId: string;
  };
};

const TABLE_HEAD = [
  { id: 'barcode', label: 'barcode' },
  { id: 'logo', label: 'image' },
  { id: 'name_ar', label: 'name_ar' },
  { id: 'name_en', label: 'name_en' },
  { id: 'is_active', label: 'state' },
  { id: 'order_by', label: 'Order by' },
];

export default function SectionSubCategoryDetails({
  subcategory,
  products,
  children,
  categorySubcategoryId,
  subcategoryId,
  itemCount,
  services,
  breadCrumbObj,
}: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const { closeLink, link: isOpenlink } = useCostomSearchParams();
  const [filters, setFilters] = useState({ name: '' });
  const [ProductID, setProductID] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<ISingleProduct | undefined>(undefined);
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const LinkToProduct = useBoolean(isOpenlink);
  const LinkToPrice = useBoolean(false);
  const AddService = useBoolean(false);

  const additionalTableProps = {
    onRenderbarcode: (item: IProduct) => item?.barcode,
    onRenderlogo: (item: IProduct) => (
      <Avatar src={item?.product_logo} alt={item?.name_en?.charAt(0)?.toUpperCase()} sx={{ mr: 2 }}>
        {item?.name_en?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
    onRenderis_active: (product: IProduct) => (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form action={ToggleProduct}>
          <input
            name="id"
            value={product?.product_sub_category_id}
            readOnly
            style={{ display: 'none' }}
          />
          <Switch
            checked={product?.product_sub_category_is_active}
            name="is_active"
            value={product?.product_sub_category_is_active}
            inputProps={{ 'aria-label': 'controlled' }}
            type="submit"
          />
        </form>
      </Box>
    ),
    onRenderorder_by: (Product: IProduct) => (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1" color="initial">
          {Product?.product_sub_category_order_by}
        </Typography>
      </Box>
    ),
  };

  const dataFiltered = applyFilter({
    inputData: products,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError: false,
  });
  const handleFilters = useCallback(
    (name: string, value: string) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleConfirmDelete = async () => {
    if (typeof ProductID !== 'string') return;

    const res = await unlinkProduct(ProductID);
    if (res?.error) {
      enqueueSnackbar(res.error, {
        variant: 'error',
      });
    } else {
      enqueueSnackbar(t('Deleted success!'), {
        variant: 'success',
      });
    }
    confirm.onFalse();
    setProductID(undefined);
  };
  const handleLinkProduct = useCallback(() => {
    LinkToProduct.onTrue();
  }, [LinkToProduct]);

  const handleEditLinkedProduct = useCallback(
    async (item: IProduct) => {
      const selected_Product: ISingleProduct = await fetchSingleProduct({
        productID: item?.product_id,
        subcategoryId: categorySubcategoryId,
      });
      setSelectedProduct(selected_Product);
      LinkToProduct.onTrue();
    },
    [LinkToProduct, categorySubcategoryId]
  );

  const handleLinkProductToPrice = useCallback(
    async (item: IProduct) => {
      const selected_Product: ISingleProduct = await fetchSingleProduct({
        productID: item?.product_id,
        subcategoryId: categorySubcategoryId,
      });
      setSelectedProduct(selected_Product);
      LinkToPrice.onTrue();
    },
    [LinkToPrice, categorySubcategoryId]
  );

  const handleAddServices = useCallback(
    async (item: IProduct) => {
      const selected_Product: ISingleProduct = await fetchSingleProduct({
        productID: item?.product_id,
        subcategoryId: categorySubcategoryId,
      });
      setSelectedProduct(selected_Product);
      AddService.onTrue();
    },
    [AddService, categorySubcategoryId]
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={getCustomNameKeyLang(
          subcategory.name_en,
          subcategory?.name_ar ? subcategory.name_ar : ''
        )}
        links={[
          {
            name: getCustomNameKeyLang(
              breadCrumbObj.sectionName.sectionNameEn,
              breadCrumbObj.sectionName.sectionNameAr
            ),
            href: `${paths.dashboard.sections}/${breadCrumbObj.sectionId}`,
          },
          {
            name: getCustomNameKeyLang(
              breadCrumbObj.categoryName.categoryNameEn,
              breadCrumbObj.categoryName.categoryNameAr
            ),
            href: `${paths.dashboard.categories}/${breadCrumbObj.categoryId}?sectionCategoryId=${breadCrumbObj.sectionCategoryId}&sectionId=${breadCrumbObj.sectionId}&sectionNameAr=${breadCrumbObj.sectionName.sectionNameAr}&sectionNameEn=${breadCrumbObj.sectionName.sectionNameEn}`,
          },
          {
            name: getCustomNameKeyLang(
              subcategory.name_en,
              subcategory?.name_ar ? subcategory.name_ar : ''
            ),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card sx={{ pt: 5, px: 3 }}>
        <Box alignItems="center">
          {/* <Box
            component="img"
            alt="logo"
            src={subcategory?.logo || '/logo/sam-mart-logo.svg'}
            sx={{ width: 48, height: 48, marginBottom: 2 }}
          /> */}

          <Avatar
            src={subcategory?.logo}
            alt={subcategory?.logo}
            sx={{ width: 48, height: 48, marginBottom: 2 }}
          >
            {getCustomNameKeyLang(subcategory.name_en, subcategory.name_ar || '')
              .charAt(0)
              ?.toUpperCase()}
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('details')}
            </Typography>
            <Typography variant="subtitle2">
              {t('Name in Arabic')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {subcategory?.name_ar || t('unknown')}
              </Label>
            </Typography>
            <Typography variant="subtitle2">
              {t('Name in English')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {subcategory?.name_en || t('unknown')}
              </Label>
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
        <Box sx={{ pb: 5 }}>
          <SharedTable
            custom_add_title={t('link_subcategory_to_product')}
            enableAdd
            handleAdd={handleLinkProduct}
            dataFiltered={dataFiltered.map((e) => ({ id: e.product_id, ...e }))}
            count={itemCount}
            table={table}
            tableHeaders={TABLE_HEAD}
            additionalTableProps={additionalTableProps}
            handleFilters={handleFilters}
            filters={filters}
            enableActions
            actions={[
              {
                label: t('edit'),
                icon: 'solar:pen-bold',
                onClick: (item: IProduct) => {
                  handleEditLinkedProduct(item);
                },
              },
              {
                label: t('Add price'),
                icon: 'solar:wad-of-money-bold',
                onClick: (item: IProduct) => {
                  handleLinkProductToPrice(item);
                },
              },
              {
                label: t('add_service'),
                icon: 'material-symbols:medical-services-sharp',
                onClick: (item: IProduct) => {
                  handleAddServices(item);
                },
              },
              {
                label: t('delete_from_sub_category'),
                icon: 'solar:trash-bin-trash-bold',
                onClick: (item: IProduct) => {
                  confirm.onTrue();
                  setProductID(item?.product_sub_category_id);
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
          {LinkToProduct?.value && (
            <LinkProductToSubcategoryForm
              categorySubcategoryId={categorySubcategoryId}
              subcategoryId={subcategoryId}
              selectedProduct={selectedProduct}
              LinkedProducts={products}
              itemCount={itemCount}
              open={LinkToProduct.value}
              onClose={() => {
                LinkToProduct.onFalse();
                setSelectedProduct(undefined);
                // close the link by making the link in searchparams as false
                if (isOpenlink) {
                  closeLink();
                }
              }}
            >
              {children}
            </LinkProductToSubcategoryForm>
          )}
          {selectedProduct !== undefined && LinkToPrice?.value && (
            <LinkToPriceForm
              ProductMeasurements={selectedProduct?.product_measurements ?? []}
              ProductImage={
                selectedProduct?.product?.product_images.find((x) => x.is_logo)?.url ?? ''
              }
              ProductName={selectedProduct?.product[getNameKeyLang()]}
              product_id={selectedProduct?.product?.product_sub_category_id}
              open={LinkToPrice.value}
              onClose={() => {
                LinkToPrice.onFalse();
                setSelectedProduct(undefined);
                // close the link by making the link in searchparams as false
                if (isOpenlink) {
                  closeLink();
                }
              }}
            />
          )}
          {selectedProduct !== undefined && AddService?.value && (
            <AddServiceModel
              ProductMeasurements={selectedProduct?.product_measurements ?? []}
              ProductImage={
                selectedProduct?.product?.product_images.find((x: ProductImage) => x.is_logo)
                  ?.url ?? ''
              }
              ProductName={selectedProduct?.product[getNameKeyLang()]}
              services={services}
              product_id={selectedProduct?.product?.product_sub_category_id}
              open={AddService.value}
              onClose={() => {
                AddService.onFalse();
                setSelectedProduct(undefined);
              }}
            />
          )}
        </Box>
      </Card>
    </Container>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IProduct[];
  comparator: (a: any, b: any) => number;
  filters: { name: string };
  dateError: boolean;
}) {
  const { name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (section) => section.name_en.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
