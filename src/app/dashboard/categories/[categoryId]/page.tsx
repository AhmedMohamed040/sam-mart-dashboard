import { getSubCatsForLinkingModal } from 'src/actions/sub-categories-actions';
import { fetchSingleCategory, fetchCategorySubcategories } from 'src/actions/categories-actions';

// import CustomAutoCompelete from 'src/components/AutoComplete/AutoCompelete';
import SectionCategoryDetails from 'src/sections/categories/category-details';
import CustomAutoCompelete from 'src/sections/categories/link-category-to-subcategory/Linking-Modal/AutoCompelete';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Category: details',
};

type props = {
  params: {
    categoryId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};
interface Headers {
  categoryId: string;
}

export default async function Page({ params, searchParams }: props) {
  const sectionCategoryId =
    typeof searchParams?.sectionCategoryId === 'string' ? searchParams?.sectionCategoryId : '';
  const categoryId = params?.categoryId;
  const sectionNameAr =
    typeof searchParams?.sectionNameAr === 'string' ? searchParams?.sectionNameAr : '';
  const sectionNameEn =
    typeof searchParams?.sectionNameEn === 'string' ? searchParams?.sectionNameEn : '';
  const sectionId = typeof searchParams?.sectionId === 'string' ? searchParams?.sectionId : '';

  const headers: Headers = {
    categoryId,
  };
  const header2: Headers = {
    categoryId: sectionCategoryId,
  };
  const categorySubcategories = await fetchCategorySubcategories(header2);
  const category = await fetchSingleCategory(headers);

  return (
    <SectionCategoryDetails
      category={category}
      categorySubcategories={categorySubcategories}
      sectionCategoryId={sectionCategoryId}
      sectionName={{ sectionNameAr, sectionNameEn }}
      sectionId={sectionId}
    >
      <CustomAutoCompelete
        fetchItems={getSubCatsForLinkingModal}
        label="subcategory"
        placeholder="choose a subcategory"
        name="subcategory_id"
      />
    </SectionCategoryDetails>
  );
}
