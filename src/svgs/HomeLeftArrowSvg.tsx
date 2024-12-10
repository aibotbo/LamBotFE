import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const HomeLeftArrowSvg: FC<ISvgIcon> = ({
  width = '20',
  height = '20',
  fill = 'none',
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill={fill}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.16634 9.33333L12.9997 2.75C13.1663 2.58333 13.333 2.5 13.583 2.5C14.083 2.5 14.4163 2.91667 14.4163 3.33333C14.4163 3.58333 14.333 3.75 14.1663 3.91667L7.91634 10L14.1663 16C14.333 16.1667 14.4163 16.4167 14.4163 16.6667C14.4163 17.1667 13.9997 17.5 13.583 17.5C13.333 17.5 13.1663 17.4167 12.9997 17.25L6.16634 10.6667C5.99967 10.5 5.83301 10.25 5.83301 10C5.83301 9.75 5.99967 9.5 6.16634 9.33333Z"
        fill="url(#paint0_linear_1705_107914)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1705_107914"
          x1="5.83301"
          y1="10.0005"
          x2="14.4163"
          y2="10.0005"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AB6E19" />
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
  );
};

export default HomeLeftArrowSvg;
