import React, { FC } from 'react';

interface BubbleProps {
  text: string | number;
  className?: string;
  textClassName?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Bubble: FC<BubbleProps> = ({
  text,
  className = '',
  textClassName = '',
  onClick,
}) => {
  return (
    <div
      className={`w-[44px] h-[44px] flex items-center justify-center rounded-full text-sm ${className}`}
      onClick={onClick}
    >
      <p className={`font-semibold text-sm ${textClassName}`}>{text}</p>
    </div>
  );
};

export default Bubble;
