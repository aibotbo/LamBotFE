import { FormikBag, FormikProps, FormikValues } from 'formik';
import React, { FC, useRef, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { CurrencyInputOnChangeValues } from 'react-currency-input-field/dist/components/CurrencyInputProps';

interface CustomNumberInputWithFocusProps {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  isLabelOutside?: boolean;
  placeholder?: string;
  prefix?: string;
  value: string | number | readonly string[] | undefined;
  error?: boolean;
  isInputDisabled?: boolean;
  helperText?: React.ReactNode;
  helperTextEnd?: React.ReactNode;
  decimalsLimit?: number;
  decimalScale?: number;
  fixedDecimalLength?: number;
  fullWidth?: boolean;
  maxLength?: number;
  searchIcon?: string;
  symbol?: string;
  icon?: string | undefined;
  button?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  symbolClassName?: string;
  helperClassName?: string;
  helperTextClassName?: string;
  helperTextEndClassName?: string;
  resetValue?: () => void;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onValueChange?:
    | ((
        value: string | undefined,
        name?: string | undefined,
        values?: CurrencyInputOnChangeValues | undefined
      ) => void)
    | undefined;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onMouseOver?: React.MouseEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onMouseLeave?: React.MouseEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
}

const CustomNumberInputWithFocus: FC<CustomNumberInputWithFocusProps> = ({
  id,
  name,
  label,
  isLabelOutside = false,
  placeholder,
  prefix,
  value,
  error,
  helperText,
  helperTextEnd,
  decimalsLimit = 3,
  decimalScale,
  fixedDecimalLength,
  fullWidth,
  maxLength,
  searchIcon,
  symbol,
  icon,
  button,
  isInputDisabled,
  containerClassName = '',
  inputClassName = '',
  symbolClassName = '',
  helperClassName = '',
  helperTextClassName = '',
  helperTextEndClassName = '',
  resetValue,
  onChange,
  onValueChange,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  onMouseOver,
  onMouseLeave,
}) => {
  const [isInputFocus, setInputFocus] = useState(false);
  const [isInputHover, setIsInputHover] = useState(false);

  return (
    <CurrencyInput
      id={id}
      name={name}
      className={`w-full overflow-hidden text-ellipsis whitespace-nowrap bg-transparent caret-yellow-500 focus:outline-none ${
        !isInputFocus && !value && label && !isLabelOutside
          ? 'placeholder-transparent'
          : 'placeholder-ink-20'
      } ${inputClassName}`}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onValueChange={(value, _, values) => {
        if (onValueChange) {
          onValueChange(value, _, values);
        }
      }}
      onBlur={(e) => {
        if (onBlur) {
          onBlur(e);
        }
        setInputFocus(false);
      }}
      onFocus={(e) => {
        if (onFocus) {
          onFocus(e);
        }
        setInputFocus(true);
      }}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseOver={(e) => {
        if (onMouseOver) {
          onMouseOver(e);
        }
        setIsInputHover(true);
      }}
      onMouseLeave={(e) => {
        if (onMouseLeave) {
          onMouseLeave(e);
        }
        setIsInputHover(false);
      }}
      prefix={prefix}
      inputMode='text'
      disabled={isInputDisabled}
      allowNegativeValue={false}
      decimalsLimit={decimalsLimit}
      disableAbbreviations={true}
      decimalSeparator="."
      groupSeparator=","
      maxLength={maxLength}
    />
  );
};

export default CustomNumberInputWithFocus;
