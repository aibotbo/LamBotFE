import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const TableRightArrowSvg: FC<ISvgIcon> = ({
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
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.88912 4.91668C8.32217 4.50425 9.02429 4.50425 9.45734 4.91668L16.1107 11.2533C16.5438 11.6657 16.5438 12.3344 16.1107 12.7468L9.45734 19.0834C9.02429 19.4958 8.32217 19.4958 7.88912 19.0834C7.45607 18.6709 7.45607 18.0022 7.88912 17.5898L13.7584 12L7.88912 6.41023C7.45607 5.9978 7.45607 5.32911 7.88912 4.91668Z"
        fill={fill}
      />
    </svg>
  );
};

export default TableRightArrowSvg;
