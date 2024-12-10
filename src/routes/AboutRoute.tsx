import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import SideBarLayout from 'layouts/SidebarLayout';
import { Loader } from './Loader';

const About = Loader(lazy(() => import('pages/About')));

export const AboutRoute: RouteObject = {
  path: '/',
  element: <SideBarLayout />,
  children: [
    {
      path: 'about',
      element: <About />,
    },
  ],
};
