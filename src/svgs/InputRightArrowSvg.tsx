import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const InputRightArrowSvg: FC<ISvgIcon> = ({
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
        d="M16.003 9.5672C15.6595 9.22373 15.6595 8.66334 16.003 8.31987C16.1693 8.15356 16.3862 8.0704 16.6248 8.0704C16.8635 8.0704 17.084 8.16441 17.2503 8.33072L20.3343 11.4147C20.497 11.5774 20.591 11.8016 20.591 12.0329V12.0402C20.591 12.2679 20.497 12.4957 20.3343 12.6584L17.2503 15.7424C16.9068 16.0859 16.3465 16.0859 16.003 15.7424C15.8331 15.5761 15.7427 15.3519 15.7427 15.1169C15.7427 14.8783 15.8367 14.6578 16.003 14.4915L17.5902 12.9079H4.28529C3.80082 12.9079 3.40674 12.5102 3.40674 12.0257C3.40674 11.5412 3.80082 11.1472 4.28529 11.1472H17.5902L16.003 9.5672Z"
        fill={fill}
      />
    </svg>
  );
};

export default InputRightArrowSvg;
