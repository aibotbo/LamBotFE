import images from 'assets';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { faker } from '@faker-js/faker';
import { Column, useTable } from 'react-table';
import SearchInput from 'components/SearchInput';
import CopyTradeSelfOrderHistory, {
  CopyTradeSelfOrderHistoryResult,
} from 'types/CopyTradeSelfOrderHistory';
import APIs from 'apis';
import axios from 'axios';
import { uiActions } from 'stores/uiSlice';
import { useAppDispatch } from 'stores/hooks';
import ICurrentSession, {
  ISession,
  ISessionLocal,
} from 'types/ICurrentSession';
import moment from 'moment';
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import CustomModal from 'components/CustomModal';
import GreyButton from 'components/GreyButton';
import GoldButton from 'components/GoldButton';
import useWindowFocus from 'hooks/useWindowFocus';
import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import ReactPaginate from 'react-paginate';
import SelectInput from 'components/SelectInput';
import InputSelectOption from 'types/InputSelectOption';
import { SingleValue, ActionMeta } from 'react-select';
import { useMediaQuery } from 'react-responsive';

const BASE_RATE = 0.95;

const PAGE_SIZE_OPTIONS: InputSelectOption[] = [
  { value: 10, label: '10/page' },
  { value: 20, label: '20/page' },
  { value: 30, label: '30/page' },
  { value: 40, label: '40/page' },
];

type CopyTradeHistoryManualSelfProps = {
  isMaster: boolean;
  setIsMaster: React.Dispatch<React.SetStateAction<boolean>>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
};

type TableData = {
  id: string;
  checkbox?: string;
  logo?: string;
  nickname?: string;
  accountType?: string;
  orderAmount?: number;
  volumeAmount?: number;
  multiply?: number;
  profit?: number;
  loss?: number;
  profitLoss?: number;
  master?: string;
  masterLogo?: string;
  masterName?: string;
};

type SelectedIdsType = {
  [key: string]: boolean;
};

const TIME_IN_ONE_SESSION = 30;

const SESSION_TYPES = ['WAIT', 'TRADE'];

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: 'decimal',
};

const CopyTradeHistoryManualSelf: FC<CopyTradeHistoryManualSelfProps> = ({
  isMaster,
  setIsMaster,
  searchInput,
  setSearchInput,
}) => {
  const [selectedIds, setSelectedIds] = useState<SelectedIdsType>({});
  const [selectAll, setSelectAll] = useState(0);
  const [botHistory, setBotHistory] = useState<CopyTradeSelfOrderHistory>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [partnerBotId, setPartnerBotId] = useState(0);

  // SESSION
  const [sessionLocal, setSessionLocal] = useState<ISessionLocal>({
    ss_t: '',
    r_second: 0,
  });
  const [sessionId, setSessionId] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [startSession, setStartSession] = useState<ISession>({
    ss_id: 0,
    ss_t: 'WAIT',
    o_price: 0,
    c_price: 0,
    r_second: 0,
    st_time: moment().format('YYYY-MM-DDTHH:mm:ss.SSSS'),
  });

  // MODAL
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // PAGINATION
  // const [pageSize, setPageSize] = useState(10);
  const [selectedPageSizeOption, setSelectedPageSizeOption] =
    useState<InputSelectOption>(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(10);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isPrevHover, setIsPrevHover] = useState(false);
  const [isNextHover, setIsNextHover] = useState(false);

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

  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

  const data = React.useMemo<CopyTradeSelfOrderHistoryResult[]>(
    () => botHistory.results,
    [botHistory]
  );

  // MODAL FUNCTION
  const handleOpenPopupModal = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopupModal = () => {
    setIsPopupOpen(false);
  };

  // CHECKBOX FUNCTION
  const toggleRow = useCallback(
    (id: number | string) => {
      const newSelected = { ...selectedIds };
      newSelected[id] = !newSelected[id];
      console.log(newSelected);
      setSelectedIds(newSelected);
      const totalSelected = Object.entries(newSelected).reduce(
        (prev, value) => {
          if (value[1]) return prev + 1;
          return prev;
        },
        0
      );
      if (totalSelected >= data.length) {
        setSelectAll(1);
      } else {
        setSelectAll(0);
      }
    },
    [data.length, selectedIds]
  );

  const toggleAllRow = useCallback(() => {
    let newSelected: SelectedIdsType = {};

    if (selectAll === 0) {
      data.forEach((x) => {
        newSelected[x.id] = true;
      });
    }
    setSelectedIds(newSelected);
    setSelectAll((prev) => (prev === 0 ? 1 : 0));
  }, [data, selectAll]);

  // FUNCTIONAL REQUIREMENTS
  const getCurrentSession = useCallback(() => {
    const noLoadingAxios = axios.create();
    noLoadingAxios
      .get(APIs.currentSession)
      .then((res) => {
        const data: ICurrentSession = res.data;
        setSessionId(data.d.ss_id);
        setStartSession(data.d);
      })
      .catch((err) => console.log(err));
  }, []);

  const getOrderHistory = useCallback(
    (page: number) => {
      const noLoadingAxios = axios.create();
      noLoadingAxios
        .get(`${APIs.orderSelfList}`, {
          params: {
            page,
            page_size: selectedPageSizeOption.value,
          },
        })
        .then((res) => {
          const data: CopyTradeSelfOrderHistory = res.data;
          setBotHistory(data);
          if (data.count != null && selectedPageSizeOption.value != null) {
            setTotalPages(
              Math.ceil(data.count / +selectedPageSizeOption.value)
            );
          }
        })
        .catch(() => {
          enqueueSnackbar('Không thể lấy lịch sử giao dịch!', {
            variant: 'error',
          });
        });
    },
    [enqueueSnackbar, selectedPageSizeOption]
  );

  const updateOrderHistory = useCallback(() => {
    const noLoadingAxios = axios.create();
    noLoadingAxios
      .get(`${APIs.updateOrderListById}`)
      .then((res) => {
        getOrderHistory(page + 1);
      })
      .catch(() => {
        const notification = {
          id: Math.floor(Math.random() * 101 + 1),
          title: 'Thất bại',
          description: 'Không thể lấy lịch sử giao dịch!',
          backgroundColor: 'text-red-100',
          icon: images.toast.error,
        };
        dispatch(uiActions.showNotifications(notification));
      });
  }, [dispatch, getOrderHistory, page]);

  // SESSION
  const getCurrentSessionByLocalTime = useCallback(() => {
    // GET START SESSION AND CONSTANTS
    const currentSecond = moment().second();
    const MAXIMUM_SECOND_IN_A_MINUTE = 60;
    const START_SESSION_SECOND_CONVERTED = +moment(startSession.st_time).format(
      'ss'
    );

    const START_SESSION =
      START_SESSION_SECOND_CONVERTED < 30
        ? START_SESSION_SECOND_CONVERTED
        : Math.abs(30 - START_SESSION_SECOND_CONVERTED);

    // RETRIEVE START SESSION TYPE
    let middleSessionType: string;
    let notMiddleSessionType: string;
    if (START_SESSION_SECOND_CONVERTED < 30) {
      middleSessionType = startSession.ss_t;
      notMiddleSessionType = SESSION_TYPES.filter(
        (type) => type !== middleSessionType
      )[0];
    } else {
      middleSessionType = SESSION_TYPES.filter(
        (type) => type !== startSession.ss_t
      )[0];
      notMiddleSessionType = startSession.ss_t;
    }

    // const START_SESSION =
    //   START_SESSION_TRADE < 30
    //     ? START_SESSION_TRADE
    //     : Math.abs(30 - START_SESSION_TRADE);

    // 15 <= sess < 45
    const isInMiddleSession =
      currentSecond >= START_SESSION &&
      currentSecond < START_SESSION + TIME_IN_ONE_SESSION;

    // type is TRADE if START < 30 and isInMiddleSession
    let sessionType = isInMiddleSession
      ? middleSessionType
      : notMiddleSessionType;
    let timeLeft;
    if (isInMiddleSession) {
      // 15 <= sess < 45
      console.log('15 <= sess < 45', currentSecond);
      timeLeft = START_SESSION + TIME_IN_ONE_SESSION - currentSecond;
    } else if (currentSecond >= START_SESSION + TIME_IN_ONE_SESSION) {
      // 45 <= sess < 60
      console.log('45 <= sess < 60', currentSecond);
      const START_SESSION_UPPER = START_SESSION + TIME_IN_ONE_SESSION;
      timeLeft = START_SESSION_UPPER + TIME_IN_ONE_SESSION - currentSecond;
    } else {
      // 0 <= sess < 15
      console.log('0 <= sess < 15', currentSecond);
      // In this case: START_SESSION = END_LOWER_SESSION
      const END_LOWER_SESSION = START_SESSION;
      timeLeft = END_LOWER_SESSION - currentSecond;
    }
    // UPDATE SESSION ID
    const isStartSession = currentSecond === START_SESSION;
    const endSessionSecond =
      START_SESSION + TIME_IN_ONE_SESSION === MAXIMUM_SECOND_IN_A_MINUTE
        ? 0
        : START_SESSION + TIME_IN_ONE_SESSION;
    const isEndSession = currentSecond === endSessionSecond;
    if ((isStartSession || isEndSession) && sessionId !== 0) {
      setSessionId((prev) => prev + 1);
    }
    // GET PARTNER BOT AFTER END WAIT SESSION
    if (isEndSession && sessionId !== 0) {
      updateOrderHistory();
    }
    setSessionLocal({
      r_second: timeLeft,
      ss_t: sessionType,
    });
  }, [updateOrderHistory, sessionId, startSession.ss_t, startSession.st_time]);

  const deleteHistoryByListIds = () => {
    // ENTRY: string: boolean
    console.log(selectedIds);
    const selectedListIds = Object.entries(selectedIds)
      .filter((selected) => selected[1])
      .map((selected) => selected[0]);
    console.log('selectedListIds:', selectedListIds);
    axios
      .delete(`${APIs.deleteOrderByIds}${selectedListIds}`)
      .then((res) => {
        getOrderHistory(page + 1);
        setSelectAll(0);
        setSelectedIds({});
        enqueueSnackbar('Xoá cấu hình thành công!', { variant: 'success' });
      })
      .catch(() => {
        enqueueSnackbar('Xoá cấu hình thất bại!', { variant: 'error' });
      });
  };

  // PAGINATION FUNCTION
  const handleSelectPageSize = (
    option: SingleValue<InputSelectOption>,
    actionMeta: ActionMeta<InputSelectOption>
  ) => {
    if (option != null) {
      setSelectedPageSizeOption(option);
      setPage(0);
      getOrderHistory(1);
    }
  };

  const handlePageChange = useCallback(
    ({ selected }: { selected: number }) => {
      console.log(selected);
      const page = selected + 1;
      setPage(selected);
      getOrderHistory(page);
    },
    [getOrderHistory]
  );

  const columns = React.useMemo<Column<CopyTradeSelfOrderHistoryResult>[]>(
    () => [
      {
        id: 'checkbox',
        accessor: 'checkbox',
        Cell: (props) => {
          const original = props.cell.row.original;
          // console.log(selected);
          // console.log(original.id);
          return (
            <div className="flex justify-center items-center">
              <input
                type="checkbox"
                className="checkbox"
                checked={selectedIds[original.id] === true}
                onChange={(e) => toggleRow(original.id)}
              />
            </div>
          );
        },
        Header: () => {
          return (
            <div className="flex justify-center items-center">
              <input
                type="checkbox"
                className="checkbox text-center"
                checked={selectAll === 1}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = selectAll === 2;
                  }
                }}
                onChange={() => toggleAllRow()}
              />
            </div>
          );
        },
        sortable: false,
        width: 45,
      },
      {
        Header: () => {
          return <div className="text-left">Mã phiên</div>;
        },
        accessor: 'ss_id',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div>
              <p>{original.ss_id}</p>
            </div>
          );
        },
      },
      {
        Header: () => {
          return <div className="text-left">Thời gian</div>;
        },
        accessor: 'o_time',
        Cell: (props) => {
          const original = props.cell.row.original;
          const convertedMoment = moment
            .unix(original.o_time / 1000)
            .format('DD/MM/YYYY HH:mm');
          return <p>{convertedMoment}</p>;
        },
      },
      {
        Header: () => {
          return <div className="text-center">Loại tài khoản</div>;
        },
        accessor: 'account_type',
        Cell: (props) => {
          const original = props.cell.row.original;
          const isDemoAccount = original.account_type === 'DEMO';
          // const isDemoAccount = false;
          return (
            <div className="flex justify-center gap-x-1">
              {/* <p>{original.account_type}</p> */}
              <p
                className={`px-2 ${
                  isDemoAccount ? 'bg-blue-80' : 'bg-purple-100'
                } rounded-3xl text-ink-100 text-xs`}
              >
                {original.account_type}
                {/* LIVE */}
              </p>
            </div>
          );
        },
      },
      {
        Header: () => {
          return <div className="text-left">Tài khoản giao dịch</div>;
        },
        accessor: 'o_PartnerAcc_owner_name',
        Cell: (props) => {
          const original = props.cell.row.original;
          // const isDemoAccount = false;
          return (
            <div>
              <p>{original.o_PartnerAcc_owner_name}</p>
            </div>
          );
        },
      },
      {
        Header: () => <div className="text-center">Lệnh vào</div>,
        accessor: 'o_type',
        Cell: (props) => {
          const original = props.cell.row.original;
          const imageOrderType =
            original.o_type === 'BUY' ? images.table.buy : images.table.sell;
          return (
            <div className="text-center">
              <img
                className="w-[1.5rem] mx-auto"
                alt="BotLambotrade"
                src={imageOrderType}
              />
            </div>
          );
        },
      },
      {
        Header: () => <div className="text-center">Kết quả</div>,
        accessor: 'o_result',
        Cell: (props) => {
          const original = props.cell.row.original;
          const isWinning = original.o_result === 1;
          const isLosing = original.o_result === -1;
          const isPending =
            original.o_result === 0 || original.o_result == null;
          const isDraw = original.o_result === 0;
          const isFinished = original.o_status === 'FINISHED';
          let imageOrderType = <></>;
          if (isWinning) {
            if (original.o_type === 'BUY') {
              imageOrderType = (
                <img
                  className="w-[1.5rem] mx-auto"
                  alt="BotLambotrade"
                  src={images.table.buy}
                />
              );
            } else if (original.o_type === 'SELL') {
              imageOrderType = (
                <img
                  className="w-[1.5rem] mx-auto"
                  alt="BotLambotrade"
                  src={images.table.sell}
                />
              );
            }
          } else if (isLosing) {
            if (original.o_type === 'BUY') {
              imageOrderType = (
                <img
                  className="w-[1.5rem] mx-auto"
                  alt="BotLambotrade"
                  src={images.table.sell}
                />
              );
            } else if (original.o_type === 'SELL') {
              imageOrderType = (
                <img
                  className="w-[1.5rem] mx-auto"
                  alt="BotLambotrade"
                  src={images.table.buy}
                />
              );
            }
          } else if (isDraw && isFinished) {
            imageOrderType = (
              <img
                className="w-[1.5rem] mx-auto"
                alt="BotLambotrade"
                src={images.table.draw}
              />
            );
          } else if (isPending) {
            imageOrderType = (
              <p className="bg-primary-100 bg-clip-text text-transparent">
                ...
              </p>
            );
          }
          return <div className="text-center">{imageOrderType}</div>;
        },
      },
      {
        Header: () => <div className="text-end">Giá trị lệnh</div>,
        accessor: 'o_amount',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="text-end">
              <span className="bg-primary-100 bg-clip-text text-transparent text-sm font-bold">
                ${original.o_amount?.toLocaleString('en-US', options)}
              </span>
            </div>
          );
        },
      },
      {
        Header: () => <div className="text-end">Thanh toán</div>,
        accessor: 'output',
        Cell: (props) => {
          const original = props.cell.row.original;
          const isWinning = original.o_result === 1;
          const isLosing = original.o_result === -1;
          const isPending =
            original.o_result === 0 || original.o_result == null;
          const isDraw = original.o_result === 0;
          const isFinished = original.o_status === 'FINISHED';
          return (
            <div className="text-end">
              {isWinning && (
                <span className="text-green-100 rounded-3xl text-sm font-bold">
                  +$
                  {(original.o_amount * BASE_RATE).toLocaleString(
                    'en-US',
                    options
                  )}
                </span>
              )}
              {isLosing && (
                <span className="text-red-100 rounded-3xl text-sm font-bold">
                  -$
                  {original.o_amount.toLocaleString('en-US', options)}
                </span>
              )}
              {isFinished && isDraw ? (
                <span className="bg-primary-100 bg-clip-text text-transparent rounded-3xl text-sm font-bold">
                  ${original.o_amount.toLocaleString('en-US', options)}
                </span>
              ) : isPending ? (
                <span className="bg-primary-100 bg-clip-text text-transparent rounded-3xl text-sm font-bold">
                  ...
                </span>
              ) : (
                <span className="bg-primary-100 bg-clip-text text-transparent rounded-3xl text-sm font-bold"></span>
              )}
            </div>
          );
        },
      },
    ],
    [selectAll, selectedIds, toggleAllRow, toggleRow]
  );

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const showIsDevelopingModal = () => {
    dispatch(uiActions.updateIsModalOpen(true));
  };

  // INTERVAL GET CURRENT SESSION BY LOCAL TIME
  useEffect(() => {
    if (!isInitialized) {
      getCurrentSession();
      setIsInitialized(true);
    }
    const intervalId = setInterval(() => {
      getCurrentSessionByLocalTime();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [getCurrentSession, getCurrentSessionByLocalTime, isInitialized]);

  // TIME OUT 3 MINS FOR GET CURRENT SESSION
  useEffect(() => {
    const threeMins = 180000;
    const interval = setInterval(() => {
      getCurrentSession();
    }, threeMins);

    return () => {
      clearInterval(interval);
    };
  }, [getCurrentSession]);

  // CHECK IF INITIALIZED => setPartnerBotId
  useEffect(() => {
    if (!isInitialized && botHistory.results.length > 0) {
      setPartnerBotId(data[0].o_PartnerAcc_owner);
      setIsInitialized(true);
    }
  }, [botHistory.results.length, data, isInitialized]);

  // RETRIEVE ORDER HISTORY
  useEffect(() => {
    getOrderHistory(page + 1);
  }, [getOrderHistory, page]);

  // CHECK IF TAB IS FOCUS OR NOT

  return (
    <>
      <div className="h-fit mb-6 bg-background-80 rounded-3xl">
        <div className="flex gap-y-6 px-6 pt-2 border-b border-ink-10">
          <div
            className={`relative py-4 px-6 cursor-pointer ${
              !isMaster ? 'border-bottom-primary' : ''
            }`}
            onClick={() => {
              setIsMaster(false);
              setSelectAll(0);
              setSelectedIds({});
            }}
          >
            <p
              className={`${
                !isMaster
                  ? 'bg-primary-100 bg-clip-text text-transparent font-semibold'
                  : 'text-ink-60'
              } text-sm whitespace-nowrap`}
            >
              Trade cá nhân
            </p>
          </div>
          <div
            className={`relative py-4 px-6 cursor-pointer ${
              isMaster ? 'border-bottom-primary' : ''
            }`}
            onClick={() => {
              setIsMaster(true);
              setSelectAll(0);
              setSelectedIds({});
            }}
          >
            <p
              className={`${
                isMaster
                  ? 'bg-primary-100 bg-clip-text text-transparent font-semibold'
                  : 'text-ink-60'
              } text-sm whitespace-nowrap`}
            >
              Trade chuyên gia
            </p>
          </div>
        </div>

        {botHistory.results.length === 0 && (
          <div className="py-[5rem] flex flex-col justify-center items-center gap-y-6">
            <img
              className="w-[10.25rem]"
              src={images.copy.manualEmpty}
              alt="BotLambotrade"
            />
            <p className="text-ink-60">Lịch sử trade cá nhân trống</p>
          </div>
        )}

        {botHistory.results.length > 0 && (
          <div className="p-6 flex flex-col gap-y-6">
            {/* SEARCH */}
            <div>
              <SearchInput
                inputName="search"
                inputClassName="w-full md:w-[21.375rem]"
                searchInput={searchInput}
                setSearchInput={setSearchInput}
              />
            </div>

            {/* SELECTED CHECKBOX */}
            {Object.values(selectedIds).filter((value) => value === true)
              .length > 0 && (
              <div className="px-4 py-3 bg-ink-05 rounded-xl flex justify-between items-center">
                <p className="text-ink-100 font-semibold">
                  {`Đã chọn ${
                    Object.values(selectedIds).filter((value) => value === true)
                      .length
                  }`}
                </p>
                <button
                  className="px-8 py-3 bg-primary-100 rounded-xl"
                  onClick={() => {
                    // showIsDevelopingModal();
                    handleOpenPopupModal();
                  }}
                >
                  <p className="bg-background-100 bg-clip-text text-transparent font-semibold">
                    Xoá
                  </p>
                </button>
              </div>
            )}

            {/* TABLE */}
            <div>
              <div
                className={`border border-ink-05 rounded-2xl w-full ${
                  !isDesktop ? 'overflow-x-scroll' : ''
                }`}
              >
                <table className="w-full" {...getTableProps()}>
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            className={`p-4 bg-primary-05 first-of-type:rounded-tl-2xl last-of-type:rounded-tr-2xl text-sm text-ink-100 font-normal whitespace-nowrap text-ellipsis`}
                            {...column.getHeaderProps()}
                          >
                            {column.render('Header')}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          className={`border-b border-ink-10 last:border-0 whitespace-nowrap text-ellipsis`}
                          {...row.getRowProps()}
                        >
                          {row.cells.map((cell) => (
                            <td
                              className="p-4 text-sm"
                              {...cell.getCellProps()}
                            >
                              {cell.render('Cell')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION */}
            <div
              className={`flex flex-col justify-center items-end md:flex-row md:justify-end md:items-center gap-2`}
            >
              {/* <div className="px-3 py-[0.375rem] flex justify-center items-center gap-x-1 border-input-ink rounded-lg">
                <SelectInput
                  value={selectedPageSizeOption}
                  onChange={handleSelectPageSize}
                  name="select"
                  options={PAGE_SIZE_OPTIONS}
                />
                <p>
                  {selectedPageSizeOption.value}/{botHistory.count}
                </p>
                <KeyboardArrowDown
                  sx={{
                    fill: 'var(--color-ink-80)',
                    cursor: 'pointer',
                  }}
                />
              </div> */}
              <div>
                <SelectInput
                  menuRef={menuRef}
                  value={selectedPageSizeOption}
                  onChange={handleSelectPageSize}
                  inputClassName="!py-2 !pr-8 text-sm"
                  indicatorContainerClassName="!right-3"
                  indicatorContainerIconClassName="!w-[1rem]"
                  menuPortalClassName={`min-w-[10.25rem] ${
                    isMobile ? 'translate-x-[-3.2rem]' : ''
                  }`}
                  name="select"
                  options={PAGE_SIZE_OPTIONS}
                />
              </div>

              <ReactPaginate
                breakLabel="..."
                onPageChange={handlePageChange}
                marginPagesDisplayed={isMobile ? 2 : 3}
                pageCount={totalPages}
                previousLabel={
                  <div
                    onMouseLeave={() => {
                      setIsPrevHover(false);
                    }}
                    onMouseEnter={() => {
                      setIsPrevHover(true);
                    }}
                    className="p-[0.375rem] border-input-ink before:rounded-lg"
                  >
                    {isPrevHover ? (
                      <img
                        className="w-[1.25rem]"
                        src={images.table.pagination_left_arrow_gold}
                        alt="BotLambotrade"
                      />
                    ) : (
                      // <KeyboardArrowLeft sx={{ fill: 'var(--color-ink-80)' }} />
                      <img
                        className="w-[1.25rem]"
                        src={images.table.pagination_left_arrow}
                        alt="BotLambotrade"
                      />
                    )}
                  </div>
                }
                nextLabel={
                  <div
                    onMouseLeave={() => {
                      setIsNextHover(false);
                    }}
                    onMouseEnter={() => {
                      setIsNextHover(true);
                    }}
                    className="p-[0.375rem] border-input-ink before:rounded-lg"
                  >
                    {/* <KeyboardArrowRight sx={{ fill: 'var(--color-ink-80)' }} /> */}
                    {isNextHover ? (
                      <img
                        className="w-[1.25rem]"
                        src={images.table.pagination_right_arrow_gold}
                        alt="BotLambotrade"
                      />
                    ) : (
                      <img
                        className="w-[1.25rem]"
                        src={images.table.pagination_right_arrow}
                        alt="BotLambotrade"
                      />
                    )}
                  </div>
                }
                forcePage={page}
                // pageClassName="py-[0.3125rem] px-3 border-input-ink before:rounded-lg cursor-pointer"
                pageLinkClassName="page-link relative z-10 py-[0.3125rem] px-3 border-input-ink before:rounded-lg cursor-pointer"
                previousClassName="page-item flex"
                previousLinkClassName="page-link"
                nextClassName="page-item flex"
                nextLinkClassName="page-link relative z-10"
                breakClassName="page-item py-[0.375rem] px-3 border-input-ink before:rounded-lg cursor-pointer"
                breakLinkClassName="page-link z-10"
                containerClassName="flex items-center gap-x-2 text-ink-80 text-sm"
                activeClassName="pagination-active border-primary before:rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <CustomModal
        isOpen={isPopupOpen}
        handleOpen={handleOpenPopupModal}
        handleClose={handleClosePopupModal}
      >
        <div
          className={`absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 md:w-[31.25rem] w-[calc(100vw-2rem)] bg-background-80 rounded-3xl text-center`}
        >
          <div className="flex items-center justify-center">
            <img
              className="mb-4 w-[5.5rem]"
              src={images.copy.delete}
              alt="BotLambotrade"
            />
          </div>
          <h3 className="mb-2 mx-auto max-w-[18.75rem] text-xl text-ink-100">
            Xoá lịch sử trade cá nhân
          </h3>
          <p className="mb-12 mx-auto max-w-[18.75rem] text-ink-80">
            Bạn có chắc chắn muốn xoá lịch sử trade cá nhân không?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4">
            <GreyButton onClick={handleClosePopupModal}>Huỷ</GreyButton>
            <GoldButton
              onClick={() => {
                deleteHistoryByListIds();
                handleClosePopupModal();
              }}
            >
              Xoá
            </GoldButton>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default CopyTradeHistoryManualSelf;
