import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const CopyTelegramUpSvg: FC<ISvgIcon> = ({
  width = '24',
  height = '24',
  fill = 'white',
  className = '',
  onClick = () => {},
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.0741 16.106C19.4861 15.6735 19.4861 14.9723 19.0741 14.5398L12.7455 7.8947C12.3336 7.46218 11.6657 7.46218 11.2538 7.8947L4.92515 14.5398C4.51323 14.9723 4.51323 15.6735 4.92515 16.106C5.33706 16.5386 6.00491 16.5386 6.41683 16.106L11.9996 10.2441L17.5825 16.106C17.9944 16.5386 18.6622 16.5386 19.0741 16.106Z"
        fill={fill}
      />
    </svg>
  );
};

export default CopyTelegramUpSvg;
