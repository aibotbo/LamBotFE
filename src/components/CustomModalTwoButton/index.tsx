import CustomModal from 'components/CustomModal';
import GoldButton from 'components/GoldButton';
import GreyButton from 'components/GreyButton';
import React, { FC } from 'react';

interface CustomModalTwoButtonProps {
  open: boolean;
  icon: string;
  title: string;
  content: React.ReactNode;
  handleOpen: () => void;
  handleClose: () => void;
  onConfirm: () => void;
}

const CustomModalTwoButton: FC<CustomModalTwoButtonProps> = ({
  open,
  icon,
  title,
  content,
  handleOpen,
  handleClose,
  onConfirm,
}) => {
  return (
    <CustomModal
      isOpen={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
    >
      <div
        className={`absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 md:w-[31.25rem] w-[calc(100vw-2rem)] bg-background-80 rounded-3xl text-center`}
      >
        <div className="flex items-center justify-center">
          <img className="mb-4 w-[5.5rem]" src={icon} alt="BotLambotrade" />
        </div>
        <h3 className="mb-2 mx-auto max-w-[18.75rem] text-xl text-ink-100">
          {title}
        </h3>
        <p className="mb-12 mx-auto max-w-[18.75rem] text-ink-80">{content}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4">
          <GreyButton onClick={handleClose}>Huỷ</GreyButton>
          <GoldButton onClick={onConfirm}>Xoá</GoldButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default CustomModalTwoButton;
