import CustomButton from 'components/CustomButton';
import CustomModal from 'components/CustomModal';
import React, { FC } from 'react';
import CustomValidateModelProps from 'types/CustomValidateProps';

const CustomValidateModel: FC<CustomValidateModelProps> = ({
  isOpen,
  headingMessage,
  message,
  icon,
  buttonMessage,
  handleOpen,
  handleClose,
}) => {
  return (
    <CustomModal
      zIndex={2000}
      isOpen={isOpen}
      handleOpen={handleOpen}
      handleClose={handleClose}
    >
      <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 w-[calc(100vw-2rem)] md:min-w-[31.25rem] md:max-w-[31.25rem] bg-background-80 rounded-3xl text-center">
        <img
          className="mb-4 w-[5.5rem] mx-auto"
          src={icon}
          alt="BotLambotrade"
        />
        <p className="mb-2 mx-auto max-w-[18.75rem] text-xl text-ink-100 font-bold">
          {headingMessage}
        </p>
        <p className="mb-12">{message}</p>
        <div className="w-full">
          <CustomButton
            className="w-full py-4"
            textClassName="font-bold"
            onClick={() => {
              handleClose();
            }}
          >
            {buttonMessage}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default CustomValidateModel;
