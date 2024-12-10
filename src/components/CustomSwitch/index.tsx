import React, { FC } from 'react';
import ReactSwitch from 'react-switch';

interface CustomSwitchProps {
  onChange: (
    checked: boolean,
    event: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent, Event>,
    id: string
  ) => void;
  checked: boolean;
}

const CustomSwitch: FC<CustomSwitchProps> = ({ onChange, checked }) => {
  return (
    <ReactSwitch
      onChange={onChange}
      checkedIcon={
        <div className="h-full flex justify-center items-center text-xs bg-background-100 bg-clip-text text-transparent font-medium">
          Bật
        </div>
      }
      uncheckedIcon={
        <div className="h-full flex justify-center items-center text-xs text-ink-40 font-medium">
          Tắt
        </div>
      }
      checked={checked}
      className="react-switch"
    />
  );
};

export default CustomSwitch;
