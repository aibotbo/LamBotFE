import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import SideBarLayout from 'layouts/SidebarLayout';
import { Loader } from './Loader';

const UserManagement = Loader(lazy(() => import('pages/UserManagement')));

export const UserManagementRoute: RouteObject = {
  path: '/',
  element: <SideBarLayout />,
  children: [
    {
      path: 'user_management',
      element: <UserManagement />,
    },
  ],
};
