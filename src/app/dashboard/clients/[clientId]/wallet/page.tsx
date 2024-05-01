import { getUserTransactions, getWalletInformation } from 'src/actions/wallet-and-transactions';

import WalletAndTransactions from 'src/sections/transactions/view';

interface Props {
  searchParams: { [key: string]: string };
  params: { [key: string]: string };
}
export default async function DriverWallet({ params, searchParams }: Props) {
  const userType = 'client';
  const { clientId } = params;
  const PAGE =
    searchParams?.page && typeof searchParams?.page === 'string' ? searchParams.page : '1';
  const LIMIT =
    searchParams?.limit && typeof searchParams?.limit === 'string' ? searchParams.limit : '5';
  const { TRANSACTIONS, META } = await getUserTransactions({
    page: PAGE,
    limit: LIMIT,
    user_id: clientId,
  });
  const walletInfo = await getWalletInformation(clientId);
  return (
    <WalletAndTransactions
      transactions={TRANSACTIONS}
      meta={META}
      wallet={walletInfo}
      userType={userType}
    />
  );
}
