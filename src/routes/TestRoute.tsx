import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Loader } from './Loader';
import SideBarLayout  from 'layouts/SidebarLayout';

const Test = Loader(lazy(() => import('pages/Test')));

export const TestRoute: RouteObject = {
    path: '/',
    element: <SideBarLayout />,
    children: [
      {
        path: 'test',
        element: <Test />,
      },
    ],
  };
  