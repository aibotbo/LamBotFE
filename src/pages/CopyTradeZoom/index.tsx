import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import APIs from 'apis';
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import {
  AutoBotHistoryTelegramList,
} from 'types/AutoBotHistoryTelegramList';
import CopyTradeType from './CopyTradeType';
import CopyTradeTelegram from './CopyTradeTelegram';
import CopyTradeInformation from './CopyTradeInformation';
import CopyTradeResultCanvas from './CopyTradeResultCanvas';
import CopyTradeFollow from './CopyTradeFollow';
import InputSelectOption from 'types/InputSelectOption';
import { useMediaQuery } from 'react-responsive';
import CopyTradeAI from './CopyTradeAI';


const generateShapes = () => {
  return [...Array(10)].map((_, i) => ({
    id: i * Math.random() * 1000,
    x: i * 24,
    y: (i % 5) * 24,
  }));
};

const INITIAL_SELECT_OPTIONS: InputSelectOption[] = [
  {
    value: '',
    label: '',
  },
];

const INITIAL_SELECTED_OPTION: InputSelectOption = {
  value: '',
  label: '',
};

const INITIAL_SELECTED_ACCOUNT_TYPE: InputSelectOption = {
  value: 'DEMO',
  label: 'Tài khoản DEMO',
};

const CopyTradeZoom = () => {
  const [isMaster, setIsMaster] = useState<number>(0);
  const [shapes, setShapes] = useState(generateShapes());
  const [isFollowing, setIsFollowing] = useState(true);
  const [searchInputTable, setSearchInputTable] = useState('');
  const [signalGroupedData, setSignalGroupedData] = useState<any>(null);
  const [refetch, setRefetch] = useState(0)
  const enqueueSnackbar = useEnqueueSnackbar();
  // Account Information
  const [selectedAccountType, setSelectedAccountType] =
    useState<InputSelectOption>(INITIAL_SELECTED_ACCOUNT_TYPE);
  const [selectedBotAccount, setSelectedBotAccount] =
    useState<InputSelectOption>(INITIAL_SELECTED_OPTION);
  const [accountOptions, setAccountOptions] = useState<InputSelectOption[]>(
    INITIAL_SELECT_OPTIONS
  );

  // RESPONSIVE
  const isDesktop = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

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

  // useEffect(() => {
  //   const intervalTime = 5000;
  //   const interval = setInterval(() => {
  //     getAutoBotOrderHistory();
  //   }, intervalTime);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [getAutoBotOrderHistory]);

  useEffect(() => {
    getAutoBotOrderHistory();
  }, [refetch]);

  return (
    <>
      <Helmet>
        <title> BotLambotrade AI | Copy Trade</title>
      </Helmet>

      <CopyTradeType isMaster={isMaster} setIsMaster={setIsMaster} />

      <div
        className={`grid ${
          isDesktop ? 'grid-cols-3' : 'grid-cols-1'
        } gap-6 mb-6`}
      >
        {/* Bot tín hiệu Telegrame */}
        {isMaster > 0  
        ? <CopyTradeTelegram />
        : <CopyTradeAI/>
      }

        {/* Thông tin giao dịch */}
        <CopyTradeInformation isMaster={isMaster} callback={(v) => setRefetch((prev) => prev + 1)}/>
      </div>

      {/* Canvas kết quả  */}
      <CopyTradeResultCanvas results={signalGroupedData} />

      {isMaster === 2 && (
        <CopyTradeFollow
          isFollowing={isFollowing}
          setIsFollowing={setIsFollowing}
          searchInput={searchInputTable}
          setSearchInput={setSearchInputTable}
        />
      )}
    </>
  );
};

export default CopyTradeZoom;
