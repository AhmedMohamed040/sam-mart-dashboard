'use client';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
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

import { getCustomNameKeyLang } from 'src/utils/helperfunction';

import { useTranslate } from 'src/locales';
import { ICategory } from 'src/@types/categories';
import { SubCategories } from 'src/@types/sub-categories';
import { ToggleSubCategory, deleteSubCategory } from 'src/actions/categories-actions';

import Label from 'src/components/label';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { ISection } from 'src/types/sections';

import LinkSubcategoryToMainCategoryForm from './link-category-to-subcategory/link_main_category_to_sub_category';

// ----------------------------------------------------------------------
type Props = {
  category: ICategory;
  categorySubcategories: SubCategories[];
  children: ReactElement;
  sectionCategoryId: string;
  sectionName: { sectionNameAr: string; sectionNameEn: string };
  sectionId: string;
};

const TABLE_HEAD = [
  { id: 'logo', label: 'image' },
  { id: 'name', label: 'name' },
  { id: 'is_active', label: 'state' },
  { id: 'order_by', label: 'Order by' },
];

export default function SectionCategoryDetails({
  category,
  categorySubcategories,
  children,
  sectionCategoryId,
  sectionName,
  sectionId,
}: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const { closeLink, link: isOpenlink } = useCostomSearchParams();
  const [filters, setFilters] = useState({ name: '' });
  const [categoryID, setCategoryID] = useState<string | undefined>(undefined);
  const [selectedSubcategory, setSelectedSubcategory] = useState<ICategory | undefined>(undefined);
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const LinkToSubcategory = useBoolean(isOpenlink);

  const additionalTableProps = {
    onRenderlogo: (item: ICategory) => (
      <Avatar src={item?.logo} alt={item?.logo} sx={{ mr: 2 }}>
        {item?.name?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
    onRenderis_active: ({ is_active, id }: ISection) => (
      // <ToggleSectionView id={item.id} is_active={item?.is_active} />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form action={ToggleSubCategory}>
          <input name="id" value={id} readOnly style={{ display: 'none' }} />
          <Switch
            checked={is_active}
            name="is_active"
            value={is_active}
            inputProps={{ 'aria-label': 'controlled' }}
            type="submit"
          />
        </form>
      </Box>
    ),
    onRenderorder_by: ({ order_by }: ISection) => (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1" color="initial">
          {order_by}
        </Typography>
      </Box>
    ),
  };
  const dataFiltered = applyFilter({
    inputData: categorySubcategories,
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
    if (typeof categoryID === 'string') {
      const res = await deleteSubCategory(categoryID);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Deleted success!'), {
          variant: 'success',
        });
      }
    }

    confirm.onFalse();
    setCategoryID(undefined);
  };
  const handleLinkMainCategoryToSubCategory = useCallback(() => {
    LinkToSubcategory.onTrue();
  }, [LinkToSubcategory]);

  const handleEditLinkedSubcategory = useCallback(
    (item: ICategory) => {
      setSelectedSubcategory(item);
      LinkToSubcategory.onTrue();
    },
    [LinkToSubcategory]
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={getCustomNameKeyLang(category.name_en, category.name_ar)}
        links={[
          {
            name: getCustomNameKeyLang(sectionName.sectionNameEn, sectionName.sectionNameAr),
            href: `${paths.dashboard.sections}/${sectionId}`,
          },
          { name: getCustomNameKeyLang(category.name_en, category.name_ar) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card sx={{ pt: 5, px: 3 }}>
        <Box alignItems="center">
          {/* <Box
            component="img"
            alt=""
            src={category?.logo || '/logo/sam-mart-logo.svg'}
            sx={{ width: 48, height: 48, marginBottom: 2 }}
          /> */}
          <Avatar
            src={category?.logo}
            alt={category?.logo}
            sx={{ width: 48, height: 48, marginBottom: 2 }}
          >
            {getCustomNameKeyLang(category.name_en, category.name_ar).charAt(0)?.toUpperCase()}
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('details')}
            </Typography>
            <Typography variant="subtitle2">
              {t('Name in Arabic')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {category?.name_ar || t('unknown')}
              </Label>
            </Typography>
            <Typography variant="subtitle2">
              {t('Name in English')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {category?.name_en || t('unknown')}
              </Label>
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
        <Box sx={{ pb: 5 }}>
          <SharedTable
            custom_add_title={t('link_category_to_subcategory')}
            enableAdd
            handleAdd={handleLinkMainCategoryToSubCategory}
            dataFiltered={dataFiltered}
            count={dataFiltered?.length}
            table={table}
            tableHeaders={TABLE_HEAD}
            additionalTableProps={additionalTableProps}
            handleFilters={handleFilters}
            filters={filters}
            enableActions
            disablePagination
            actions={[
              {
                label: t('view'),
                icon: 'solar:eye-bold',
                onClick: (item: SubCategories) => {
                  const breadCrumbParams = [
                    `&sectionId=${sectionId}`,
                    `&sectionNameAr=${sectionName.sectionNameAr}`,
                    `&sectionNameEn=${sectionName.sectionNameEn}`,
                    // `&categoryName=${getCustomNameKeyLang(category.name_en, category.name_ar)}`,
                    `&categoryNameAr=${category.name_ar}`,
                    `&categoryNameEn=${category.name_en}`,
                    `&categoryId=${category.id}`,
                    `&sectionCategoryId=${sectionCategoryId}`,
                  ];
                  router.push(
                    `/dashboard/sub-categories/${item?.sub_category_id}?categorySubcategoryId=${item.id}${breadCrumbParams.join('')}`
                  );
                },
              },
              {
                label: t('edit'),
                icon: 'solar:pen-bold',
                onClick: (item: SubCategories) => {
                  handleEditLinkedSubcategory(item);
                },
              },
              {
                label: t('link_subcategory_to_product'),
                icon: 'solar:link-bold',

                onClick: (item: SubCategories) => {
                  const breadCrumbParams = [
                    `&sectionId=${sectionId}`,
                    `&sectionNameAr=${sectionName.sectionNameAr}`,
                    `&sectionNameEn=${sectionName.sectionNameEn}`,
                    // `&categoryName=${getCustomNameKeyLang(category.name_en, category.name_ar)}`,
                    `&categoryNameAr=${category.name_ar}`,
                    `&categoryNameEn=${category.name_en}`,
                    `&categoryId=${category.id}`,
                    `&sectionCategoryId=${sectionCategoryId}`,
                  ];
                  router.push(
                    `/dashboard/sub-categories/${item?.sub_category_id}?categorySubcategoryId=${item.id}${breadCrumbParams.join('')}}&link=true`
                  );
                },
              },
              {
                label: t('delete_from_main_category'),
                icon: 'solar:trash-bin-trash-bold',
                onClick: (item: SubCategories) => {
                  confirm.onTrue();
                  setCategoryID(item?.sub_category_id);
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
          {LinkToSubcategory.value && (
            <LinkSubcategoryToMainCategoryForm
              category={{ category_id: category?.id }}
              open={LinkToSubcategory.value}
              sectionCategoryId={sectionCategoryId}
              onClose={() => {
                LinkToSubcategory.onFalse();
                setSelectedSubcategory(undefined);
                // close the link by making the link in searchparams as false
                if (isOpenlink) {
                  closeLink();
                }
              }}
              LinkedSubCategories={categorySubcategories}
              selectedSubcategory={selectedSubcategory}
            >
              {children}
            </LinkSubcategoryToMainCategoryForm>
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
  inputData: SubCategories[];
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
      (category) => category.name_en.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
