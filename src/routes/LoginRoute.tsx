import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Loader } from './Loader';

const Login = Loader(lazy(() => import('pages/Login')));

export const LoginRoute: RouteObject = {
  path: 'login',
  element: <Login />,
  children: [
    {
      path: 'verify-email',
      element: <Login />,
    },
    {
      path: ':uid/:reset_key',
      element: <Login />,
    },
  ],
};
