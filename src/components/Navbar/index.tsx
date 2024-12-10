import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import images from 'assets';
import axios from 'axios';
import APIs from 'apis';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { RootState } from 'stores/store';
import toggleDarkMode from 'utils/ToggleDarkLight';
import SearchInput from 'components/SearchInput';
import { uiActions } from 'stores/uiSlice';
import { ClickAwayListener, Tooltip } from '@mui/material';
import HomeRightArrowSvg from 'svgs/HomeRightArrowSvg';
import { userActions } from 'stores/userSlice';
import CustomModal from 'components/CustomModal';
import GoldButton from 'components/GoldButton';
import GreyButton from 'components/GreyButton';
import { useMediaQuery } from 'react-responsive';
import BotTableZoomOut from 'svgs/BotTableZoomOut';
import NavbarHamburger from 'svgs/NavbarHamburger';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState<string>('');
  // RESPONSIVE
  const isDesktop = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  const [isUserTooltipOpen, setIsUserTooltipOpen] = useState(false);

  const handleUserTooltipOpen = () => {
    setIsUserTooltipOpen(true);
  };

  const handleUserTooltipClose = () => {
    setIsUserTooltipOpen(false);
  };

  const handleUserTooltipToggle = () => {
    setIsUserTooltipOpen((prevOpen) => !prevOpen);
  };

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const ui = useAppSelector((state) => state.ui);

  // MODAL
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopupModal = useCallback(() => {
    setIsPopupOpen(true);
  }, []);

  const handleClosePopupModal = () => {
    setIsPopupOpen(false);
  };

  const showIsDevelopingModal = () => {
    dispatch(uiActions.updateIsModalOpen(true));
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(userActions.updateIsLoggedIn(false));
    navigate('/login');
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log('You have commit a change to the data');
      // Send Axios request here
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    let windowWidth = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    console.log(windowWidth);

    // window.addEventListener('scroll', function () {
    //   let navbar = document.querySelector('.navbar');
    //   let html = document.documentElement;
    //   let windowWidth = Math.max(
    //     document.documentElement.clientWidth || 0,
    //     window.innerWidth || 0
    //   );
    //   var scrollPosition = window.scrollY;
    //   console.log(windowWidth);

    //   if (windowWidth <= 1224) {
    //     if (scrollPosition > 50) {
    //       // @ts-ignore
    //       navbar.classList.add('fixed');
    //       html.classList.add('overflow-html');
    //     } else {
    //       // @ts-ignore
    //       navbar.classList.remove('fixed');
    //       html.classList.remove('overflow-html');
    //     }
    //   }
    // });
  }, []);

  return (
    <>
      <div
        id="home_search"
        className={`flex justify-between items-center pb-6 ${
          !isDesktop ? 'navbar bg-background-100 top-0 z-[98]' : ''
        }`}
      >
        {/* <SearchInput
        inputName="search"
        inputClassName="w-[29.5rem]"
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      /> */}
        {!isDesktop && (
          <div
            className="flex-shrink-0 p-3 border-2 border-ink-10 rounded-xl"
            onClick={() => {
              dispatch(
                uiActions.updateIsMobileSidebarOpen(!ui.isMobileSidebarOpen)
              );
            }}
          >
            <NavbarHamburger className="w-[1.5rem] h-[1.5rem] text-ink-100 cursor-pointer" />
          </div>
        )}
        <div className="ml-auto flex items-center gap-4">
          {isDesktop && isTablet && (
            <div className="px-3 py-3 flex gap-x-3 rounded-xl border-2 border-ink-05">
              <img
                className="cursor-pointer w-[2rem]"
                onClick={() => {
                  // localStorage.theme = 'light';
                  // toggleDarkMode();
                  showIsDevelopingModal();
                }}
                src={images.navbar.sun}
                alt="BotLambotrade"
              />
              <img
                className="cursor-pointer w-[2rem]"
                onClick={() => {
                  localStorage.theme = 'dark';
                  toggleDarkMode();
                }}
                src={images.navbar.moon_gold}
                alt="BotLambotrade"
              />
            </div>
          )}

          <div
            className="p-3 flex gap-4 rounded-xl border-2 border-ink-05 cursor-pointer"
            onClick={() => {
              showIsDevelopingModal();
            }}
          >
            <img src={images.navbar.noti} alt="BotLambotrade" />
          </div>
          <div
            className="p-3 flex gap-4 rounded-xl border-2 border-ink-05 cursor-pointer"
            onClick={() => {
              showIsDevelopingModal();
            }}
          >
            <img src={images.navbar.setting} alt="BotLambotrade" />
          </div>

          <div className="flex gap-4 rounded-xl cursor-pointer">
            <ClickAwayListener
              onClickAway={() => {
                if (!isDesktop) {
                  handleUserTooltipClose();
                }
              }}
            >
              <div>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      className:
                        '!p-4 min-w-[16.5rem] !bg-dropdown !rounded-xl',
                    },
                    arrow: {
                      className:
                        '!w-[1rem] !h-[1em] !mt-[-1em] !before:bg-dropdown',
                      sx: {
                        '&::before': {
                          background: 'var(--bg-dropdown)',
                        },
                      },
                    },
                  }}
                  title={
                    <div
                      className="flex flex-col gap-y-4 text-base"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserTooltipClose();
                      }}
                    >
                      <p className="pb-4 border-b border-ink-10 bg-primary-100 bg-clip-text text-transparent font-bold">
                        {user.username}
                      </p>
                      <div
                        className="pb-4 flex items-center justify-between border-b border-ink-10 text-ink-100 cursor-pointer"
                        onClick={() => {
                          showIsDevelopingModal();
                        }}
                      >
                        <p>Đổi mật khẩu</p>
                        <HomeRightArrowSvg className="text-ink-100" />
                      </div>
                      <div
                        className="pb-4 flex items-center justify-between border-b border-ink-10 text-ink-100 cursor-pointer"
                        onClick={() => {
                          showIsDevelopingModal();
                        }}
                      >
                        <p>Bật/ Tắt 2 FA</p>
                        <HomeRightArrowSvg className="text-ink-100" />
                      </div>
                      <div
                        className="flex items-center justify-between text-red-100 cursor-pointer"
                        onClick={() => {
                          handleOpenPopupModal();
                        }}
                      >
                        <p>Đăng xuất</p>
                      </div>
                    </div>
                  }
                  // placement="bottom-end"
                  arrow
                  open={isUserTooltipOpen}
                  onOpen={handleUserTooltipOpen}
                  onClose={handleUserTooltipClose}
                  disableHoverListener={!isDesktop}
                  disableFocusListener={!isDesktop}
                  disableTouchListener={!isDesktop}
                  placement="bottom-end"
                  enterTouchDelay={0}
                  leaveTouchDelay={20000}
                >
                  <img
                    className="w-[3rem]"
                    srcSet={`${images.home.avatar} 2x`}
                    alt="BotLambotrade"
                    onClick={handleUserTooltipOpen}
                  />
                </Tooltip>
              </div>
            </ClickAwayListener>
          </div>

          {/* <div className="flex items-center gap-x-1">
          <p>Lucas tran </p>
          <img
            className="cursor-pointer"
            src={images.home.dropdown}
            alt="BotLambotrade"
          />
        </div> */}
        </div>
      </div>
      {/* MODAL RESET PASSWORD CONFIRM */}
      <CustomModal
        isOpen={isPopupOpen}
        handleOpen={handleOpenPopupModal}
        handleClose={handleClosePopupModal}
      >
        <div
          className={`absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 md:w-[31.25rem] w-[calc(100vw-2rem)] bg-background-80 rounded-3xl text-center`}
        >
          <h3 className="mb-2 mx-auto max-w-[18.75rem] text-xl text-ink-100">
            Đăng xuất
          </h3>
          <p className="mb-12 mx-auto max-w-[18.75rem] text-ink-80">
            Bạn có chắc chắn muốn đăng xuất tài khoản bot không?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4">
            <GreyButton onClick={handleClosePopupModal}>Huỷ</GreyButton>
            <GoldButton
              onClick={() => {
                logout();
                handleClosePopupModal();
              }}
            >
              Đăng xuất
            </GoldButton>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Navbar;
