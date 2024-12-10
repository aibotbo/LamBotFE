import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const InputDatePickerSeperatorSvg: FC<ISvgIcon> = ({
  width = '24',
  height = '24',
  fill = 'white',
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.0032 9.5672C15.6598 9.22373 15.6598 8.66334 16.0032 8.31987C16.1695 8.15356 16.3865 8.0704 16.6251 8.0704C16.8637 8.0704 17.0842 8.16441 17.2506 8.33072L20.3345 11.4147C20.4972 11.5774 20.5912 11.8016 20.5912 12.0329V12.0402C20.5912 12.2679 20.4972 12.4957 20.3345 12.6584L17.2506 15.7424C16.9071 16.0859 16.3467 16.0859 16.0032 15.7424C15.8333 15.5761 15.7429 15.3519 15.7429 15.1169C15.7429 14.8783 15.8369 14.6578 16.0032 14.4915L17.5904 12.9079H4.28554C3.80107 12.9079 3.40698 12.5102 3.40698 12.0257C3.40698 11.5412 3.80107 11.1472 4.28554 11.1472H17.5904L16.0032 9.5672Z"
        fill={fill}
      />
    </svg>
  );
};

export default InputDatePickerSeperatorSvg;
