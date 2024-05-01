import { getUserTransactions, getWalletInformation } from 'src/actions/wallet-and-transactions';

import WalletAndTransactions from 'src/sections/transactions/view';

interface Props {
  searchParams: { [key: string]: string };
  params: { [key: string]: string };
}
export default async function DriverWallet({ params, searchParams }: Props) {
  const userType = 'driver';
  const ID = params['driver-id'];
  const PAGE =
    searchParams?.page && typeof searchParams?.page === 'string' ? searchParams.page : '1';
  const LIMIT =
    searchParams?.limit && typeof searchParams?.limit === 'string' ? searchParams.limit : '5';
  const { TRANSACTIONS, META } = await getUserTransactions({
    page: PAGE,
    limit: LIMIT,
    user_id: ID,
  });
  const walletInfo = await getWalletInformation(ID);
  return (
    <WalletAndTransactions
      transactions={TRANSACTIONS}
      meta={META}
      wallet={walletInfo}
      userType={userType}
    />
  );
}
