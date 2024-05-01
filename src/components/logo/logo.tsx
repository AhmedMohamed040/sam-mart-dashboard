import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  enableText?: boolean;
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ enableText, disabledLink = false, sx, ...other }, ref) => {
    const { t } = useTranslate();

    // OR using local (public folder)
    // -------------------------------------------------------
    const logo = (
      <Box
        component="div"
        sx={{ display: 'flex', gap: 1, width: 'auto', height: 'auto', cursor: 'pointer', ...sx }}
      >
        <Box
          component="img"
          src="/logo/sam-mart-logo.svg"
          sx={{ width: 40, height: 40, cursor: 'pointer', ...sx}}
        />
        {enableText && (
          <Typography variant="h6" component="span" textTransform="capitalize" alignSelf="center">
            {t('sam_mart')}
          </Typography>
        )}
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
