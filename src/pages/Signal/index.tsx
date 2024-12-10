import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SignalBot from './SignalBot';
import SignalBotHistory from './SignalBotHistory';

const Signal = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isHistory, setIsHistory] = useState(false);

  const toggleHistory = () => {
    setIsHistory((prev) => !prev);
  };

  return (
    <>
      <Helmet>
        <title>BotLambotrade | Copy Trade</title>
      </Helmet>

      {!isHistory && (
        <SignalBot
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          toggleHistory={toggleHistory}
        />
      )}

      {isHistory && (
        <SignalBotHistory
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          toggleHistory={toggleHistory}
        />
      )}
    </>
  );
};

export default Signal;
