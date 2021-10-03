import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { createTheme } from '@mui/material';

const LinkBehavior = React.forwardRef<
  never,
  Omit<LinkProps, 'to'> & { href: LinkProps['to'] }
>(({ href, ...other }, ref) => <Link ref={ref} to={href} {...other} />);

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

export default theme;
