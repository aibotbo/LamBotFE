import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Loader } from './Loader';

const Register = Loader(lazy(() => import('pages/Register')));

export const RegisterRoute: RouteObject = {
  path: 'register',
  element: <Register />,
};
