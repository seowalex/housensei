import { Paper } from '@mui/material';
import { styled } from '@mui/system';

export const ModalPaper = styled(Paper)({
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '1rem',
});

export const FormPaper = styled(ModalPaper)({
  width: '75%',
});
