import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BotTradeMethodResultCanvas from './BotTradeMethodResultCanvas';
import BotTradeMethodType from './BotTradeMethodType';
import BotTradeMethodBuySell from './BotTradeMethodBuySell';
import BotTradeMethodBubble from './BotTradeMethodBubble';
import './style.scss'

const WIN_LOSES_ONE = [
  true,
  true,
  true,
  false,
  true,
  false,
  true,
  false,
  false,
  false,
  false,
  true,
  false,
  false,
  false,
  false,
  true,
  false,
  false,
  true,
];

const BotTradeMethod = () => {
  const [isBotTradeBuySell, setIsBotTradeBuySell] = useState(true);

  return (
    <>
      <Helmet>
        <title>BotLambotrade | Bot Trade</title>
      </Helmet>

      <BotTradeMethodType
        isBotTradeBuySell={isBotTradeBuySell}
        setIsBotTradeBuySell={setIsBotTradeBuySell}
      />

      {/* BOT TRADE BUY SELL */}
      {isBotTradeBuySell && <BotTradeMethodBuySell />}

      {/* BOT TRADE BUBBLE */}
      {!isBotTradeBuySell && <BotTradeMethodBubble />}

      {/* Canvas kết quả  */}
      {/* <BotTradeMethodResultCanvas results={WIN_LOSES_ONE} /> */}
    </>
  );
};

export default BotTradeMethod;
