import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import SideBarLayout from 'layouts/SidebarLayout';
import { Loader } from './Loader';

const BotTradeSetting = Loader(lazy(() => import('pages/BotTradeSetting')));
const BotTradeMethod = Loader(lazy(() => import('pages/BotTradeMethod')));
const BotTradeHistory = Loader(lazy(() => import('pages/BotTradeHistory')));
const ConfigureTimer = Loader(lazy(() => import('pages/ConfigureTimer')));

export const BotTradeRoute: RouteObject = {
  path: '/',
  element: <SideBarLayout />,
  children: [
    {
      path: 'bot_trade_setting',
      element: <BotTradeSetting />,
    },
    {
      path: 'bot_trade_method',
      element: <BotTradeMethod />,
    },
    {
      path: 'bot_trade_history',
      element: <BotTradeHistory />,
    },
    {
      path: 'bot_trade_configure_timer',
      element: <ConfigureTimer />,
    },
  ],
};
