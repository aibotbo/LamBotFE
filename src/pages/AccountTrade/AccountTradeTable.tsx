import images from 'assets';
import React, { FC, useCallback, useState } from 'react';
import { faker } from '@faker-js/faker';
import { Column, useTable, usePagination } from 'react-table';
import ReactPaginate from 'react-paginate';
import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { ClickAwayListener, Tooltip } from '@mui/material';
import BotData from 'types/BotData';
import CustomModal from 'components/CustomModal';
import GreyButton from 'components/GreyButton';
import GoldButton from 'components/GoldButton';
import axios from 'axios';
import APIs from 'apis';
import { useAppDispatch } from 'stores/hooks';
import { uiActions } from 'stores/uiSlice';
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import { useMediaQuery } from 'react-responsive';

const STATUSES_MAP = {
  active: 'Đang đăng nhập',
  inactive: 'Chưa đăng nhập',
};

type TableData = {
  id: string;
  checkbox?: string;
  nickname?: string;
  referCode?: string;
  email?: string;
  balance?: number;
  status?: string;
  actions?: string;
};

type PaginationEvent = {
  selected: number;
};

type SelectedIdsType = {
  [key: string]: boolean;
};

interface AccountTradeTableProps {
  partnerBotDatas: BotData[];
  fetchAllBots: () => void;
}

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: 'decimal',
};

interface TooltipToggle {
  [x: string | number]: boolean;
}

// const generateFakeData = (): BotData[] => {
//   return Array(5)
//     .fill(0)
//     .map((_, index) => ({
//       id: faker.datatype.uuid(),
//       nickname: faker.name.fullName(),
//       referCode: faker.random.word(),
//       email: faker.internet.email(),
//       balance: 50000,
//       status: index % 2 === 0 ? 'active' : 'inactive',
//     }));
// };

const AccountTradeTable: FC<AccountTradeTableProps> = ({
  partnerBotDatas,
  fetchAllBots,
}) => {
  const [selectedAccountTradeIds, setSelectedAccountTradeIds] =
    useState<SelectedIdsType>({});
  const [selectedBot, setSelectedBot] = useState<BotData>();
  const [selectAll, setSelectAll] = useState(0);
  const [totalRecords, setTotalRecords] = useState(100);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

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

  const partnerDatas = React.useMemo<BotData[]>(
    () => partnerBotDatas,
    [partnerBotDatas]
  );

  // Tooltips
  const [isTooltipOpen, setIsTooltipOpen] = useState<TooltipToggle>({});

  const handleTooltipOpen = useCallback((rowIndex: string | number) => {
    if (!isTooltipOpen[rowIndex]) {
      setIsTooltipOpen((prevState) => ({
        [rowIndex]: true,
      }));
    }
  }, []);

  const handleTooltipClose = (rowIndex: string | number) => {
    console.log('handleTooltipClose');
    if (isTooltipOpen[rowIndex]) {
      setIsTooltipOpen((prevState) => ({
        [rowIndex]: false,
      }));
    }
  };

  const handleTooltipToggle = (rowIndex: string | number) => {
    setIsTooltipOpen((prevState) => ({
      [rowIndex]: !prevState[rowIndex],
    }));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleRow = useCallback(
    (id: number) => {
      const newSelected = { ...selectedAccountTradeIds };
      newSelected[id] = !newSelected[id];
      setSelectedAccountTradeIds(newSelected);
      const totalSelected = Object.entries(newSelected).reduce(
        (prev, value) => {
          if (value[1]) return prev + 1;
          return prev;
        },
        0
      );
      if (totalSelected >= partnerDatas.length) {
        setSelectAll(1);
      } else {
        setSelectAll(0);
      }
    },
    [partnerDatas.length, selectedAccountTradeIds]
  );

  const handleBotLogout = useCallback(
    (partnerAccId: number | undefined, status: string) => {
      const logoutBot = {
        status,
      };
      // http://149.28.128.238/partner/details/1/
      axios
        .patch(`${APIs.partnerAccountDetail}${partnerAccId}/`, logoutBot)
        .then((res) => {
          fetchAllBots();
          // const notification = {
          //   id: Math.floor(Math.random() * 101 + 1),
          //   title: 'Thành công',
          //   description: 'Đăng xuất tài khoản thành công!',
          //   backgroundColor: 'text-green-100',
          //   icon: images.toast.check,
          // };
          // dispatch(uiActions.showNotifications(notification));
          enqueueSnackbar('Đăng xuất tài khoản thành công!', {
            variant: 'success',
          });
        })
        .catch(() => {
          // const notification = {
          //   id: Math.floor(Math.random() * 101 + 1),
          //   title: 'Thất bại',
          //   description: 'Đăng xuất tài khoản thất bại!',
          //   backgroundColor: 'text-red-100',
          //   icon: images.toast.error,
          // };
          // dispatch(uiActions.showNotifications(notification));
          enqueueSnackbar('Đăng xuất tài khoản thất bại!', {
            variant: 'error',
          });
        });
    },
    [enqueueSnackbar, fetchAllBots]
  );

  const handleBotDelete = useCallback(
    (partnerAccId: number | undefined) => {
      // http://149.28.128.238/partner/details/1/
      axios
        .delete(`${APIs.partnerAccountDetail}${partnerAccId}/`)
        .then((res) => {
          fetchAllBots();
          // const notification = {
          //   id: Math.floor(Math.random() * 101 + 1),
          //   title: 'Thành công',
          //   description: 'Xoá tài khoản thành công!',
          //   backgroundColor: 'text-green-100',
          //   icon: images.toast.check,
          // };
          // dispatch(uiActions.showNotifications(notification));
          enqueueSnackbar('Xoá tài khoản thành công!', { variant: 'success' });
        })
        .catch(() => {
          // const notification = {
          //   id: Math.floor(Math.random() * 101 + 1),
          //   title: 'Thất bại',
          //   description: 'Xoá tài khoản thất bại!',
          //   backgroundColor: 'text-red-100',
          //   icon: images.toast.error,
          // };
          // dispatch(uiActions.showNotifications(notification));
          enqueueSnackbar('Xoá tài khoản thất bại!', { variant: 'error' });
        });
    },
    [enqueueSnackbar, fetchAllBots]
  );

  const toggleAllRow = useCallback(() => {
    let newSelected: SelectedIdsType = {};

    if (selectAll === 0) {
      partnerDatas.forEach((x) => {
        newSelected[x.id] = true;
      });
    }
    setSelectedAccountTradeIds(newSelected);
    setSelectAll((prev) => (prev === 0 ? 1 : 0));
  }, [partnerDatas, selectAll]);

  const handleOpenPopupModal = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopupModal = () => {
    setIsPopupOpen(false);
  };

  const deleteAccountTradeBySelectedIds = () => {
    const selectedListIds = Object.entries(selectedAccountTradeIds)
      .filter((selected) => selected[1])
      .map((selected) => selected[0]);
    console.log('selectedListIds:', selectedListIds);

    axios
      .delete(`${APIs.deletePartnerAccountsByIds}${selectedListIds}`)
      .then((res) => {
        fetchAllBots();
        enqueueSnackbar('Xoá tài khoản liên kết thành công!', {
          variant: 'success',
        });
      })
      .catch((err) => {
        enqueueSnackbar('Xoá tài khoản liên kết thất bại!', {
          variant: 'error',
        });
      });
  };

  const columns = React.useMemo<Column<BotData>[]>(
    () => [
      {
        id: 'checkbox',
        accessor: 'checkbox',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex justify-center items-center">
              <input
                type="checkbox"
                className="checkbox"
                checked={selectedAccountTradeIds[original.id] === true}
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
        accessor: 'botname',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex">
              <p className="max-w-[9rem] whitespace-nowrap overflow-ellipsis overflow-hidden">
                {original.botname}
              </p>
            </div>
          );
        },
      },
      {
        Header: () => {
          return <div className="text-left">Mã giới thiệu</div>;
        },
        accessor: 'description',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex">
              <p className="max-w-[9rem] whitespace-nowrap overflow-ellipsis overflow-hidden">
                {original.description}
              </p>
            </div>
          );
        },
      },
      {
        Header: () => {
          return <div className="text-left">Email</div>;
        },
        accessor: 'botusername',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex">
              <p className="max-w-[11rem] whitespace-nowrap overflow-ellipsis overflow-hidden">
                {original.botusername}
              </p>
            </div>
          );
        },
      },
      {
        Header: () => <div className="text-end">Số dư</div>,
        accessor: 'balance_live',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="text-end">
              <span className="rounded-3xl bg-primary-100 bg-clip-text text-transparent text-sm font-semibold">
                ${original.balance_live?.toLocaleString('en-US', options)}
              </span>
            </div>
          );
        },
      },
      {
        Header: () => <div className="text-left">Trạng thái</div>,
        accessor: 'status',
        Cell: (props) => {
          const original = props.cell.row.original;
          const status = original.status;
          return (
            <div className="flex">
              <p
                className={`w-fit px-2 rounded-[0.375rem] text-xs text-ink-100 leading-5 ${
                  status === 'active' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {status === 'active'
                  ? STATUSES_MAP.active
                  : STATUSES_MAP.inactive}
              </p>
            </div>
          );
        },
      },
      {
        accessor: 'actions',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex justify-center gap-x-1 w-[1.5rem]">
              <Tooltip
                componentsProps={{
                  tooltip: {
                    className: '!px-0 !py-3 !bg-dropdown !rounded-xl',
                  },
                  arrow: {
                    className: '!w-[1rem] !before:w-[1rem] !before:bg-dropdown',
                    sx: {
                      '&::before': {
                        background: 'var(--bg-dropdown)',
                      },
                    },
                  },
                }}
                title={
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTooltipClose(original.id);
                    }}
                  >
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={(e) => {
                        handleOpenModal();
                        setIsLoggingOut(true);
                        setSelectedBot(original);
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={
                          original.status === 'active'
                            ? images.table.log_out
                            : images.table.log_in
                        }
                        alt="BotLambotrade"
                      />
                      <p className="text-ink-100 text-base">
                        {original.status === 'active'
                          ? 'Đăng xuất'
                          : 'Đăng nhập'}
                      </p>
                    </div>
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={() => {
                        handleOpenModal();
                        setIsLoggingOut(false);
                        setSelectedBot(original);
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={images.table.delete}
                        alt="BotLambotrade"
                      />
                      <p className="text-ink-100 text-base">Xoá cấu hình</p>
                    </div>
                  </div>
                }
                arrow
                open={isTooltipOpen[original.id]}
                onOpen={() => {
                  handleTooltipOpen(original.id);
                }}
                onClose={() => {
                  handleTooltipClose(original.id);
                }}
                disableHoverListener={!isDesktop}
                disableFocusListener={!isDesktop}
                disableTouchListener={!isDesktop}
                placement="bottom-end"
                enterTouchDelay={0}
                leaveTouchDelay={20000}
              >
                <img
                  className="cursor-pointer"
                  src={images.table.actions}
                  alt="BotLambotrade"
                  onClick={(e) => {
                    handleTooltipToggle(original.id);
                  }}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [
      handleTooltipOpen,
      isDesktop,
      isTooltipOpen,
      selectAll,
      selectedAccountTradeIds,
      toggleAllRow,
      toggleRow,
    ]
  );

  const tableInstance = useTable(
    { columns, data: partnerDatas },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
  } = tableInstance;

  const handlePageClick = (event: PaginationEvent) => {
    console.log(event);
  };

  return (
    <>
      <div className="mb-6 bg-background-80 rounded-3xl">
        <h2 className="px-6 py-5 border-b border-ink-10 text-ink-100 text-xl font-bold">
          Danh sách tài khoản sàn liên kết
        </h2>
        {partnerDatas.length === 0 && (
          <div className="py-[5rem] flex flex-col justify-center items-center gap-y-6">
            <img
              className="w-[10.25rem]"
              src={images.account.table_empty}
              alt="BotLambotrade"
            />
            <p className="text-ink-60">Danh sách tài khoản liên kết trống</p>
          </div>
        )}
        {partnerDatas.length > 0 && (
          <div className="flex flex-col gap-y-6 p-6">
            {Object.values(selectedAccountTradeIds).filter(
              (value) => value === true
            ).length > 0 && (
              <div className="px-4 py-3 bg-ink-05 rounded-xl flex justify-between items-center">
                <p className="text-ink-100 font-semibold">
                  {`Đã chọn ${
                    Object.values(selectedAccountTradeIds).filter(
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
                    {/* {isFollowing ? 'Chặn' : 'Bỏ chặn'} */}
                    Xoá
                  </p>
                </button>
              </div>
            )}

            <div>
              {/* TABLE */}
              <div
                className={`border border-ink-05 rounded-2xl w-full ${
                  isMobile || isMediumTablet ? 'overflow-x-scroll' : ''
                }`}
              >
                <table className="w-full" {...getTableProps()}>
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            className={`p-4 last:w-[1%] last:whitespace-nowrap bg-primary-05 first-of-type:rounded-tl-2xl last-of-type:rounded-tr-2xl text-sm text-ink-100 font-normal whitespace-nowrap text-ellipsis`}
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
                          className="border-b border-ink-10 last:border-0 whitespace-nowrap text-ellipsis"
                          {...row.getRowProps()}
                        >
                          {row.cells.map((cell) => (
                            <td
                              className="p-4 last:w-[1%] last:whitespace-nowrap"
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

              {/* PAGINATION */}
              {/* <div
                className={`flex flex-col justify-center items-end md:flex-row md:justify-end md:items-center gap-2`}
              >
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
                      <KeyboardArrowRight
                        sx={{ fill: 'var(--color-ink-80)' }}
                      />
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
                  activeClassName="active"
                />
              </div> */}
            </div>
          </div>
        )}
      </div>

      <CustomModal
        isOpen={isModalOpen}
        handleOpen={handleOpenModal}
        handleClose={handleCloseModal}
      >
        <div
          className={`absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 md:w-[31.25rem] w-[calc(100vw-2rem)] bg-background-80 rounded-3xl text-center`}
        >
          <div className="flex items-center justify-center">
            <img
              className="mb-4 w-[5.5rem]"
              src={
                isLoggingOut && selectedBot?.status === 'active'
                  ? images.account.table_logout
                  : isLoggingOut && selectedBot?.status === 'inactive'
                  ? images.account.table_login
                  : images.account.table_delete
              }
              alt="BotLambotrade"
            />
          </div>
          <h3 className="mb-2 mx-auto max-w-[18.75rem] text-xl text-ink-100">
            {isLoggingOut && selectedBot?.status === 'active'
              ? 'Đăng xuất tài khoản giao dịch'
              : isLoggingOut && selectedBot?.status === 'inactive'
              ? 'Đăng nhập tài khoản giao dịch'
              : 'Xoá tài khoản giao dịch'}
          </h3>
          <p className="mb-12 mx-auto max-w-[18.75rem] text-ink-80">
            {isLoggingOut && selectedBot?.status === 'active'
              ? 'Bạn có chắc chắn muốn đăng xuất tài khoản giao dịch này không?'
              : isLoggingOut && selectedBot?.status === 'inactive'
              ? 'Bạn có chắc chắn muốn đăng nhập tài khoản giao dịch này không'
              : 'Bạn có chắc chắn muốn xoá tài khoản giao dịch này không?'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4">
            <GreyButton onClick={handleCloseModal}>Huỷ</GreyButton>
            <GoldButton
              onClick={() => {
                if (isLoggingOut && selectedBot?.status === 'active') {
                  handleBotLogout(selectedBot?.id, 'inactive');
                } else if (isLoggingOut && selectedBot?.status === 'inactive') {
                  handleBotLogout(selectedBot?.id, 'active');
                } else {
                  handleBotDelete(selectedBot?.id);
                }
                handleCloseModal();
              }}
            >
              {isLoggingOut && selectedBot?.status === 'active'
                ? 'Đăng xuất'
                : isLoggingOut && selectedBot?.status === 'inactive'
                ? 'Đăng nhập'
                : 'Xoá'}
            </GoldButton>
          </div>
        </div>
      </CustomModal>

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
              src={images.account.table_delete}
              alt="BotLambotrade"
            />
          </div>
          <h3 className="mb-2 mx-auto max-w-[18.75rem] text-xl text-ink-100">
            Xoá tài khoản liên kết
          </h3>
          <p className="mb-12 mx-auto max-w-[18.75rem] text-ink-80">
            Bạn có chắc chắn muốn xoá tài khoản liên kết không?
          </p>
          <div className="grid grid-cols-2 justify-center items-center gap-4">
            <GreyButton onClick={handleClosePopupModal}>Huỷ</GreyButton>
            <GoldButton
              onClick={() => {
                deleteAccountTradeBySelectedIds();
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

export default AccountTradeTable;
