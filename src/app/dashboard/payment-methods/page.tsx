import PaymentView from 'src/sections/payment-methods/view';

// ----------------------------------------------------------------------

import { fetchPaymentMethods } from 'src/actions/payment-methods';

export const metadata = {
  title: 'Payment Methods',
};

type props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ searchParams }: Readonly<props>) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams?.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? Number(searchParams?.limit) : 5;
  const type = typeof searchParams?.type === 'string' ? searchParams?.type : null;

  const res = await fetchPaymentMethods({
    page,
    limit,
    type: type === 'CASH' || type === 'WALLET' ? type : undefined,
  });

  return <PaymentView paymentMethods={res?.data?.data} count={res?.data?.data?.length} />;
}
