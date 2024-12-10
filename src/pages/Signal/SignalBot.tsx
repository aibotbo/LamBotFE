import React, { FC, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Column, useTable } from 'react-table';
import SearchInput from 'components/SearchInput';
import { useMediaQuery } from 'react-responsive';
import APIs from 'apis';
import { uiActions } from 'stores/uiSlice';
import { useAppDispatch } from 'stores/hooks';
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import TableRightArrowSvg from 'svgs/TableRightArrowSvg';
import ICurrentSession, { ISession } from 'types/ICurrentSession';
import BotSignal, { BotSignalResult } from 'types/BotSignal';

const BASE_RATE = 0.95;

type SignalBotProps = {
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

const fetchBotSignalData = async (page: number): Promise<BotSignalResult[]> => {
    try {
        const response = await axios.get(`${APIs.botSignalTeleList}`, {
            params: {
                page,
                page_size: 20,
            },
        });
        return response.data.results.map((bot: any) => ({
            id: bot.id,
            bot_name: bot.bot_name,
            win_streak: bot.win_accum,
            total_win_streak: 0,
            lose_streak: bot.lose_accum,
            total_lose_streak: 0,
            total_win: bot.total_win,
            total_lose: bot.total_lose,
            total_volume: bot.total_volume,
            history: '',
        }));
    } catch (error) {
        console.error('Error fetching bot signal list:', error);
        return [];
    }
};

const SignalBot: FC<SignalBotProps> = ({ searchInput, setSearchInput, toggleHistory }) => {
    const [selected, setSelected] = useState<SelectedIdsType>({});
    const [selectAll, setSelectAll] = useState(0);
    const [botHistory, setBotHistory] = useState<BotSignal>({
        count: 0,
        next: null,
        previous: null,
        results: [],
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

    const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' });
    const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const dispatch = useAppDispatch();
    const enqueueSnackbar = useEnqueueSnackbar();

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

    const columns = React.useMemo<Column<BotSignalResult>[]>(
        () => [
            {
                accessor: 'bot_name',
                Header: () => {
                    return <div className="text-left">Tên Bot Telegram</div>;
                },
                Cell: (props) => {
                    const original = props.cell.row.original;
                    return (
                        <div className="flex">
                            <p>{original.bot_name}</p>
                        </div>
                    );
                },
            },

            {
                accessor: 'win_streak',
                Header: () => {
                    return <div className="text-center">Win </div>;
                },
                Cell: (props) => {
                    const original = props.cell.row.original;
                    return (
                        <div className="flex items-center justify-center">
                            <p className="px-2 rounded-3xl bg-green-100 text-xs text-ink-100">
                                {original.total_win}
                            </p>
                        </div>
                    );
                },
            },
            {
                accessor: 'lose_streak',
                Header: () => {
                    return <div className="text-center">Lose</div>;
                },
                Cell: (props) => {
                    const original = props.cell.row.original;
                    return (
                        <div className="flex items-center justify-center">
                            <p className={`px-2 rounded-3xl bg-red-100 text-xs text-ink-100`}>
                                {original.total_lose}
                            </p>
                        </div>
                    );
                },
            },

            {
                accessor: 'total_win_lose',
                Header: () => {
                    return <div className="text-center">Win/Lose</div>;
                },
                Cell: (props) => {
                    const original = props.cell.row.original;
                    return (
                        <div className="flex items-center justify-center">
                            {/*
              <p
                className={`px-3 rounded-3xl bg-green-100 text-xs text-ink-100`}
              >
                {original.total_win}
              </p>
              /
              <p className={`px-3 rounded-3xl bg-red-100 text-xs text-ink-100`}>
                {original.total_lose}
              </p>
              :
              */}
                            <p
                                className={`px-3 rounded-3xl bg-ink-100 text-xs text-background-100`}
                            >
                                {original.total_win - original.total_lose}
                            </p>
                        </div>
                    );
                },
            },
            {
                accessor: 'total_volume',
                Header: () => {
                    return <div className="text-end">KLGD</div>;
                },
                Cell: (props) => {
                    const original = props.cell.row.original;
                    return (
                        <div className="flex items-center justify-end">
                            <p className="bg-primary-100 bg-clip-text text-transparent">
                                ${original.total_volume}
                            </p>
                        </div>
                    );
                },
            },
            {
                accessor: 'history',
                Header: () => {
                    return <div className="text-end">Lịch sử</div>;
                },
                Cell: (props) => {
                    const original = props.cell.row.original;
                    return (
                        <div className="flex items-center justify-end">
                            <TableRightArrowSvg />
                        </div>
                    );
                },
            },
        ],
        []
    );

    const tableInstance = useTable({ columns, data: botHistory.results });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    const showIsDevelopingModal = () => {
        dispatch(uiActions.updateIsModalOpen(true));
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            countDownSession();
        }, 1000);
        return () => clearInterval(intervalId);
    }, [countDownSession]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchBotSignalData(1); // Fetch data for page 1
            setBotHistory((prevHistory) => ({
                ...prevHistory,
                results: data,
            }));
        };
        fetchData();
    }, []);

    return (
        <div className="h-fit mb-6 bg-background-80 rounded-3xl">
            <div className="p-6 border-b border-ink-10 flex justify-between items-center">
                <h1 className="text-xl text-ink-100 font-semibold">Signal tín hiệu Bot Telegram</h1>
            </div>

            <div className="p-6 flex flex-col gap-y-6">
                <div>
                    <SearchInput inputName="search" inputClassName="w-full md:w-[21.375rem]" searchInput={searchInput} setSearchInput={setSearchInput} />
                </div>

                <div>
                    <div className={`border border-ink-05 rounded-2xl w-full ${!isDesktop ? 'overflow-x-scroll' : ''}`}>
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
                                        className="border-b border-ink-10 last:border-0 cursor-pointer"
                                        onClick={() => {
                                            toggleHistory();
                                        }}
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
    );
};

export default SignalBot;
