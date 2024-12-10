import { Cancel } from '@mui/icons-material';
import { TextField } from '@mui/material';
import React, { FC, forwardRef, useRef, useState } from 'react';
import { boolean } from 'yup';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field';
import { CurrencyInputOnChangeValues } from 'react-currency-input-field/dist/components/CurrencyInputProps';
import Select, {
  components,
  ActionMeta,
  GroupBase,
  OptionsOrGroups,
  SingleValue,
  StylesConfig,
  ContainerProps,
  InputProps,
  Props,
  IndicatorSeparatorProps,
  IndicatorsContainerProps,
  MenuListProps,
  OptionProps,
  SingleValueProps,
} from 'react-select';
import Control, {
  ControlProps,
} from 'react-select/dist/declarations/src/components/Control';
import images from 'assets';
import TextInput from 'components/TextInput';
import InputSelectOption from 'types/InputSelectOption';

interface SelectInputProps {
  id?: string;
  name: string;
  label?: React.ReactNode;
  isLabelOutside?: boolean;
  placeholder?: string;
  value: InputSelectOption | null;
  options:
    | OptionsOrGroups<InputSelectOption, GroupBase<InputSelectOption>>
    | undefined;
  defaultValue?: InputSelectOption;
  isSelectDisabled?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  helperTextEnd?: React.ReactNode;
  fullWidth?: boolean;
  searchIcon?: string;
  symbol?: string;
  icon?: string | undefined;
  button?: React.ReactNode;
  containerClassName?: string;
  selectContainerClassName?: string;
  inputClassName?: string;
  indicatorContainerClassName?: string;
  indicatorContainerIconClassName?: string;
  symbolClassName?: string;
  helperClassName?: string;
  helperTextClassName?: string;
  helperTextEndClassName?: string;
  menuPortalClassName?: string;
  resetValue?: () => void;
  onChange?:
    | ((
        newValue: SingleValue<InputSelectOption>,
        actionMeta: ActionMeta<InputSelectOption>
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
  // REF
  menuRef?: React.RefObject<HTMLDivElement>;
}

const selectStyles: StylesConfig<InputSelectOption> = {
  control: (styles) => ({
    ...styles,
  }),
};

export interface ColourOption {
  readonly value: string;
  readonly label: string;
}

export const IndicatorsContainer = (
  props: IndicatorsContainerProps<InputSelectOption, false>
) => {
  // @ts-ignore
  const { indicatorContainerClassName, indicatorContainerIconClassName } =
    props.selectProps;
  return (
    <components.IndicatorsContainer
      className={`absolute right-3 top-[50%] translate-y-[-50%] ${indicatorContainerClassName}`}
      {...props}
    >
      <img
        className={`w-[1.5rem] ${indicatorContainerIconClassName}`}
        src={images.input.dropdown}
        alt="Legend Ground"
      />
    </components.IndicatorsContainer>
  );
};

const IndicatorSeparator = ({
  innerProps,
}: IndicatorSeparatorProps<InputSelectOption, false>) => {
  // return <span style={indicatorSeparatorStyle} {...innerProps} />;
  return <></>;
};

const MenuList = (props: MenuListProps<InputSelectOption, false>) => {
  // @ts-ignore
  // prettier-ignore
  const { searchInputIcon, searchInput, searchInputName, searchInputPlaceHolder, 
    // @ts-ignore
    searchInputSymbol, searchInputResetValue, searchInputError, searchInputHelperText } = props.selectProps;

  return (
    <components.MenuList {...props}>
      {searchInput && (
        <TextInput
          searchIcon={searchInputIcon}
          name={searchInputName}
          value={searchInput}
          placeholder={searchInputPlaceHolder}
          symbol={searchInputSymbol}
          resetValue={searchInputResetValue}
          error={searchInputError}
          helperText={searchInputHelperText}
          type="search"
        />
      )}
      {props.children}
      {/* <div className="max-h-[39.5rem] overflow-y-auto"></div> */}
    </components.MenuList>
  );
};

const Option = (props: OptionProps<InputSelectOption>) => {
  // const { value, options, isOptionSelected } = props.selectProps;
  const { isSelected, data, selectOption } = props;
  const optionRef = useRef<HTMLDivElement | null>(null);
  // console.log('isSelected', isSelected);
  // console.log('data', data);
  return (
    <components.Option
      {...props}
      className={`!px-4 w-fit border-select-input-two select-input-hover ${
        isSelected ? 'bg-primary-05 !bg-inherit' : ''
      } !cursor-pointer`}
    >
      <div
        className="py-4 flex items-center justify-between"
      >
        <p
          className={`${
            isSelected
              ? 'bg-primary-100 !bg-clip-text !text-transparent'
              : 'text-ink-100'
          }`}
        >
          {props.children}
        </p>
        {isSelected && (
          <img
            className="w-[1.5rem]"
            src={images.input.gold_checkbox}
            alt="BotLambotrade"
          />
        )}
      </div>
    </components.Option>
  );
};

const SelectInput: FC<SelectInputProps> = forwardRef(
  (
    {
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
      options,
      defaultValue,
      searchIcon,
      symbol,
      icon,
      button,
      isSelectDisabled,
      containerClassName = '',
      selectContainerClassName = '',
      inputClassName = '',
      indicatorContainerClassName = '',
      indicatorContainerIconClassName = '',
      symbolClassName = '',
      helperClassName = '',
      helperTextClassName = '',
      helperTextEndClassName = '',
      menuPortalClassName = '',
      resetValue,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      onKeyUp,
      onMouseOver,
      onMouseLeave,
      menuRef,
    },
    ref
  ) => {
    const [isSelectFocus, setIsSelectFocus] = useState(false);
    const [isSelectHover, setIsSelectHover] = useState(false);
    const [isPasswordShowing, setIsPasswordShowing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    // const [isClickingInside, setIsClickingInside] = useState(false);

    const passwordType = isPasswordShowing ? 'text' : 'password';
    const handlePasswordShown = () => {
      // @ts-ignore
      inputRef.current?.focus();
      setIsPasswordShowing((prev) => !prev);
    };

    const inputSpacingWithLabel = label
      ? 'pt-[1.625rem] pb-[0.375rem]'
      : 'py-3';

    return (
      <div
        className={`relative ${
          fullWidth ? 'w-full' : ''
        } ${containerClassName} ${
          isSelectDisabled ? 'cursor-not-allowed' : ''
        }`}
      >
        {!!label && !isLabelOutside && (
          <label
            className={`cubic-bezier absolute left-0 top-0  ${
              icon || button ? 'w-[85%]' : 'w-[70%]'
            } overflow-hidden text-ellipsis whitespace-nowrap ${
              !isSelectFocus && !value && value !== 0
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
        <div
          onMouseOver={() => {
            setIsSelectHover(true);
          }}
          onMouseLeave={() => {
            setIsSelectHover(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Select
            // defaultValue={value}
            value={value}
            id={id}
            name={name}
            options={options}
            // @ts-ignore
            ref={inputRef}
            menuPortalTarget={document.body}
            indicatorContainerClassName={indicatorContainerClassName}
            indicatorContainerIconClassName={indicatorContainerIconClassName}
            menuPlacement="auto"
            // menuPosition="fixed"
            // menuIsOpen={true}
            classNames={{
              container: (state) => {
                return `relative ${selectContainerClassName}`;
              },
              control: (state) => {
                return `${inputSpacingWithLabel} relative w-full !overflow-hidden !text-ellipsis !whitespace-nowrap !bg-transparent !caret-yellow-500 !focus:outline-none ${
                  !searchIcon ? '!pl-3 !pr-[2.875rem]' : '!pl-8 !pr-[2.875rem]'
                } !rounded-xl ${
                  isSelectDisabled
                    ? 'border-input-ink !bg-ink-10'
                    : error
                    ? 'border-input-red'
                    : isSelectFocus || isSelectHover
                    ? 'border-primary'
                    : 'border-input-ink'
                } !border-0 !shadow-none ${inputClassName} !cursor-pointer`;
                // return `${inputSpacingWithLabel} w-full overflow-hidden text-ellipsis whitespace-nowrap !bg-transparent caret-input focus:outline-none ${
                //   !isSelectDisabled && !value && label
                //     ? 'placeholder-transparent'
                //     : 'placeholder-ink-20'
                // } ${inputClassName}`;
              },
              valueContainer: (state) => {
                return `!p-0`;
              },
              singleValue: (state) => {
                return `!m-0 !text-ink-100`;
              },
              placeholder: (state) => {
                return `!m-0 ${
                  !isSelectFocus && !value && label && !isLabelOutside
                    ? '!text-transparent'
                    : '!text-ink-20'
                }`;
              },
              menu: (state) => {
                return `my-2 py-4 !overflow-hidden !rounded-2xl !bg-dropdown shadow-popup `;
              },
              menuList: (state) => {
                return `!p-0`;
              },
              menuPortal: (state) => {
                return `!z-[20000] ${menuPortalClassName}`;
              },
            }}
            unstyled
            isOptionSelected={(option, options) => {
              return options[0]?.value === option?.value;
            }}
            components={{
              IndicatorSeparator,
              IndicatorsContainer,
              MenuList,
              Option,
            }}
            openMenuOnFocus={true}
            onChange={(option, actionMeta) => {
              if (onChange) {
                onChange(option, actionMeta);
              }
              setIsSelectFocus(false);
              setIsSelectHover(false);
            }}
            onBlur={(e) => {
              if (onBlur) {
                onBlur(e);
              }
              setIsSelectFocus(false);
            }}
            onFocus={(e) => {
              if (onFocus) {
                onFocus(e);
              }
              setIsSelectFocus(true);
            }}
            isSearchable={false}
            isDisabled={isSelectDisabled}
          />
        </div>
        {/* <div
        className={`relative ${
          fullWidth ? 'w-full' : ''
        } ${containerClassName}`}
      >
        {!!label && (
          <label
            className={`cubic-bezier -z-10 absolute left-0 top-0 w-[70%] overflow-hidden text-ellipsis whitespace-nowrap ${
              !isInputFocus && !value && value !== 0
                ? 'px-3 py-4 text-base text-ink-40'
                : 'px-3 py-[0.375rem] text-xs text-ink-60'
            }`}
          >
            {label}
          </label>
        )}

        <div
          className={`px-3 flex justify-between items-center gap-x-3 rounded-xl ${
            isSelectDisabled
              ? 'border-input-ink bg-ink-10'
              : error
              ? 'border-input-red'
              : isInputFocus
              ? 'border-primary'
              : 'border-input-ink'
          } `}
        ></div>
      </div> */}
        {(!!helperText || !!helperTextEnd) && (
          <div className={`px-3 pt-2 flex justify-between ${helperClassName}`}>
            <p
              className={`${
                isSelectDisabled
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
  }
);

export default SelectInput;
