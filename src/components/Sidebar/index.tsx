import images from 'assets';
import React, { FC, useEffect } from 'react';
import SidebarMenu from './SidebarMenu';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import SidebarMenuMobile from './SidebarMenuMobile';
import { createPortal } from 'react-dom';
import { useAppSelector, useAppDispatch } from 'stores/hooks';
import { useSpring, animated } from 'react-spring';
import { uiActions } from 'stores/uiSlice';
import './style.scss'

const Sidebar: FC = () => {
  const isTablet = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const uiIsMobileSidebarOpen = useAppSelector(
    (state) => state.ui.isMobileSidebarOpen
  );
  const dispatch = useAppDispatch();
  const animationSidebar = useSpring({
    to: {
      opacity: uiIsMobileSidebarOpen ? 1 : 0,
      transform: uiIsMobileSidebarOpen ? 'translateX(0%)' : 'translateX(-100%)',
    },
  });

  useEffect(() => {
    if (uiIsMobileSidebarOpen) {
      document.body.classList.add('overflow-body');
    } else {
      document.body.classList.remove('overflow-body');
    }
  }, [uiIsMobileSidebarOpen]);

  return (
    <>
      {isTablet && (
        <div className="mx-0 px-0 2xl:w-[280px] w-[200px] fixed overflow-auto bg-background-80 h-full flex flex-col">
          <div className="px-12 py-3">
            <Link to="/" className='flex justify-center items-center'>
              <img
                className="w-full h-auto logo"
                src={images.sidebar.logo}
                alt="BotLambotrade"
              />
            </Link>
          </div>
          <SidebarMenu />
        </div>
      )}
      {!isTablet &&
        createPortal(
          <>
            <animated.div
              style={animationSidebar}
              className="fixed z-[100] top-0 left-0 bottom-0 mx-0 px-0"
            >
              <div className="h-full w-full">
                <div className="z-[100] w-[280px] overflow-auto bg-background-80 h-full flex flex-col">
                  <div className="px-12 py-3">
                    <Link to="/">
                      <img
                        className="max-w-full h-auto"
                        src={images.sidebar.logo}
                        alt="BotLambotrade"
                      />
                    </Link>
                  </div>
                  <SidebarMenuMobile />
                </div>
              </div>
            </animated.div>
            {uiIsMobileSidebarOpen && (
              <div
                className="z-[99] fixed top-0 left-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.8)] min-h-screen"
                onClick={() => {
                  dispatch(uiActions.updateIsMobileSidebarOpen(false));
                }}
              ></div>
            )}
          </>,
          document.body
        )}
    </>
  );
};

export default Sidebar;
