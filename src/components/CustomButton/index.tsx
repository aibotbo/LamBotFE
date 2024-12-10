import React, { FC } from 'react';

interface CustomButtonProps {
  children: React.ReactNode;
  className?: string;
  background?: string;
  textClassName?: string;
  textColor?: string;
  icon?: string;
  iconClassName?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const CustomButton: FC<CustomButtonProps> = ({
  children,
  className = '',
  background = 'bg-primary-100',
  textClassName = '',
  textColor = 'bg-background-100',
  icon,
  iconClassName = '',
  type = 'button',
  onClick,
}) => {
  return (
    <button
      className={`flex justify-center items-center gap-x-[0.625rem] px-4 py-2 rounded-xl ${background} ${className}`}
      type={type}
      onClick={onClick}
    >
      {icon && <img src={icon} className={iconClassName} alt="BotLambotrade" />}
      <p
        className={`${textClassName} ${textColor} bg-clip-text text-transparent font-bold`}
      >
        {children}
      </p>
    </button>
  );
};

export default CustomButton;
