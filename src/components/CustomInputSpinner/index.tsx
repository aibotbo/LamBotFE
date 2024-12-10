import images from 'assets';
import React, { FC, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import TextInput from 'components/TextInput';
import { CurrencyInputOnChangeValues } from 'react-currency-input-field/dist/components/CurrencyInputProps';
import CustomButton from 'components/CustomButton';

interface CustomInputSpinnerProps {
  // Text Input props
  id?: string;
  name: string;
  label?: React.ReactNode;
  isLabelOutside?: boolean;
  placeholder?: string;
  value: string | number | readonly string[] | undefined;
  error?: boolean;
  helperText?: React.ReactNode;
  helperTextEnd?: React.ReactNode;
  fullWidth?: boolean;
  searchIcon?: string;
  symbol?: string;
  prefix?: string;
  icon?: string | undefined;
  button?: React.ReactNode;
  isInputDisabled?: boolean;
  PREFIX_VALUE?: string;
  VALUES?: (string | number)[];
  inputSpinnerWrapperClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
  symbolClassName?: string;
  helperClassName?: string;
  helperTextClassName?: string;
  helperTextEndClassName?: string;
  resetValue?: () => void;
  onFixedValueChange: (value: string | number) => void;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  handleValueMinusOne: () => void;
  handleValuePlusOne: () => void;
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

const CustomInputSpinner: FC<CustomInputSpinnerProps> = ({
  id,
  name,
  label,
  isLabelOutside = false,
  placeholder,
  value,
  error,
  helperText,
  helperTextEnd,
  fullWidth,
  searchIcon,
  symbol,
  icon,
  button,
  isInputDisabled,
  prefix = '$ ',
  PREFIX_VALUE = '+',
  VALUES = [],
  inputSpinnerWrapperClassName = '',
  containerClassName = '',
  inputClassName = '',
  symbolClassName = '',
  helperClassName = '',
  helperTextClassName = '',
  helperTextEndClassName = '',
  onFixedValueChange,
  resetValue,
  onChange,
  handleValueMinusOne,
  handleValuePlusOne,
  onValueChange,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  onMouseOver,
  onMouseLeave,
}) => {
  const [isMinusFocus, setIsMinusFocus] = useState(false);
  const [isPlusFocus, setIsPlusFocus] = useState(false);
  // border border-ink-20 hover:bg-ink-20 hover:border-ink-10

  return (
    <div>
      {/* INPUT */}
      <div
        className={`flex justify-between gap-x-3 ${inputSpinnerWrapperClassName}`}
      >
        <div
          onClick={handleValueMinusOne}
          className={`p-3 flex-shrink-0 flex items-center justify-center rounded-xl text-ink-60 cursor-pointer ${
            isMinusFocus ? 'border-primary' : 'border-input-ink bg-ink-05'
          }`}
          onMouseOver={(e) => {
            setIsMinusFocus(true);
          }}
          onMouseLeave={(e) => {
            setIsMinusFocus(false);
          }}
        >
          {isMinusFocus ? (
            <img
              className="w-[2rem]"
              src={images.input.minus_gold}
              alt="BotLambotrade"
            />
          ) : (
            <img
              className="w-[2rem]"
              src={images.input.minus}
              alt="BotLambotrade"
            />
          )}
        </div>
        <TextInput
          containerClassName="flex-grow font-bold"
          id={id}
          name={name}
          label={label}
          type="number"
          value={value}
          onValueChange={onValueChange}
          placeholder={placeholder}
          prefix={prefix}
          inputClassName="!py-[0.875rem] text-center text-xl"
          fullWidth={true}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          // containerClassName="w-[25rem]"
          // icon={images.input.eye}
          // button={<CustomButton>Button</CustomButton>}
        />
        <div
          onClick={handleValuePlusOne}
          className={`p-3 flex-shrink-0 flex items-center justify-center rounded-xl cursor-pointer ${
            isPlusFocus ? 'border-primary' : 'border-input-ink'
          }`}
          onMouseOver={(e) => {
            setIsPlusFocus(true);
          }}
          onMouseLeave={(e) => {
            setIsPlusFocus(false);
          }}
        >
          <img
            className="w-[2rem]"
            src={images.copy.plus_gold}
            alt="BotLambotrade"
          />
        </div>
      </div>

      {/* BUTTON */}
      {VALUES.length > 0 && (
        <div className="mt-4 grid grid-flow-col auto-cols-fr gap-x-2">
          {VALUES.map((value, index) => {
            let renderText;
            if (typeof value === 'string') {
              renderText = value;
            } else {
              renderText = PREFIX_VALUE + value;
            }
            return (
              <div
                key={index * Math.random() * 100}
                className="flex-grow xl:px-3 xl:py-3 px-2 py-2 text-center bg-ink-05 hover:bg-ink-20 text-ink-100 rounded-xl cursor-pointer"
                onClick={() => {
                  if (onFixedValueChange) {
                    onFixedValueChange(value);
                  }
                }}
              >
                {renderText}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomInputSpinner;
