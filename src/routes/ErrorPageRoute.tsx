import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Loader } from './Loader';

const ErrorPage = Loader(lazy(() => import('pages/404/ErrorPage')));

export const ErrorRoute: RouteObject = {
  path: '*',
  element: <ErrorPage />,
};
