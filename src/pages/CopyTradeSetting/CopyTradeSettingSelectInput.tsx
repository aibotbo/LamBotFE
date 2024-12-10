import images from 'assets';
import SearchInputFormik from 'pages/CopyTradeSetting/CopyTradeSettingSearchInput';
import React, { FC, useRef, useState } from 'react';
import { ICopyTradeSettingFormik } from './CopyTradeSettingFollow';
import { FormikProps } from 'formik';
import SearchInput from 'components/SearchInput';

interface CustomSelectInputProps {
  label: string;
  inputName: string;
  className?: string;
  selectInputValue: string;
  formik: FormikProps<ICopyTradeSettingFormik>;
}

const ACCOUNT_TYPES = ['Tài khoản LIVE', 'Tài khoản DEMO'];

const CustomSelectInput: FC<CustomSelectInputProps> = ({
  label,
  inputName,
  className = '',
  selectInputValue,
  formik,
}) => {
  const [open, setOpen] = useState(false);
  // const [searchInput, setSearchInput] = useState('');
  const handleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setOpen((prev) => !prev);
  };

  const handleSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    value: number | string
  ) => {
    setOpen((prev) => !prev);
    formik.setFieldValue(inputName, value);
  };
  return (
    <>
      <div className="relative px-3 py-[0.375rem] border border-ink-10 bg-ink-05 rounded-2xl cursor-pointer">
        <div className="flex justify-between items-center" onClick={handleOpen}>
          <div>
            <label className="pb-1 text-ink-60">{label}</label>
            <p className="text-ink-100">
              {selectInputValue ? selectInputValue : '\u00A0'}
            </p>
          </div>
          <img
            className="w-[1.5rem]"
            src={images.home.white_dropdown}
            alt="BotLambotrade"
          />
        </div>
        {open && (
          <div
            className={`z-[10000] top-[calc(100%+0.5rem)] absolute w-full left-0 bg-dropdown rounded-2xl cursor-pointer shadow-popup ${className}`}
          >
            {/* <div className="p-4">
              <SearchInput
                inputName="search"
                inputClassName="w-full"
                searchInput={searchInput}
                setSearchInput={setSearchInput}
              />
            </div> */}
            <div className="flex flex-col max-h-[39.5rem] overflow-y-auto">
              {/* {Array(20)
                .fill(0)
                .map((value, index) => (
                  <div
                    className={`border-select-input ${
                      index === 0 ? 'bg-primary-05' : 'p-4'
                    }`}
                    onClick={(e) => {
                      handleSelect(e, value);
                    }}
                    key={index}
                  >
                    <p
                      className={`${
                        index === 0
                          ? 'p-4 bg-primary-100 bg-clip-text text-transparent'
                          : ''
                      }`}
                    >
                      Botchat {value + 1}
                    </p>
                  </div>
                ))} */}
              {ACCOUNT_TYPES.map((accountType, index) => (
                <div
                  className={`border-select-input first:rounded-tl-2xl first:rounded-tr-2xl last:rounded-bl-2xl last:rounded-br-2xl ${
                    selectInputValue === accountType ? 'bg-primary-05' : 'p-4'
                  }`}
                  onClick={(e) => {
                    handleSelect(e, accountType);
                  }}
                  key={index}
                >
                  <p
                    className={`${
                      selectInputValue === accountType
                        ? 'p-4 bg-primary-100 bg-clip-text text-transparent'
                        : ''
                    }`}
                  >
                    {accountType}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomSelectInput;
