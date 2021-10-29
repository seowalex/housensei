import { Link } from '@mui/material';

type Props = {
  link: string;
  label: string;
};

const NewTabLink = (props: Props) => {
  const { link, label } = props;
  return (
    <Link
      href={`//${link.slice(12)}`}
      target="_blank"
      rel="noopener"
      sx={{ paddingLeft: 1 }}
    >
      {label}
    </Link>
  );
};

export default NewTabLink;
