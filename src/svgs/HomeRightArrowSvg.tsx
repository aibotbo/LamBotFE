import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const HomeRightArrowSvg: FC<ISvgIcon> = ({
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
        d="M7.8947 19.0744C8.32721 19.4863 9.02845 19.4863 9.46096 19.0744L16.106 12.7457C16.5386 12.3338 16.5386 11.6659 16.106 11.254L9.46096 4.92537C9.02845 4.51345 8.32721 4.51345 7.8947 4.92537C7.46219 5.33729 7.46219 6.00513 7.8947 6.41705L13.7567 11.9999L7.8947 17.5827C7.46218 17.9946 7.46218 18.6624 7.8947 19.0744Z"
        fill={fill}
      />
    </svg>
  );
};

export default HomeRightArrowSvg;
