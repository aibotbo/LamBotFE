import React, { FC, useState } from 'react';

interface BotTradeSettingButtonProps {
  children: React.ReactNode;
  className?: string;
  classNameHover?: string;
  background?: string;
  backgroundHover?: string;
  textClassName?: string;
  textClassNameHover?: string;
  textColor?: string;
  textColorHover?: string;
  icon?: string;
  iconHover?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const BotTradeSettingButton: FC<BotTradeSettingButtonProps> = ({
  children,
  className = '',
  classNameHover = '',
  background = 'bg-primary-05',
  backgroundHover = 'bg-primary-100',
  textClassName = '',
  textClassNameHover = '',
  textColor = 'bg-primary-100',
  textColorHover = 'bg-background-100',
  icon,
  iconHover,
  type = 'button',
  onClick,
}) => {
  console.log(onClick);
  console.log('CLICKED');
  const [isButtonHover, setIsButtonHover] = useState(false);

  return (
    <button
      className={`flex justify-center items-center gap-x-[0.625rem] px-3 py-[0.625rem] rounded-xl ${
        isButtonHover ? backgroundHover : background
      } ${isButtonHover ? classNameHover : className}`}
      type={type}
      onClick={onClick}
      onMouseOver={() => {
        setIsButtonHover(true);
      }}
      onMouseLeave={() => {
        setIsButtonHover(false);
      }}
    >
      {icon && iconHover && (
        <img src={isButtonHover ? iconHover : icon} alt="BotLambotrade" />
      )}
      <p
        className={`${isButtonHover ? textClassNameHover : textClassName} ${
          isButtonHover ? textColorHover : textColor
        } bg-clip-text text-transparent font-bold`}
      >
        {children}
      </p>
    </button>
  );
};

export default BotTradeSettingButton;
