import { FormikBag, FormikProps, FormikValues } from 'formik';
import React, { FC, useRef, useState } from 'react';
import { CurrencyInputOnChangeValues } from 'react-currency-input-field/dist/components/CurrencyInputProps';

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
  containerClassName?: string;
  inputClassName?: string;
}

const CustomTextInput: FC<IInput> = (props) => {
  const {
    formik,
    isInputFocus,
    setIsInputFocus,
    inputValue,
    inputError,
    id,
    label,
    name,
    containerClassName,
    inputClassName,
  } = props;

  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className={`mb-4 text-ink-100 ${containerClassName}`}>
      <div
        className={`relative border-primary-input ${
          isInputFocus && !inputError ? 'border-primary-focus' : ''
        }`}
      >
        <input
          id={id}
          name={name}
          className={`${
            inputValue === 0 || inputValue || isInputFocus
              ? 'pt-5 pb-3'
              : 'py-4'
          } px-3 w-full bg-ink-10 rounded-2xl text-ink-100 ${
            inputError ? 'border border-red-100' : ''
          } ${inputClassName}`}
          type="text"
          value={inputValue}
          onChange={formik.handleChange}
          onBlur={(e) => {
            formik.handleBlur(e);
            setIsInputFocus((prev) => !prev);
          }}
          onFocus={(e) => {
            console.log(e);
            setIsInputFocus((prev) => !prev);
          }}
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
      </div>
      {inputError && (
        <p className="px-4 py-2 text-red-100 text-sm">{inputError}</p>
      )}
    </div>
  );
};

export default CustomTextInput;
