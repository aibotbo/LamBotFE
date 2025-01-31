import { FC } from 'react';
import { ISvgIcon } from 'types';

const MenuVIPSvg: FC<ISvgIcon> = ({
  width = '24',
  height = '25',
  fill = 'none',
  className = '',
}) => {
  return (
    <>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 25"
        fill={fill}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 2.20215C3.79086 2.20215 2 3.99301 2 6.20215V18.2021C2 20.4113 3.79086 22.2021 6 22.2021H18C20.2091 22.2021 22 20.4113 22 18.2021V6.20215C22 3.99301 20.2091 2.20215 18 2.20215H6ZM6.34863 15.248H8.16504L10.5137 8.20215H8.85352L7.30078 13.6074H7.21289L5.65527 8.20215H4L6.34863 15.248ZM11.7197 15.248H13.1943V8.20215H11.7197V15.248ZM16.3779 15.248H14.9033V8.20215H17.8086C19.293 8.20215 20.2842 9.15918 20.2842 10.6094V10.6191C20.2842 12.0693 19.293 13.0264 17.8086 13.0264H16.3779V15.248ZM18.79 10.6143C18.79 9.81348 18.292 9.36914 17.4473 9.36914H16.3779V11.874H17.4473C18.292 11.874 18.79 11.4248 18.79 10.624V10.6143Z"
          fill="url(#paint0_linear_1628_4436)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1628_4436"
            x1="2"
            y1="12.2029"
            x2="22"
            y2="12.2029"
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

export default MenuVIPSvg;
