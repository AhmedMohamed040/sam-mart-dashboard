import { fetchServices } from 'src/actions/additional-services-actions';
import { fetchSingleSubcategory } from 'src/actions/sub-categories-actions';
import { fetchProducts, getProductsForLinkingModal } from 'src/actions/product-actions';

// import CustomAutoCompelete from 'src/components/AutoComplete/AutoCompelete';
import CustomAutoCompelete from 'src/sections/subcategory/Linking-Modal/AutoCompelete';
import SectionSubCategoryDetails from 'src/sections/subcategory/subcategory-details/subcategory-details';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Subcategory: details',
};

type props = {
  params: {
    subcategoryId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: props) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const search = typeof searchParams?.search === 'string' ? searchParams?.search : '';
  const Products_autoComplete =
    typeof searchParams?.Products_autoComplete === 'string'
      ? searchParams?.Products_autoComplete
      : '';
  const subcategoryId = typeof params?.subcategoryId === 'string' ? params?.subcategoryId : '';
  const categorySubcategoryId =
    typeof searchParams?.categorySubcategoryId === 'string'
      ? searchParams?.categorySubcategoryId
      : '';
  // const sectionName =
  //   typeof searchParams?.sectionName === 'string' ? searchParams?.sectionName : '';
  const sectionNameAr =
    typeof searchParams?.sectionNameAr === 'string' ? searchParams?.sectionNameAr : '';
  const sectionNameEn =
    typeof searchParams?.sectionNameEn === 'string' ? searchParams?.sectionNameEn : '';
  const sectionId = typeof searchParams?.sectionId === 'string' ? searchParams?.sectionId : '';
  // const categoryName =
  //   typeof searchParams?.categoryName === 'string' ? searchParams?.categoryName : '';
  const categoryNameAr =
    typeof searchParams?.categoryNameAr === 'string' ? searchParams?.categoryNameAr : '';
  const categoryNameEn =
    typeof searchParams?.categoryNameEn === 'string' ? searchParams?.categoryNameEn : '';
  const categoryId = typeof searchParams?.categoryId === 'string' ? searchParams?.categoryId : '';
  const sectionCategoryId =
    typeof searchParams?.sectionCategoryId === 'string' ? searchParams?.sectionCategoryId : '';
  const breadCrumbObj = {
    sectionId,
    sectionName: { sectionNameAr, sectionNameEn },
    categoryId,
    categoryName: { categoryNameAr, categoryNameEn },
    sectionCategoryId,
  };

  const subcategory = await fetchSingleSubcategory({ subcategoryId });

  const res = await fetchProducts({
    page,
    limit,
    filters: search,
    category_sub_category_id: categorySubcategoryId,
  });
  const categorySubcategoryProducts = res?.data.data;
  const itemCount = res?.data?.meta?.itemCount;
  const services_res = await fetchServices();
  return (
    <SectionSubCategoryDetails
      subcategory={subcategory}
      itemCount={itemCount}
      products={categorySubcategoryProducts}
      categorySubcategoryId={categorySubcategoryId}
      subcategoryId={subcategoryId}
      services={services_res?.data?.data}
      breadCrumbObj={breadCrumbObj}
    >
      <CustomAutoCompelete
        searchQuery="Products_autoComplete"
        search={Products_autoComplete}
        fetchItems={getProductsForLinkingModal}
        label="product"
        placeholder="choose a product"
        name="product_id"
      />
    </SectionSubCategoryDetails>
  );
}
