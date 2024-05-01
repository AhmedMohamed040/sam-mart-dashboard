import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  src: string;
};

export default function InvoicePreviewDialog({ open, onClose, src }: Props) {
  const { t } = useTranslate();

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 1170, minHeight: 600 },
      }}
    >
      <DialogContent sx={{ width: '100%', height: '100%', p: 4 }}>
        <iframe
          src={src}
          width="100%"
          height="800px"
          title="invoice-preview"
          style={{
            transform: 'scale(1)',
            border: 'none',
            borderRadius: '1rem',
          }}
        >
          <p>Alternative text for browsers that do not understand the tag.</p>
        </iframe>
      </DialogContent>

      <DialogActions sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            padding: '0.75rem 2rem',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
