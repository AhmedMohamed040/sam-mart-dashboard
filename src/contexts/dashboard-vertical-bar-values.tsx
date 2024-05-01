import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  createContext,
} from 'react';

import { INITIAL_TYPES } from 'src/@types/vertical-side-bar-types';
import { getTotalOrders } from 'src/actions/vertical-side-bar-actions';

const VerticalNavDataContext = createContext({
  Orders: {
    ordersTotal: 0,
    ordersNew: 0,
    ordersDriversAccepted: 0,
    ordersProcessing: 0,
    ordersReadyForPickup: 0,
    ordersPicked: 0,
    ordersDelivered: 0,
    ordersCanceled: 0,
  },
  refresh: () => {},
});

interface Prop {
  children: React.ReactNode;
}
const INITIAL: INITIAL_TYPES = {
  Orders: {
    ordersTotal: 0,
    ordersNew: 0,
    ordersDriversAccepted: 0,
    ordersProcessing: 0,
    ordersReadyForPickup: 0,
    ordersPicked: 0,
    ordersDelivered: 0,
    ordersCanceled: 0,
  },
};

// THIS CONTEXT IS GOING TO MAKE AN API CALL JUST FOR ONE-TIME WHEN THE APP IS FIRST RENDERED
// THEN IT WILL BE UPDATED FROM THE COMPONENTS IT'S CONSUMING IT
// SO WE DON"T FETCH DATA OVER & OVER & OVER AGAIN
// IF YOU'RE GOING TO ADD NEW DATA MAKE THE CALL TO BE RACE PROMISE (AKA: Promise.All)

export default function VerticalNavDataProvider({ children }: Prop) {
  const [refetchData, setRefetch] = useState<boolean>(false);
  const [values, setValues] = useReducer(
    (current: { Orders: INITIAL_TYPES }, update: any) => ({
      ...current,
      ...update,
    }),
    INITIAL
  );

  useEffect(() => {
    const firstRenderApiCall = async () => {
      const res = await getTotalOrders();
      setValues({
        Orders: res.data,
      });
    };

    // CALL THE FUNCTION
    firstRenderApiCall();
  }, [refetchData]);

  const refresh = useCallback(() => {
    setRefetch((prev) => !prev);
  }, []);

  const VALUES = useMemo(
    () => ({
      ...values,
      refresh,
    }),
    [values, refresh]
  );
  return (
    <VerticalNavDataContext.Provider value={VALUES}>{children}</VerticalNavDataContext.Provider>
  );
}

export const useVerticalNavDataContext = () => useContext(VerticalNavDataContext);
