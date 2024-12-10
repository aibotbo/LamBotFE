import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import SideBarLayout from 'layouts/SidebarLayout';
import { Loader } from './Loader';

const AccountTrade = Loader(lazy(() => import('pages/AccountTrade')));

export const AccountTradeRoute: RouteObject = {
  path: '/',
  element: <SideBarLayout />,
  children: [
    {
      path: 'account_trade',
      element: <AccountTrade />,
    },
  ],
};
