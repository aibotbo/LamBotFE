import images from 'assets';
import React, { FC, useCallback, useEffect, useState } from 'react';
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
import ICurrentSession, { ISession } from 'types/ICurrentSession';
import moment from 'moment';
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import CustomModal from 'components/CustomModal';
import GreyButton from 'components/GreyButton';
import GoldButton from 'components/GoldButton';
import useWindowFocus from 'hooks/useWindowFocus';
import BotSignal, { BotSignalResult } from 'types/BotSignal';
import TableRightArrowSvg from 'svgs/TableRightArrowSvg';
import BotSignalHistory, {
  BotSignalHistoryResult,
} from 'types/BotSignalHistory';
import TableLeftArrowSvg from 'svgs/TableLeftArrowSvg';
import { useMediaQuery } from 'react-responsive';

const BASE_RATE = 0.95;

type SignalBotHistoryProps = {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  toggleHistory: () => void;
};

type SelectedIdsType = {
  [key: string]: boolean;
};

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const O_TYPE = ['BUY', 'SELL'];
const O_RESULT = [-1, 0, 1];

const generateFakeData = (): BotSignalHistoryResult[] => {
  return Array(10)
    .fill(0)
    .map((_, index) => ({
      id: faker.datatype.uuid(),
      ss_id: randomIntFromInterval(2865000, 2869000),
      o_id: faker.datatype.uuid(),
      o_type: O_TYPE[Math.floor(Math.random() * O_TYPE.length)],
      o_result: O_RESULT[Math.floor(Math.random() * O_RESULT.length)],
      created_at: moment().format('DD/MM/YYYY HH:mm'),
      o_amount: 50,
      output: 50,
    }));
};

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: 'decimal',
};

const SignalBotHistory: FC<SignalBotHistoryProps> = ({
  searchInput,
  setSearchInput,
  toggleHistory,
}) => {
  const [selected, setSelected] = useState<SelectedIdsType>({});
  const [selectAll, setSelectAll] = useState(0);
  const [botHistory, setBotHistory] = useState<BotSignalHistory>({
    count: 0,
    next: null,
    previous: null,
    results: generateFakeData(),
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [partnerBotId, setPartnerBotId] = useState(0);

  const [session, setSession] = useState<ISession>({
    ss_id: 0,
    ss_t: '',
    o_price: 0,
    c_price: 0,
    r_second: 0,
    st_time: '',
  });
  const [countdown, setCountdown] = useState(1);

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

  // MODAL
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // HOOKS
  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

  // const isTabVisible = useWindowFocus(() => {
  //   getCurrentSession();
  // });

  // const data = React.useMemo<BotCopyTradeSelfOrderHistoryResult[]>(
  //   () => botHistory.results,
  //   [botHistory]
  // );

  const data = React.useMemo<BotSignalHistoryResult[]>(
    () => botHistory.results,
    [botHistory.results]
  );

  const handleOpenPopupModal = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopupModal = () => {
    setIsPopupOpen(false);
  };

  const getCurrentSession = useCallback(() => {
    axios
      .get(APIs.currentSession)
      .then((res) => {
        const data: ICurrentSession = res.data;
        setSession(data.d);
        setCountdown(data.d.r_second);
      })
      .catch((err) => console.log(err));
  }, []);

  // const getOrderHistory = useCallback(() => {
  //   axios
  //     .get(APIs.orderSelfList)
  //     .then((res) => {
  //       const data: BotCopyTradeSelfOrderHistory = res.data;
  //       setBotHistory(data);
  //     })
  //     .catch(() => {
  //       enqueueSnackbar('Không thể lấy lịch sử giao dịch!', {
  //         variant: 'error',
  //       });
  //     });
  // }, [enqueueSnackbar]);

  const countDownSession = useCallback(() => {
    if (countdown === 1) {
      getCurrentSession();
      console.log(countdown);
      if (botHistory.results.length > 0) {
        // getOrderHistory();
      }
    } else {
      setCountdown((prev) => prev - 1);
    }
  }, [botHistory.results.length, countdown, getCurrentSession]);

  const columns = React.useMemo<Column<BotSignalHistoryResult>[]>(
    () => [
      {
        Header: () => {
          return <div className="text-left">Mã phiên</div>;
        },
        accessor: 'ss_id',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex">
              <p>{original.ss_id}</p>
            </div>
          );
        },
      },
      {
        Header: () => {
          return <div className="text-left">Thời gian</div>;
        },
        accessor: 'created_at',
        Cell: (props) => {
          const original = props.cell.row.original;
          // const convertedMoment = moment
          //   .unix(original.o_time / 1000)
          //   .format('DD/MM/YYYY HH:mm');
          return <p>{original.created_at}</p>;
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
          return (
            <div className="text-center">
              {isWinning && (
                <img
                  className="w-[1.5rem] mx-auto"
                  alt="BotLambotrade"
                  src={images.table.buy}
                />
              )}
              {isLosing && (
                <img
                  className="w-[1.5rem] mx-auto"
                  alt="BotLambotrade"
                  src={images.table.sell}
                />
              )}
              {isPending && (
                <p className="bg-primary-100 bg-clip-text text-transparent">
                  ...
                </p>
              )}
            </div>
          );
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
              {isPending && (
                <span className="bg-primary-100 bg-clip-text text-transparent rounded-3xl text-sm font-bold">
                  ...
                </span>
              )}
            </div>
          );
        },
      },
    ],
    [toggleHistory]
  );

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const showIsDevelopingModal = () => {
    dispatch(uiActions.updateIsModalOpen(true));
  };

  // Count down session
  useEffect(() => {
    const intervalId = setInterval(() => {
      countDownSession();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countDownSession]);

  // CHECK IF INITIALIZED => setPartnerBotId
  // useEffect(() => {
  //   if (!isInitialized && botHistory.results.length > 0) {
  //     setPartnerBotId(data[0].o_PartnerAcc_owner);
  //     setIsInitialized(true);
  //   }
  // }, [botHistory.results.length, data, isInitialized]);

  // RETRIEVE ORDER HISTORY
  // useEffect(() => {
  //   getOrderHistory();
  // }, [getOrderHistory]);

  // CHECK IF TAB IS FOCUS OR NOT

  return (
    <>
      <div className="h-fit mb-6 bg-background-80 rounded-3xl">
        <div className="p-6 border-b border-ink-10 flex justify-between items-center">
          <h1 className="text-xl text-ink-100 font-semibold">
            Lịch sử tín hiệu
          </h1>
          <button
            className="px-3 py-[0.625rem] rounded-xl flex items-center gap-[0.625rem] bg-primary-100"
            onClick={() => {
              toggleHistory();
            }}
          >
            {/* <img src={images.table.left_arrow} alt="BotLambotrade" /> */}
            <TableLeftArrowSvg className="text-background-100" />
            <p className="bg-background-100 bg-clip-text text-transparent font-semibold">
              Trở lại
            </p>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-y-6">
          <div>
            <SearchInput
              inputName="search"
              inputClassName="w-full md:w-[21.375rem]"
              searchInput={searchInput}
              setSearchInput={setSearchInput}
            />
          </div>

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
                          <td className="p-4 text-sm" {...cell.getCellProps()}>
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
        </div>
      </div>
    </>
  );
};

export default SignalBotHistory;
