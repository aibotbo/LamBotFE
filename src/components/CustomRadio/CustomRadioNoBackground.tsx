import React, { FC } from 'react';

interface CustomRadioNoBackgroundProps {
  checked: boolean;
  label: string;
  containerClassName?: string;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const CustomRadioNoBackground: FC<CustomRadioNoBackgroundProps> = ({
  checked,
  label,
  containerClassName = '',
  onClick,
}) => {
  return (
    <div
      className={`flex items-center gap-x-[0.625rem] rounded-xl cursor-pointer ${containerClassName}`}
      onClick={onClick}
    >
      <div className="p-[0.125rem]">
        <div
          className={`p-[0.3125rem] flex items-center justify-center z-[100] ${
            checked ? 'border-radio-primary' : 'border-radio-ink'
          }`}
        >
          <div
            className={`rounded-full w-[0.625rem] h-[0.625rem] ${
              checked ? 'bg-primary-100' : ''
            }`}
          />
        </div>
      </div>
      <label className={`text-ink-100 cursor-pointer select-none`}>{label}</label>
    </div>
  );
};

export default CustomRadioNoBackground;
