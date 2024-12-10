import { FC } from 'react';
import { ISvgIcon } from 'types';

const MenuHouseSvg: FC<ISvgIcon> = ({
  width = '24',
  height = '25',
  fill = '#0F0E0C',
  className = '',
  fillOpacity = '1'
}) => {
  return (
    <>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M9.13478 20.9755V17.9178C9.13478 17.1372 9.77217 16.5045 10.5584 16.5045H13.4326C13.8102 16.5045 14.1723 16.6534 14.4393 16.9184C14.7063 17.1835 14.8563 17.5429 14.8563 17.9178V20.9755C14.8539 21.3 14.9821 21.612 15.2124 21.8423C15.4427 22.0726 15.7561 22.2021 16.0829 22.2021H18.0438C18.9596 22.2045 19.8388 21.845 20.4872 21.203C21.1356 20.5609 21.5 19.6891 21.5 18.78V10.069C21.5 9.33461 21.1721 8.63799 20.6046 8.16682L13.934 2.87802C12.7737 1.95071 11.1111 1.98065 9.98539 2.94913L3.46701 8.16682C2.87274 8.6241 2.51755 9.32278 2.5 10.069V18.7711C2.5 20.666 4.04738 22.2021 5.95617 22.2021H7.87229C8.55123 22.2022 9.103 21.6584 9.10792 20.9844L9.13478 20.9755Z"
          fill={fill}
          fillOpacity={fillOpacity}
        />
      </svg>
    </>
  );
};

export default MenuHouseSvg;
