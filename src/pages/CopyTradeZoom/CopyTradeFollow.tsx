import images from 'assets';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import { Column, useTable, usePagination } from 'react-table';
import ReactPaginate from 'react-paginate';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import BotSetting, { BotSettingResult } from 'types/BotSetting';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import APIs from 'apis';
import { uiActions } from 'stores/uiSlice';
import { number } from 'yup/lib/locale';
import CustomModal from 'components/CustomModal';
import GreyButton from 'components/GreyButton';
import GoldButton from 'components/GoldButton';
import BotSettingUpdate from 'types/BotSettingUpdate';
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import { useMediaQuery } from 'react-responsive';
import { ActionMeta, SingleValue } from 'react-select';
import InputSelectOption from 'types/InputSelectOption';
import SelectInput from 'components/SelectInput';

type CopyTradeFollowProps = {
  isFollowing: boolean;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
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

type PaginationEvent = {
  selected: number;
};

type SelectedIdsType = {
  [key: string]: boolean;
};

interface ListFollowTradeByMaster {
  master: number;
}

const INITIAL_BOT_SETTING_RESULT: BotSettingResult = {
  id: 0,
  master: 0,
  master_name: '',
  account_type: '',
  follower: 0,
  follower_name: '',
  follower_username: '',
  o_amount: 0,
  o_owner: 0,
  fold_command: 0,
  status: '',
  block_status: '',
  created_at: '',
  updated_at: '',
  current_profit: 0,
  current_date_profit: 0,
  current_volume: 0,
  current_date_volume: 0,
  aim_min: 0,
  aim_max: 0,
};

const PAGE_SIZE_OPTIONS: InputSelectOption[] = [
  { value: 10, label: '10/page' },
  { value: 20, label: '20/page' },
  { value: 30, label: '30/page' },
  { value: 40, label: '40/page' },
];

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: 'decimal',
};

const CopyTradeFollow: FC<CopyTradeFollowProps> = ({
  isFollowing,
  setIsFollowing,
  searchInput,
  setSearchInput,
}) => {
  const [selectedIds, setSelectedIds] = useState<SelectedIdsType>({});
  const [selectAll, setSelectAll] = useState(0);
  const [totalRecords, setTotalRecords] = useState(100);
  const [followingDatas, setFollowingDatas] = useState([]);

  // BOT SETTINGS
  const [botFollowingData, setBotFollowingData] = useState<BotSetting>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [botFollowingResults, setBotFollowingResults] = useState<
    BotSettingResult[]
  >([]);

  // MODAL
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedBotSettingResult, setSelectedBotSetting] =
    useState<BotSettingResult>(INITIAL_BOT_SETTING_RESULT);

  // PAGINATION
  const [selectedPageSizeOption, setSelectedPageSizeOption] =
    useState<InputSelectOption>(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(10);
  const [isPrevHover, setIsPrevHover] = useState(false);
  const [isNextHover, setIsNextHover] = useState(false);

  const selectedBotAccount = useAppSelector(
    (state) => state.user.selectedBotAccount
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

  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

  const data = React.useMemo<BotSettingResult[]>(
    () => botFollowingResults,
    [botFollowingResults]
  );

  const handleOpenPopupModal = useCallback(() => {
    setIsPopupOpen(true);
  }, []);

  const handleClosePopupModal = () => {
    setIsPopupOpen(false);
  };

  const getAllBotSettingByFollowingStatus = useCallback(
    (page: number) => {
      if (isFollowing) {
        // const data: ListFollowTradeByMaster = {
        //   master: +selectedBotAccount.value,
        // };
        axios
          .get(APIs.listCopyTradeSettingNonBlocking, {
            params: {
              page,
              page_size: selectedPageSizeOption.value,
            },
          })
          .then((res) => {
            const data: BotSetting = res.data;
            setBotFollowingData(data);
            setBotFollowingResults(data.results);
            if (data.count != null && selectedPageSizeOption.value != null) {
              setTotalPages(
                Math.ceil(data.count / +selectedPageSizeOption.value)
              );
            }
          })
          .catch(() => {
            enqueueSnackbar('Không thể lấy bot settings!', {
              variant: 'error',
            });
          });
      } else {
        axios
          .get(APIs.listCopyTradeSettingBlocking, {
            params: {
              page,
              page_size: selectedPageSizeOption.value,
            },
          })
          .then((res) => {
            const data: BotSetting = res.data;
            setBotFollowingData(data);
            setBotFollowingResults(data.results);
            if (data.count != null && selectedPageSizeOption.value != null) {
              setTotalPages(
                Math.ceil(data.count / +selectedPageSizeOption.value)
              );
            }
          })
          .catch(() => {
            enqueueSnackbar('Không thể lấy bot settings!', {
              variant: 'error',
            });
          });
      }
    },
    [enqueueSnackbar, isFollowing, selectedPageSizeOption.value]
  );

  const toggleRow = useCallback(
    (id: string | number) => {
      const newSelected = { ...selectedIds };
      newSelected[id] = !newSelected[id];
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

  const handleBlockingFollower = () => {
    // const blockStatusToUpdate =
    //   selectedBotSetting.block_status === 'none' ? 'blocked' : 'none';
    const blockStatusToUpdate = isFollowing ? 'blocked' : 'none';
    const data: BotSettingUpdate = {
      // status: selectedBotSetting.status,
      block_status: blockStatusToUpdate,
      // master: selectedBotSetting.master,
      // master_name: selectedBotSetting.master_name,
      // o_amount: selectedBotSetting.o_amount,
      // fold_command: selectedBotSetting.fold_command,
      // aim_min: selectedBotSetting.aim_min,
      // aim_max: selectedBotSetting.aim_max,
    };
    const selectedListIds = Object.entries(selectedIds)
      .filter((selected) => selected[1])
      .map((selected) => selected[0]);
    console.log('selectedListIds:', selectedListIds);
    axios
      .patch(`${APIs.updateSettingBlockStatusByIds}${selectedListIds}/`, data)
      .then((res) => {
        getAllBotSettingByFollowingStatus(page + 1);
        enqueueSnackbar(
          `${blockStatusToUpdate === 'blocked' ? 'Chặn' : 'Bỏ chặn'
          } thành công!`,
          { variant: 'success' }
        );
        setSelectedIds({});
        setSelectAll(0);
      })
      .catch((err) => {
        enqueueSnackbar(
          `${blockStatusToUpdate === 'blocked' ? 'Chặn' : 'Bỏ chặn'} thất bại!`,
          { variant: 'error' }
        );
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
      getAllBotSettingByFollowingStatus(1);
    }
  };

  const handlePageChange = useCallback(
    ({ selected }: { selected: number }) => {
      console.log(selected);
      const page = selected + 1;
      setPage(selected);
      getAllBotSettingByFollowingStatus(page);
    },
    [getAllBotSettingByFollowingStatus]
  );

  const columns = React.useMemo<Column<BotSettingResult>[]>(
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
          return <div className="text-left">Biệt danh</div>;
        },
        accessor: 'follower_name',
        Cell: (props) => {
          const original = props.cell.row.original;
          const isBlocked = original.block_status === 'blocked';
          return (
            <div className="flex items-center gap-x-1">
              <p className="text-sm text-ink-100">{original.follower_name}</p>
              {isBlocked && (
                <p className="text-xs text-purple-800">(Đã bị chặn)</p>
              )}
            </div>
          );
        },
      },
      {
        Header: 'Lợi nhuận',
        accessor: 'current_date_profit',
        align: 'center',
        Cell: (props) => {
          const original = props.cell.row.original.current_date_profit;
          return (
            <div className="text-center">
              <span className="rounded-3xl text-sm font-semibold">
                {(original && original > 0)
                  ? <span className='text-teal-100'>${original.toLocaleString('en-US', options)}</span>
                  : <span className='text-red-100'>${original.toLocaleString('en-US', options)}</span>
                }
              </span>
            </div>
          );
        },
      },
      {
        Header: 'Loại tài khoản',
        accessor: 'account_type',
        Cell: (props) => {
          const original = props.cell.row.original;
          const isDemoAccount = original.account_type === 'DEMO';
          // const isDemoAccount = false;
          return (
            <div className="flex justify-center gap-x-1">
              {/* <p>{original.account_type}</p> */}
              <p
                className={`px-2 ${isDemoAccount ? 'bg-blue-80' : 'bg-purple-100'
                  } rounded-3xl text-ink-100 text-xs`}
              >
                {original.account_type}
                {/* LIVE */}
              </p>
            </div>
          );
        },
      },
      /*
      {
        Header: () => <div className="text-end">Giá trị lệnh</div>,
        accessor: 'o_amount',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="text-end">
              <span className="rounded-3xl bg-primary-100 bg-clip-text text-transparent text-sm font-semibold">
                ${original.o_amount?.toLocaleString('en-US', options)}
              </span>
            </div>
          );
        },
      },
      */
      {
        Header: () => <div className="text-center">Volume ngày</div>,
        accessor: 'current_date_volume',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="text-center">
              <span className="rounded-3xl text-teal-100 text-sm font-semibold">
                ${original.current_date_volume?.toLocaleString('en-US', options)}
              </span>
            </div>
          );
        },
      },
      {
        Header: 'HS. Gấp lệnh',
        accessor: 'fold_command',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex justify-center items-center">
              <p className="px-2 leading-5 bg-orange-100 rounded-3xl text-ink-100 text-xs">
                X{original.fold_command?.toLocaleString('en-US', options)}
              </p>
            </div>
          );
        },
      },
      {
        Header: 'Chốt lãi/Cắt lỗ',
        accessor: 'profitLoss',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex items-center justify-center">
              <p className="px-2 leading-5 bg-green-100 rounded-3xl text-ink-100 text-xs">
                ${original.aim_max?.toLocaleString('en-US', options)}
              </p>
              /
              <p className="px-2 leading-5 bg-red-100 rounded-3xl text-ink-100 text-xs">
                ${original.aim_min?.toLocaleString('en-US', options)}
              </p>
            </div>
          );
        },
      },
      {
        Header: () => <div className="text-left">Tuyến trên</div>,
        accessor: 'master_above',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <>
              {original.master_above && (
                <div className="flex items-center gap-x-1">
                  {/* <img
                    className="w-[1.5rem] rounded-lg"
                    src={faker.image.people(undefined, undefined, true)}
                    alt="BotLambotrade"
                  /> */}
                  <p>{original.master_above}</p>
                </div>
              )}
            </>
          );
        },
      },
      // {
      //   accessor: 'actions',
      //   Cell: (props) => {
      //     const original = props.cell.row.original;
      //     return (
      //       <div className="flex justify-center gap-x-1">
      //         <Tooltip
      //           componentsProps={{
      //             tooltip: {
      //               className: '!px-0 !py-3 !bg-dropdown !rounded-xl',
      //             },
      //             arrow: {
      //               className:
      //                 '!w-[1rem] !translate-x-[9.6875rem] !before:bg-dropdown',
      //               sx: {
      //                 '&::before': {
      //                   background: 'var(--bg-dropdown)',
      //                 },
      //               },
      //             },
      //           }}
      //           title={
      //             <>
      //               <div
      //                 className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
      //                 onClick={() => {
      //                   handleOpenPopupModal();
      //                   setSelectedBotSetting(original);
      //                 }}
      //               >
      //                 <img
      //                   className="w-[1.5rem]"
      //                   src={images.table.edit}
      //                   alt="BotLambotrade"
      //                 />
      //                 <p className="text-ink-100 text-base">
      //                   {original.block_status === 'none' ? 'Chặn' : 'Bỏ chặn'}
      //                 </p>
      //               </div>
      //             </>
      //           }
      //           arrow
      //           placement="bottom-end"
      //         >
      //           <img
      //             className="cursor-pointer"
      //             src={images.table.actions}
      //             alt="BotLambotrade"
      //           />
      //         </Tooltip>
      //       </div>
      //     );
      //   },
      // },
    ],
    [selectAll, selectedIds, toggleAllRow, toggleRow]
  );

  const tableInstance = useTable({ columns, data }, usePagination);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
  } = tableInstance;

  const handlePageClick = (event: PaginationEvent) => {
    // const newOffset = (event.selected * itemsPerPage) % items.length;
    // console.log(
    //   `User requested page number ${event.selected}, which is offset ${newOffset}`
    // );
    console.log(event);
    // setItemOffset(newOffset);
  };

  const showIsDevelopingModal = () => {
    dispatch(uiActions.updateIsModalOpen(true));
  };

  useEffect(() => {
    getAllBotSettingByFollowingStatus(page + 1);
  }, [getAllBotSettingByFollowingStatus, page]);

  return (
    <>
      <div className="h-fit mb-6 bg-background-80 rounded-3xl">
        <div>
          <div className={`flex px-6 pt-2 border-b border-ink-10`}>
            <div
              className={`relative py-4 px-6 cursor-pointer ${isFollowing ? 'border-bottom-primary' : ''
                } whitespace-nowrap`}
              onClick={() => {
                setIsFollowing(true);
                setSelectAll(0);
                setSelectedIds({});
              }}
            >
              <p
                className={`${isFollowing
                    ? 'bg-primary-100 bg-clip-text text-transparent font-semibold'
                    : 'text-ink-60'
                  } text-sm`}
              >
                Đang theo dõi
              </p>
            </div>
            <div
              className={`relative py-4 px-6 cursor-pointer ${!isFollowing ? 'border-bottom-primary' : ''
                } whitespace-nowrap`}
              onClick={() => {
                setIsFollowing(false);
                setSelectAll(0);
                setSelectedIds({});
              }}
            >
              <p
                className={`${!isFollowing
                    ? 'bg-primary-100 bg-clip-text text-transparent font-semibold'
                    : 'text-ink-60'
                  } text-sm`}
              >
                Đang chặn
              </p>
            </div>
          </div>
          {botFollowingResults.length > 0 && (
            <div className="p-6 flex flex-col gap-y-6">
              <div>
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-ink-100"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-black-opacity-100"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full md:w-[21.375rem] py-3 pl-9 pr-8 text-sm text-black-opacity-40 border border-ink-20 rounded-xl bg-ink-05 focus:ring-blue-500 focus:border-blue-500 placeholder-black-opacity-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Tìm kiếm"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>

              {Object.values(selectedIds).filter((value) => value === true)
                .length > 0 && (
                  <div className="px-4 py-3 bg-ink-05 rounded-xl flex justify-between items-center">
                    <p className="text-ink-100 font-semibold">
                      {`Đã chọn ${Object.values(selectedIds).filter(
                        (value) => value === true
                      ).length
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
                        {isFollowing ? 'Chặn' : 'Bỏ chặn'}
                      </p>
                    </button>
                  </div>
                )}

              <div>
                <div
                  className={`border border-ink-05 rounded-2xl w-full ${!isDesktop ? 'overflow-x-scroll' : ''
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
                              <td className={`p-4`} {...cell.getCellProps()}>
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
                <div>
                  <SelectInput
                    value={selectedPageSizeOption}
                    onChange={handleSelectPageSize}
                    inputClassName="!py-2 !pr-8 text-sm"
                    indicatorContainerClassName="!right-3"
                    indicatorContainerIconClassName="!w-[1rem]"
                    menuPortalClassName={`min-w-[10.25rem] ${isMobile ? 'translate-x-[-3.2rem]' : ''
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

        {botFollowingResults.length === 0 && isFollowing && (
          <div className="py-[5rem] flex flex-col justify-center items-center gap-y-6">
            <img
              className="w-[10.25rem]"
              src={images.copy.followingEmpty}
              alt="BotLambotrade"
            />
            <p className="text-ink-60">Danh sách đang theo dõi trống</p>
          </div>
        )}

        {botFollowingResults.length === 0 && !isFollowing && (
          <div className="py-[5rem] flex flex-col justify-center items-center gap-y-6">
            <img
              className="w-[10.25rem]"
              src={images.copy.blockingEmpty}
              alt="BotLambotrade"
            />
            <p className="text-ink-60">Danh sách đang chặn trống</p>
          </div>
        )}

        {/* <div className="m-6 flex justify-end gap-x-2">
          <div className="px-3 py-2 flex justify-center items-center gap-x-1 border border-ink-10 rounded-lg">
            <p>
              {pageSize}/{totalRecords}
            </p>
            <KeyboardArrowDown
              sx={{
                fill: 'var(--color-ink-80)',
                cursor: 'pointer',
              }}
            />
          </div>
          <ReactPaginate
            breakLabel="..."
            onPageChange={handlePageClick}
            marginPagesDisplayed={isMobile ? 2 : 3}
            pageCount={page.length}
            previousLabel={
              <div className="p-[0.375rem] border border-ink-10 rounded-lg">
                <KeyboardArrowLeft sx={{ fill: 'var(--color-ink-80)' }} />
              </div>
            }
            nextLabel={
              <div className="p-[0.375rem] border border-ink-10 rounded-lg">
                <KeyboardArrowRight sx={{ fill: 'var(--color-ink-80)' }} />
              </div>
            }
            pageClassName="py-[0.375rem] px-3 border border-ink-10 rounded-lg"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="flex items-center gap-x-2 text-ink-80"
            activeClassName="active bg-primary-100 bg-clip-text text-transparent border-primary"
          />
        </div> */}
      </div>

      <CustomModal
        isOpen={isPopupOpen}
        handleOpen={handleOpenPopupModal}
        handleClose={handleClosePopupModal}
      >
        <div
          className={`absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 md:w-[31.25rem] w-[calc(100vw-2rem)] bg-background-80 rounded-3xl text-center`}
        >
          <h3 className="mb-2 mx-auto max-w-[18.75rem] text-xl text-ink-100">
            {isFollowing ? 'Chặn' : 'Bỏ chặn'} cấu hình
          </h3>
          <p className="mb-12 mx-auto max-w-[18.75rem] text-ink-80">
            Bạn có chắc chắn muốn {isFollowing ? 'chặn' : 'bỏ chặn'} cấu hình
            không?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4">
            <GreyButton onClick={handleClosePopupModal}>Huỷ</GreyButton>
            <GoldButton
              onClick={() => {
                handleBlockingFollower();
                handleClosePopupModal();
              }}
            >
              {isFollowing ? 'Chặn' : 'Bỏ chặn'}
            </GoldButton>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default CopyTradeFollow;
