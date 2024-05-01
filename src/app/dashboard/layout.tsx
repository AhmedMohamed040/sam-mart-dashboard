'use client';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
import { SocketProvider } from 'src/sockets/orders-socket-context';
import VerticalNavDataProvider from 'src/contexts/dashboard-vertical-bar-values';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <VerticalNavDataProvider>
        <SocketProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </SocketProvider>
      </VerticalNavDataProvider>
    </AuthGuard>
  );
}
