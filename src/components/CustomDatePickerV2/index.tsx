import { DatePicker } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import React, { FC } from "react";
import InputClearSvg from "svgs/InputClearSvg";
import InputDatePickerSeperatorSvg from "svgs/InputDatePickerSeperatorSvg";
import InputDatePickerSuffixSvg from "svgs/InputDatePickerSuffixSvg";
import { twMerge } from "tailwind-merge";
import "./CustomRangePickerV2.scss";

const dateFormat = "DD/MM/YYYY";

interface CustomRangePickerV2Props {
  placeholder: [string, string];
  fullWidth?: boolean;
  className?: string;
}

const CustomRangePickerV2: FC<CustomRangePickerV2Props> = ({
  placeholder,
  fullWidth = false,
  className,
}) => {
  const { RangePicker } = DatePicker;

  const onChange: RangePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <div
      className={twMerge(`relative`, `${fullWidth} ? "w-full" : ""`, className)}
    >
      <RangePicker
        className="custom-range-picker border-input-ink"
        popupClassName="popuptest"
        dropdownClassName="dropdowntest"
        format={dateFormat}
        onChange={onChange}
        placeholder={placeholder}
        separator={<InputDatePickerSeperatorSvg />}
        // <img src={images.input.date_picker_arrow} alt="BotLambotrade" />
        placement="bottomLeft"
        suffixIcon={<InputDatePickerSuffixSvg className="text-ink-100" />}
        clearIcon={<InputClearSvg className="text-ink-60" />}
      />
    </div>
  );
};

export default CustomRangePickerV2;
