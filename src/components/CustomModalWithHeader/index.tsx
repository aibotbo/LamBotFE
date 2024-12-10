import { CloseOutlined } from '@mui/icons-material';
import CustomButton from 'components/CustomButton';
import CustomModal from 'components/CustomModal';
import React, { FC } from 'react';

interface CustomModalWithHeaderProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  button: React.ReactNode;
  handleOpen: () => void;
  handleClose: () => void;
}

const CustomModalWithHeader: FC<CustomModalWithHeaderProps> = ({
  open,
  title,
  content,
  button,
  handleOpen,
  handleClose,
}) => {
  return (
    <CustomModal
      isOpen={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
    >
      <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl">
        <div className="p-6 border-b border-ink-10 flex justify-between items-center">
          <h3 className="text-xl text-ink-100 font-semibold">{title}</h3>
          <CloseOutlined className="cursor-pointer" onClick={handleClose} />
        </div>
        {content}
        <div className="justify-center items-center gap-4">{button}</div>
      </div>
    </CustomModal>
  );
};

export default CustomModalWithHeader;
