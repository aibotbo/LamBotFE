import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import SideBarLayout from 'layouts/SidebarLayout';
import { Loader } from './Loader';

const Signal = Loader(lazy(() => import('pages/Signal')));

export const SignalRoute: RouteObject = {
  path: '/',
  element: <SideBarLayout />,
  children: [
    {
      path: 'signal',
      element: <Signal />,
    },
  ],
};
