import { Modal } from '@mui/material';
import React, { FC, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { uiActions } from 'stores/uiSlice';

interface IModel {
  children: ReactNode;
  isOpen: boolean;
  zIndex?: number;
  handleOpen?: () => void;
  handleClose: () => void;
}

const CustomModal: FC<IModel> = ({
  children,
  isOpen,
  zIndex = 1300,
  handleOpen,
  handleClose,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        zIndex: zIndex
      }}
    >
      <>{children}</>
    </Modal>
  );
};

export default CustomModal;
