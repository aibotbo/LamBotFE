import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const CopyTelegramDownSvg: FC<ISvgIcon> = ({
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
        d="M4.92564 7.8947C4.51372 8.32721 4.51372 9.02845 4.92564 9.46096L11.2543 16.106C11.6662 16.5386 12.3341 16.5386 12.746 16.106L19.0746 9.46096C19.4865 9.02845 19.4865 8.32721 19.0746 7.8947C18.6627 7.46219 17.9949 7.46219 17.583 7.8947L12.0001 13.7567L6.41732 7.8947C6.0054 7.46218 5.33755 7.46218 4.92564 7.8947Z"
        fill={fill}
      />
    </svg>
  );
};

export default CopyTelegramDownSvg;
