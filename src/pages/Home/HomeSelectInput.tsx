import images from 'assets';
import SearchInputFormik from 'pages/CopyTradeSetting/CopyTradeSettingSearchInput';
import React, { FC, useRef, useState } from 'react';
import { FormikProps } from 'formik';
import SearchInput from 'components/SearchInput';
import InputSelectOption from 'types/InputSelectOption';

interface HomeSelectInputProps {
  label: string;
  inputValue: InputSelectOption;
  options: InputSelectOption[];
  // setInputValue: React.Dispatch<React.SetStateAction<InputSelectOption>>;
  onSelectChange: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: InputSelectOption
  ) => void;
  popupClassName?: string;
  containerClassName?: string;
  isSearchEnabled?: boolean;
}

const HomeSelectInput: FC<HomeSelectInputProps> = ({
  label,
  popupClassName = '',
  containerClassName = '',
  isSearchEnabled = true,
  inputValue,
  // setInputValue,
  onSelectChange,
  options,
}) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('Money AI 1.8');
  const handleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setOpen((prev) => !prev);
  };

  // const handleSelect = (
  //   e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  //   option: InputSelectOption
  // ) => {
  //   setOpen((prev) => !prev);
  //   setInputValue(option);
  // };

  return (
    <>
      <div
        className={`relative px-3 py-[0.375rem] border border-ink-10 bg-ink-05 rounded-2xl cursor-pointer ${containerClassName}`}
      >
        <div className="flex justify-between items-center" onClick={handleOpen}>
          <div>
            <label className="pb-1 text-ink-60 text-xs cursor-pointer">
              {label}
            </label>
            <p className="text-ink-100">
              {inputValue.label === '' || inputValue.label === 'None'
                ? '\u00A0'
                : inputValue.label}
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
            className={`z-[10000] top-[calc(100%+0.5rem)] absolute w-full left-0 bg-dropdown rounded-2xl cursor-pointer shadow-popup ${popupClassName}`}
          >
            {isSearchEnabled && (
              <div className="p-4">
                <SearchInput
                  inputName="search"
                  inputClassName="w-full"
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                />
              </div>
            )}
            <div className="flex flex-col max-h-[39.5rem] overflow-y-auto">
              {options.map((option, index) => (
                <div
                  className={`border-select-input first:rounded-tl-2xl first:rounded-tr-2xl last:rounded-bl-2xl last:rounded-br-2xl ${
                    inputValue.value === option.value ? 'bg-primary-05' : 'p-4'
                  }`}
                  onClick={(e) => {
                    // handleSelect(e, option);
                    onSelectChange(e, option);
                    setOpen((prev) => !prev);
                  }}
                  key={index}
                >
                  <p
                    className={`${
                      inputValue.value === option.value
                        ? 'p-4 bg-primary-100 bg-clip-text text-transparent'
                        : ''
                    }`}
                  >
                    {option.label}
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

export default HomeSelectInput;
