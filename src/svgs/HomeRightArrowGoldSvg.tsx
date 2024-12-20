import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const HomeRightArrowGoldSvg: FC<ISvgIcon> = ({
  width = '20',
  height = '20',
  fill = 'none',
  className = '',
}) => {
  return (
    <>
      <svg
        width={width}
        height={height}
        viewBox="0 0 20 20"
        fill={fill}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.8337 9.33333L7.00033 2.75C6.83366 2.58333 6.66699 2.5 6.41699 2.5C5.91699 2.5 5.58366 2.91667 5.58366 3.33333C5.58366 3.58333 5.66699 3.75 5.83366 3.91667L12.0837 10L5.83366 16C5.66699 16.1667 5.58366 16.4167 5.58366 16.6667C5.58366 17.1667 6.00032 17.5 6.41699 17.5C6.66699 17.5 6.83366 17.4167 7.00033 17.25L13.8337 10.6667C14.0003 10.5 14.167 10.25 14.167 10C14.167 9.75 14.0003 9.5 13.8337 9.33333Z"
          fill="url(#paint0_linear_1705_107916)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1705_107916"
            x1="14.167"
            y1="10.0005"
            x2="5.58366"
            y2="10.0005"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#AB6E19" />
            <stop offset="0.01" stop-color="#B47B23" />
            <stop offset="0.06" stop-color="#CDA243" />
            <stop offset="0.121891" stop-color="#E2C15B" />
            <stop offset="0.171403" stop-color="#F0D76D" />
            <stop offset="0.232867" stop-color="#F9E477" />
            <stop offset="0.306282" stop-color="#FCE97B" />
            <stop offset="0.39399" stop-color="#F9E475" />
            <stop offset="0.504894" stop-color="#EFD665" />
            <stop offset="0.635883" stop-color="#E0C04B" />
            <stop offset="0.74" stop-color="#E8C853" />
            <stop offset="0.808788" stop-color="#FCE97B" />
            <stop offset="0.87" stop-color="#F8E475" />
            <stop offset="0.9" stop-color="#EED465" />
            <stop offset="0.94" stop-color="#DDBB4B" />
            <stop offset="0.98" stop-color="#C59826" />
            <stop offset="1" stop-color="#BA8916" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};

export default HomeRightArrowGoldSvg;
