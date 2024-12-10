import images from 'assets';
import CustomButton from 'components/CustomButton';
import SelectInput from 'components/SelectInput';
import TextInput from 'components/TextInput';
import React, { useState } from 'react';
import {
  CurrencyInputOnChangeValues,
  CurrencyInputProps,
} from 'react-currency-input-field/dist/components/CurrencyInputProps';
import { Helmet } from 'react-helmet-async';
import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import InputSelectOption from '../../types/InputSelectOption';
import moment, { Moment } from 'moment';
import CustomDatePicker from 'components/CustomDatePicker';
import { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro';
import CustomRangePickerV2 from 'components/CustomDatePickerV2';
import CustomInputSpinner from 'components/CustomInputSpinner';
import convertToThreeDecimalPlaces from 'utils/ConvertToThreeDecimalPlaces';

const TEST_OPTIONS: InputSelectOption[] = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AS', label: 'American Samoa' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
];

const Test = () => {
  const [testValue, setTestValue] = useState('');
  const [selectedOption, setSelectedOption] =
    useState<InputSelectOption | null>(null);
  const [testNumber, setTestNumber] = useState<string | number | undefined>();
  const [date, setDate] = useState<DateRange<Dayjs>>([null, null]);
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);

  const [spinnerValue, setSpinnerValue] = useState<string | number>(0);
  // const [endDate, setEndDate] = useState<Moment | null>(
  //   moment().add(5, 'days')
  // );
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');

  const handleTestValueChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setTestValue(e.target.value);
  };

  const resetValue = () => {
    setTestValue('');
  };

  const handleNumber = (
    value: string | undefined,
    name: string | undefined,
    values: CurrencyInputOnChangeValues | undefined
  ): void => {
    const valueToSet = value === undefined ? value : +value <= 0 ? 0 : +value;
    setTestNumber(valueToSet);
  };

  const resetNumber = () => {
    setTestNumber('');
  };

  const handleSelect = (
    option: SingleValue<InputSelectOption>,
    actionMeta: ActionMeta<InputSelectOption>
  ) => {
    console.log(option);
    if (option?.value == null) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
  };

  // const onStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value);
  //   setDate(e.target.value);
  // };

  // const onEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value);
  //   setEndDate(e.target.value);
  // };

  const onDateChange = (
    date: DateRange<Dayjs>,
    keyboardInputValue?: string | undefined
  ) => {
    console.log(date);
    console.log(keyboardInputValue);
    setDate(date);
    setIsDateOpen(false);
  };

  const handleToggleIsDateOpen = () => {
    setIsDateOpen((prev) => !prev);
  };

  const handleOnDateOpen = () => {
    setIsDateOpen(true);
  };

  const handleOnDateCLose = () => {
    setIsDateOpen(false);
  };

  // INPUT SPINNER
  const handleInputSpinnerPlusOne = () => {
    if (+spinnerValue >= 100) {
      setSpinnerValue(100);
    } else {
      setSpinnerValue((prev) => +prev + 1);
    }
  };

  const handleInputSpinnerMinusOne = () => {
    if (+spinnerValue - 1 <= 1) {
      setSpinnerValue(1);
    } else {
      setSpinnerValue((prev) => +prev - 1);
    }
  };

  const onSpinnerValueChange: CurrencyInputProps['onValueChange'] = (
    value,
    _,
    values
  ): void => {
    const valueToSet = value === undefined ? '' : value;
    const convertedValue = convertToThreeDecimalPlaces(valueToSet);
    setSpinnerValue(convertedValue);
  };

  return (
    <>
      <Helmet>
        <title>BotLambotrade | Test</title>
      </Helmet>
      <div className="relative">
        <div className="grid grid-cols-3">
          <TextInput
            // id="test"
            name="test"
            label="Label name"
            type="text"
            value={testValue}
            onChange={handleTestValueChange}
            resetValue={resetValue}
            placeholder="Hint text"
            error={false}
            // isInputDisabled={true}
            helperText="Test"
            helperTextEnd="0/20"
            containerClassName="w-[25rem]"
            inputClassName="!text-xl font-bold placeholder:text-base placeholder:font-semibold"
            symbol="$"
            // icon={images.input.eye}
            // button={<CustomButton>Button</CustomButton>}
          />
          <TextInput
            name="test_number"
            label="Label name"
            type="number"
            value={testNumber}
            onValueChange={handleNumber}
            resetValue={resetNumber}
            placeholder="Hint text"
            // error={true}
            // isInputDisabled={true}
            helperText="Help text"
            containerClassName="w-[25rem]"
            inputClassName=""
            symbol="$"
            icon={images.input.eye}
            button={<CustomButton>Button</CustomButton>}
          />
          <SelectInput
            value={selectedOption}
            onChange={handleSelect}
            label="Hint text"
            error={true}
            helperText="Error message"
            name="select"
            options={TEST_OPTIONS}
          />
          <TextInput
            // id="test"
            name="test"
            // label="Label name"
            type="password"
            value={testValue}
            onChange={handleTestValueChange}
            // resetValue={resetValue}
            placeholder="Hint text"
            // error={true}
            // isInputDisabled={true}
            helperText="Help text"
            containerClassName="w-[25rem]"
            inputClassName="x"
            // symbol="$"
            icon={images.input.eye}
            button={<CustomButton>Button</CustomButton>}
          />
          {/* <CustomDatePicker
            calendars={2}
            value={date}
            onDateChange={onDateChange}
            isOpen={isDateOpen}
            handleToggleOpen={handleToggleIsDateOpen}
            handleOnOpen={handleOnDateOpen}
            handleOnClose={handleOnDateCLose}
          /> */}
          <CustomRangePickerV2
            placeholder={['Từ Ngày', 'Đến ngày']}
            fullWidth
          />
        </div>

        {/* <CustomInputSpinner
          id="test-input-spinner"
          name="test-input-spinner"
          value={spinnerValue}
          handleValueMinusOne={handleInputSpinnerMinusOne}
          handleValuePlusOne={handleInputSpinnerPlusOne}
          onValueChange={onSpinnerValueChange}
        /> */}
      </div>
    </>
  );
};

export default Test;
