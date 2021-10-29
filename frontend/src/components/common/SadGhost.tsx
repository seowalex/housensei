import { useTheme } from '@mui/material';
import { Ghost } from 'react-kawaii';

const SadGhost = () => {
  const theme = useTheme();

  const colors = [
    theme.palette.primary.light,
    theme.palette.secondary.light,
    theme.palette.error.light,
    theme.palette.warning.light,
    theme.palette.info.light,
    theme.palette.success.light,
  ];

  return (
    <Ghost
      size={200}
      mood="sad"
      color={colors[Math.floor(Math.random() * colors.length)]}
    />
  );
};

export default SadGhost;
