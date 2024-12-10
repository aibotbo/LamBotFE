import images from 'assets';
import CustomNumberInputWithFocus from 'components/CustomNumberInputOnlyFocus';
import React, { FC, useState } from 'react';
import { CurrencyInputOnChangeValues } from 'react-currency-input-field/dist/components/CurrencyInputProps';

interface BotTradeSettingViewTableRowProps {
  row: number;
  onDeleteRow: () => void;
}

const BotTradeSettingViewTableRow: FC<BotTradeSettingViewTableRowProps> = ({
  row,
  onDeleteRow,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="left-0 sticky rt-th w-[7.375rem] max-w-[7.375rem] p-4 flex-[100_0_auto] bg-background-80 border-r border-ink-10 z-[100] text-sm cursor-pointer overflow-visible whitespace-nowrap text-ellipsis"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {row <= 1  ? (
        `Giá trị lệnh ${row + 1}`
      ) : isHovered ? (
        <div className="flex items-center gap-1" onClick={onDeleteRow}>
          <img
            src={images.bot.delete_gold}
            alt="BotLambotrade"
            className="w-[1.5rem]"
          />
          <p>Xoá</p>
        </div>
      ) : (
        `Giá trị lệnh ${row + 1}`
      )}
    </div>
  );
};

export default BotTradeSettingViewTableRow;
