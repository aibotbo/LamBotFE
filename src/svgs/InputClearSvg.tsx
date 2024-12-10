import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const InputClearSvg: FC<ISvgIcon> = ({
  width = '24',
  height = '24',
  fill = 'white',
  fillOpacity = 0.6,
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM8.19526 15.8047C7.93491 15.5444 7.93491 15.1223 8.19526 14.8619L11.0572 12L8.19526 9.13807C7.93491 8.87772 7.93491 8.45561 8.19526 8.19526C8.45561 7.93491 8.87772 7.93491 9.13807 8.19526L12 11.0572L14.8619 8.19526C15.1223 7.93491 15.5444 7.93491 15.8047 8.19526C16.0651 8.45561 16.0651 8.87772 15.8047 9.13807L12.9428 12L15.8047 14.8619C16.0651 15.1223 16.0651 15.5444 15.8047 15.8047C15.5444 16.0651 15.1223 16.0651 14.8619 15.8047L12 12.9428L9.13807 15.8047C8.87772 16.0651 8.45561 16.0651 8.19526 15.8047Z"
        fill={fill}
        fillOpacity={fillOpacity}
      />
    </svg>
  );
};

export default InputClearSvg;
