import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CopyTradeSettingFollow from './CopyTradeSettingFollow';

const CopyTradeSetting = () => {
  const [isFollowing, setIsFollowing] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  return (
    <>
      <Helmet>
        <title>BotLambotrade | Copy Trade</title>
      </Helmet>

      <CopyTradeSettingFollow
        isFollowing={isFollowing}
        setIsFollowing={setIsFollowing}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
    </>
  );
};

export default CopyTradeSetting;
