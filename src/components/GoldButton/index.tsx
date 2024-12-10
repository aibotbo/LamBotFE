import React, { FC, ReactNode } from 'react';

interface GoldButtonProps {
  children: ReactNode;
  buttonClassName?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const GoldButton: FC<GoldButtonProps> = ({
  children,
  buttonClassName = '',
  onClick,
  type = 'button',
}) => {
  return (
    <button
      className={`${buttonClassName} px-8 py-3 bg-primary-100 rounded-xl`}
      type={type}
      onClick={onClick}
    >
      <p className="bg-background-100 bg-clip-text text-transparent font-semibold">
        {children}
      </p>
    </button>
  );
};

export default GoldButton;
