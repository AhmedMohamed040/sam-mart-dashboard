import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { META, Transaction, WalletInformation } from 'src/@types/walelt-and-transactions';

import Header from './header';
import WalletData from './wallet-data';
import TransactionsTable from './transactions-table';

interface Props {
  transactions: Transaction[] | [];
  meta: META;
  wallet: WalletInformation;
  userType: 'client' | 'driver';
}
export default function WalletAndTransactions({ transactions, meta, wallet, userType }: Props) {
  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        <Header userType={userType} username={wallet.user.name} />
        <WalletData wallet={wallet} userType={userType} />
        <TransactionsTable
          transactions={transactions}
          meta={meta}
          username={wallet.user.name}
          userType={userType}
        />
      </Stack>
    </Container>
  );
}
