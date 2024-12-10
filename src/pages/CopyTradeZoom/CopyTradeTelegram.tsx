import React, { useEffect, useState, useCallback } from 'react';
import APIs from 'apis';
import axios from 'axios';
import BotSignal, { BotSignalResult } from 'types/BotSignal';
import { Column, useTable } from 'react-table';
import images from 'assets';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CopyTradeZoomSelectInput from './CopyTradeZoomSelectInput';
import InputSelectOption from 'types/InputSelectOption';
import { useMediaQuery } from 'react-responsive';
import CopyTelegramUpSvg from 'svgs/CopyTelegramUpSvg';
import CopyTelegramDownSvg from 'svgs/CopyTelegramDownSvg';

export interface BotInterface {
  label: string;
  value: string;
  [x: string]: any
}

const CopyTradeTelegram = () => {
  const [botList, setBotList] = useState<BotInterface[]>([]);
  const [botDetailList, setBotDetailList] = useState<any[]>([]);
  const [currentMoment, setCurrentMoment] = useState(moment());
  const [searchInputTelegram, setSearchInputTelegram] =
    useState<InputSelectOption | any>({
      value: '',
      label: '',
    });
  const [isTelegramChatOpen, setIsTelegramChatOpen] = useState(true);

  // RESPONSIVE
  const isDesktop = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px)',
  });
  const isMediumTablet = useMediaQuery({
    minWidth: '768px',
    maxWidth: '1023px',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  useEffect(() => {
    setInterval(() => setCurrentMoment(moment()), 1000);
  }, []);

  const loadOrderDetail = (id: any) => {
    const noLoadingAxios = axios.create();
    noLoadingAxios
      .get(`${APIs.botOrderDetail}/${id}`)
      .then((res) => {
        setBotDetailList(res?.data?.results)
      })
      .catch(() => {
      });
  }

  useEffect(() => {
    const oneMins = 60000;
    const interval = setInterval(() => {
      if (searchInputTelegram) {
        loadOrderDetail(searchInputTelegram.value);
      }
    }, oneMins);

    return () => {
      clearInterval(interval);
    };
  }, [searchInputTelegram]);

  const onSelectTelegramChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: InputSelectOption
  ) => {
    setSearchInputTelegram(option);
    loadOrderDetail(option.value);
  };

  const getAutoBotSignalTeleList = useCallback((page: number) => {
    const noLoadingAxios = axios.create();
    noLoadingAxios
      .get(`${APIs.botSignalTeleList}`, {
        params: {
          page,
          page_size: 20,
        },
      })
      .then((res) => {
        const result = res?.data?.results.map((bot: any) => {
          return {
            ...bot,
            value: bot.id,
            label: bot.bot_name,
          };
        });
        setBotList(result)
        if (result?.length > 0) {
          setSearchInputTelegram(result[0])
          loadOrderDetail(result[0].value)
        }
      })
      .catch(() => {
      });
  }, []);

  const openTelegramGroup = (link: string) => {
    window.open(link, '_blank');
  };
  
  // RETRIEVE ORDER HISTORY
  useEffect(() => {
    getAutoBotSignalTeleList(1);
  }, [getAutoBotSignalTeleList]);

  return (
    <div
      className={`${isDesktop ? 'col-span-2' : ''
        } bg-background-80 rounded-3xl`}
    >
      <div
        className={`px-6 py-5 flex justify-between items-center ${isTelegramChatOpen ? 'border-b border-ink-10' : ''
          }`}
      >
        <p className={`text-xl text-ink-100 font-semibold`}>
          Bot tín hiệu Telegram
        </p>
        {!isDesktop && isTelegramChatOpen && (
          <CopyTelegramDownSvg
            className="text-ink-100"
            onClick={() => {
              setIsTelegramChatOpen(false);
            }}
          />
        )}
        {!isDesktop && !isTelegramChatOpen && (
          <CopyTelegramUpSvg
            className="text-ink-100"
            onClick={() => {
              setIsTelegramChatOpen(true);
            }}
          />
        )}
      </div>
      {/* Select BOT */}
      {isTelegramChatOpen && (
        <div className="flex justify-between px-6 py-5 gap-2">
          <div className="flex gap-2 flex-grow md:flex-initial">
            {/* Select BOT */}
            {/* <div className="py-2 pl-3 pr-4 border border-ink-10 bg-ink-05 rounded-2xl w-[24.75rem]">
            <div className="relative flex justify-between items-center cursor-pointer">
              <div>
                <p className="pb-1 text-xs text-ink-60">Tên cấu hình BOT</p>
                <p className="text-ink-100">Money AI 1.8</p>
              </div>
              <Link to="/copy_trade_zoom">
                <img
                  className="w-[1.5rem]"
                  src={images.home.white_dropdown}
                  alt="Legend Group"
                />
              </Link>
              <div className="absolute top-[100%] pt-2 rounded-2xl bg-ink-05">
                <div></div>
              </div>
            </div>
          </div> */}

            <CopyTradeZoomSelectInput
              inputValue={searchInputTelegram}
              options={botList}
              containerClassName={`${isTablet ? 'w-[24.75rem]' : 'w-[10.375rem]'
                } flex-grow md:flex-initial`}
              labelName="Tên cấu hình BOT"
              onSelectChange={onSelectTelegramChange}
            />

            {/* <Link to="/copy_trade_zoom">
              <div className="p-[0.625rem] border border-ink-10 bg-ink-05 rounded-2xl flex-grow md:flex-initial">
                <img
                  className="w-[2.25rem]"
                  src={images.copy.telegram}
                  alt="Legend Group"
                />
              </div>
            </Link> */}
            <div onClick={() => openTelegramGroup(searchInputTelegram?.telegroup_name)} className="p-[0.625rem] border border-ink-10 bg-ink-05 rounded-2xl flex-grow md:flex-initial">
                <img
                  className="w-[2.25rem]"
                  src={images.copy.telegram}
                  alt="Legend Group"
                />
              </div>
          </div>

          <Link to="/copy_trade_zoom">
            <div className="p-[0.625rem] border border-ink-10 bg-ink-05 rounded-2xl">
              <img
                className="w-[2.25rem]"
                src={images.copy.stock}
                alt="Legend Group"
              />
            </div>
          </Link>
        </div>
      )}
      {/* History */}

      {isTelegramChatOpen && (
        <div className="mb-[0.625rem] px-6">
          <h3 className="mb-4 text-xl text-ink-100 font-medium">
            ({currentMoment.format('HH:mm:ss')}) Tổng hợp {botDetailList?.length} phiên giao dịch gần
            nhất:
          </h3>
          <div className="flex flex-col gap-y-4 max-h-[36.5rem] overflow-y-scroll">
            {
              botDetailList.map((item) => (
                <React.Fragment key={item.id}>
                  <p className="text-ink-100">
                    {item.o_status === 'PENDING' ? (
                      <>
                        ⏰ ({moment(item.created_at).format('HH:mm')}) phiên {item.ss_id}{' '}
                        {item.o_type === 'BUY' ? (
                          <span>🔊 Hãy đánh  {item.o_amount}{' '} $ TĂNG 🟩!</span>
                        ) : (
                          <span>🔊 Hãy đánh  {item.o_amount}{' '} $ GIẢM 🟥!</span>
                        )}
                      </>
                    ) : (
                      <>
                        ⏰ ({moment(item.created_at).format('HH:mm')}) phiên {item.ss_id}{' '}

                        {item.o_result === -1 ? <span>💢 -{item.o_amount} $ (-100%) </span> : <span>💰 {(item.o_amount * 0.95).toFixed(2)} $ (95.00%)</span>}
                      </>
                    )}
                  </p>
                </React.Fragment>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyTradeTelegram;
