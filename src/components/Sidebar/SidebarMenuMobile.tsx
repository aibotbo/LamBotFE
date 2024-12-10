import React from 'react';
import images from 'assets';
import { NavLink, useLocation } from 'react-router-dom';
import MenuHouseSvg from 'svgs/MenuHouseSvg';
import MenuAccountSvg from 'svgs/MenuAccountSvg';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { uiActions } from 'stores/uiSlice';
import { useSpring, animated } from 'react-spring';
import { createPortal } from 'react-dom';
import MenuAdminManagementSvg from 'svgs/MenuAdminManagementSvg';

const SidebarMenuMobile = () => {
  const { pathname } = useLocation();

  const isCopyTradeEnabled = pathname.includes('copy_trade');
  const isBotTradeEnabled = pathname.includes('bot_trade');

  const dispatch = useAppDispatch();

  const showIsDevelopingModal = () => {
    dispatch(uiActions.updateIsModalOpen(true));
  };

  return (
    <>
      {/* MENU 1 */}
      <div className="px-4 pt-4 pb-6 flex flex-col text-sm text-ink-60">
        <h2 className="text-xs pb-4 uppercase">DASHBOARD</h2>
        <div className="flex flex-col gap-y-3 mb-6">
          <NavLink to="/">
            {({ isActive }) => (
              <div
                className={`flex items-center px-4 py-3 gap-3 ${
                  isActive
                    ? 'bg-primary-100 text-black font-bold rounded-2xl background-animation'
                    : ''
                }`}
                onClick={() => {
                  dispatch(uiActions.updateIsMobileSidebarOpen(false));
                }}
              >
                {isActive ? (
                  <MenuHouseSvg />
                ) : (
                  <MenuHouseSvg fill="white" fillOpacity="0.6" />
                )}
                {/* <img
                  className={`w-[1.5rem]`}
                  src={images.sidebar.house}
                  alt="BotLambotrade"
                /> */}
                <p>Trang chủ</p>
              </div>
            )}
          </NavLink>
          {/*
          <NavLink
            to="#"
            onClick={() => {
              showIsDevelopingModal();
            }}
          >
            {({ isActive }) => (
              <div
                // className={`flex items-center px-4 py-3 gap-3 ${
                //   isActive
                //     ? 'bg-primary-100 text-black font-bold rounded-2xl background-animation'
                //     : ''
                // }`}
                className="flex items-center px-4 py-3 gap-3"
              >
                <img
                  className={`w-[1.5rem]`}
                  src={images.sidebar.statistic}
                  alt="BotLambotrade"
                />
                <p>Thống kê</p>
              </div>
            )}
          </NavLink>
          */}
          <NavLink to="/account_trade">
            {({ isActive }) => (
              <div
                className={`flex items-center px-4 py-3 gap-3 ${
                  isActive
                    ? 'bg-primary-100 text-black font-bold rounded-2xl background-animation'
                    : ''
                }`}
                onClick={() => {
                  dispatch(uiActions.updateIsMobileSidebarOpen(false));
                }}
              >
                {isActive ? (
                  <MenuAccountSvg fill="#0F0E0C" fillOpacity="1" />
                ) : (
                  <MenuAccountSvg />
                )}
                {/* <img
                  className={`w-[1.5rem]`}
                  src={images.sidebar.account}
                  alt="BotLambotrade"
                /> */}
                <p>Tài khoản giao dịch</p>
              </div>
            )}
          </NavLink>
          <NavLink to="/user_management">
            {({ isActive }) => (
              <div
                className={`flex items-center px-4 py-3 gap-3 ${
                  isActive
                    ? 'bg-primary-100 text-black font-bold rounded-2xl background-animation'
                    : ''
                }`}
                onClick={() => {
                  dispatch(uiActions.updateIsMobileSidebarOpen(false));
                }}
              >
                {isActive ? (
                  <MenuAdminManagementSvg fill="#0F0E0C" fillOpacity="1" />
                ) : (
                  <MenuAdminManagementSvg fill="white" fillOpacity="0.6" />
                )}
                <p>Quản trị thành viên</p>
              </div>
            )}
          </NavLink>
          <NavLink to="/signal">
            {({ isActive }) => (
              <div
                className={`flex items-center px-4 py-3 gap-3 ${
                  isActive
                    ? 'bg-primary-100 text-black font-bold rounded-2xl background-animation'
                    : ''
                }`}
                onClick={() => {
                  dispatch(uiActions.updateIsMobileSidebarOpen(false));
                }}
              >
                {isActive ? (
                  <img
                    className={`w-[1.5rem]`}
                    src={images.sidebar.signal_active}
                    alt="BotLambotrade"
                  />
                ) : (
                  <img
                    className={`w-[1.5rem]`}
                    src={images.sidebar.signal}
                    alt="BotLambotrade"
                  />
                )}
                <p>Signal</p>
              </div>
            )}
          </NavLink>
        </div>
        <div className="border-gray-50/10 border border-solid"></div>
      </div>

      {/* MENU 2 */}
      <div className="px-4 pt-4 pb-6 flex flex-col text-sm text-ink-60">
        <h2 className="text-xs pb-4 uppercase">TRADING</h2>
        <div className="flex flex-col gap-y-3 mb-6">
          <NavLink to="/copy_trade_zoom">
            {({ isActive }) => (
              <div
                className={`flex items-center px-4 py-3 gap-3`}
                onClick={() => {
                  dispatch(uiActions.updateIsMobileSidebarOpen(false));
                }}
              >
                {isCopyTradeEnabled ? (
                  <>
                    <img
                      className={`w-[1.5rem]`}
                      src={images.sidebar.copy_trade_gold}
                      alt="BotLambotrade"
                    />
                    <p className="bg-primary-100 bg-clip-text text-transparent">
                      Copy Trade
                    </p>
                    <img
                      className={`w-[1.5rem] ml-auto`}
                      src={images.sidebar.drop_down_gold}
                      alt="BotLambotrade"
                    />
                  </>
                ) : (
                  <>
                    <img
                      className={`w-[1.5rem]`}
                      src={images.sidebar.copy_trade}
                      alt="BotLambotrade"
                    />
                    <p>Copy Trade</p>
                    <img
                      className={`w-[1.5rem] ml-auto`}
                      src={images.sidebar.arrow_right}
                      alt="BotLambotrade"
                    />
                  </>
                )}
              </div>
            )}
          </NavLink>

          {/* BOT TRADE COPY TRADE ENABLED */}
          {isCopyTradeEnabled && (
            <>
              <NavLink to="/copy_trade_zoom">
                {({ isActive }) => (
                  <div
                    className={`flex items-center px-4 py-3 gap-3 ${
                      isActive
                        ? 'bg-primary-100 text-black font-bold rounded-2xl background-animation'
                        : ''
                    }`}
                    onClick={() => {
                      dispatch(uiActions.updateIsMobileSidebarOpen(false));
                    }}
                  >
                    <div className={`w-[1.5rem]`} />
                    <p>Giao dịch (Zoom)</p>
                  </div>
                )}
              </NavLink>
              <NavLink to="/copy_trade_history">
                {({ isActive }) => (
                  <div
                    className={`flex items-center px-4 py-3 gap-3 ${
                      isActive
                        ? 'bg-primary-100 text-black font-bold rounded-2xl background-animation'
                        : ''
                    }`}
                    onClick={() => {
                      dispatch(uiActions.updateIsMobileSidebarOpen(false));
                    }}
                  >
                    <div className={`w-[1.5rem]`} />
                    <p>Lịch sử</p>
                  </div>
                )}
              </NavLink>
              <NavLink to="/copy_trade_setting">
                {({ isActive }) => (
                  <div
                    className={`flex items-center px-4 py-3 gap-3 ${
                      isActive
                        ? 'bg-primary-100 text-black font-bold rounded-2xl background-animation'
                        : ''
                    }`}
                    onClick={() => {
                      dispatch(uiActions.updateIsMobileSidebarOpen(false));
                    }}
                  >
                    <div className={`w-[1.5rem]`} />
                    <p>Cài đặt</p>
                  </div>
                )}
              </NavLink>
            </>
          )}
        </div>
        <div className="border-gray-50/10 border border-solid"></div>
      </div>

      {/* MENU 3 */}
      <div className="px-4 pt-4 pb-6 flex flex-col text-sm text-ink-60">
        <h2 className="text-xs pb-4 uppercase">AUTO TRADING</h2>
        <div className="flex flex-col gap-y-3 mb-6">
          <NavLink
            to="/bot_trade_setting"
            // to="#"
            // onClick={() => {
            //   showIsDevelopingModal();
            // }}
          >
            {({ isActive }) => (
              <div
                className={`flex items-center px-4 py-3 gap-3`}
                onClick={() => {
                  dispatch(uiActions.updateIsMobileSidebarOpen(false));
                }}
              >
                {isBotTradeEnabled ? (
                  <>
                    <img
                      className={`w-[1.5rem]`}
                      src={images.sidebar.bot_trade_gold}
                      alt="BotLambotrade"
                    />
                    <p className="bg-primary-100 bg-clip-text text-transparent">
                      Bot Trade
                    </p>
                    <img
                      className={`w-[1.5rem] ml-auto`}
                      src={images.sidebar.drop_down_gold}
                      alt="BotLambotrade"
                    />
                  </>
                ) : (
                  <>
                    <img
                      className={`w-[1.5rem]`}
                      src={images.sidebar.bot_trade}
                      alt="BotLambotrade"
                    />
                    <p>Bot Trade</p>
                    <img
                      className={`w-[1.5rem] ml-auto`}
                      src={images.sidebar.arrow_right}
                      alt="BotLambotrade"
                    />
                  </>
                )}
              </div>
            )}
          </NavLink>

          {/* BOT TRADE BOT TRADE ENABLED */}
          {isBotTradeEnabled && (
            <>
              <NavLink to="/bot_trade_setting">
                {({ isActive }) => (
                  <>
                    <div
                      className={`flex items-center px-4 py-3 gap-3 ${
                        isActive
                          ? 'bg-primary-100 text-black font-bold rounded-2xl background-animation'
                          : ''
                      }`}
                      onClick={() => {
                        dispatch(uiActions.updateIsMobileSidebarOpen(false));
                      }}
                    >
                      <div className={`w-[1.5rem]`} />
                      <p>Quản lý Bot</p>
                    </div>
                  </>
                )}
              </NavLink>
              <NavLink
                to="/bot_trade_method"
                // to="#"
                // onClick={() => {
                //   showIsDevelopingModal();
                // }}
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`flex items-center px-4 py-3 gap-3 ${
                        isActive
                          ? 'bg-primary-100 text-black font-bold rounded-2xl background-animation'
                          : ''
                      }`}
                      onClick={() => {
                        dispatch(uiActions.updateIsMobileSidebarOpen(false));
                      }}
                    >
                      <div className={`w-[1.5rem]`} />
                      <p>Quản lý phương pháp</p>
                    </div>

                    {/* <div className={`flex items-center px-4 py-3 gap-3`}>
                      <div className="w-[1.5rem]"></div>
                      <p>Quản lý phương pháp</p>
                    </div> */}
                  </>
                )}
              </NavLink>
              <NavLink
                to="/bot_trade_history"
                // to="#"
                // onClick={() => {
                //   showIsDevelopingModal();
                // }}
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`flex items-center px-4 py-3 gap-3 ${
                        isActive
                          ? 'bg-primary-100 text-black font-bold rounded-2xl background-animation'
                          : ''
                      }`}
                      onClick={() => {
                        dispatch(uiActions.updateIsMobileSidebarOpen(false));
                      }}
                    >
                      <div className={`w-[1.5rem]`} />
                      <p>Lịch sử</p>
                    </div>
                    {/* <div className={`flex items-center px-4 py-3 gap-3`}>
                      <div className="w-[1.5rem]"></div>
                      <p>Lịch sử</p>
                    </div> */}
                  </>
                )}
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarMenuMobile;
