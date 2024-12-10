import { Tag } from "antd";
import APIs from "apis";
import { Tooltip } from "@mui/material";
import images from "assets";
import axios from "axios";
import CustomModal from "components/CustomModal";
import GoldButton from "components/GoldButton";
import GreyButton from "components/GreyButton";
import SelectInput from "components/SelectInput";
import { useEnqueueSnackbar } from "hooks/useEnqueueSnackbar";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useMediaQuery } from "react-responsive";
import { ActionMeta, SingleValue } from "react-select";
import { Column, useTable } from "react-table";
import InputSelectOption from "types/InputSelectOption";
import BotTradeSettingButton from "pages/BotTradeSetting/BotTradeSettingButton";

export type TypeFollowbotschedule = {
    followbotschedule_name: string,
    followbot_name: string,
    status: string,
    id: number,
    hour_of_day: number,
    minute_of_day: number,
    checkbox?: boolean,
    actions?: any,
    followbotid: number[]
}

type SelectedIdsType = {
    [key: string]: boolean;
};

const PAGE_SIZE_OPTIONS = [
    { value: 10, label: '10/page' },
    { value: 20, label: '20/page' },
    { value: 30, label: '30/page' },
    { value: 40, label: '40/page' },
];

interface IProps {
    refetch: number
    onSelectedTimer: (v: {
        key: 'EDIT' | 'DELETE',
        value: TypeFollowbotschedule
    }) => void
}

interface TooltipToggle {
    [x: string | number]: boolean;
}

const List = ({ refetch, onSelectedTimer }: IProps) => {

    const [ids, setIds] = useState<any[]>([])
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(10);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isPrevHover, setIsPrevHover] = useState(false);
    const [isNextHover, setIsNextHover] = useState(false);
    const [selectedIds, setSelectedIds] = useState<SelectedIdsType>({});
    const [selectAll, setSelectAll] = useState(0);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const enqueueSnackbar = useEnqueueSnackbar();
    const [isTooltipOpen, setIsTooltipOpen] = useState<TooltipToggle>({});

    // PAGINATION
    // const [pageSize, setPageSize] = useState(10);
    const [selectedPageSizeOption, setSelectedPageSizeOption] =
        useState<InputSelectOption>(PAGE_SIZE_OPTIONS[0]);

    const [followbotschedule, setFollowbotschedule] = useState<TypeFollowbotschedule[]>([])
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

    const handleOpenPopupModal = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopupModal = () => {
        setIsPopupOpen(false);
    };

    const fetchAutoBotList = async () => {
        try {
            await axios.get(APIs.followbotschedule, {
                params: {
                    page: page + 1,
                },
            }).then((res) => {
                const arr: TypeFollowbotschedule[] | undefined = res.data
                if (Array.isArray(arr)) {
                    setFollowbotschedule(arr)
                    if (selectedPageSizeOption.value != null) {
                        setTotalPages(
                            Math.ceil(arr.length / + selectedPageSizeOption.value)
                        );
                    }
                }
            })
        } catch (err) {

        }
    }

    useEffect(() => {
        setIsTooltipOpen({})
        fetchAutoBotList()
    }, [refetch, page])

    const toggleRow = useCallback(
        (id: number | string) => {
            const newSelected = { ...selectedIds };
            newSelected[id] = !newSelected[id];
            setIds((prev) => {
                let arr = [...prev]
                if (arr.includes(id)) {
                    arr = arr.filter((x) => String(x) !== String(id))
                } else {
                    arr.push(id)
                }
                return arr
            })
            setSelectedIds(newSelected);
            const totalSelected = Object.entries(newSelected).reduce(
                (prev, value) => {
                    if (value[1]) return prev + 1;
                    return prev;
                },
                0
            );
            if (totalSelected >= followbotschedule.length) {
                setSelectAll(1);
            } else {
                setSelectAll(0);
            }
        },
        [followbotschedule, selectedIds]
    );


    const handleTooltipOpen = useCallback((rowIndex: string | number) => {
        if (!isTooltipOpen[rowIndex]) {
            setIsTooltipOpen((prevState) => ({
                [rowIndex]: true,
            }));
        }
    }, []);

    const handleTooltipClose = (rowIndex: string | number) => {
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
    const toggleAllRow = useCallback(() => {
        let newSelected: SelectedIdsType = {};

        if (selectAll === 0) {
            followbotschedule.forEach((x) => {
                newSelected[x.id] = true;
            });
        }
        setIds(followbotschedule.map((x) => x.id))
        setSelectedIds(newSelected);
        setSelectAll((prev) => (prev === 0 ? 1 : 0));
    }, [selectAll]);

    const columns = React.useMemo<Column<TypeFollowbotschedule>[]>(
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
                width: 45,
            },
            {
                Header: () => {
                    return <div className="text-left">Tên</div>;
                },
                accessor: 'followbotschedule_name',
                Cell: (props) => {
                    const original = props.cell.row.original;
                    return (
                        <div className="flex">
                            <p>{original.followbotschedule_name}</p>
                        </div>
                    );
                },
            },
            {
                Header: () => {
                    return <div className="text-center">Thời gian</div>;
                },
                accessor: 'hour_of_day',
                Cell: (props) => {
                    const original = props.cell.row.original;
                    const time = moment().startOf('day').add(original.hour_of_day, 'hours').add(original.minute_of_day, 'minutes').format('HH:mm');
                    return <p className="text-center">{time}</p>;
                },
            },
            {
                Header: () => {
                    return <div className="text-center">Thao tác</div>;
                },
                accessor: 'status',
                align: 'center',
                Cell: (props) => {
                    const original = props.cell.row.original;
                    return <p className="text-sm text-center"><Tag color={original.status === 'start' ? "green" : 'red'}>{original.status === 'start' ? 'Bắt đầu' : 'Tắt Bot'}</Tag></p>;
                },
            },
            {
                accessor: "actions",
                Cell: (props) => {
                    const original = props.cell.row.original;
                    const isActive = original.status === "active";

                    return (
                        <div className="flex justify-center gap-x-1 w-[1.5rem]">
                            <Tooltip
                                componentsProps={{
                                    tooltip: {
                                        className: "!px-0 !py-3 !bg-dropdown !rounded-xl",
                                    },
                                    arrow: {
                                        className:
                                            "!w-[1rem] !translate-x-[9.6875rem] !before:bg-dropdown",
                                        sx: {
                                            "&::before": {
                                                background: "var(--bg-dropdown)",
                                            },
                                        },
                                    },
                                }}
                                title={
                                    <div
                                        onClick={(e) => {
                                            handleTooltipClose(original.id);
                                            e.stopPropagation();
                                        }}
                                    >
                                        <div
                                            className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                                            onClick={() => {
                                                onSelectedTimer({
                                                    key: 'EDIT',
                                                    value: original
                                                })
                                            }}
                                        >
                                            <img
                                                className="w-[1.5rem]"
                                                src={images.table.edit}
                                                alt="BotLambotrade"
                                            />
                                            <p className="text-base text-ink-100">Chỉnh sửa</p>
                                        </div>
                                        <div
                                            className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                                            onClick={() => {
                                                setSelectedIds({
                                                    [original.id]: true
                                                })
                                                handleOpenPopupModal();
                                            }}
                                        >
                                            <img
                                                className="w-[1.5rem]"
                                                src={images.table.delete}
                                                alt="BotLambotrade"
                                            />
                                            <p className="text-base text-ink-100">Xoá cấu hình</p>
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
                                    onClick={() => {
                                        handleTooltipToggle(original.id);
                                    }}
                                />
                            </Tooltip>
                        </div>
                    );
                },
            },
        ],
        [selectAll, selectedIds, toggleAllRow, toggleRow]
    );

    const tableInstance = useTable({ columns, data: followbotschedule });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    const getAutoBotOrderHistory = useCallback(
        (page: number) => {
            setTotalPages(
                Math.ceil(followbotschedule.length / + selectedPageSizeOption.value)
            );
        },
        [selectedPageSizeOption]
    );

    const handleSelectPageSize = (
        option: SingleValue<InputSelectOption>,
        actionMeta: ActionMeta<InputSelectOption>
    ) => {
        if (option != null) {
            setSelectedPageSizeOption(option);
            setPage(0);
            getAutoBotOrderHistory(1);
        }
    };

    const handlePageChange = useCallback(
        ({ selected }: { selected: number }) => {
            const page = selected + 1;
            setPage(selected);
            getAutoBotOrderHistory(page);
        },
        [getAutoBotOrderHistory]
    );

    const deleteSettingById = async () => {
        const selectedListIds = Object.entries(selectedIds)
            .filter((selected) => selected[1])
            .map((selected) => selected[0]);
        await axios
            .delete(`${APIs.followbotscheduleupdate}delete/${selectedListIds}/`)
            .then((res) => {
                setPage((prev) => prev + 1);
                setSelectAll(0)
                setSelectedIds({})
                enqueueSnackbar('Xoá cấu hình thành công!', { variant: 'success' });
            })
            .catch(() => {
                enqueueSnackbar('Không thể xoá cấu hình!', { variant: 'error' });
            });
    };

    return <div className="p-6 bg-background-80 rounded-3xl h-full">
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
                    Xoá cấu hình hẹn giờ
                </h3>
                <p className="mb-12 mx-auto max-w-[18.75rem] text-ink-80">
                    Bạn có chắc chắn muốn xoá cấu hình hẹn giờ không?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4">
                    <GreyButton onClick={handleClosePopupModal}>Huỷ</GreyButton>
                    <GoldButton
                        onClick={async () => {
                            await deleteSettingById();
                            handleClosePopupModal();
                        }}
                    >
                        Xoá
                    </GoldButton>
                </div>
            </div>
        </CustomModal>
        <h1 className="mb-6 text-xl font-semibold text-ink-100">Danh sách cấu hình</h1>
       <div className="mb-4">
       {Object.values(selectedIds).filter((value) => value === true)
            .length > 0 && (
                <div className="px-4 py-3 bg-ink-05 rounded-xl flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <p className="text-ink-100 font-semibold">
                        {`Đã chọn ${Object.values(selectedIds).filter((value) => value === true)
                            .length
                            }`}
                    </p>
                    <div className="grid grid-cols-2 md:flex items-center justify-center gap-4">
                        <BotTradeSettingButton
                            icon={images.bot.delete_gold}
                            iconHover={images.bot.delete}
                            classNameHover="background-animation"
                            onClick={() => {
                                handleOpenPopupModal();
                            }}
                        >
                            Xoá
                        </BotTradeSettingButton>
                    </div>
                </div>
            )}
       </div>

        <div className="flex flex-col gap-0">
            <div className="flex justify-between flex-col gap-4">
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
                    className={`flex flex-col justify-between items-end md:flex-row md:justify-end md:items-center gap-2`}
                >
                    <div>
                        <SelectInput
                            menuRef={menuRef}
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
        </div>
    </div>
}

export default List