import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import APIs from 'apis';
import { Helmet } from "react-helmet-async";
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import BotTradeHistoryTelegram from "./BotTradeHistoryTelegram";
import BotTradeResultCanvas from "./BotTradeResultCanvas";
import BotTradeHistoryMethod from "./BotTradeHistoryMethod";
import {
  AutoBotHistoryTelegramList,
} from 'types/AutoBotHistoryTelegramList';

const CopyTradeHistory = () => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const [isTelegramBot, setIsTelegramBot] = useState(true);

  const [signalGroupedData, setSignalGroupedData] = useState<any>(null);

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
          // splitSignal
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
    const intervalTime = 10000;
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
        <title>BotLambotrade | Bot Trade</title>
      </Helmet>

      {/* TRADE THU CONG CA NHAN */}
      {isTelegramBot && (
        <BotTradeHistoryTelegram
          isBotTelegram={isTelegramBot}
          setIsBotTelegram={setIsTelegramBot}
        />
      )}

      {/* TRADE THU CONG CHUYEN GIA */}
      {!isTelegramBot && (
        <BotTradeHistoryMethod
          isBotTelegram={isTelegramBot}
          setIsBotTelegram={setIsTelegramBot}
        />
      )}

      {/* Canvas kết quả  */}
      <BotTradeResultCanvas results={signalGroupedData} />
    </>
  );
};

export default CopyTradeHistory;
