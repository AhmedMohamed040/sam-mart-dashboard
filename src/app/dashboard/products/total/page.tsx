import { fetchProducts } from 'src/actions/product-actions';
import { fetchCategorySubcategories } from 'src/actions/categories-actions';
import { fetchSections, fetchSectionCategories } from 'src/actions/sections-actions';

import ProductsView from 'src/sections/products/view';

import { User } from 'src/types/user';

import { useUser } from '../../../../hooks/use-user';

export const metadata = {
  title: 'Total Products',
};
type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ searchParams }: Readonly<props>) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const search = typeof searchParams?.search === 'string' ? searchParams?.search : '';
  const section_id = typeof searchParams?.section === 'string' ? searchParams?.section : '';
  const section_category_id =
    typeof searchParams?.category === 'string' ? searchParams?.category : '';
  const category_sub_category_id =
    typeof searchParams?.subCategory === 'string' ? searchParams?.subCategory : '';
  const user: User = useUser();
  const products = await fetchProducts({
    limit,
    page,
    filters: search,
    section_id,
    section_category_id,
    category_sub_category_id,
  });
  const sections = await fetchSections({ user_id: user.id });

  const categories = section_id ? await fetchSectionCategories({ sectionId: section_id }) : [];
  const subCategories = section_category_id
    ? await fetchCategorySubcategories({ categoryId: section_category_id })
    : [];
  return (
    <ProductsView
      products={products.data?.data}
      categories={categories}
      subCategories={subCategories}
      sections={sections.data.data}
      count={products.data?.meta?.itemCount}
    />
  );
}
