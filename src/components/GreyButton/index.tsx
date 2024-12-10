import React, { FC, ReactNode } from 'react';

interface GreyButtonProps {
  children: ReactNode;
  buttonClassName?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const GreyButton: FC<GreyButtonProps> = ({
  children,
  buttonClassName,
  disabled,
  onClick,
}) => {
  return (
    <button
      className={`${buttonClassName} px-8 py-3 bg-primary-05 rounded-xl ${
        disabled ? 'cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <p className="bg-primary-100 bg-clip-text text-transparent font-semibold">
        {children}
      </p>
    </button>
  );
};

export default GreyButton;
