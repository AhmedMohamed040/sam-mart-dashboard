import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { bgGradient } from 'src/theme/css';
import { ColorSchema } from 'src/theme/palette';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  icon?: React.ReactNode;
  color?: ColorSchema;
  customBgColor?: string;
  customColor?: string;
  customOpacity?: string;
}

export default function AnalyticsWidgetSummary({
  title,
  total,
  icon,
  color = 'primary',
  customBgColor,
  customColor,
  customOpacity,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  return (
    <Stack
      alignItems="center"
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette[color].light, 0.2),
          endColor: alpha(theme.palette[color].main, 0.2),
        }),
        py: 5,
        borderRadius: 2,
        textAlign: 'center',
        color: customColor || `${color}.darker`,
        backgroundColor: customBgColor || 'common.white',
        width: '100%',
        ...sx,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64, mb: 1 }}>{icon}</Box>}

      <Typography variant="h3">{total ? fShortenNumber(total) : '٠'}</Typography>

      <Typography variant="subtitle2" sx={{ opacity: customOpacity || 0.64 }}>
        {title}
      </Typography>
    </Stack>
  );
}
