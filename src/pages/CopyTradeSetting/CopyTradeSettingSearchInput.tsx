import { FormikProps } from 'formik';
import React, { FC } from 'react';
import { ICopyTradeSettingFormik } from './CopyTradeSettingFollow';

type CopyTradeSettingSearchInputProps = {
  inputClassName?: string;
  inputName: string;
  searchInputFormik: string;
  formik: FormikProps<ICopyTradeSettingFormik>
};

const CopyTradeSettingSearchInput: FC<CopyTradeSettingSearchInputProps> = ({
  inputClassName,
  inputName,
  searchInputFormik,
  formik,
}) => {
  return (
    <div>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium sr-only text-ink-100"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-black-opacity-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          id={inputName}
          name={inputName}
          className={`${inputClassName} block py-3 pl-9 pr-8 text-sm text-black-opacity-40 border border-ink-20 rounded-xl bg-ink-05 focus:ring-blue-500 focus:border-blue-500 placeholder-black-opacity-40 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          placeholder="Tìm kiếm"
          value={searchInputFormik}
          onChange={(e) => {
            formik.setFieldValue(inputName, e.target.value);
          }}
          required
        />
      </div>
    </div>
  );
};

export default CopyTradeSettingSearchInput;
