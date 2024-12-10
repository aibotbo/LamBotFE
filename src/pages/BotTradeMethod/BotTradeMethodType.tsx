import React, { FC, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

type BotTradeMethodTypeProps = {
  isBotTradeBuySell: boolean;
  setIsBotTradeBuySell: React.Dispatch<React.SetStateAction<boolean>>;
};

const BotTradeMethodType: FC<BotTradeMethodTypeProps> = ({
  isBotTradeBuySell,
  setIsBotTradeBuySell,
}) => {
  // RESPONSIVE
  const isDesktop = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  return (
    <div
      className={`flex items-center gap-4 mb-6 ${
        isMobile && !isBotTradeBuySell
          ? 'translate-x-[-4.8rem]'
          : 'translate-x-[0]'
      } transition-all`}
    >
      <div
        className={`rounded-xl px-6 py-3 cursor-pointer ${
          isBotTradeBuySell ? 'border-primary bg-primary-10' : 'bg-primary-05'
        } whitespace-nowrap`}
        onClick={() => {
          setIsBotTradeBuySell(true);
        }}
      >
        <p
          className={`${
            isBotTradeBuySell
              ? 'bg-primary-100 bg-clip-text text-transparent font-semibold'
              : 'text-ink-60 font-medium'
          }`}
        >
          Xbot - Buy/Sell
        </p>
      </div>
      <div
        className={`px-6 py-3 rounded-xl cursor-pointer ${
          !isBotTradeBuySell ? 'border-primary bg-primary-10' : 'bg-primary-05'
        } whitespace-nowrap`}
        onClick={() => {
          setIsBotTradeBuySell(false);
        }}
      >
        <p
          className={`${
            !isBotTradeBuySell
              ? 'bg-primary-100 bg-clip-text text-transparent font-semibold'
              : 'text-ink-60 font-medium'
          }`}
        >
          Xbot - Bóng nước
        </p>
      </div>
    </div>
  );
};

export default BotTradeMethodType;
