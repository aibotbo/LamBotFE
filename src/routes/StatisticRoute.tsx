import SideBarLayout from "layouts/SidebarLayout";
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loader } from "./Loader";

const Statistic = Loader(lazy(() => import("pages/Statistic")));

export const StatisticRoute: RouteObject = {
  path: "/",
  element: <SideBarLayout />,
  children: [
    {
      path: "statistics",
      element: <Statistic />,
    },
  ],
};
