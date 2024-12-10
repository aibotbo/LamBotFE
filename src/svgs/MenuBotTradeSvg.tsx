import { FC } from 'react';
import { ISvgIcon } from 'types';

const MenuBotTradeSvg: FC<ISvgIcon> = ({
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
          d="M14.6926 6.66535H5.58843C5.22633 6.66576 4.87918 6.80979 4.62313 7.06583C4.36709 7.32187 4.22306 7.66903 4.22266 8.03113V19.1355C4.22306 19.4976 4.36709 19.8448 4.62313 20.1008C4.87918 20.3569 5.22633 20.5009 5.58843 20.5013H14.6926C15.0547 20.5009 15.4018 20.3569 15.6579 20.1008C15.9139 19.8448 16.0579 19.4976 16.0583 19.1355V8.03113C16.0579 7.66903 15.9139 7.32187 15.6579 7.06583C15.4018 6.80979 15.0547 6.66576 14.6926 6.66535Z"
          fill="white"
          fill-opacity="0.6"
        />
        <path
          d="M18.412 17.739H17.3104C17.2779 17.7391 17.2455 17.736 17.2136 17.7298V6.87736C17.2132 6.51499 17.069 6.16761 16.8126 5.91152C16.5562 5.65543 16.2087 5.51159 15.8463 5.51159H7.99889C7.96119 5.43624 7.94171 5.3531 7.94204 5.26885C7.94245 4.90675 8.08648 4.5596 8.34252 4.30355C8.59856 4.04751 8.94572 3.90348 9.30782 3.90308H18.412C18.7742 3.90308 19.1216 4.04697 19.3777 4.3031C19.6338 4.55923 19.7777 4.90662 19.7777 5.26885V16.3733C19.7777 16.7355 19.6338 17.0829 19.3777 17.339C19.1216 17.5951 18.7742 17.739 18.412 17.739Z"
          fill="white"
          fill-opacity="0.6"
        />
      </svg>
    </>
  );
};

export default MenuBotTradeSvg;
