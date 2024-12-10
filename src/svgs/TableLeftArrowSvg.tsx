import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const TableLeftArrowSvg: FC<ISvgIcon> = ({
  width = '24',
  height = '24',
  fill = '#0F0E0C',
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.1109 4.91668C15.6778 4.50425 14.9757 4.50425 14.5426 4.91668L7.88924 11.2533C7.45619 11.6657 7.45619 12.3344 7.88924 12.7468L14.5426 19.0834C14.9757 19.4958 15.6778 19.4958 16.1109 19.0834C16.5439 18.6709 16.5439 18.0022 16.1109 17.5898L10.2416 12L16.1109 6.41023C16.5439 5.9978 16.5439 5.32911 16.1109 4.91668Z"
        fill={fill}
      />
    </svg>
  );
};

export default TableLeftArrowSvg;
