import { faker } from "@faker-js/faker";
import { CloseOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import APIs from "apis";
import images from "assets";
import axios from "axios";
import CustomButton from "components/CustomButton";
import CustomInputSpinner from "components/CustomInputSpinner";
import CustomModal from "components/CustomModal";
import CustomModalTwoButton from "components/CustomModalTwoButton";
import CustomRadio from "components/CustomRadio";
import CustomValidateModel from "components/CustomValidateModal";
import SelectInput from "components/SelectInput";
import TextInput from "components/TextInput";
import { useFormik } from "formik";
import { useEnqueueSnackbar } from "hooks/useEnqueueSnackbar";
import moment from "moment";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { CurrencyInputOnChangeValues } from "react-currency-input-field/dist/components/CurrencyInputProps";
import ReactPaginate from "react-paginate";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { ActionMeta, SingleValue } from "react-select";
import { useSpring } from "react-spring";
import { Column, usePagination, useTable } from "react-table";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { uiActions } from "stores/uiSlice";
import { userActions } from "stores/userSlice";
import { BotAllData } from "types/BotAllData";
import { BotBalance } from "types/BotBalance";
import BotData from "types/BotData";
import CustomValidateModelProps from "types/CustomValidateProps";
import InputSelectOption from "types/InputSelectOption";
import { UserHistoryProps } from "types/UserHistoryProps";
import UserManagementAdminResponse, {
  UserManagementAdminResponseResult,
} from "types/UserManagementAdminResponse";
import * as Yup from "yup";
import UserManagementButton from "./UserManagementButton";

type UserManagementAdminProps = {
  setUserHistory: React.Dispatch<React.SetStateAction<UserHistoryProps>>;
};

interface ListMasterCopyTradeSetting {
  master?: string | number;
}

interface ListFollowerCopyTradeSetting {
  follower?: string | number;
}

interface FormikValueType {
  followerName: string;
  email: string;
  role: string;
  status: string;
}

type Conditions = {
  [key: string]: BubbleOptions;
};

type BubbleOptions = {
  [key: string]: any;
};

type SelectedIdsType = {
  [key: string]: boolean;
};

interface TooltipToggle {
  [x: string | number]: boolean;
}

interface InputValue {
  value: string | number;
  error: null | string;
  touched: boolean;
}

const PAGE_SIZE_OPTIONS: InputSelectOption[] = [
  { value: 10, label: "10/page" },
  { value: 20, label: "20/page" },
  { value: 30, label: "30/page" },
  { value: 40, label: "40/page" },
];

const METHOD_OWN_TYPES: InputSelectOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "own", label: "Phương pháp của tôi" },
  { value: "gifted", label: "Phương pháp được tặng" },
];

const PLUS_VALUES = [5, 10, 20, 50, 100, "All"];
const MULTIPLY_VALUES = [2, 5, 10, 20, 40, 100];
const OPTIONS = [
  {
    value: 10,
    name: "Ten",
  },
  {
    value: 15,
    name: "Fifteen",
  },
  {
    value: 20,
    name: "Twenty",
  },
  {
    value: 25,
    name: "Twenty-five",
  },
];

const INITIAL_BOT_BALANCE = {
  balance: 1,
  demo_balance: 1,
  usdt_balance: 1,
};

const INITIAL_SELECT_OPTIONS: InputSelectOption[] = [
  {
    value: "",
    label: "",
  },
];

const INITIAL_SELECTED_OPTION: InputSelectOption = {
  value: "",
  label: "",
};

const INITIAL_SELECTED_ACCOUNT_TYPE: InputSelectOption = {
  value: "LIVE",
  label: "Tài khoản LIVE",
};

const INITIAL_FORMIK_VALUES: FormikValueType = {
  followerName: "",
  email: "",
  role: "",
  status: "",
};

const ACCOUNT_TYPES = [
  {
    value: "DEMO",
    label: "Tài khoản DEMO",
  },
  {
    value: "LIVE",
    label: "Tài khoản LIVE",
  },
];

export interface ICopyTradeSettingFormik {
  accountType: string;
  email: string;
  balance: number;
  masterName: string;
  amountPerOrder: number;
  multiply: number;
  takeProfit: number;
  stopLoss: number;
}

const INITIAL_ADMIN_RESULT: UserManagementAdminResponseResult = {
  id: 0,
  follower_name: "",
  email: "",
  role: "",
  status: "",
};

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: "decimal",
};

const STATUSES_MAP = {
  active: "Đang hoạt động",
  inactive: "Đang chặn",
};

const INITIAL_INPUT_VALUE = {
  value: "",
  error: null,
  touched: false,
};

const generateFakeData = (): UserManagementAdminResponseResult[] => {
  return Array(10)
    .fill(0)
    .map((_, index) => ({
      id: faker.datatype.uuid(),
      follower_name: faker.name.fullName(),
      email: faker.internet.email(),
      role: index === 0 ? "Owner" : "Được thêm bởi " + faker.name.fullName(),
      status: index % 2 === 0 ? "active" : "inactive",
    }));
};

const DEFAULT_INDEX_OF_CONDITIONS = "1";

const UserManagementAdmin: FC<UserManagementAdminProps> = ({
  setUserHistory,
}) => {
  const [currentTimer, setCurrentTimer] = useState(moment());
  const [selectedIds, setSelectedIds] = useState<SelectedIdsType>({});
  const [selectAll, setSelectAll] = useState(0);
  const [totalRecords, setTotalRecords] = useState(100);

  // BOT
  const [allBotDatas, setAllBotDatas] = useState<BotAllData[]>([]);
  const [partnerBotDatas, setPartnerBotDatas] = useState<BotData[]>([]);
  const [botBalance, setBotBalance] = useState<BotBalance>(INITIAL_BOT_BALANCE);
  const [selectedAccountType, setSelectedAccountType] =
    useState<InputSelectOption>(INITIAL_SELECTED_ACCOUNT_TYPE);
  const [selectedBotAccount, setSelectedBotAccount] =
    useState<InputSelectOption>(INITIAL_SELECTED_OPTION);
  const [selectedMasterAccount, setSelectedMasterAccount] =
    useState<InputSelectOption>(INITIAL_SELECTED_OPTION);
  const [isMasterAccountValid, setIsMasterAccountValid] = useState(false);
  const [accountOptions, setAccountOptions] = useState<InputSelectOption[]>([]);
  const [allBotAccountOptions, setAllBotAccountOptions] = useState<
    InputSelectOption[]
  >([]);

  // SETTINGS
  const [admins, setAdmins] = useState<UserManagementAdminResponse>({
    count: 3,
    next: null,
    previous: null,
    results: [],
  });
  const [adminResults, setAdminResults] = useState<
    UserManagementAdminResponseResult[]
  >(generateFakeData());
  const userData = useAppSelector((state) => state.user.user);
  const [isDeletingByList, setIsDeletingByList] = useState(false);
  const [isLimited, setIsLimited] = useState(false);

  // MODAL
  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isRemovePopupOpen, setIsRemovePopupOpen] = useState(false);
  const [isBlockPopupOpen, setIsBlockPopupOpen] = useState(false);
  const [isAuthorizePopupOpen, setIsAuthorizePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isConditionPopupOpen, setIsConditionPopupOpen] = useState(false);
  const [isSetupPopupOpen, setIsSetupPopupOpen] = useState(false);
  const [isValidAmountPopupOpen, setIsValidAmountPopupOpen] = useState(false);

  // SEARCH AND FILTER
  const [searchInput, setSearchInput] = useState("");
  const [selectedMethodOwnType, setSelectedMethodOwnType] =
    useState<InputSelectOption>(METHOD_OWN_TYPES[0]);

  // PAGINATION
  const [selectedPageSizeOption, setSelectedPageSizeOption] =
    useState<InputSelectOption>(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(10);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isPrevHover, setIsPrevHover] = useState(false);
  const [isNextHover, setIsNextHover] = useState(false);

  const [modalAttributes, setModalAttributes] =
    useState<CustomValidateModelProps>({
      isOpen: false,
      icon: "",
      headingMessage: "",
      message: "",
      buttonMessage: "",
      handleOpen: () => {},
      handleClose: () => {},
    });

  // ! FORMIK RELATED STATES AND BUY SELL
  const [formikValues, setFormikValues] = useState<FormikValueType>(
    INITIAL_FORMIK_VALUES
  );
  const [selectedAdminResult, setSelectedAdminResult] =
    useState<UserManagementAdminResponseResult>(INITIAL_ADMIN_RESULT);
  const [isEditing, setIsEditing] = useState(false);
  const [newAdminUsername, setNewAdminUserName] =
    useState<InputValue>(INITIAL_INPUT_VALUE);
  const [giftUsername, setGiftUsername] =
    useState<InputValue>(INITIAL_INPUT_VALUE);
  const [conditionError, setConditionError] = useState("");

  // ! INITIAL PARTNER BOT USEFFECT
  const [isPartnerBotInitialized, setIsPartnerBotInitialized] = useState(false);
  const animationUpsertModalMobile = useSpring({
    to: {
      opacity: isUpsertModalOpen ? 1 : 0,
      transform: isUpsertModalOpen ? "translateX(0%)" : "translateX(-100%)",
    },
  });

  // ! RESPONSIVE
  const isLargeDesktop = useMediaQuery({
    query: "(min-width: 1368px)",
  });
  const isDesktop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px)",
  });
  const isMobile = useMediaQuery({
    query: "(max-width: 767px)",
  });

  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();
  const navigate = useNavigate();
  const scrollElement = useRef<HTMLDivElement>(null);

  const data = React.useMemo<UserManagementAdminResponseResult[]>(
    () => adminResults,
    [adminResults]
  );

  // Tooltips
  const [isTooltipOpen, setIsTooltipOpen] = useState<TooltipToggle>({});

  const handleTooltipOpen = useCallback(
    (rowIndex: string | number) => {
      console.log("handleTooltipOpen");
      if (!isTooltipOpen[rowIndex]) {
        setIsTooltipOpen((prevState) => ({
          [rowIndex]: true,
        }));
      }
    },
    [isTooltipOpen]
  );

  const handleTooltipClose = useCallback(
    (rowIndex: string | number) => {
      console.log("handleTooltipClose");
      if (isTooltipOpen[rowIndex]) {
        setIsTooltipOpen((prevState) => ({
          [rowIndex]: false,
        }));
      }
    },
    [isTooltipOpen]
  );

  const handleTooltipToggle = (rowIndex: string | number) => {
    setIsTooltipOpen((prevState) => ({
      [rowIndex]: !prevState[rowIndex],
    }));
  };

  // FUNCTIONS FOR MODAL
  const showIsDevelopingModal = useCallback(() => {
    dispatch(uiActions.updateIsModalOpen(true));
  }, [dispatch]);

  const handleOpenUpsertModal = () => {
    setIsUpsertModalOpen(true);
  };

  const handleCloseUpsertModal = () => {
    setIsUpsertModalOpen(false);
    setNewAdminUserName(INITIAL_INPUT_VALUE);
  };

  const handleOpenChangePasswordPopupModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleCloseChangePasswordPopupModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handleOpenRemovePopupModal = () => {
    setIsRemovePopupOpen(true);
  };

  const handleCloseRemovePopupModal = () => {
    setIsRemovePopupOpen(false);
  };

  const handleOpenBlockPopupModal = () => {
    setIsBlockPopupOpen(true);
  };

  const handleCloseBlockPopupModal = () => {
    setIsBlockPopupOpen(false);
  };

  const handleOpenAuthorizePopupModal = () => {
    setIsAuthorizePopupOpen(true);
  };

  const handleCloseAuthorizePopupModal = () => {
    setIsAuthorizePopupOpen(false);
  };

  const handleOpenDeletePopupModal = () => {
    setIsDeletePopupOpen(true);
  };

  const handleCloseDeletePopupModal = () => {
    setIsDeletePopupOpen(false);
  };

  const handleOpenSetupPopupModal = () => {
    setIsSetupPopupOpen(true);
  };

  const handleCloseSetupPopupModal = () => {
    setIsSetupPopupOpen(false);
  };

  const handleOpenAccountTradePopupModal = () => {
    setModalAttributes((prev) => ({
      ...prev,
      isOpen: true,
    }));
  };

  const handleCloseAccountTradePopupModal = () => {
    setModalAttributes((prev) => ({
      ...prev,
      isOpen: false,
    }));
    navigate("/account_trade");
  };

  // FUNCTIONS FOR CHECKBOX
  const toggleRow = useCallback(
    (id: string | number) => {
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
        if (x.role !== "Owner") {
          newSelected[x.id] = true;
        }
      });
    }
    setSelectedIds(newSelected);
    setSelectAll((prev) => (prev === 0 ? 1 : 0));
  }, [data, selectAll]);

  // COMMON FUNCTIONS
  // const getAllBotSignalBuySellSettings = useCallback(
  //   (page: number) => {
  //     if (partnerBotDatas.length > 0) {
  //       axios
  //         .get(`${APIs.botSignalBuySellList}`, {
  //           params: {
  //             page,
  //             page_size: selectedPageSizeOption.value,
  //           },
  //         })
  //         .then((res) => {
  //           const data: BotSignalPersonal = res.data;
  //           setBotPersonalSignalData(data);
  //           setAllBotPersonalSignalResults(data.results);
  //           if (data.count != null && selectedPageSizeOption.value != null) {
  //             setTotalPages(
  //               Math.ceil(data.count / +selectedPageSizeOption.value)
  //             );
  //           }
  //         })
  //         .catch(() => {
  //           enqueueSnackbar('Không thể lấy bot settings!', {
  //             variant: 'error',
  //           });
  //         });
  //     }
  //   },
  //   [enqueueSnackbar, partnerBotDatas, selectedPageSizeOption]
  // );

  const deleteSettingById = () => {
    axios
      .delete(`${APIs.deleteBotSignalPersonal}${selectedAdminResult.id}`)
      .then((res) => {
        // TODO
        // getAllBotSignalBuySellSettings(page + 1);
        setSelectedIds({});
        setSelectAll(0);
        enqueueSnackbar("Xoá cấu hình thành công!", { variant: "success" });
      })
      .catch(() => {
        enqueueSnackbar("Không thể xoá cấu hình!", { variant: "error" });
      });
  };

  const deleteSettingByListIds = () => {
    // ENTRY: string: boolean
    const selectedListIds = Object.entries(selectedIds)
      .filter((selected) => selected[1])
      .map((selected) => selected[0]);
    axios
      .delete(`${APIs.deleteBotSignalPersonal}${selectedListIds}`)
      .then((res) => {
        // TODO
        // getAllBotSignalBuySellSettings(page + 1);
        setSelectedIds({});
        setSelectAll(0);
        enqueueSnackbar("Xoá cấu hình thành công!", { variant: "success" });
      })
      .catch(() => {
        enqueueSnackbar("Xoá cấu hình thất bại!", { variant: "error" });
      });
  };

  const updateModelData = useCallback(
    (botPersonalSignalResult: UserManagementAdminResponseResult) => {
      // UPDATE FORM MODAL
      const updatedFormikValues: FormikValueType = {
        followerName: botPersonalSignalResult.follower_name,
        email: botPersonalSignalResult.email,
        role: botPersonalSignalResult.role,
        status: botPersonalSignalResult.status,
      };

      console.log(updatedFormikValues);
      setFormikValues(updatedFormikValues);
    },
    []
  );

  // SEARCH AND FILTER
  const handleSelectMethodOwnType = (
    option: SingleValue<InputSelectOption>,
    actionMeta: ActionMeta<InputSelectOption>
  ) => {
    if (option != null) {
      setSelectedMethodOwnType(option);
    }
  };

  // PAGINATION FUNCTION
  const handleSelectPageSize = (
    option: SingleValue<InputSelectOption>,
    actionMeta: ActionMeta<InputSelectOption>
  ) => {
    if (option != null) {
      setSelectedPageSizeOption(option);
      setPage(0);
      // getAllBotSignalBuySellSettings(1);
    }
  };

  const handlePageChange = useCallback(({ selected }: { selected: number }) => {
    console.log(selected);
    const page = selected + 1;
    setPage(selected);
    // TODO
    // getAllBotSignalBuySellSettings(page);
  }, []);

  // TABLE
  const columns = React.useMemo<Column<UserManagementAdminResponseResult>[]>(
    () => [
      {
        id: "checkbox",
        accessor: "checkbox",
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                className="checkbox"
                checked={selectedIds[original.id] === true}
                onChange={(e) => {
                  if (original.role !== "Owner") {
                    toggleRow(original.id);
                  }
                }}
                disabled={original.role === "Owner"}
              />
            </div>
          );
        },
        Header: (props) => {
          return (
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                className="text-center checkbox"
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
        accessor: "follower_name",
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex items-center">
              <p className="text-sm text-ink-100">{original.follower_name}</p>
            </div>
          );
        },
      },
      {
        Header: () => {
          return <div className="text-left">Email</div>;
        },
        accessor: "email",
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex items-center">
              <p className="text-sm text-ink-100">{original.email}</p>
            </div>
          );
        },
      },
      {
        Header: () => {
          return <div className="text-left">Vai trò</div>;
        },
        accessor: "role",
        Cell: (props) => {
          const original = props.cell.row.original;
          const role = original.role;
          return (
            <div className="flex gap-x-1">
              <p
                className={`${
                  role === "Owner"
                    ? "bg-primary-100 bg-clip-text text-transparent"
                    : "text-ink-100"
                } font-medium text-sm`}
              >
                {role}
              </p>
            </div>
          );
        },
      },
      {
        Header: () => <div className="text-left">Trạng thái</div>,
        accessor: "status",
        Cell: (props) => {
          const original = props.cell.row.original;
          const status = original.status;
          return (
            <div className="flex">
              <p
                className={`w-fit px-2 rounded-[0.375rem] text-xs text-ink-100 leading-5 ${
                  status === "active" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {status === "active"
                  ? STATUSES_MAP.active
                  : STATUSES_MAP.inactive}
              </p>
            </div>
          );
        },
      },
      {
        accessor: "actions",
        Cell: (props) => {
          const original = props.cell.row.original;
          return original.role !== "Owner" ? (
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
                  <>
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRemovePopupModal();
                        setSelectedAdminResult(original);
                        handleTooltipClose(original.id);
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={images.user.remove_gold}
                        alt="BotLambotrade"
                      />
                      <p className="text-base text-ink-100">Bỏ quyền Admin</p>
                    </div>
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleOpenUpsertModal();
                        // setIsEditing(true);
                        // updateModelData(original);
                        handleTooltipClose(original.id);
                        //TODO
                        setUserHistory({
                          isShowing: true,
                          userId: 1,
                        });
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={images.user.history}
                        alt="BotLambotrade"
                      />
                      <p className="text-base text-ink-100">
                        Lịch sử hoạt động
                      </p>
                    </div>
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBlockPopupModal();
                        // setIsDeletingByList(false);
                        setSelectedAdminResult(original);
                        handleTooltipClose(original.id);
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={images.user.block_gold}
                        alt="BotLambotrade"
                      />
                      <p className="text-base text-ink-100">Chặn tài khoản</p>
                    </div>
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        // setIsDeletingByList(false);
                        setSelectedAdminResult(original);
                        handleTooltipClose(original.id);
                        handleOpenSetupPopupModal();
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={images.user.setting_gold}
                        alt="BotLambotrade"
                      />
                      <p className="text-base text-ink-100">Cài đặt lệnh</p>
                    </div>
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAuthorizePopupModal();
                        // setIsDeletingByList(false);
                        setSelectedAdminResult(original);
                        handleTooltipClose(original.id);
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={images.user.bot}
                        alt="BotLambotrade"
                      />
                      <p className="text-base text-ink-100">Cấp quyền Bot</p>
                    </div>
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenChangePasswordPopupModal();
                        // setIsDeletingByList(false);
                        setSelectedAdminResult(original);
                        handleTooltipClose(original.id);
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={images.user.lock}
                        alt="BotLambotrade"
                      />
                      <p className="text-base text-ink-100">Đổi mật khẩu</p>
                    </div>
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDeletePopupModal();
                        // setIsDeletingByList(false);
                        setSelectedAdminResult(original);
                        handleTooltipClose(original.id);
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={images.user.delete_gold}
                        alt="BotLambotrade"
                      />
                      <p className="text-base text-ink-100">Xoá tài khoản</p>
                    </div>
                  </>
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
          ) : (
            <></>
          );
        },
      },
    ],
    [
      handleTooltipClose,
      handleTooltipOpen,
      isDesktop,
      isTooltipOpen,
      selectAll,
      selectedIds,
      setUserHistory,
      toggleAllRow,
      toggleRow,
    ]
  );

  const tableInstance = useTable({ columns, data }, usePagination);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const formikChangePassword = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      uid: "",
      resetKey: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu của bạn phải dài ít nhất 6 ký tự")
        .max(20, "Mật khẩu của bạn không được quá 20 ký tự"),
      confirmNewPassword: Yup.string()
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu của bạn phải dài ít nhất 6 ký tự")
        .max(20, "Mật khẩu của bạn không được quá 20 ký tự")
        .oneOf([Yup.ref("newPassword"), null], "Mật khẩu phải khớp"),
    }),
    onSubmit: async (values, helpers) => {
      const request = {
        new_password1: values.newPassword,
        new_password2: values.confirmNewPassword,
        uid: values.uid,
        token: values.resetKey,
      };
      console.log(request);
      axios
        .post(`${APIs.resetPasswordConfirm}`, request)
        .then((res) => {
          handleCloseChangePasswordPopupModal();
          enqueueSnackbar("Cập nhập mật khẩu thành công", {
            variant: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar("Cập nhập mật khẩu thất bại", { variant: "error" });
        });
    },
  });

  // SETUP FORMIK AND FUNCTIONS
  const formikSetup = useFormik({
    initialValues: {
      multiplyPerSession: 0,
      multiply: 0,
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values, helpers) => {
      // console.log(values);
      // axios
      //   .post(`${APIs.resetPasswordConfirm}`, request)
      //   .then((res) => {
      //     handleCloseChangePasswordPopupModal();
      //     enqueueSnackbar("Cập nhập mật khẩu thành công", {
      //       variant: "success",
      //     });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     enqueueSnackbar("Cập nhập mật khẩu thất bại", { variant: "error" });
      //   });
    },
  });

  // FUNCTIONS FOR INPUT AMOUNT
  const handleAmount = (
    value: number | string | undefined,
    fieldName: string,
    values: CurrencyInputOnChangeValues | undefined
  ): void => {
    // const valueToSet = value === undefined || +value <= 0 ? 0 : value || ' ';
    const valueToSet = value === undefined ? "" : value;
    formikSetup.setFieldValue(fieldName, valueToSet);
  };

  const handleAmountMinusOne = (value: number, fieldName: string) => {
    if (value - 1 < 1) return;
    formikSetup.setFieldValue(fieldName, +value - 1);
  };

  const handleOrderAmountPlusOne = (value: number, fieldName: string) => {
    formikSetup.setFieldValue(fieldName, +value + 1);
  };

  // BOT SELECT
  const getAllAccounts = useCallback(() => {
    axios
      .get(APIs.allAccounts)
      .then((res) => {
        const data = res.data;
        setAllBotDatas(data);
      })
      .catch(() => {
        enqueueSnackbar("Không thể lấy tài khoản master", { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const getAllPartnerBots = useCallback(() => {
    axios
      .get(APIs.partnerAccount)
      .then((res) => {
        const datas: BotData[] = res.data;
        const partnerBotDatas = datas.filter(
          (data) => data.status === "active"
        );
        setPartnerBotDatas(partnerBotDatas);
      })
      .catch((err) => {
        enqueueSnackbar("Không thể lấy bot datas", { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const getBalance = useCallback(
    (id: number | string) => {
      axios
        .get(`${APIs.balanceById}${id}/`)
        .then((res) => {
          const data: BotBalance = res.data;
          setBotBalance(data);
        })
        .catch(() => {
          enqueueSnackbar("Không thể lấy được số dư ví", { variant: "error" });
        });
    },
    [enqueueSnackbar]
  );

  const convertPartnerBotsToPartnerAccountOptions = useCallback(() => {
    if (partnerBotDatas && partnerBotDatas.length > 0) {
      const accountOptions = partnerBotDatas.map((botData) => ({
        value: botData.id,
        label: botData.botname,
      }));
      setAccountOptions(accountOptions);
    }
  }, [partnerBotDatas]);

  const convertAllPartnerBotsToPartnerAccountOptions = useCallback(() => {
    if (allBotDatas && allBotDatas.length > 0) {
      const allBotAccountOptions = allBotDatas.map((botData) => ({
        value: botData.id,
        label: botData.username,
      }));
      setAllBotAccountOptions(allBotAccountOptions);
    }
  }, [allBotDatas]);

  useEffect(() => {
    getAllPartnerBots();
    getAllAccounts();
  }, [getAllAccounts, getAllPartnerBots]);

  useEffect(() => {
    console.log("HERE");
    if (partnerBotDatas && partnerBotDatas.length > 0) {
      if (selectedAccountType.value === "LIVE" && !isPartnerBotInitialized) {
        getBalance(partnerBotDatas[0].id);
        const firstBotOption = {
          value: partnerBotDatas[0].id,
          label: partnerBotDatas[0].botname,
        };
        setSelectedBotAccount(firstBotOption);
        setIsPartnerBotInitialized(true);
        dispatch(userActions.updateSelectedBotAccount(firstBotOption));
      } else if (selectedBotAccount.value) {
        getBalance(selectedBotAccount.value);
      }

      convertPartnerBotsToPartnerAccountOptions();
      convertAllPartnerBotsToPartnerAccountOptions();
    }
  }, [
    partnerBotDatas,
    convertPartnerBotsToPartnerAccountOptions,
    getBalance,
    selectedAccountType,
    selectedBotAccount.value,
    convertAllPartnerBotsToPartnerAccountOptions,
    dispatch,
    isPartnerBotInitialized,
  ]);

  // TODO
  // useEffect(() => {
  //   getAllBotSignalBuySellSettings(page + 1);
  // }, [getAllBotSignalBuySellSettings, page]);

  return (
    <>
      <div className="mb-6 h-fit bg-background-80 rounded-3xl">
        <div className="flex flex-col gap-4 p-6 border-b border-ink-10 md:flex-row md:justify-between md:items-center">
          <h1 className="text-xl font-semibold text-ink-100">
            Danh sách Admin
          </h1>
          <button
            className="px-3 py-[0.625rem] w-full md:w-auto rounded-xl flex justify-center items-center gap-[0.625rem] bg-primary-100"
            onClick={() => {
              if (partnerBotDatas.length === 0) {
                setModalAttributes((prev) => ({
                  ...prev,
                  isOpen: true,
                  icon: images.copy.account_not_integrate,
                  headingMessage: "Bạn chưa liên kết tài khoản",
                  message: (
                    <>
                      Liên kết tài khoản ngay để thực hiện giao dịch cùng đội
                      ngũ chuyên gia của AI BotTrade
                    </>
                  ),
                  buttonMessage: "Liên kết tài khoản",
                  handleOpen: handleOpenAccountTradePopupModal,
                  handleClose: handleCloseAccountTradePopupModal,
                }));
                return;
              }
              handleOpenUpsertModal();
              setIsEditing(false);
            }}
          >
            <img src={images.copy.plus} alt="BotLambotrade" />
            <p className="font-semibold text-transparent bg-background-100 bg-clip-text">
              Thêm mới
            </p>
          </button>
        </div>
        {adminResults.length === 0 && (
          <div className="py-[5rem] flex flex-col justify-center items-center gap-y-6">
            <img
              className="w-[10.25rem]"
              srcSet={`${images.user.empty} 2x`}
              alt="BotLambotrade"
            />
            <p className="text-ink-60">Danh sách Admin trống</p>
          </div>
        )}
        {adminResults.length > 0 && (
          <div className="flex flex-col p-6 gap-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              {/* SEARCH */}
              <TextInput
                fullWidth={true}
                name="search"
                id="search"
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                resetValue={() => {
                  setSearchInput("");
                }}
                placeholder="Tìm kiếm"
                searchIcon={images.table.search}
                searchIconClassName="!w-[1.25rem]"
                containerClassName="w-full md:w-[21.375rem]"
                inputClassName="!py-2 text-sm"
              />

              <div className="flex flex-col gap-2 md:flex-row">
                <div
                  className={`p-3 flex items-center gap-2 bg-primary-10 rounded-xl`}
                >
                  <p className="text-ink-100">Tổng số lượng Admin:</p>
                  <span className="font-bold text-transparent bg-clip-text bg-primary-100">
                    {admins.count?.toLocaleString()}
                  </span>
                  <div className="pl-2 border-l border-ink-20">
                    <img
                      className="w-[1.25rem] cursor-pointer"
                      src={images.user.reload}
                      alt="BotLambotrade"
                    />
                  </div>
                </div>
              </div>
            </div>

            {Object.values(selectedIds).filter((value) => value === true)
              .length > 0 && (
              <div className="flex flex-col gap-4 px-4 py-3 bg-ink-05 rounded-xl md:flex-row md:justify-between md:items-center">
                <p className="font-semibold text-ink-100">
                  {`Đã chọn ${
                    Object.values(selectedIds).filter((value) => value === true)
                      .length
                  }`}
                </p>
                <div className="grid items-center justify-center grid-cols-2 gap-4 md:flex">
                  <UserManagementButton
                    icon={images.user.remove_gold}
                    iconHover={images.user.remove_black}
                    classNameHover="background-animation"
                    onClick={() => {
                      // setIsDeletingByList(true);
                      // handleOpenPopupModal();
                      showIsDevelopingModal();
                    }}
                  >
                    Bỏ quyền Admin
                  </UserManagementButton>
                  <UserManagementButton
                    icon={images.user.block_gold}
                    iconHover={images.user.block_black}
                    classNameHover="background-animation"
                    onClick={() => {
                      showIsDevelopingModal();
                      // resetAllCurrent();
                    }}
                  >
                    Chặn tài khoản
                  </UserManagementButton>
                  <UserManagementButton
                    icon={images.user.setting_gold}
                    iconHover={images.user.setting_black}
                    classNameHover="background-animation"
                    onClick={() => {
                      handleOpenSetupPopupModal();
                      // resetAllCurrent();
                    }}
                  >
                    Cài đặt lệnh
                  </UserManagementButton>
                  <UserManagementButton
                    icon={images.user.delete_gold}
                    iconHover={images.user.delete_black}
                    classNameHover="background-animation"
                    onClick={() => {
                      showIsDevelopingModal();
                      // resetAllCurrent();
                    }}
                  >
                    Xoá tài khoản
                  </UserManagementButton>
                </div>
              </div>
            )}

            <div
              className={`border border-ink-05 rounded-2xl w-full ${
                !isLargeDesktop ? "overflow-x-scroll border-collapse" : ""
              }`}
            >
              <table className="w-full" {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          className={`p-4 last:w-[1%] whitespace-nowrap 2xl:whitespace-normal last:whitespace-nowrap bg-primary-05 first-of-type:rounded-tl-2xl last-of-type:rounded-tr-2xl text-sm text-ink-100 font-normal`}
                          {...column.getHeaderProps()}
                        >
                          {column.render("Header")}
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
                            className="p-4 last:w-[1%] last:whitespace-nowrap"
                            {...cell.getCellProps()}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div
              className={`flex flex-col justify-center items-end md:flex-row md:justify-end md:items-center gap-2`}
            >
              <div>
                <SelectInput
                  menuRef={menuRef}
                  value={selectedPageSizeOption}
                  onChange={handleSelectPageSize}
                  inputClassName="!py-2 !pr-8 text-sm"
                  indicatorContainerClassName="!right-3"
                  indicatorContainerIconClassName="!w-[1rem]"
                  menuPortalClassName={`min-w-[10.25rem] ${
                    isMobile ? "translate-x-[-3.2rem]" : ""
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

      {/* UPSERT MODAL */}
      <CustomModal
        isOpen={isUpsertModalOpen}
        handleOpen={handleOpenUpsertModal}
        handleClose={handleCloseUpsertModal}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl">
          <div className="flex items-center justify-between p-6 border-b border-ink-10">
            <h3 className="text-xl font-semibold text-ink-100">
              Thêm mới Admin
            </h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={handleCloseUpsertModal}
            />
          </div>
          <div className="p-6">
            <TextInput
              id="newAdminUsername"
              name="newAdminUsername"
              type="text"
              label="Tên tài khoản"
              fullWidth
              value={newAdminUsername.value}
              onChange={(e) => {
                setNewAdminUserName((prev) => ({
                  ...prev,
                  value: e.target.value,
                }));
              }}
              onBlur={() => {
                setNewAdminUserName((prev) => ({ ...prev, touched: true }));
              }}
              error={
                newAdminUsername.touched && Boolean(newAdminUsername.error)
              }
              helperText={newAdminUsername.touched && newAdminUsername.error}
              containerClassName="mb-6"
            />
            <div className="flex justify-center md:justify-end">
              <CustomButton
                className={`w-full md:w-[12rem] py-4`}
                background={`${
                  newAdminUsername.error ? "bg-ink-10" : "bg-primary-100"
                }`}
                textColor={
                  newAdminUsername.error ? "bg-primary-60" : "bg-background-100"
                }
                textClassName="font-bold"
                onClick={() => {
                  if (!newAdminUsername.error) {
                    handleCloseUpsertModal();
                  }
                }}
              >
                Lưu
              </CustomButton>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* MODAL RESET PASSWORD CONFIRM */}
      <CustomModal
        isOpen={isChangePasswordModalOpen}
        handleOpen={handleOpenChangePasswordPopupModal}
        handleClose={handleCloseChangePasswordPopupModal}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl">
          <div className="flex items-center justify-between p-6 border-b border-ink-10">
            <h3 className="text-xl font-semibold text-ink-100">Đổi mật khẩu</h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={handleCloseChangePasswordPopupModal}
            />
          </div>
          <div className="flex flex-col px-6 pt-6 pb-8">
            <TextInput
              id="oldPassword"
              name="oldPassword"
              type="password"
              label="mật khẩu hiện tại"
              fullWidth
              isLabelOutside
              value={formikChangePassword.values.oldPassword}
              onChange={formikChangePassword.handleChange}
              onBlur={formikChangePassword.handleBlur}
              error={
                formikChangePassword.touched.oldPassword &&
                Boolean(formikChangePassword.errors.oldPassword)
              }
              helperText={
                formikChangePassword.touched.oldPassword &&
                formikChangePassword.errors.oldPassword
              }
              helperTextEnd={`${formikChangePassword.values.oldPassword.length}/20`}
              icon={images.input.eye}
              containerClassName="mb-6"
              isInputDisabled={true}
            />
            <TextInput
              id="newPassword"
              name="newPassword"
              type="password"
              label="mật khẩu mới"
              fullWidth
              isLabelOutside
              value={formikChangePassword.values.newPassword}
              onChange={formikChangePassword.handleChange}
              onBlur={formikChangePassword.handleBlur}
              error={
                formikChangePassword.touched.newPassword &&
                Boolean(formikChangePassword.errors.newPassword)
              }
              helperText={
                formikChangePassword.touched.newPassword &&
                formikChangePassword.errors.newPassword
              }
              helperTextEnd={`${formikChangePassword.values.newPassword.length}/20`}
              icon={images.input.eye}
              containerClassName="mb-6"
            />
            <TextInput
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              label="xác nhận mật khẩu"
              fullWidth
              isLabelOutside
              value={formikChangePassword.values.confirmNewPassword}
              onChange={formikChangePassword.handleChange}
              onBlur={formikChangePassword.handleBlur}
              error={
                formikChangePassword.touched.confirmNewPassword &&
                Boolean(formikChangePassword.errors.confirmNewPassword)
              }
              helperText={
                formikChangePassword.touched.confirmNewPassword &&
                formikChangePassword.errors.confirmNewPassword
              }
              helperTextEnd={`${formikChangePassword.values.confirmNewPassword.length}/20`}
              icon={images.input.eye}
              containerClassName="mb-12"
            />
            <div className="items-center justify-center gap-4">
              <CustomButton
                className="w-full py-4"
                textClassName="font-bold"
                onClick={() => {
                  // TODO
                  // formikChangePassword.handleSubmit();
                  showIsDevelopingModal();
                  handleCloseChangePasswordPopupModal();
                }}
              >
                Xác nhận
              </CustomButton>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* Remove Modal */}
      <CustomModalTwoButton
        open={isRemovePopupOpen}
        handleOpen={handleOpenRemovePopupModal}
        handleClose={handleCloseRemovePopupModal}
        icon={images.user.remove_gold}
        title="Bỏ quyền Admin"
        content="Bạn có chắc chắn muốn xoá bỏ quyền Admin này không?"
        onConfirm={() => {
          // TODO
          // if (isDeletingByList) {
          //   deleteSettingByListIds();
          // } else {
          //   deleteSettingById();
          // }
          showIsDevelopingModal();
          handleCloseDeletePopupModal();
        }}
      />

      {/* Block Modal */}
      <CustomModalTwoButton
        open={isBlockPopupOpen}
        handleOpen={handleOpenBlockPopupModal}
        handleClose={handleCloseBlockPopupModal}
        icon={images.user.block_gold}
        title="Chặn tài khoản"
        content="Bạn có chắc chắn muốn chặn tài khoản này không?"
        onConfirm={() => {
          showIsDevelopingModal();
          handleCloseBlockPopupModal();
        }}
      />

      {/* Authorise Modal */}
      <CustomModalTwoButton
        open={isAuthorizePopupOpen}
        handleOpen={handleOpenAuthorizePopupModal}
        handleClose={handleCloseAuthorizePopupModal}
        icon={images.user.bot}
        title="Cấp quyền Bot"
        content="Bạn có chắc chắn muốn cấp quyền Bot này không?"
        onConfirm={() => {
          showIsDevelopingModal();
          handleCloseAuthorizePopupModal();
        }}
      />

      {/* Delete Modal */}
      <CustomModalTwoButton
        open={isDeletePopupOpen}
        handleOpen={handleOpenDeletePopupModal}
        handleClose={handleCloseDeletePopupModal}
        icon={images.user.remove_gold}
        title="Xoá tài khoản"
        content="Bạn có chắc chắn muốn xoá tài khoản này không?"
        onConfirm={() => {
          // if (isDeletingByList) {
          //   deleteSettingByListIds();
          // } else {
          //   deleteSettingById();
          // }
          showIsDevelopingModal();
          handleCloseDeletePopupModal();
        }}
      />

      {/* POPUP Validate */}
      <CustomValidateModel
        isOpen={modalAttributes.isOpen}
        icon={modalAttributes.icon}
        headingMessage={modalAttributes.headingMessage}
        message={modalAttributes.message}
        buttonMessage={modalAttributes.buttonMessage}
        handleOpen={modalAttributes.handleOpen}
        handleClose={modalAttributes.handleClose}
      />

      {/* SETUP POPUP MODAL */}
      <CustomModal
        isOpen={isSetupPopupOpen}
        handleOpen={handleOpenSetupPopupModal}
        handleClose={handleCloseSetupPopupModal}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl">
          <div className="flex items-center justify-between p-6 border-b border-ink-10">
            <h3 className="text-xl font-semibold text-ink-100">Cài đặt lệnh</h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={handleCloseSetupPopupModal}
            />
          </div>
          <div className="flex flex-col gap-4 p-6 md:gap-6">
            <div className="grid items-center justify-center grid-cols-1 gap-4 md:grid-flow-col md:grid-cols-2 md:auto-cols-fr">
              <CustomRadio
                checked={!isLimited}
                onClick={() => {
                  setIsLimited(false);
                }}
                containerClassName="flex-grow"
                label="Không giới hạn"
              />
              <CustomRadio
                checked={isLimited}
                onClick={() => {
                  setIsLimited(true);
                }}
                label="Giới hạn"
              />
            </div>

            {/* LỆNH TRONG 1 PHIÊN */}
            <div>
              <p className="mb-4 text-sm text-ink-100">LỆNH TRONG 1 PHIÊN</p>
              <CustomInputSpinner
                fullWidth={true}
                name="multiplyPerSession"
                id="multiplyPerSession"
                value={formikSetup.values.multiplyPerSession}
                placeholder="Mời nhập giá trị lệnh"
                error={
                  formikSetup.touched.multiplyPerSession &&
                  Boolean(formikSetup.errors.multiplyPerSession)
                }
                helperText={
                  formikSetup.touched.multiplyPerSession &&
                  formikSetup.errors.multiplyPerSession
                }
                onValueChange={(value, _, values) => {
                  handleAmount(value, "multiplyPerSession", values);
                }}
                onBlur={(e) => {
                  formikSetup.handleBlur(e);
                }}
                handleValueMinusOne={() => {
                  handleAmountMinusOne(
                    formikSetup.values.multiplyPerSession,
                    "multiplyPerSession"
                  );
                }}
                handleValuePlusOne={() => {
                  handleOrderAmountPlusOne(
                    formikSetup.values.multiplyPerSession,
                    "multiplyPerSession"
                  );
                }}
                onFixedValueChange={(value: string | number) => {
                  const plusAmount =
                    +formikSetup.values.multiplyPerSession + +value;
                  formikSetup.setFieldValue("multiplyPerSession", plusAmount);
                }}
                prefix="X"
              />
            </div>

            {/* HỆ SỐ GẤP LỆNH */}
            <div>
              <p className="mb-4 text-sm text-ink-100">HỆ SỐ GẤP LỆNH</p>
              <CustomInputSpinner
                fullWidth={true}
                name="multiply"
                id="multiply"
                value={formikSetup.values.multiply}
                placeholder="Mời nhập giá trị lệnh"
                error={
                  formikSetup.touched.multiply &&
                  Boolean(formikSetup.errors.multiply)
                }
                helperText={
                  formikSetup.touched.multiply && formikSetup.errors.multiply
                }
                onValueChange={(value, _, values) => {
                  handleAmount(value, "multiply", values);
                }}
                onBlur={(e) => {
                  formikSetup.handleBlur(e);
                }}
                handleValueMinusOne={() => {
                  handleAmountMinusOne(formikSetup.values.multiply, "multiply");
                }}
                handleValuePlusOne={() => {
                  handleOrderAmountPlusOne(
                    formikSetup.values.multiply,
                    "multiply"
                  );
                }}
                onFixedValueChange={(value: string | number) => {
                  const plusAmount = +formikSetup.values.multiply + +value;
                  formikSetup.setFieldValue("multiply", plusAmount);
                }}
                prefix="X"
              />
            </div>

            <CustomButton
              className={`py-4 md:min-w-[12rem] basis-1/2 md:basis-auto flex-grow md:flex-initial md:w-fit md:ml-auto cursor-pointer`}
              background="bg-primary-100"
              textClassName="bg-background-100"
              onClick={() => {
                showIsDevelopingModal();
                handleCloseSetupPopupModal();
              }}
            >
              Lưu
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default UserManagementAdmin;
