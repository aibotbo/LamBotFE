import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const TableCancelSvg: FC<ISvgIcon> = ({
  width = '32',
  height = '32',
  fill = 'white',
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill={fill}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.39052 21.7239C7.86983 22.2446 7.86983 23.0888 8.39052 23.6095C8.91122 24.1302 9.75544 24.1302 10.2761 23.6095L16 17.8856L21.7239 23.6095C22.2446 24.1302 23.0888 24.1302 23.6095 23.6095C24.1302 23.0888 24.1302 22.2446 23.6095 21.7239L17.8856 16L23.6095 10.2761C24.1302 9.75544 24.1302 8.91122 23.6095 8.39052C23.0888 7.86983 22.2446 7.86983 21.7239 8.39052L16 14.1144L10.2761 8.39053C9.75544 7.86983 8.91122 7.86983 8.39052 8.39053C7.86983 8.91122 7.86983 9.75544 8.39052 10.2761L14.1144 16L8.39052 21.7239Z"
        fill={fill}
      />
    </svg>
  );
};

export default TableCancelSvg;
