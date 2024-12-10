import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import APIs from 'apis';
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import {
  AutoBotHistoryTelegramList,
} from 'types/AutoBotHistoryTelegramList';
import { Helmet } from 'react-helmet-async';
import CopyTradeHistoryType from './CopyTradeHistoryType';
import CopyTradeResultCanvas from './CopyTradeResultCanvas';
import CopyTradeHistoryManualSelf from './CopyTradeHistoryManualSelf';
import CopyTradeHistoryManualMaster from './CopyTradeHistoryManualMaster';
import CopyTradeHistorySelf from './CopyTradeHistorySelf';

const generateShapes = () => {
  return [...Array(10)].map((_, i) => ({
    id: i * Math.random() * 1000,
    x: i * 24,
    y: (i % 5) * 24,
  }));
};

const CopyTradeHistory = () => {
  const [isMaster, setIsMaster] = useState(false);
  const [isCopyTrade, setIsCopyTrade] = useState(false);
  const [shapes, setShapes] = useState(generateShapes());
  const [isFollowing, setIsFollowing] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [signalGroupedData, setSignalGroupedData] = useState<any>(null);
  const enqueueSnackbar = useEnqueueSnackbar();
  const splitSignal = (list: any, size: any) => {
    let result = [];
    for (let i = 0; i < list.length; i += size) {
      let childList = list.slice(i, i + size);
      result.push(childList);
    }
    return result;
  };

  const getAutoBotOrderHistory = useCallback(
    () => {
      const noLoadingAxios = axios.create();
      noLoadingAxios
        .get(`${APIs.orderBotListResult}`, {
          params: {},
        })
        .then((res) => {
          const data: AutoBotHistoryTelegramList = res.data;

          const signalList = data?.results.map((item: any) =>
            item.o_result === 1 ? true : item.o_result === -1 ? false : null
          );
          const _signalGroupedData = splitSignal(signalList, 20);
          setSignalGroupedData(_signalGroupedData);
        })
        .catch(() => {
          enqueueSnackbar('Không thể lấy lịch sử giao dịch!', {
            variant: 'error',
          });
        });
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    const intervalTime = 5000;
    const interval = setInterval(() => {
      getAutoBotOrderHistory();
    }, intervalTime);

    return () => {
      clearInterval(interval);
    };
  }, [getAutoBotOrderHistory]);

  useEffect(() => {
    getAutoBotOrderHistory();
  }, [getAutoBotOrderHistory]);

  return (
    <>
      <Helmet>
        <title>BotLambotrade | Copy Trade</title>
      </Helmet>

      <CopyTradeHistoryType
        isCopyTrade={isCopyTrade}
        setIsCopyTrade={setIsCopyTrade}
      />

      {/* TRADE THU CONG CA NHAN */}
      {!isMaster && !isCopyTrade && (
        <CopyTradeHistoryManualSelf
          isMaster={isMaster}
          setIsMaster={setIsMaster}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      )}

      {/* TRADE THU CONG CHUYEN GIA */}
      {isMaster && !isCopyTrade && (
        <CopyTradeHistoryManualMaster
          isMaster={isMaster}
          setIsMaster={setIsMaster}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      )}

      {/* COPY TRADE */}
      {isCopyTrade && (
        <CopyTradeHistorySelf
          isMaster={isMaster}
          setIsMaster={setIsMaster}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      )}

      {/* Canvas kết quả  */}
      <CopyTradeResultCanvas results={signalGroupedData} />
    </>
  );
};

export default CopyTradeHistory;
