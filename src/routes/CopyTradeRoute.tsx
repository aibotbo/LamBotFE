import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import SideBarLayout from 'layouts/SidebarLayout';
import { Loader } from './Loader';

const CopyTradeZoom = Loader(lazy(() => import('pages/CopyTradeZoom')));
const CopyTradeHistory = Loader(lazy(() => import('pages/CopyTradeHistory')));
const CopyTradeSetting = Loader(lazy(() => import('pages/CopyTradeSetting')));

export const CopyTradeRoute: RouteObject = {
  path: '/',
  element: <SideBarLayout />,
  children: [
    {
      path: 'copy_trade_zoom',
      element: <CopyTradeZoom />,
    },
    {
      path: 'copy_trade_history',
      element: <CopyTradeHistory />,
    },
    {
      path: 'copy_trade_setting',
      element: <CopyTradeSetting />,
    },
  ],
};
