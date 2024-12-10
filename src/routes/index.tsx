import { RouteObject } from "react-router-dom";
import { AboutRoute } from "./AboutRoute";
import { AccountTradeRoute } from "./AccountTradeRoute";
import { BotTradeRoute } from "./BotTradeRoute";
import { CopyTradeRoute } from "./CopyTradeRoute";
import { ErrorRoute } from "./ErrorPageRoute";
import { HomeRoute } from "./HomeRoute";
import { LoginRoute } from "./LoginRoute";
import { RegisterRoute } from "./RegisterRoute";
import { SignalRoute } from "./SignalRoute";
import { StatisticRoute } from "./StatisticRoute";
import { TestRoute } from "./TestRoute";
import { UserManagementRoute } from "./UserManagementRoute";

const routes: RouteObject[] = [
  HomeRoute,
  AboutRoute,
  AccountTradeRoute,
  SignalRoute,
  CopyTradeRoute,
  UserManagementRoute,
  BotTradeRoute,
  ErrorRoute,
  LoginRoute,
  RegisterRoute,
  StatisticRoute,
  TestRoute,
];

export default routes;
