import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { uiActions } from 'stores/uiSlice';

const CustomLoader = () => {
  const isLoading = useAppSelector((state) => state.ui.isLoading);
  const dispatch = useAppDispatch();

  return (
    <Backdrop sx={{ zIndex: 1400 }} open={isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default CustomLoader;
