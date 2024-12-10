import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import SideBarLayout from 'layouts/SidebarLayout';
import { Loader } from './Loader';

const Home = Loader(lazy(() => import('pages/Home')));

export const HomeRoute: RouteObject = {
  path: '/',
  element: <SideBarLayout />,
  children: [
    {
      path: '',
      element: <Home />,
    },
    {
      path: 'home',
      element: <Navigate to="/" replace />,
    },
  ],
};
