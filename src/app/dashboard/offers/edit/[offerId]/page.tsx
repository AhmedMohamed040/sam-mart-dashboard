import { fetchSingleOffer } from 'src/actions/offers-actions';
import { fetchSingleProduct } from 'src/actions/product-actions';

import { NotFoundView } from 'src/sections/error';
import { OfferCreateView } from 'src/sections/offers/offers-form/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Edit: Offer',
};

interface Params {
  offerId: string;
}

export default async function Page({ params }: { params: Params }) {
  const { offerId } = params;

  const offer = await fetchSingleOffer(offerId);

  if (!offer) return <NotFoundView />;

  const product = offer
    ? await fetchSingleProduct({ productID: offer?.data?.data?.product_id })
    : undefined;

  return <OfferCreateView offer={offer?.data?.data} product={product} />;
}
