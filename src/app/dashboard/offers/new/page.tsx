import { fetchProducts, fetchSingleProduct } from 'src/actions/product-actions';

import { OfferCreateView } from 'src/sections/offers/offers-form/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'New: Offer',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { search: string; product: string };
}) {
  const { search, product: produtId } = searchParams;

  const products = await fetchProducts({ page: 1, limit: 10 ** 6, filters: search });

  const nameSuggestions = products?.data?.data.map((item: any) => ({
    id: item.product_id,
    name: item.name_en,
    name_ar: item.name_ar,
    name_en: item.name_en,
  }));

  const product = produtId ? await fetchSingleProduct({ productID: produtId }) : undefined;

  return <OfferCreateView nameSuggestions={nameSuggestions} product={product} />;
}
