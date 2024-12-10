import React, { FC } from 'react';

interface TileProps {
  isGold?: boolean;
  isLast?: boolean;
  className?: string;
  textClassName?: string;
  text: string;
  rightIcon?: string;
  rightIconAction?: () => void;
}

const Tile: FC<TileProps> = ({
  isGold = false,
  isLast = false,
  className = '',
  textClassName = '',
  text,
  rightIcon,
  rightIconAction,
}) => {
  return (
    <div
      className={`p-4 flex items-center justify-between rounded-tl-xl rounded-tr-xl ${
        isGold ? 'bg-background-60' : ''
      } ${className} ${!isLast ? 'border-b border-ink-10' : ''}`}
    >
      <p className={`text-ink-100 text-sm ${textClassName}`}>{text}</p>
      {rightIcon && (
        <img
          className="w-[1.5rem] cursor-pointer"
          src={rightIcon}
          alt="BotLambotrade"
          onClick={rightIconAction}
        />
      )}
    </div>
  );
};

export default Tile;
