import React, { useState } from 'react';
import BotTradeSettingView from './BotTradeSettingView';
import { Helmet } from 'react-helmet-async';

const BotTradeSetting = () => {
  return (
    <>
      <Helmet>
        <title>BotLambotrade | Bot Trade</title>
      </Helmet>
      <BotTradeSettingView />
    </>
  );
};

export default BotTradeSetting;
