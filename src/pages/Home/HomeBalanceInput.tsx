import React, { FC } from 'react';
import HomeSelectInput from './HomeSelectInput';
import InputSelectOption from 'types/InputSelectOption';
import { BotBalance } from 'types/BotBalance';
import BotData from 'types/BotData';
import images from 'assets';

interface HomeSelectInputProps {
  selectedAccountType: InputSelectOption;
  // setSelectedAccountType: React.Dispatch<
  //   React.SetStateAction<InputSelectOption>
  // >;
  onSelectedAccountTypeChange: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: InputSelectOption
  ) => void;
  selectedBotAccount: InputSelectOption;
  // setSelectedBotAccount: React.Dispatch<
  //   React.SetStateAction<InputSelectOption>
  // >;
  onSelectedBotAccountChange: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: InputSelectOption
  ) => void;
  accountOptions: InputSelectOption[];
  botBalance: BotBalance;
  partnerBotDatas: BotData[];
  // reloadDemoBalance: (id: number | string) => void;
}

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: 'decimal',
};

const ACCOUNT_TYPES = [
  {
    value: 'DEMO',
    label: 'Tài khoản DEMO',
  },
  {
    value: 'LIVE',
    label: 'Tài khoản LIVE',
  },
];

const HomeBalanceInput: FC<HomeSelectInputProps> = ({
  selectedAccountType,
  // setSelectedAccountType,
  onSelectedAccountTypeChange,
  selectedBotAccount,
  // setSelectedBotAccount,
  onSelectedBotAccountChange,
  accountOptions,
  botBalance,
  partnerBotDatas,
  // reloadDemoBalance,
}) => {
  return (
    <>
      <HomeSelectInput
        containerClassName="mb-4"
        label="Loại tài khoản"
        inputValue={selectedAccountType}
        // setInputValue={setSelectedAccountType}
        onSelectChange={onSelectedAccountTypeChange}
        options={ACCOUNT_TYPES}
        isSearchEnabled={false}
      />
      {partnerBotDatas.length > 0 && (
        <HomeSelectInput
          containerClassName="mb-4"
          label="Tài khoản giao dịch"
          inputValue={selectedBotAccount}
          // setInputValue={setSelectedBotAccount}
          onSelectChange={onSelectedBotAccountChange}
          options={accountOptions}
          isSearchEnabled={false}
        />
      )}
      {partnerBotDatas.length > 0 && (
        <div className="px-3 flex justify-between items-center">
          <div className="flex items-center gap-x-2">
            <p className="text-sm text-ink-100">Số dư ví:</p>
            {/* {selectedAccountType.value === 'DEMO' && (
              <img
                onClick={() => {
                  reloadDemoBalance(selectedBotAccount.value);
                }}
                className="w-[1.5rem] cursor-pointer"
                src={images.home.reload}
                alt="BotLambotrade"
              />
            )} */}
          </div>
          <p className={`font-semibold text-xl text-gold`}>
            $
            {selectedAccountType.value === 'DEMO'
              ? botBalance.demo_balance.toLocaleString('en-US', options)
              : selectedAccountType.value === 'LIVE'
              ? botBalance.balance.toLocaleString('en-US', options)
              : 0}
          </p>
        </div>
      )}
      {partnerBotDatas.length === 0 && (
        <div className="flex justify-between items-center">
          <p className={`font-semibold text-sm text-gold`}>
            Bạn chưa liên kết tài khoản Lambotradevới sàn, vui lòng ấn vào nút
            thêm mới tài khoản giao dịch để thực hiện liên kết tài khoản giao
            dịch
          </p>
        </div>
      )}
    </>
  );
};

export default HomeBalanceInput;
