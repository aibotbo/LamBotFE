import React, { FC, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

type CopyTradeTypeProps = {
  isMaster: number;
  setIsMaster: (value: number) => void;
};

const CopyTradeType: FC<CopyTradeTypeProps> = ({ isMaster, setIsMaster }) => {
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
      className={`flex items-center gap-4 mb-6 sm:flex-nowrap flex-wrap ${
        isMobile && isMaster === 2 ? 'translate-x-[-3.2rem]' : 'translate-x-[0]'
      } transition-all`}
    >
      <div
        className={`rounded-xl px-6 py-3 cursor-pointer max-sm:flex-1 sm:w-full md:w-fit ${
          isMaster === 0 ? 'border-primary bg-primary-10' : 'bg-primary-05'
        } whitespace-nowrap`}
        onClick={() => {
          setIsMaster(0);
        }}
      >
        <p
          className={`${
            isMaster === 0
              ? 'bg-primary-100 bg-clip-text text-transparent font-semibold'
              : 'text-ink-60 font-medium'
          }`}
        >
          Giao dịch AI
        </p>
      </div>
      <div
        className={`rounded-xl px-6 py-3 cursor-pointer max-sm:flex-1 sm:w-full md:w-fit ${
          isMaster === 1 ? 'border-primary bg-primary-10' : 'bg-primary-05'
        } whitespace-nowrap`}
        onClick={() => {
          setIsMaster(1);
        }}
      >
        <p
          className={`${
            isMaster === 1
              ? 'bg-primary-100 bg-clip-text text-transparent font-semibold'
              : 'text-ink-60 font-medium'
          }`}
        >
          Giao dịch cá nhân
        </p>
      </div>
      <div
        className={`px-6 py-3 rounded-xl cursor-pointer w-full md:w-fit ${
          isMaster === 2 ? 'border-primary bg-primary-10' : 'bg-primary-05'
        } whitespace-nowrap`}
        onClick={() => {
          setIsMaster(2);
        }}
      >
        <p
          className={`${
            isMaster === 2
              ? 'bg-primary-100 bg-clip-text text-transparent font-semibold'
              : 'text-ink-60 font-medium'
          }`}
        >
          Giao dịch chuyên gia
        </p>
      </div>
    </div>
  );
};

export default CopyTradeType;
