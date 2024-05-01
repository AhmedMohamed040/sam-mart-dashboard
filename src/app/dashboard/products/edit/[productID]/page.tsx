import { fetchUnits } from 'src/actions/units-actions';
import { fetchSingleProduct } from 'src/actions/product-actions';

import ProductEditView from 'src/sections/products/product-form/view/product-edit-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Edit: Product',
};
interface IProps {
  params: {
    productID: string;
  };
}
export default async function Page({ params: { productID } }: IProps) {
  const product = await fetchSingleProduct({ productID });
  const units = await fetchUnits();
  return <ProductEditView product={product} units={units} />;
}
