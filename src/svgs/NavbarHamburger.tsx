import React, { FC } from 'react';
import { ISvgIcon } from 'types';

const NavbarHamburger: FC<ISvgIcon> = ({
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
        d="M4 7.03924C4 6.46528 4.45997 6 5.02738 6H18.9726C19.54 6 20 6.46528 20 7.03924C20 7.6132 19.54 8.07848 18.9726 8.07848H5.02738C4.45997 8.07848 4 7.6132 4 7.03924Z"
        fill={fill}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 11.797C4 11.2231 4.45997 10.7578 5.02738 10.7578H18.9726C19.54 10.7578 20 11.2231 20 11.797C20 12.371 19.54 12.8363 18.9726 12.8363H5.02738C4.45997 12.8363 4 12.371 4 11.797Z"
        fill={fill}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 16.9608C4 16.3868 4.45997 15.9215 5.02738 15.9215H18.9726C19.54 15.9215 20 16.3868 20 16.9608C20 17.5347 19.54 18 18.9726 18H5.02738C4.45997 18 4 17.5347 4 16.9608Z"
        fill={fill}
      />
    </svg>
  );
};

export default NavbarHamburger;
