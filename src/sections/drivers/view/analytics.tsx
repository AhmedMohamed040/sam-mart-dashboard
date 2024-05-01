import { useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { ColorSchema } from 'src/theme/palette';
import { Analytics } from 'src/@types/dashboard-drivers';

import AnalyticsWidgetSummary from './analytics-widget-summary';

const DRIVERS_STATUS: { [key: string]: string } = {
  all_drivers: '',
  pending_drivers: 'PENDING',
  active_drivers: 'VERIFIED',
  blocked_drivers: 'BLOCKED',
};
const DriversViewAnalytics = ({ analytics }: { analytics: Analytics }) => {
  const { total, totalBlocked, totalPending, totalVerified } = analytics;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentParam = searchParams.get('status');
  const analyticsData: {
    title: string;
    total: number;
    status: string;
    color: ColorSchema | undefined;
  }[] = [
    {
      title: 'all_drivers',
      total,
      status: '',
      color: 'secondary',
    },
    {
      title: 'pending_drivers',
      total: totalPending,
      status: 'PENDING',
      color: 'warning',
    },
    {
      title: 'active_drivers',
      total: totalVerified,
      status: 'VERIFIED',
      color: 'success',
    },
    {
      title: 'blocked_drivers',
      total: totalBlocked,
      status: 'BLOCKED',
      color: 'error',
    },
  ];
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );
  useEffect(() => {
    if (currentParam === null) {
      createQueryString('status', '');
    }
  }, [currentParam, createQueryString]);
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      display="grid"
      gap={2}
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)',
      }}
    >
      {analyticsData.map((analytic, index: number) => (
        <Grid item key={index}>
          <Button
            fullWidth
            sx={{ padding: 0 }}
            onClick={() => {
              createQueryString('status', DRIVERS_STATUS[analytic.title]);
            }}
          >
            <AnalyticsWidgetSummary
              title={analytic.title}
              total={analytic.total}
              color={analytic.color}
              sx={{ width: '100%' }}
            />
          </Button>
          <Divider
            sx={{
              marginTop: 2,
              borderWidth: '2px',
              opacity: currentParam === analytic.status ? 1 : 0,
              borderColor: `${analytic.color}.light`,
            }}
            variant="middle"
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default DriversViewAnalytics;
