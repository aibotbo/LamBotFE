import React, { FC, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

type CopyTradeHistoryTypeProps = {
  isCopyTrade: boolean;
  setIsCopyTrade: React.Dispatch<React.SetStateAction<boolean>>;
};

const CopyTradeHistoryType: FC<CopyTradeHistoryTypeProps> = ({
  isCopyTrade,
  setIsCopyTrade,
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
        isMobile && isCopyTrade ? 'translate-x-[-4.8rem]' : 'translate-x-[0]'
      } transition-all`}
    >
      <div
        className={`rounded-xl px-6 py-3 cursor-pointer ${
          !isCopyTrade ? 'border-primary bg-primary-10' : 'bg-primary-05'
        } whitespace-nowrap`}
        onClick={() => {
          setIsCopyTrade(false);
        }}
      >
        <p
          className={`${
            !isCopyTrade
              ? 'bg-primary-100 bg-clip-text text-transparent font-semibold'
              : 'text-ink-60 font-medium'
          }`}
        >
          Lịch sử Trade thủ công
        </p>
      </div>
      <div
        className={`px-6 py-3 rounded-xl cursor-pointer ${
          isCopyTrade ? 'border-primary bg-primary-10' : 'bg-primary-05'
        } whitespace-nowrap`}
        onClick={() => {
          setIsCopyTrade(true);
        }}
      >
        <p
          className={`${
            isCopyTrade
              ? 'bg-primary-100 bg-clip-text text-transparent font-semibold'
              : 'text-ink-60 font-medium'
          }`}
        >
          Lịch sử Copy Trade
        </p>
      </div>
    </div>
  );
};

export default CopyTradeHistoryType;
