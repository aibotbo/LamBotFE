import { FormikBag, FormikProps, FormikValues } from 'formik';
import React, { FC, useRef, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { CurrencyInputOnChangeValues } from 'react-currency-input-field/dist/components/CurrencyInputProps';
import convertToThreeDecimalPlaces from 'utils/ConvertToThreeDecimalPlaces';

interface IInputValues {
  [key: string]: string | number;
}

interface IInput {
  formik: FormikValues;
  isInputFocus: boolean;
  setIsInputFocus: React.Dispatch<React.SetStateAction<boolean>>;
  inputValue: string | number;
  inputError: string | number | undefined;
  id: string;
  label: string;
  name: string;
  inputColor?: string;
  symbol?: string;
}

const CustomNumberInput: FC<IInput> = (props) => {
  const {
    formik,
    isInputFocus,
    setIsInputFocus,
    inputValue,
    inputError,
    id,
    label,
    name,
    inputColor = 'text-ink-100',
    symbol = '$',
  } = props;

  const handleAmount = (
    value: string | undefined,
    fieldName: string,
    values: CurrencyInputOnChangeValues | undefined
  ): void => {
    // const valueToSet = value === undefined || +value <= 0 ? 0 : value || ' ';
    const valueToSet = value === undefined ? '' : value;
    const convertedValue = convertToThreeDecimalPlaces(+valueToSet);
    formik.setFieldValue(fieldName, convertedValue);
  };

  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="mb-4 text-ink-100">
      <div
        className={`relative border-primary-input ${
          isInputFocus && !inputError ? 'border-primary-focus' : ''
        }`}
      >
        <CurrencyInput
          id={id}
          name={name}
          className={`${
            inputValue === 0 || inputValue || isInputFocus
              ? 'pt-5 pb-3'
              : 'py-4'
          } px-3 w-full bg-ink-10 rounded-2xl ${
            inputError ? 'border border-red-100' : ''
          } ${inputColor}`}
          value={inputValue}
          onBlur={(e) => {
            formik.handleBlur(e);
            setIsInputFocus((prev) => !prev);
          }}
          onValueChange={(value, _, values) => {
            handleAmount(value, name, values);
          }}
          onFocus={(e) => {
            setIsInputFocus((prev) => !prev);
          }}
          allowNegativeValue={false}
          disableAbbreviations={true}
          decimalsLimit={3}
          maxLength={13}
          decimalSeparator=","
          groupSeparator="."
          ref={ref}
        />
        <label
          className={`absolute left-0 transition-all ${
            inputValue === 0 || inputValue || isInputFocus
              ? 'text-xs px-3 py-[0.375rem]'
              : 'px-3 py-4'
          } text-ink-40 cursor-text`}
          onClick={() => {
            if (ref.current) {
              ref.current.focus();
            }
          }}
        >
          {label}
        </label>
        <p className={`absolute right-3 top-[1.25rem] ${inputColor}`}>
          {symbol}
        </p>
      </div>
      {inputError && (
        <p className={`px-4 py-2 text-red-100 text-sm`}>{inputError}</p>
      )}
    </div>
  );
};

export default CustomNumberInput;
