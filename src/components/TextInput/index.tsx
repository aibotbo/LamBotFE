import { Cancel } from '@mui/icons-material';
import { TextField } from '@mui/material';
import React, { FC, useRef, useState } from 'react';
import { boolean } from 'yup';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field';
import { CurrencyInputOnChangeValues } from 'react-currency-input-field/dist/components/CurrencyInputProps';

interface TextInputProps {
  id?: string;
  name: string;
  label?: React.ReactNode;
  isLabelOutside?: boolean;
  type: React.InputHTMLAttributes<unknown>['type'];
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
  searchIcon?: string;
  symbol?: string;
  autoComplete?: boolean;
  icon?: string | undefined;
  button?: React.ReactNode;
  searchIconClassName?: string;
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

const TextInput: FC<TextInputProps> = ({
  id,
  name,
  label,
  isLabelOutside = false,
  placeholder,
  prefix,
  type = 'text',
  value,
  error,
  helperText,
  helperTextEnd,
  decimalsLimit = 3,
  decimalScale,
  fixedDecimalLength,
  fullWidth,
  searchIcon,
  symbol,
  icon,
  autoComplete,
  button,
  isInputDisabled,
  searchIconClassName = '',
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
  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // const [isClickingInside, setIsClickingInside] = useState(false);

  const passwordType = isPasswordShowing ? 'text' : 'password';
  const handlePasswordShown = () => {
    inputRef.current?.focus();
    setIsPasswordShowing((prev) => !prev);
  };

  const inputSpacingWithLabel =
    label && !isLabelOutside ? 'pt-[1.625rem] pb-[0.375rem]' : 'py-4';

  return (
    <div
      className={`relative ${fullWidth ? 'w-full' : ''} ${containerClassName}`}
    >
      {!!label && isLabelOutside && (
        <div className={`mb-2 cubic-bezier ssss`}>
          <label
            className={`overflow-hidden text-ellipsis whitespace-nowrap small-caps`}
            onClick={() => {
              inputRef.current?.focus();
            }}
          >
            {label}
          </label>
        </div>
      )}
      {!!label && !isLabelOutside && (
        <label
          className={`cubic-bezier absolute left-0 top-0  ${icon || button ? 'w-[85%]' : 'w-[70%]'
            } overflow-hidden text-ellipsis whitespace-nowrap ${!isInputFocus && !value
              ? 'pl-3 pr-3 py-4 text-base text-ink-40'
              : 'pl-3 pr-3 py-[0.375rem] text-xs text-ink-60'
            }`}
          onClick={() => {
            inputRef.current?.focus();
          }}
        >
          {label}
        </label>
      )}
      {!!searchIcon && (
        <div className="absolute left-3 top-[50%] translate-y-[-50%]">
          <img className={`w-[1.5rem] ${searchIconClassName}`} src={searchIcon} alt="BotLambotrade" />
        </div>
      )}

      <div
        className={`${!searchIcon ? 'pl-3 pr-3' : 'pl-10 pr-3'
          } flex justify-between items-center gap-x-3 rounded-xl ${isInputDisabled
            ? 'border-input-ink bg-ink-10'
            : error
              ? 'border-input-red'
              : isInputFocus || isInputHover
                ? 'border-primary'
                : 'border-input-ink'
          }`}
      >
        <div className="relative z-10 flex-grow flex justify-between items-center">
          {type === 'number' && (
            <CurrencyInput
              id={id}
              name={name}
              autoComplete={autoComplete === true ? 'new-password' : ''}
              className={`${inputSpacingWithLabel} w-full overflow-hidden text-ellipsis whitespace-nowrap bg-transparent caret-yellow-500 focus:outline-none ${!isInputFocus && !value && label && !isLabelOutside
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
              disabled={isInputDisabled}
              allowNegativeValue={false}
              decimalsLimit={decimalsLimit}
              decimalScale={decimalScale}
              fixedDecimalLength={fixedDecimalLength}
              disableAbbreviations={true}
              decimalSeparator="."
              groupSeparator=","
              maxLength={13}
              // intlConfig={{ locale: 'en-US', currency: 'USD' }}
              ref={inputRef}
            />
          )}
          {type !== 'number' && (
            <input
              id={id}
              name={name}
              autoComplete={autoComplete === true ? 'new-password' : ''}
              className={`${inputSpacingWithLabel} w-full overflow-hidden text-ellipsis whitespace-nowrap bg-transparent caret-input focus:outline-none ${!isInputFocus && !value && label && !isLabelOutside
                  ? 'placeholder-transparent'
                  : 'placeholder-ink-20'
                } ${inputClassName}`}
              type={type === 'password' ? passwordType : type}
              value={value}
              placeholder={placeholder}
              onChange={onChange}
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
              disabled={isInputDisabled}
              ref={inputRef}
            />
          )}

          {symbol && (
            <span className={`${inputSpacingWithLabel} ${symbolClassName}`}>
              {symbol}
            </span>
          )}
        </div>

        {((!!value && resetValue) || !!icon || !!button) && (
          <div className="z-10 flex justify-end items-center gap-x-[1.25rem]">
            {!!value && resetValue && (
              <div
                className={`${button || icon ? 'input-icon-seperator' : ''} ${isInputFocus || isInputHover ? 'opacity-100' : 'opacity-50'
                  }`}
                onClick={(e) => {
                  if (resetValue) {
                    resetValue();
                    inputRef.current?.focus();
                  }
                }}
              >
                <Cancel className="w-[1.5rem] !fill-ink-60 cursor-pointer" />
              </div>
            )}
            {!!icon && (
              <div className={`${button ? 'input-icon-seperator' : ''}`}>
                <img
                  className={`w-[1.5rem] cursor-pointer`}
                  src={icon}
                  alt="BotLambotrade"
                  onClick={handlePasswordShown}
                />
              </div>
            )}
            {!!button && <div className="py-[0.375rem]">{button}</div>}
          </div>
        )}
      </div>
      {(!!helperText || !!helperTextEnd) && (
        <div className={`px-3 pt-2 flex justify-between ${helperClassName}`}>
          <p
            className={`${isInputDisabled
                ? 'text-ink-80'
                : error
                  ? 'text-red-100'
                  : 'text-ink-80'
              } text-sm ${helperTextClassName}`}
          >
            {helperText}
          </p>
          <p className={`text-ink-100 text-sm ${helperTextEndClassName}`}>
            {helperTextEnd}
          </p>
        </div>
      )}
    </div>
  );
};

export default TextInput;
