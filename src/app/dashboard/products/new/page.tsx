import { fetchUnits } from 'src/actions/units-actions';

import { ProductCreateView } from 'src/sections/products/product-form/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'New: Product',
};

export default async function Page() {
  const units = await fetchUnits();
  return <ProductCreateView units={units} />;
}
