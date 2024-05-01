import { useSnackbar } from 'notistack';
import { Socket } from 'socket.io-client';
import React, { useMemo, useState, ReactNode, useEffect, useContext, createContext } from 'react';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { invalidatePath } from 'src/actions/cache-invalidation';
import { useVerticalNavDataContext } from 'src/contexts/dashboard-vertical-bar-values';

import { socket } from './socket-orders-connection';

const SocketContext = createContext<any>({
  isConnected: false,
  transport: 'N/A',
  socketState: socket,
  listenForOrderReturn: (callback: (data: any) => void) => {},
});

const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socketState, setSocket] = useState<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');
  const { enqueueSnackbar } = useSnackbar();
  const { refresh } = useVerticalNavDataContext();
  const { t } = useTranslate();

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (transports) => {
        setTransport(transports.name);
      });
      setSocket(socket);
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }
    function onReturnOrder() {
      const newReturnOrder = new Audio('/assets/sounds/new_order_sound_effect.mp3');
      newReturnOrder.play();
      enqueueSnackbar(
        <Box component={RouterLink} href={paths.dashboard.returnRequests}>
          {t('new_return_order')}
        </Box>
      );
      invalidatePath(paths.dashboard.returnRequests);
    }
    async function onOrderStatusChange(value: any) {
      if (value.action === 'PENDING') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newOrderSoundEffect = new Audio('/assets/sounds/new_order_sound_effect.mp3');
        refresh();
        invalidatePath(paths.dashboard.ordersGroup.total);
        enqueueSnackbar(
          <Box component={RouterLink} href={paths.dashboard.ordersGroup.total}>
            {t('you_have_recieved_a_new_order')}
          </Box>
        );
        newOrderSoundEffect.play();
      } else {
        refresh();
        invalidatePath(paths.dashboard.ordersGroup.total);
      }
    }
    socket.on('connect', onConnect);

    socket.on('connect_error', (err) => {
      console.log(err.message); // prints the message associated with the error
    });

    socket.on('order_return', onReturnOrder);
    socket.on('order_status_change', onOrderStatusChange);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('order_return', onReturnOrder);
      socket.off('order_status_change', onOrderStatusChange);
    };
  }, [enqueueSnackbar, t, refresh]);

  const VALUE = useMemo(
    () => ({
      isConnected,
      transport,
      socketState,
    }),
    [isConnected, transport, socketState]
  );
  return <SocketContext.Provider value={VALUE}>{children}</SocketContext.Provider>;
};

const useSocket = () => useContext(SocketContext);

export { useSocket, SocketProvider };
