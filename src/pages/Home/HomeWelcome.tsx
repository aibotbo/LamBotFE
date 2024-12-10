import React from 'react';
import images from 'assets';
import { useAppSelector } from 'stores/hooks';
import { useMediaQuery } from 'react-responsive';

const HomeWelcome = () => {
  const user = useAppSelector((state) => state.user.user);
  const isDesktop = useMediaQuery({
    query: '(min-width: 1224px)',
  });

  const isTablet = useMediaQuery({
    query: '(min-width: 768px)',
  });

  return (
    <div
      id="home_welcome"
      className="mb-6 mt-6 text-ink-100 relative overflow-visible"
    >
      <div
        className={`absolute ${
          isDesktop || isTablet
            ? 'top-[62%] translate-y-[-50%] left-6'
            : 'top-4 left-4'
        } 2xl:left-8`}
      >
        <h3 className="mb-4 text-4xl md:text-3xl lg:text-4xl font-medium">
          Hi, {user.username}
        </h3>
        <h2 className="text-5xl md:text-4xl lg:text-5xl font-bold">
          Welcome to {!isDesktop ? <br /> : ''} AI BotTrade
        </h2>
      </div>
      <img
        className={`${isDesktop ? 'mt-[-2rem]' : ''} h-auto max-w-full w-full`}
        srcSet={`${
          isDesktop
            ? images.home.banner_desktop
            : isTablet
            ? images.home.banner_tablet
            : images.home.banner_mobile
        } 4x`}
        alt="BotLambotrade"
      />
      {/* <img
        className="absolute left-[70%] translate-x-[-50%] top-[50%] translate-y-[-50%] w-[30rem] xl:w-[32rem] 2xl:w-[34rem] z-0"
        srcSet={`${images.home.welcome_background} 2x`}
        alt="BotLambotrade"
      />
      <img
        className="absolute left-[55%] w-[16.75rem] 2xl:w-[20rem] 3xl:w-[22%] overflow-visible bottom-0"
        srcSet={`${images.home.robot_blue} 2x`}
        alt="BotLambotrade"
      />
      STARS
      <img
        className="absolute left-[50%] top-[20%] w-[1.5rem] 2xl:w-[1.75rem] opacity-80 bg-blend-screen mix-blend-screen overflow-visible"
        srcSet={`${images.home.star_1}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute left-[45%] top-[38%] w-[2rem] 2xl:w-[2.25rem] z-0 border-0 opacity-80 bg-blend-screen mix-blend-screen overflow-visible"
        srcSet={`${images.home.star_2}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute left-[45%] top-[21%] w-[1.25rem] 2xl:w-[1.5rem] z-0 border-0 opacity-80 bg-blend-screen mix-blend-screen overflow-visible"
        srcSet={`${images.home.star_3}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute left-[47%] top-[6%] w-[1rem] xl:w-[1.25rem] z-0 border-0 opacity-80 bg-blend-screen mix-blend-screen overflow-visible"
        srcSet={`${images.home.star_4}`}
        alt="BotLambotrade"
      />
      GOLD WITH STARS
      <img
        className="absolute left-[51%] w-[5rem] 2xl:w-[5.5rem] bottom-0 z-0 border-0 overflow-visible"
        srcSet={`${images.home.gold_1}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute left-[51%] top-[55%] w-[5.75rem] 2xl:w-[6.25rem] z-0 border-0 opacity-80 bg-blend-screen mix-blend-screen overflow-visible"
        srcSet={`${images.home.star_gold_1}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute left-[59%] top-[49%] w-[3.5rem] 2xl:w-[4rem] z-0 border-0 overflow-visible"
        srcSet={`${images.home.gold_2}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute left-[58.5%] top-[44%] w-[5rem] 2xl:w-[6rem] z-0 border-0 opacity-80 bg-blend-screen mix-blend-screen overflow-visible"
        srcSet={`${images.home.star_gold_2}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute left-[52%] top-[29%] x-[2rem] 2xl:w-[2.25rem] z-0 border-0 overflow-visible"
        srcSet={`${images.home.gold_3}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute left-[52%] top-[29%] w-[2.25rem] 2xl:w-[2.5rem] z-0 border-0 opacity-80 bg-blend-screen mix-blend-screen overflow-visible"
        srcSet={`${images.home.star_gold_3}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute left-[56%] top-[5%] w-[2rem] 2xl:w-[2.25rem] z-0 border-0 overflow-visible"
        srcSet={`${images.home.gold_4}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute left-[53%] 2xl:left-[56%] top-[5%] w-[2.25rem] 2xl:w-[2.5rem] z-0 border-0 opacity-80 bg-blend-screen mix-blend-screen overflow-visible"
        srcSet={`${images.home.star_gold_4}`}
        alt="BotLambotrade"
      />
      RIGHT STARS
      <img
        className="absolute right-[11%] top-[32%] w-[2rem] 2xl:w-[2.25rem] z-0 border-0 overflow-visible"
        srcSet={`${images.home.star_5}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute right-[6%] top-[57%] w-[2rem] 2xl:w-[2.25rem] z-0 border-0 overflow-visible"
        srcSet={`${images.home.star_6}`}
        alt="BotLambotrade"
      />
      <img
        className="absolute right-[5%] top-[14%] w-[2rem] 2xl:w-[2.25rem] z-0 border-0 overflow-visible"
        srcSet={`${images.home.star_7}`}
        alt="BotLambotrade"
      /> */}
    </div>
  );
};

export default HomeWelcome;
