import { Cancel } from '@mui/icons-material';
import { SnackbarKey, useSnackbar } from 'notistack';
import React, { FC } from 'react';

interface CustomSnackbarCloseProps {
  id: SnackbarKey;
}

const CustomSnackbarClose: FC<CustomSnackbarCloseProps> = ({ id }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <button onClick={() => closeSnackbar(id)}>
      <Cancel className="fill-ink-100" />
    </button>
  );
};

export default CustomSnackbarClose;
