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
import { ToggleCategory, deleteCategory } from 'src/actions/sections-actions';

import Label from 'src/components/label';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { ISection } from 'src/types/sections';
import { ISectionCategory } from 'src/types/section-category';

import LinkSectionToCategoryForm from './link-section-to-category/link-section-to-categoryModel';

// ----------------------------------------------------------------------
type Props = {
  section: ISection;
  categories: ISectionCategory[];
  children: ReactElement;
};

const TABLE_HEAD = [
  { id: 'logo', label: 'image' },
  { id: 'name', label: 'name' },
  { id: 'is_active', label: 'state' },
  { id: 'order_by', label: 'Order by' },
];

export default function SectionCategoryDetails({ section, categories, children }: Props) {
  const settings = useSettingsContext();
  const router = useRouter();
  const { t } = useTranslate();
  const { closeLink, link: isOpenlink } = useCostomSearchParams();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const [filters, setFilters] = useState({ name: '' });
  const [categoryID, setCategoryID] = useState<string | undefined>(undefined);
  const [category, setSelectedCategory] = useState<ISectionCategory | undefined>(undefined);
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const LinkToCategory = useBoolean(isOpenlink);
  const additionalTableProps = {
    onRenderdelivery_type: (item: ISection) => (
      <>
        {item?.delivery_type?.split('&').map((delivery_type: string) => (
          <Label
            key={delivery_type}
            variant="soft"
            color={
              (delivery_type === 'SCHEDULED' && 'success') ||
              (delivery_type === 'FAST' && 'warning') ||
              'default'
            }
          >
            {delivery_type}
          </Label>
        ))}
      </>
    ),
    onRenderlogo: (item: ISection) => (
      <Avatar src={item?.logo} alt={item?.logo} sx={{ mr: 2 }}>
        {item?.name?.charAt(0)?.toUpperCase()}
      </Avatar>
    ),
    onRendername: (item: ISection) => item.name,
    onRenderis_active: ({ is_active, id }: ISection) => (
      // <ToggleSectionView id={item.id} is_active={item?.is_active} />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form action={ToggleCategory}>
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
    inputData: categories,
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
    try {
      if (typeof categoryID === 'string') {
        await deleteCategory(categoryID);
        enqueueSnackbar(t('Deleted success!'), {
          variant: 'success',
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
    confirm.onFalse();
    setCategoryID(undefined);
  };
  const handleLinkSectionToMainCategory = useCallback(() => {
    LinkToCategory.onTrue();
  }, [LinkToCategory]);

  const handleEditLinkedMainCategory = useCallback(
    (item: ISectionCategory) => {
      setSelectedCategory(item);
      LinkToCategory.onTrue();
    },
    [LinkToCategory]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={getCustomNameKeyLang(section?.name_en, section?.name_ar ? section?.name_ar : '')}
        links={[
          {
            name: t('sections'),
            href: paths.dashboard.sections,
          },
          {
            name: getCustomNameKeyLang(section?.name_en, section?.name_ar ? section?.name_ar : ''),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card sx={{ pt: 5, px: 3 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          {/* <Box
            component="img"
            alt="logo"
            src={section?.logo || '/logo/sam-mart-logo.svg'}
            sx={{ width: 48, height: 48 }}
          /> */}
          <Avatar
            src={section?.logo}
            alt={section?.logo}
            sx={{ width: 48, height: 48, marginBottom: 2 }}
          >
            {getCustomNameKeyLang(section.name_en, section?.name_ar || '')
              .charAt(0)
              ?.toUpperCase()}
          </Avatar>
          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label
              variant="soft"
              color={section?.allowed_roles === 'CLIENT' ? 'warning' : 'primary'}
            >
              {t(section?.allowed_roles) || t('client')}
            </Label>

            {/*   <Typography variant="h6">{section?.order_by || 1}</Typography> */}
          </Stack>
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('details')}
            </Typography>
            <Typography variant="subtitle2">
              {t('Name in Arabic')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {section?.name_ar || t('unknown')}
              </Label>
            </Typography>
            <Typography variant="subtitle2">
              {t('Name in English')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {section?.name_en || t('unknown')}
              </Label>
            </Typography>
            <Typography variant="subtitle2">
              {t('delivery type')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {section?.delivery_type === 'FAST' && t('fast delivery')}
                {section?.delivery_type === 'SCHEDULED' && t('scheduled delivery')}
                {section?.delivery_type === 'SCHEDULED&FAST' && t('scheduled & fast delivery')}
              </Label>
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {' '}
            </Typography>
            <Typography variant="subtitle2">
              {t('min order price')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {section?.min_order_price || '0'}
              </Label>
            </Typography>
            <Typography variant="subtitle2">
              {t('order by')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {section?.order_by || '1'}
              </Label>
            </Typography>
            <Typography variant="subtitle2">
              {t('delivery price')} :
              <Label sx={{ mx: 1 }} variant="soft">
                {section?.delivery_price || '0'}
              </Label>
            </Typography>
          </Stack>

          <Stack
            spacing={1}
            flexDirection="row"
            sx={{ p: 0, m: 0, typography: 'subtitle2' }}
            alignItems={{ xs: 'flex-start', md: 'flex-start' }}
          >
            {t('status')} :
            <Label variant="soft" color={section?.is_active ? 'success' : 'default'}>
              {section?.is_active ? t('show') : t('hide')}
            </Label>
          </Stack>

          {/*    {fDate(invoice.dueDate)} */}
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
        <Box sx={{ pb: 5 }}>
          <SharedTable
            custom_add_title={t('link_section_to_main_category')}
            enableAdd
            handleAdd={handleLinkSectionToMainCategory}
            dataFiltered={dataFiltered}
            count={dataFiltered?.length}
            table={table}
            tableHeaders={TABLE_HEAD}
            additionalTableProps={additionalTableProps}
            handleFilters={handleFilters}
            disablePagination
            filters={filters}
            enableActions
            actions={[
              {
                label: t('view'),
                icon: 'solar:eye-bold',
                onClick: (item: ISectionCategory) => {
                  router.push(
                    `/dashboard/categories/${item?.category_id}?sectionCategoryId=${item.id}&sectionNameAr=${section.name_ar}&sectionNameEn=${section.name_en}&sectionId=${section.id}`
                  );
                },
              },
              {
                label: t('edit'),
                icon: 'solar:pen-bold',
                onClick: (item: ISectionCategory) => {
                  handleEditLinkedMainCategory(item);
                },
              },
              {
                label: t('link_category_to_subcategory'),
                icon: 'solar:link-bold',

                onClick: (item: ISectionCategory) => {
                  router.push(
                    `/dashboard/categories/${item?.category_id}?sectionCategoryId=${item.id}&sectionNameAr=${section.name_ar}&sectionNameEn=${section.name_en}&sectionId=${section.id}&link=true`
                  );
                },
              },
              {
                label: t('delete_from_section'),
                icon: 'solar:trash-bin-trash-bold',
                onClick: (item: ISectionCategory) => {
                  confirm.onTrue();
                  setCategoryID(item?.id);
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
          {LinkToCategory.value && (
            <LinkSectionToCategoryForm
              section={{ section_id: section?.id }}
              open={LinkToCategory.value}
              onClose={() => {
                LinkToCategory.onFalse();
                setSelectedCategory(undefined);
                // close the link by making the link in searchparams as false
                if (isOpenlink) {
                  closeLink();
                }
              }}
              LinkedCategories={categories}
              selectedCategory={category}
            >
              {children}
            </LinkSectionToCategoryForm>
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
  inputData: ISectionCategory[];
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
      (section) => section.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
