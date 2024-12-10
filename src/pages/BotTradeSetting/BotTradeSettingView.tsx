import { CloseOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import APIs from "apis";
import images from "assets";
import axios from "axios";
import CustomButton from "components/CustomButton";
import CustomInputSpinner from "components/CustomInputSpinner";
import CustomModal from "components/CustomModal";
import CustomNumberInputWithFocus from "components/CustomNumberInputOnlyFocus";
import CustomRadio from "components/CustomRadio";
import CustomRadioNoBackground from "components/CustomRadio/CustomRadioNoBackground";
import CustomSwitch from "components/CustomSwitch";
import CustomValidateModel from "components/CustomValidateModal";
import GoldButton from "components/GoldButton";
import GreyButton from "components/GreyButton";
import SelectInput from "components/SelectInput";
import TextInput from "components/TextInput";
import { useFormik } from "formik";
import { useEnqueueSnackbar } from "hooks/useEnqueueSnackbar";
import moment from "moment";
import CopyTradeZoomSelectInput from "pages/CopyTradeZoom/CopyTradeZoomSelectInput";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CurrencyInputOnChangeValues } from "react-currency-input-field/dist/components/CurrencyInputProps";
import ReactPaginate from "react-paginate";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { ActionMeta, SingleValue } from "react-select";
import { animated, useSpring } from "react-spring";
import { Column, usePagination, useTable } from "react-table";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { uiActions } from "stores/uiSlice";
import { userActions } from "stores/userSlice";
import BotTableZoomIn from "svgs/BotTableZoomIn";
import BotTableZoomOut from "svgs/BotTableZoomOut";
import TableCancelSvg from "svgs/TableCancelSvg";
import AutoBotManagementList from "types/AutoBotManagementList";
import AutoBotSetting, { AutoBotSettingResult } from "types/AutoBotSetting";
import AutoBotSettingUpdate from "types/AutoBotSettingUpdate";
import { AutoBotSignalTelegram } from "types/AutoBotSignalTelegram";
import { BotAllData } from "types/BotAllData";
import { BotBalance } from "types/BotBalance";
import BotData from "types/BotData";
import BotSignalPersonal from "types/BotSignalPersonal";
import CustomValidateModelProps from "types/CustomValidateProps";
import InputSelectOption from "types/InputSelectOption";
import AutoBotSettingRequest from "types/requests/AutoBotSettingRequest";
import convertToThreeDecimalPlaces from "utils/ConvertToThreeDecimalPlaces";
import * as Yup from "yup";
import BotTradeSettingButton from "./BotTradeSettingButton";
import BotTradeSettingViewTableRow from "./BotTradeSettingViewTableRow";
import TextArea from "components/TextArea";
import CountdownManager from "./CountdownManager";

// type OrderValue = {
//   [key: string]: {
//     [key: string]: number;
//   };
// };
type OrderValue = {
  [key: string]: (number | string)[];
};

interface FormikValueType {
  configName: string;
  youngProfit?: any;
  secondAction: number;
  autoFillInDemo: boolean;
  young_loss?: any;
  amountPerOrder: number;
  orderValue: OrderValue;
  orderValueText: string;
  increaseType: number;
  stepType: number;
  aimMin: number;
  aimMax: number;
  status: string;
  reverse: boolean;
  isSignal: boolean;
  conditionFire: boolean;
  fireOne: number;
  fireTwo: number;
  fireThree: number;
  fireFour: number;
  isShareConfig: boolean;
  isMasterConfig: boolean;
  isTelegramConfig: boolean;
}

interface TooltipToggle {
  [x: string | number]: boolean;
}

type SelectedIdsType = {
  [key: string]: boolean;
};

const STATUSES_MAP = {
  active: "Đang bật",
  inactive: "Đang tắt",
};

const PAGE_SIZE_OPTIONS: InputSelectOption[] = [
  { value: 10, label: "10/page" },
  { value: 20, label: "20/page" },
  { value: 30, label: "30/page" },
  { value: 40, label: "40/page" },
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
  configName: "",
  youngProfit: null,
  secondAction: 20,
  young_loss: null,
  autoFillInDemo: false,
  amountPerOrder: 1,
  orderValue: {},
  orderValueText: '',
  aimMin: 1000,
  aimMax: 1000,
  increaseType: 1,
  stepType: 1,
  status: "active",
  reverse: false,
  isSignal: true,
  conditionFire: false,
  fireOne: 1,
  fireTwo: 1,
  fireThree: 1,
  fireFour: 1,
  isShareConfig: false,
  isMasterConfig: false,
  isTelegramConfig: false,
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

const MANAGEMENT_LIST = {
  DEU_LENH: "Đều lệnh",
  MARTINGALE: "Martingale (Gấp thếp)",
  VICTOR: "Victor đa tầng",
  FIBO: "Fibo đa tầng",
  CUSTOM: "Custom autowin",
};

const BUDGET_MANAGEMENT_OPTIONS: InputSelectOption[] = [
  {
    value: 1,
    label: "Đều lệnh",
  },
  {
    value: 2,
    label: "Martingale (Gấp thếp)",
  },
  {
    value: 3,
    label: "Victor đa tầng",
  },
  {
    value: 4,
    label: "Fibo đa tầng",
  },
  {
    value: 5,
    label: "Custom autowin",
  },
];

const INCREASE_TYPE_OPTIONS = [
  {
    value: 1,
    label: "Tăng giá trị khi thua",
  },
  {
    value: 2,
    label: "Tăng giá trị khi thắng",
  },
  {
    value: 3,
    label: "Luôn luôn tăng giá trị",
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

const INITIAL_BOT_SETTING_RESULT: AutoBotSettingResult = {
  id: 0,
  config_name: "",
  follower: 0,
  follower_name: "",
  follower_username: "",
  account_type: "",
  young_profit: null,
  young_loss: null,
  second_action: 0,
  budgetmanagement_id: 0,
  budgetmanagement_name: "",
  o_amount: 0,
  order_value: {},
  orderValueText: '',
  aim_min: 0,
  aim_max: 0,
  increase_type: 1,
  step_type: 1,
  current_profit: 0,
  current_date_profit: 0,
  current_volume: 0,
  current_date_volume: 0,
  total_win: 0,
  total_lose: 0,
  status: "",
  block_status: "",
  o_owner: 0,
  auto_fillindemo: false,
  signal_id: 0,
  singal_name: "",
  signalpersonal_id: 0,
  signalpersonal_name: "",
  reverse: false,
  condition_fire: false,
  fire_one: 0,
  fire_two: 0,
  fire_three: 0,
  fire_four: 0,
  created_at: "",
  updated_at: "",
  date: "",
  is_master: false,
};

const COLUMNS_ARR = Array(30)
  .fill(0)
  .map((_, index) => index);

const CELL_WIDTH = 90;
const BASE_CELL_WIDTH = 120;
const MIN_WIDTH = CELL_WIDTH * 30 + BASE_CELL_WIDTH;

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: "decimal",
};

interface FollowBotSchedule {
  id: number;
  followbotschedule_name: string;
  followbotid: number[];
  status: string;
  hour_of_day: number;
  minute_of_day: number;
  created_at: string;
  updated_at: string;
}

interface TypeSearchUser {
  label: string
  value: number
}

const BotTradeSettingView = () => {
  const [selectedIds, setSelectedIds] = useState<SelectedIdsType>({});
  const [selectAll, setSelectAll] = useState(0);
  const [refetch, setRefetch] = useState(0)
  const [searchInput, setSearchInput] = useState("");
  const [followbotschedule, setFollowbotschedule] = useState<FollowBotSchedule[]>([])

  // ! BOT
  const [allBotDatas, setAllBotDatas] = useState<BotAllData[]>([]);
  const [partnerBotDatas, setPartnerBotDatas] = useState<BotData[]>([]);
  const [botBalance, setBotBalance] = useState<BotBalance>(INITIAL_BOT_BALANCE);
  const [selectedAccountType, setSelectedAccountType] =
    useState<InputSelectOption>(INITIAL_SELECTED_ACCOUNT_TYPE);
  const [selectedBotAccount, setSelectedBotAccount] =
    useState<InputSelectOption>(INITIAL_SELECTED_OPTION);
  const [selectedMasterAccount, setSelectedMasterAccount] =
    useState<InputSelectOption>(INITIAL_SELECTED_OPTION);
  const [isUpdate, setIsUpdate] = useState(0)
  const [isMasterAccountValid, setIsMasterAccountValid] = useState(false);
  const [accountOptions, setAccountOptions] = useState<InputSelectOption[]>([]);
  const [allBotAccountOptions, setAllBotAccountOptions] = useState<
    InputSelectOption[]
  >([]);

  // ! INITIAL PARTNER BOT USEFFECT
  const [isPartnerBotInitialized, setIsPartnerBotInitialized] = useState(false);
  const [isAllBotInitialized, setIsAllBotInitialized] = useState(false);

  // ! SETTINGS
  const [botSettingData, setAutoBotSettingData] = useState<AutoBotSetting>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [allBotSettingResults, setAllBotSettingResults] = useState<
    AutoBotSettingResult[]
  >([]);
  const userData = useAppSelector((state) => state.user.user);
  const [isDeletingByList, setIsDeletingByList] = useState(false);

  // ! MODAL
  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const [isUpsertZoomTableOpen, setIsUpsertZoomTableOpen] = useState(false);
  // -- Xem hướng dẫn
  const [isGuidePopupOpen, setGuidePopup] = useState(false);

  // ! PAGINATION
  const [selectedPageSizeOption, setSelectedPageSizeOption] =
    useState<InputSelectOption>(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(10);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isPrevHover, setIsPrevHover] = useState(false);
  const [isNextHover, setIsNextHover] = useState(false);

  // ! RESPONSIVE
  const isDesktop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px)",
  });
  const isMobile = useMediaQuery({
    query: "(max-width: 767px)",
  });

  // ! MODAL VALIDATE
  const [modalAttributes, setModalAttributes] =
    useState<CustomValidateModelProps>({
      isOpen: false,
      icon: "",
      headingMessage: "",
      message: "",
      buttonMessage: "",
      handleOpen: () => { },
      handleClose: () => { },
    });
  const [isAmountPerOrderAmountFocus, setIsAmountPerOrderAmountFocus] =
    useState(false);

  // ! FORMIK RELATED STATES
  const [formikValues, setFormikValues] = useState<FormikValueType>(
    INITIAL_FORMIK_VALUES
  );
  const [selectedAutoBotSettingResult, setSelectedAutoBotSettingResult] =
    useState<AutoBotSettingResult>(INITIAL_BOT_SETTING_RESULT);

  const [searchUser, setSearchUser] = useState('')
  const [reSearch, setResearch] = useState(0)
  const [successUser, setSuccessUser] = useState<null | TypeSearchUser>(null)
  const [selectedGift, setSelectedGift] = useState<AutoBotSettingResult | null>(null)

  // -- BUGGET
  const [selectedBotCapitalManagement, setSelectedBotCapitalManagement] =
    useState<InputSelectOption>(BUDGET_MANAGEMENT_OPTIONS[0]);
  const [botCapitalManagementOptions, setBotCapitalManagementOptions] =
    useState<InputSelectOption[]>(BUDGET_MANAGEMENT_OPTIONS);

  // -- INCRESE TYPE
  const [selectedIncreaseType, setSelectedIncreaseType] =
    useState<InputSelectOption>(INCREASE_TYPE_OPTIONS[0]);

  // -- SIGNAL BOT LIST
  const [selectedSignalBot, setSelectedSignalBot] = useState<InputSelectOption>(
    INITIAL_SELECTED_OPTION
  );
  const [signalBotOptions, setSignalBotOptions] = useState<InputSelectOption[]>(
    []
  );

  // -- SIGNAL PERSONAL LIST
  const [selectedSignalPersonal, setSelectedSignalPersonal] =
    useState<InputSelectOption>(INITIAL_SELECTED_OPTION);
  const [signalPersonalOptions, setSignalPersonalOptions] = useState<
    InputSelectOption[]
  >([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSettingCapitalManagement, setIsSettingCapitalManagement] =
    useState(true);
  const [signalError, setSignalError] = useState("");

  // ! ANIMATIONS
  const animationSettingCapitalManagement = useSpring({
    to: {
      opacity: isSettingCapitalManagement ? 1 : 0,
      transform: isSettingCapitalManagement
        ? "translateX(0%)"
        : "translateX(-100%)",
    },
  });

  const animationUpsertModalMobile = useSpring({
    to: {
      opacity: isUpsertModalOpen ? 1 : 0,
      transform: isUpsertModalOpen ? "translateX(0%)" : "translateX(-100%)",
    },
  });

  const animationSettingMethod = useSpring({
    to: {
      opacity: isSettingCapitalManagement ? 0 : 1,
      transform: isSettingCapitalManagement
        ? "translateX(100%)"
        : "translateX(0%)",
    },
  });

  // ! TABLE
  const [tableAccountTypeOptions, setTableAccountTypeOptions] = useState<
    (InputSelectOption | null)[]
  >(new Array(allBotSettingResults.length).fill(null));

  // ! CREATE TABLE
  const [totalCreateTableRows, setTotalCreateTableRows] = useState(
    Array(1)
      .fill(0)
      .map((_, index) => index)
  );

  // ! HOOKS
  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();
  const navigate = useNavigate();
  const scrollElement = useRef<HTMLDivElement>(null);

  const data = React.useMemo<AutoBotSettingResult[]>(
    () => allBotSettingResults,
    [allBotSettingResults]
  );

  const updateStatusById = (schedule: FollowBotSchedule) => {
    setAllBotSettingResults((prev) => {
      const updatedResults = prev.map((e) =>
        schedule.followbotid.includes(e.id)
          ? { ...e, status: schedule.status === "start" ? "active" : "inactive" }
          : e
      );
      return updatedResults;
    });
    // setIsUpdate(prev => prev + 1); // Trigger re-render
  };

  // ! Tooltips
  const [isTooltipOpen, setIsTooltipOpen] = useState<TooltipToggle>({});

  const handleTooltipOpen = useCallback((rowIndex: string | number) => {
    if (!isTooltipOpen[rowIndex]) {
      setIsTooltipOpen((prevState) => ({
        [rowIndex]: true,
      }));
    }
  }, []);

  const handleTooltipClose = (rowIndex: string | number) => {
    // console.log("handleTooltipClose");
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

  const onSelectedAccountTypeChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: InputSelectOption
  ) => {
    setSelectedAccountType(option);
    dispatch(userActions.updateSelectedAccountType(option));
  };

  const onSelectedBotAccountChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: InputSelectOption
  ) => {
    setSelectedBotAccount(option);
    dispatch(userActions.updateSelectedBotAccount(option));
  };

  const onSelectedMasterChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: InputSelectOption
  ) => {
    setSelectedMasterAccount(option);
  };

  // FUNCTIONS FOR MODAL
  const handleOpenUpsertModal = () => {
    setIsUpsertModalOpen(true);
    setSelectedBotCapitalManagement({ value: 1, label: 'Đều lệnh' })
  };

  const handleCloseUpsertModal = () => {
    setIsUpsertModalOpen(false);
    formikUpsert.resetForm();
    setIsMasterAccountValid(false);
    setIsSettingCapitalManagement(true);
    setFormikValues(INITIAL_FORMIK_VALUES);
    setSelectedAccountType(INITIAL_SELECTED_ACCOUNT_TYPE);
    setSignalError("");
    // setSelectedBotAccount(INITIAL_SELECTED_OPTION);
    // setSelectedMasterAccount(INITIAL_SELECTED_OPTION);
  };

  const handleOpenInformationModal = () => {
    setIsInformationModalOpen(true);
  };

  const handleCloseInformationModal = () => {
    setIsInformationModalOpen(false);
  };

  const handleOpenUpsertZoomTableModal = () => {
    setIsUpsertZoomTableOpen(true);
  };

  const handleCloseUpsertZoomTableModal = () => {
    setIsUpsertZoomTableOpen(false);
  };

  const handleOpenPopupModal = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopupModal = () => {
    setIsPopupOpen(false);
  };

  const handleOpenValidAmountPopupModal = () => {
    setModalAttributes((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleCloseValidAmountPopupModal = useCallback(() => {
    setModalAttributes((prev) => ({
      ...prev,
      isOpen: false,
    }));
    formikUpsert.setFieldValue("amountPerOrder", 1);
    formikUpsert.setFieldValue("multiply", 1);
  }, []);

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

  const handleOpenGuidePopupModal = () => {
    setGuidePopup(true);
  };

  const handleCloseGuidePopupModal = () => {
    setGuidePopup(false);
  };

  const showIsDevelopingModal = () => {
    dispatch(uiActions.updateIsModalOpen(true));
  };

  // FUNCTIONS FOR INPUT AMOUNT
  const handleAmount = (
    value: number | string | undefined,
    fieldName: string,
    values: CurrencyInputOnChangeValues | undefined
  ): void => {
    // console.log(value, 'value')
    // const valueToSet = value === undefined || +value <= 0 ? 0 : value || ' ';
    const valueToSet = value === undefined ? "" : value;
    formikUpsert.setFieldValue(fieldName, valueToSet);
  };

  const handleAmountMinusOne = (value: number, fieldName: string) => {
    // if (value - 1 <= 1) return;
    // formikUpsert.setFieldValue(fieldName, +value - 1);
    formikUpsert.setFieldValue(fieldName, Math.max(0, +value - 1));
  };

  const handleOrderAmountPlusOne = (value: number, fieldName: string) => {
    formikUpsert.setFieldValue(fieldName, +value + 1);
  };

  const handleTableInputAmount = (
    value: number | string | undefined,
    col: number,
    row: string
  ) => {
    const valueToSet = value === undefined ? "" : value;
    // console.log("valueToSet", valueToSet);
    const arrToSet = { ...formikUpsert.values.orderValue };
    // console.log("arrToSet", arrToSet);
    const convertedValue = convertToThreeDecimalPlaces(valueToSet);
    // console.log("convertedValue", convertedValue);
    const convertedRowToLayer = "layer" + row;
    if (!arrToSet[convertedRowToLayer]) {
      arrToSet[convertedRowToLayer] = [];
    }

    const isCustomAutoWin = MANAGEMENT_LIST.CUSTOM.includes(
      selectedBotCapitalManagement.label.toString()
    );
    // console.log("convertedValue === undefined", convertedValue === undefined);
    if (
      isCustomAutoWin &&
      (convertedRowToLayer === "layer0" || convertedRowToLayer === "layer2")
    ) {
      arrToSet[convertedRowToLayer][col] =
        convertedValue === "" ? "" : Math.round(+convertedValue);
    } else {
      arrToSet[convertedRowToLayer][col] = convertedValue;
    }

    // console.log(
    //   "arrToSet[convertedRowToLayer][col]",
    //   arrToSet[convertedRowToLayer][col]
    // );

    // POP THE LAST EMPTY ELEMENT
    const lastIndexConvertedRowToLayer =
      arrToSet[convertedRowToLayer].length - 1;
    for (let i = lastIndexConvertedRowToLayer; i > 0; i--) {
      if (!arrToSet[convertedRowToLayer][i]) {
        arrToSet[convertedRowToLayer].pop();
      } else {
        break;
      }
    }

    // REMOVE ARR IF EMPTY
    if (
      arrToSet[convertedRowToLayer].length === 0 ||
      (arrToSet[convertedRowToLayer].length === 1 &&
        !arrToSet[convertedRowToLayer][0])
    ) {
      // console.log("delete arrToSet[convertedRowToLayer]");
      delete arrToSet[convertedRowToLayer];
    }
    // console.log("arrToSet['layer0'][0]", arrToSet['layer0'][0]);
    // console.log('arrToSet[convertedRowToLayer]', arrToSet[convertedRowToLayer]);
    // console.log('arrToSet', arrToSet);
    formikUpsert.setFieldValue("orderValue", arrToSet);
    formikUpsert.setFieldValue("amountPerOrder", arrToSet["layer0"]?.[0]);
  };

  const handleSelectBotCapitalManagement = (
    option: SingleValue<InputSelectOption>,
    actionMeta: ActionMeta<InputSelectOption>
  ) => {
    if (option != null) {
      if (option.value === 2) {
        formikUpsert.setFieldValue('orderValueText', '1-2-4-8-17-35')
      }
      if (option.value === 3) {
        formikUpsert.setFieldValue('orderValueText', '1-1-2-2-3-4-5-7-10-13-18-24-32-44-59-80-108-146-197-271\n0-2-4-4-6-8-10-14-20-26-36-48-64-88-118-160-216-292-394-542')
      }
      if (option.value === 4) {
        formikUpsert.setFieldValue('orderValueText', '1-2-3-5-8-13-21-34-55-89-144')
      }
      if (option.value === 5) {
        formikUpsert.setFieldValue('orderValueText', '1-1-2-6-4-3\n1-2-4-8-17-35\n2-3-4-5-6-1')
      }
      setSelectedBotCapitalManagement(option);
      // formikUpsert.setFieldValue("orderValueText", "");
      if (
        MANAGEMENT_LIST.MARTINGALE.includes(option?.label.toString()) ||
        MANAGEMENT_LIST.FIBO.includes(option?.label.toString())
      ) {
        // console.log("FIBO");
        setTotalCreateTableRows(
          Array(1)
            .fill(0)
            .map((_, index) => index)
        );
      } else if (MANAGEMENT_LIST.VICTOR.includes(option?.label.toString())) {
        setTotalCreateTableRows(
          Array(2)
            .fill(0)
            .map((_, index) => index)
        );
      } else if (MANAGEMENT_LIST.CUSTOM.includes(option?.label.toString())) {
        setTotalCreateTableRows(
          Array(3)
            .fill(0)
            .map((_, index) => index)
        );
      }
    }
  };

  const handleSelectIncreaseType = (
    option: SingleValue<InputSelectOption>,
    actionMeta: ActionMeta<InputSelectOption>
  ) => {
    if (option != null) {
      setSelectedIncreaseType(option);
    }
  };

  const handleSelectSignalBot = (
    option: SingleValue<InputSelectOption>,
    actionMeta: ActionMeta<InputSelectOption>
  ) => {
    if (option != null) {
      setSelectedSignalBot(option);
      setSignalError("");
    }
  };

  const handleSelectSignalPersonal = (
    option: SingleValue<InputSelectOption>,
    actionMeta: ActionMeta<InputSelectOption>
  ) => {
    if (option != null) {
      setSelectedSignalPersonal(option);
      setSignalError("");
    }
  };

  const handleInputCheckbox = (fieldName: string, value: boolean) => {
    formikUpsert.setFieldValue(fieldName, value);
  };

  // FUNCTIONS FOR CHECKBOX
  const toggleRow = useCallback(
    (id: string | number) => {
      const newSelected = { ...selectedIds };
      newSelected[id] = !newSelected[id];
      // console.log(newSelected);
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

  const resetToggleButton = useCallback(() => {
    setSelectAll(0);
    setSelectedIds({});
  }, []);

  // COMMON FUNCTIONS
  const getAllAutoBotSettings = useCallback(
    (page: number) => {
      if (partnerBotDatas.length > 0) {
        // const data: ListMasterCopyTradeSetting = {
        //   master: userData.pk,
        // };
        const followerIds = partnerBotDatas.map((botData) =>
          botData.id.toString()
        );
        axios
          .get(`${APIs.autoBotList}`, {
            params: {
              page,
              search: searchInput,
            },
          })
          .then((res) => {
            const data: AutoBotSetting = res.data;
            setAutoBotSettingData(data);
            setAllBotSettingResults(data.results);
            if (data.count != null && selectedPageSizeOption.value != null) {
              setTotalPages(
                Math.ceil(data.count / +selectedPageSizeOption.value)
              );
            }
          })
          .catch(() => {
            enqueueSnackbar("Không thể lấy bot settings!", {
              variant: "error",
            });
          });
      }
    },
    [
      enqueueSnackbar,
      partnerBotDatas,
      searchInput,
      selectedPageSizeOption.value,
      refetch
    ]
  );

  const getAllBotManagementList = useCallback(() => {
    axios
      .get(`${APIs.botManagementList}`)
      .then((res) => {
        const data: AutoBotManagementList = res.data;
        if (data.count != null) {
          const botCapitalOptionsToSet: InputSelectOption[] = data.results.map(
            (d) => ({ value: d.id, label: d.name })
          );
          setBotCapitalManagementOptions(botCapitalOptionsToSet);
          if (botCapitalOptionsToSet.length > 0) {
            setSelectedBotCapitalManagement(botCapitalOptionsToSet[0]);
          }
        }
      })
      .catch(() => {
        enqueueSnackbar("Không thể lấy bot settings!", {
          variant: "error",
        });
      });
  }, [enqueueSnackbar]);

  const getAllBotSignals = useCallback(() => {
    axios
      .get(`${APIs.botSignalList}`)
      .then((res) => {
        const data: AutoBotSignalTelegram = res.data;
        if (data.count != null) {
          const signalBotOptionsToSet: InputSelectOption[] = data.results.map(
            (d) => ({ value: d.id, label: d.bot_name })
          );
          setSignalBotOptions(signalBotOptionsToSet);
          if (signalBotOptionsToSet.length > 0) {
            setSelectedSignalBot(signalBotOptionsToSet[0]);
          }
        }
      })
      .catch(() => {
        enqueueSnackbar("Không thể lấy signal bots!", {
          variant: "error",
        });
      });
  }, [enqueueSnackbar]);

  const getAllPersonalSignals = useCallback(() => {
    axios
      .get(`${APIs.botSignalPersonalList}`)
      .then((res) => {
        const data: BotSignalPersonal = res.data;
        if (data.count != null) {
          const signalPersonalOptionsToSet: InputSelectOption[] =
            data.results.map((d) => ({ value: d.id, label: d.config_name }));
          setSignalPersonalOptions(signalPersonalOptionsToSet);
          if (signalPersonalOptionsToSet.length > 0) {
            setSelectedSignalPersonal(signalPersonalOptionsToSet[0]);
          }
        }
      })
      .catch(() => {
        enqueueSnackbar("Không thể lấy signal bots!", {
          variant: "error",
        });
      });
  }, [enqueueSnackbar]);

  const updateSettingAccountType = useCallback(
    (botSettingResult: AutoBotSettingResult, accountType: string) => {
      const data: AutoBotSettingUpdate = {
        account_type: accountType,
      };
      axios
        .patch(
          `${APIs.updateAutoBotAccountTypeByIds}${botSettingResult.id}/`,
          data
        )
        .then((res) => {
          getAllAutoBotSettings(page + 1);
          enqueueSnackbar(`Cập nhật cấu hình thành công!`, {
            variant: "success",
          });
        })
        .catch((err) => {
          enqueueSnackbar(`Cập nhật cấu hình thất bại!`, {
            variant: "error",
          });
        });
    },
    [enqueueSnackbar, getAllAutoBotSettings, page]
  );

  const updateSettingStatusByIds = useCallback(
    (ids: number[], status: string) => {
      const data: AutoBotSettingUpdate = {
        status: status,
        current_profit: 0,
        current_date_profit: 0,
        current_volume: 0,
        current_date_volume: 0,
      };
      const idToUpdate = ids.join(",");
      axios
        .patch(`${APIs.updateAutoBotUltimateByIds}${idToUpdate}/`, data)
        .then((res) => {
          getAllAutoBotSettings(page + 1);
          enqueueSnackbar(`Cập nhật cấu hình thành công!`, {
            variant: "success",
          });
        })
        .catch((err) => {
          enqueueSnackbar(`Cập nhật cấu hình thất bại!`, {
            variant: "error",
          });
        });
    },
    [enqueueSnackbar, getAllAutoBotSettings, page]
  );

  const updateSettingPartnerAccount = useCallback(
    (
      botSettingResult: AutoBotSettingResult,
      partnerOption: InputSelectOption
    ) => {
      const data: AutoBotSettingUpdate = {
        follower: +partnerOption.value,
        follower_name: partnerOption.label?.toString(),
      };
      axios
        .patch(
          `${APIs.updateAutoBotFollowerByIds}${botSettingResult.id}/`,
          data
        )
        .then((res) => {
          getAllAutoBotSettings(page + 1);
          enqueueSnackbar(`Cập nhật cấu hình thành công!`, {
            variant: "success",
          });
        })
        .catch((err) => {
          enqueueSnackbar(`Cập nhật cấu hình thất bại!`, {
            variant: "error",
          });
        });
    },
    [enqueueSnackbar, getAllAutoBotSettings, page]
  );

  const deleteAutoBotSettingById = () => {
    axios
      .delete(
        `${APIs.deleteAutoBotStatusByIds}${selectedAutoBotSettingResult.id}`
      )
      .then((res) => {
        getAllAutoBotSettings(page + 1);
        enqueueSnackbar("Xoá cấu hình thành công!", { variant: "success" });
      })
      .catch(() => {
        enqueueSnackbar("Không thể xoá cấu hình!", { variant: "error" });
      });
  };

  const deleteAutoBotSettingByListIds = () => {
    // ENTRY: string: boolean
    const selectedListIds = Object.entries(selectedIds)
      .filter((selected) => selected[1])
      .map((selected) => selected[0]);
    // console.log("selectedListIds:", selectedListIds);
    axios
      .delete(`${APIs.deleteAutoBotStatusByIds}${selectedListIds}`)
      .then((res) => {
        getAllAutoBotSettings(page + 1);
        setSelectedIds({});
        setSelectAll(0);
        enqueueSnackbar("Xoá cấu hình thành công!", { variant: "success" });
      })
      .catch(() => {
        enqueueSnackbar("Xoá cấu hình thất bại!", { variant: "error" });
      });
  };

  const updateModelData = useCallback(
    (autoBotSettingResult: AutoBotSettingResult) => {
      // FIND SELECTED ACCOUNT TYPE
      // console.log(autoBotSettingResult);
      const accountType = ACCOUNT_TYPES.filter(
        (accountType) => accountType.value === autoBotSettingResult.account_type
      )[0];

      // SELECTED MANAGEMENT BUDGET
      const selectedBotCapitalManagent = BUDGET_MANAGEMENT_OPTIONS.filter(
        (option) => option.value === autoBotSettingResult.budgetmanagement_id
      )[0];

      // console.log(BUDGET_MANAGEMENT_OPTIONS);
      // console.log("selectedBotCapitalManagent", selectedBotCapitalManagent);
      // console.log(
      //   "autoBotSettingResult.budgetmanagement_id",
      //   autoBotSettingResult.budgetmanagement_id
      // );

      // console.log(
      //   "updateModelData autoBotSettingResult:",
      //   autoBotSettingResult
      // );

      // FIND SELECTED BOT MASTER ACCOUNT
      // const masterAccount = {
      //   value: botSetting.master,
      //   label: botSetting.master_name,
      // };

      // FIND SELECTED BOT ACCOUNT
      const botAccount = accountOptions.filter(
        (botAccount) => botAccount.value === autoBotSettingResult.follower
      )[0];

      const increaseType = INCREASE_TYPE_OPTIONS.filter(
        (option) => option.value === autoBotSettingResult.increase_type
      )[0];

      const selectedBotSignal =
        signalBotOptions.filter(
          (option) => option.value === autoBotSettingResult.signal_id
        )[0] || signalBotOptions[0];

      const selectedBotSignalPersonal =
        signalPersonalOptions.filter(
          (option) => option.value === autoBotSettingResult.signalpersonal_id
        )[0] || signalPersonalOptions[0];

      // console.log(autoBotSettingResult);
      // console.log(accountType);
      // console.log(accountOptions);
      // console.log(botAccount);

      const orderValueConvertedToString: OrderValue = {};
      const orderValue = { ...autoBotSettingResult.order_value };
      for (const key of Object.keys(orderValue)) {
        orderValueConvertedToString[key] = orderValue[key].map(String);
      }

      // console.log(orderValueConvertedToString);

      // UPDATE FORM MODAL

      const orderValueT = autoBotSettingResult.order_value
      let concatenatedString = "";
      for (let key in orderValueT) {
        if (Array.isArray(orderValueT[key])) {
          concatenatedString += orderValueT[key].join("-");
          if (Object.keys(orderValueT).indexOf(key) < Object.keys(orderValueT).length - 1) {
            concatenatedString += "\n";
          }
        }
      }

      const updatedFormikValues: FormikValueType = {
        configName: autoBotSettingResult.config_name,
        youngProfit: autoBotSettingResult.young_profit,
        secondAction: autoBotSettingResult.second_action,
        autoFillInDemo: autoBotSettingResult.auto_fillindemo,
        amountPerOrder: autoBotSettingResult.o_amount,
        young_loss: autoBotSettingResult.young_loss,
        orderValue: orderValueConvertedToString,
        orderValueText: concatenatedString,
        increaseType: autoBotSettingResult.increase_type,
        stepType: autoBotSettingResult.step_type,
        aimMin: autoBotSettingResult.aim_min,
        aimMax: autoBotSettingResult.aim_max,
        status: autoBotSettingResult.status,
        reverse: autoBotSettingResult.reverse,
        isSignal: autoBotSettingResult.signal_id ? true : false,
        conditionFire: autoBotSettingResult.condition_fire,
        fireOne: autoBotSettingResult.fire_one,
        fireTwo: autoBotSettingResult.fire_two,
        fireThree: autoBotSettingResult.fire_three,
        fireFour: autoBotSettingResult.fire_four,
        isShareConfig: false,
        isMasterConfig: autoBotSettingResult.is_master ? true : false,
        isTelegramConfig: false,
      };

      // console.log("updatedFormikValues", updatedFormikValues);

      if (Object.keys(autoBotSettingResult.order_value).length > 1) {
        const newArr = Array(
          Object.keys(autoBotSettingResult.order_value).length
        )
          .fill(0)
          .map((_, index) => index);

        setTotalCreateTableRows(newArr);
      }

      // console.log("updatedFormikValues", updatedFormikValues);

      setSelectedAccountType(accountType);
      setSelectedIncreaseType(increaseType);
      // setSelectedMasterAccount(masterAccount);
      setSelectedBotCapitalManagement(selectedBotCapitalManagent);
      setSelectedBotAccount(botAccount);
      setSelectedSignalBot(selectedBotSignal);
      setSelectedSignalPersonal(selectedBotSignalPersonal);
      setFormikValues(updatedFormikValues);
    },
    [accountOptions, signalBotOptions]
  );

  const resetAllCurrent = useCallback(() => {
    const data: AutoBotSettingUpdate = {
      current_profit: 0,
      current_date_profit: 0,
      current_volume: 0,
      current_date_volume: 0,
    };
    const selectedListIds = Object.entries(selectedIds)
      .filter((selected) => selected[1])
      .map((selected) => selected[0]);
    axios
      .patch(`${APIs.updateAutoBotUltimateByIds}${selectedListIds}/`, data)
      .then((res) => {
        getAllAutoBotSettings(page + 1);
        enqueueSnackbar(`Nạp lại cấu hình thành công!`, {
          variant: "success",
        });
      })
      .catch((err) => {
        enqueueSnackbar(`Nạp lại cấu hình thất bại!`, {
          variant: "error",
        });
      });
  }, [enqueueSnackbar, getAllAutoBotSettings, page, selectedIds]);

  // PAGINATION FUNCTION
  const handleSelectPageSize = (
    option: SingleValue<InputSelectOption>,
    actionMeta: ActionMeta<InputSelectOption>
  ) => {
    if (option != null) {
      setSelectedPageSizeOption(option);
      setPage(0);
      getAllAutoBotSettings(1);
    }
  };

  const handlePageChange = useCallback(
    ({ selected }: { selected: number }) => {
      // console.log(selected);
      const page = selected + 1;
      setPage(selected);
      getAllAutoBotSettings(page);
    },
    [getAllAutoBotSettings]
  );

  // TABLE
  const columns = React.useMemo<Column<AutoBotSettingResult>[]>(
    () => {
      return [
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
                  onChange={(e) => toggleRow(original.id)}
                />
              </div>
            );
          },
          Header: () => {
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
            return <div className="text-left">Tên cấu hình Bot</div>;
          },
          accessor: "config_name",
          Cell: (props) => {
            const original = props.cell.row.original;
            return (
              <div className="text-left">
                <p className="text-sm text-ink-100">{original.config_name}</p>
              </div>
            );
          },
        },
        {
          Header: () => {
            return <div className="text-left">Loại tài khoản</div>;
          },
          accessor: "account_type",
          Cell: (props) => {
            const original = props.cell.row.original;
            const row = props.cell.row;
            const matchedDatas = ACCOUNT_TYPES.filter(
              (type) => type.value === original.account_type
            );
            const currentOption =
              matchedDatas.length > 0 ? matchedDatas[0] : ACCOUNT_TYPES[0];

            return (
              <div className="min-w-[10rem]">
                <SelectInput
                  value={currentOption}
                  onChange={(
                    option: SingleValue<InputSelectOption>,
                    actionMeta: ActionMeta<InputSelectOption>
                  ) => {
                    if (option != null) {
                      updateSettingAccountType(
                        original,
                        option.value?.toString()
                      );
                    }
                  }}
                  name="select-account-type"
                  options={ACCOUNT_TYPES}
                />
              </div>
            );
          },
        },
        {
          Header: () => {
            return <div className="text-left">Tài khoản giao dịch</div>;
          },
          accessor: "select_partner_account",
          Cell: (props) => {
            const original = props.cell.row.original;
            const row = props.cell.row;
            const matchedDatas = accountOptions.filter(
              (account) => account.value === original.follower
            );
            const currentOption =
              matchedDatas.length > 0 ? matchedDatas[0] : INITIAL_SELECTED_OPTION;
            const isStatusActive = original.status === "active";

            return (
              <div className="min-w-[10rem]">
                <SelectInput
                  value={currentOption}
                  onChange={(
                    option: SingleValue<InputSelectOption>,
                    actionMeta: ActionMeta<InputSelectOption>
                  ) => {
                    if (option != null) {
                      updateSettingPartnerAccount(original, option);
                    }
                  }}
                  name="select-partner-account"
                  options={accountOptions}
                  isSelectDisabled={isStatusActive}
                />
              </div>
            );
          },
        },
        {
          Header: () => {
            return <div className="text-end">Lợi nhuận ngày</div>;
          },
          accessor: "profit_per_day",
          Cell: (props) => {
            const original = props.cell.row.original;
            if (original.current_date_profit != null) {
              const isProfit = +original.current_date_profit > 0;
              const isEqual = +original.current_date_profit === 0;

              return (
                <div className="text-end">
                  <p
                    className={`text-sm ${isProfit
                      ? "text-green-100"
                      : isEqual
                        ? "bg-clip-text text-transparent bg-primary-100"
                        : "text-red-100"
                      } font-bold`}
                  >
                    $
                    {Math.abs(+original.current_date_profit).toLocaleString(
                      "en-US",
                      options
                    )}
                  </p>
                </div>
              );
            } else {
              return (
                <div className="text-end">
                  <p className={`text-sm text-green-100 font-bold`}>$100,000</p>
                </div>
              );
            }
          },
        },
        {
          Header: "Chốt lãi/Cắt lỗ",
          accessor: "profitLoss",
          Cell: (props) => {
            const original = props.cell.row.original;
            return (
              <div className="flex items-center justify-center">
                <p className="px-2 text-xs leading-5 bg-green-100 rounded-3xl text-ink-100">
                  ${original.aim_max?.toLocaleString("en-US", options)}
                </p>
                /
                <p className="px-2 text-xs leading-5 bg-red-100 rounded-3xl text-ink-100">
                  ${original.aim_min?.toLocaleString("en-US", options)}
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
            const isStatusActive = status === "active";

            const statusClass = isStatusActive ? "bg-green-100" : "bg-red-100";
            const statusContent = isStatusActive ? STATUSES_MAP.active : STATUSES_MAP.inactive;

            return (
              <div className="flex">
                <p className={`w-fit px-2 rounded-[0.375rem] text-xs text-ink-100 leading-5 ${statusClass}`}>
                  {statusContent}
                </p>
              </div>
            );
          },
        },
        {
          Header: () => <div className="text-center">Hẹn giờ</div>,
          accessor: "id",
          Cell: (props) => {
            const original = props.cell.row.original;
            const foundObjects = followbotschedule.filter(obj => obj.followbotid.includes(original.id));
            return (
              <div className="flex item-center justify-center">
                <p
                  className={`w-full flex justify-center px-2 rounded-[0.375rem] text-xs text-ink-100 leading-5`}
                >
                  {foundObjects.length > 0 ? (
                    <CountdownManager
                      schedules={foundObjects}
                      onCountdownEnd={(schedule) => {
                        updateStatusById(schedule);
                      }}
                    />
                  ) :
                    <div
                      style={{
                        width: '70px',
                        overflow: 'hidden'
                      }}
                      className={`flex justify-center px-2 rounded-[0.375rem] text-xs text-ink-100 leading-5 'bg-green-100'`}
                    >
                      ---
                    </div>}
                </p>
              </div>
            );
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
                        onClick={(e) => {
                          handleOpenInformationModal();
                          setSelectedAutoBotSettingResult(original);
                        }}
                      >
                        <img
                          className="w-[1.5rem]"
                          src={images.bot.information}
                          alt="BotLambotrade"
                        />
                        <p className="text-base text-ink-100">Xem thông tin</p>
                      </div>
                      <div
                        className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                        onClick={() => {
                          const ids = [original.id];
                          updateSettingStatusByIds(
                            ids,
                            isActive ? "inactive" : "active"
                          );
                        }}
                      >
                        <img
                          className="w-[1.5rem]"
                          src={
                            isActive ? images.bot.off_gold : images.bot.on_gold
                          }
                          alt="BotLambotrade"
                        />
                        <p className="text-base text-ink-100">
                          {isActive ? "Tắt" : "Bật"}
                        </p>
                      </div>
                      <div
                        className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                        onClick={() => {
                          handleOpenUpsertModal();
                          setIsEditing(true);
                          updateModelData(original);
                          setSelectedAutoBotSettingResult(original);
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
                          handleOpenPopupModal();
                          setIsDeletingByList(false);
                          setSelectedAutoBotSettingResult(original);
                        }}
                      >
                        <img
                          className="w-[1.5rem]"
                          src={images.table.delete}
                          alt="BotLambotrade"
                        />
                        <p className="text-base text-ink-100">Xoá cấu hình</p>
                      </div>
                      <div
                        className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                        onClick={() => {
                          setSelectedGift(original);
                        }}
                      >
                        <img
                          className="w-[1.5rem]"
                          src={images.table.gift_gold}
                          alt="BotLambotrade"
                        />
                        <p className="text-base text-ink-100">Tặng cấu hình</p>
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
      ]
    },
    [
      accountOptions,
      handleTooltipOpen,
      isDesktop,
      isTooltipOpen,
      selectAll,
      selectedIds,
      isUpdate,
      toggleAllRow,
      followbotschedule,
      toggleRow,
      updateModelData,
      updateSettingAccountType,
      updateSettingPartnerAccount,
      updateSettingStatusByIds,
    ]
  );

  const tableInstance = useTable({ columns, data }, usePagination);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  // UTILS
  const convertOrderValueToNumber = (orderValues: OrderValue) => {
    let maxRowLength = 0;
    Object.keys(orderValues).forEach((key) => {
      maxRowLength = Math.max(maxRowLength, orderValues[key].length);
    });
    Object.keys(orderValues).forEach((key) => {
      for (let i = 0; i < orderValues[key].length; i++) {
        orderValues[key][i] = +orderValues[key][i];
      }
    });

    console.log("orderValues: ", orderValues);

    return orderValues;
  };

  // ^\d+-\d+-\d+-\d+$

  function convertStringToNumber(str: string) {
    const value = str.trim().replace(',', '.');
    return parseFloat(value);
  }

  // FORMIK
  const formikUpsert = useFormik({
    initialValues: formikValues,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object({
      orderValueText: Yup.string()
        .matches(
          /^(?!.*--)(?!.*-$)(?!^-)(?!.*\n-)(?!.*-\n)(?!.*\.\D)(?!.*\.$)[\d\n.-]+$/,
          "Sai định dạng, Ex: 1-2-3"
        ),
      configName: Yup.string()
        .required("Vui lòng nhập tên cấu hình bot")
        .max(50, "Vui lòng nhập tên cấu hình bot dưới 50 ký tự")
        .matches(
          /^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ][_-a-zA-Z0-9àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ ]*$/gi,
          "Cấu hình bot phải bắt đầu bằng chữ và không chứa ký tự đặc biệt"
        ),
      secondAction: Yup.number()
        .min(1, "Giây vào lệnh không thể nhỏ hơn 1")
        .max(30, "Giây vào lệnh không thể lớn hơn 30")
        .required("Vui lòng nhập giây vào lệnh"),
      young_loss: Yup.string()
        .nullable()
        .matches(
          /^(?!0\.?0*$)(?!0,?0*$)(\d+([.,]\d+)?|\d*([.,]\d+))$/,
          "Giá trị phải là 1 số và lớn hơn 0"
        ),
      youngProfit: Yup.string()
        .nullable()
        .matches(
          /^(?!0\.?0*$)(?!0,?0*$)(\d+([.,]\d+)?|\d*([.,]\d+))$/,
          "Giá trị phải là 1 số và lớn hơn 0"
        ),
      aimMin: Yup.number()
        .min(1, "Giá trị cắt lỗ không thể nhỏ hơn 1")
        .required("Vui lòng nhập giá trị cắt lỗ"),
      aimMax: Yup.number()
        .min(1, "Giá trị chốt lãi không thể nhỏ hơn 1")
        .required("Vui lòng nhập giá trị chốt lãi"),
      fireOne: Yup.number()
        .min(1, "Giá trị cháy x phiên không thể nhỏ hơn 1")
        .required("Vui lòng nhập giá trị cháy x phiên"),
      fireTwo: Yup.number()
        .min(1, "Giá trị trong x phiên không thể nhỏ hơn 1")
        .required("Vui lòng nhập giá trị trong x phiên"),
      fireThree: Yup.number()
        .min(1, "Giá trị bỏ x phiên không thể nhỏ hơn 1")
        .required("Vui lòng nhập giá trị bỏ x phiên"),
      fireFour: Yup.number()
        .min(1, "Giá trị đánh x phiên không thể nhỏ hơn 1")
        .required("Vui lòng nhập giá trị đánh x phiên"),
    }),
    onSubmit: async (values, helpers) => {
      // Validate selected signal is null
      if (values.isSignal && !selectedSignalBot.value) {
        setSignalError("Vui lòng tạo mới Bot Signal để chọn");
        return;
      } else if (!values.isSignal && !selectedSignalPersonal.value) {
        setSignalError("Vui lòng tạo mới Phương pháp cá nhân để chọn");
        return;
      }
      let orderRes: OrderValue = {}
      values.orderValueText.split('\n').map((e, i) => {
        orderRes[`layer${i}`] = e.split('-').map((x) => x && Number(x))
      })
      if (isEditing) {
        // UPDATE
        const updateAutoBotData: AutoBotSettingUpdate = {
          config_name: values.configName,
          follower: +selectedBotAccount.value,
          follower_name: selectedBotAccount.label?.toString(),
          account_type: selectedAccountType?.value.toString(),
          young_profit: values.youngProfit ? convertStringToNumber(String(values.youngProfit)) : null,
          young_loss: values.young_loss ? convertStringToNumber(String(values.young_loss)) : null,
          second_action: values.secondAction,
          budgetmanagement_id: +selectedBotCapitalManagement.value,
          budgetmanagement_name: selectedBotCapitalManagement.label?.toString(),
          signal_id: +selectedSignalBot?.value,
          signalpersonal_id: +selectedSignalPersonal?.value,
          reverse: values.reverse,
          o_amount: values.amountPerOrder,
          increase_type: +selectedIncreaseType.value,
          step_type: values.stepType,
          order_value: orderRes,
          aim_min: values.aimMin,
          aim_max: values.aimMax,
          status: "active",
          block_status: "none",
          auto_fillindemo: values.autoFillInDemo,
          condition_fire: values.conditionFire,
          fire_one: values.fireOne,
          fire_two: values.fireTwo,
          fire_three: values.fireThree,
          fire_four: values.fireFour,
          buget_position: {},
          is_master: values.isMasterConfig,
        };
        if (values.isSignal) {
          delete updateAutoBotData.signalpersonal_id;
        } else {
          delete updateAutoBotData.signal_id;
        }
        axios
          .patch(
            `${APIs.updateAutoBotUltimateByIds}${selectedAutoBotSettingResult.id}/`,
            updateAutoBotData
          )
          .then(() => {
            getAllAutoBotSettings(page + 1);
            enqueueSnackbar("Cập nhập cấu hình thành công!", {
              variant: "success",
            });
            handleCloseUpsertModal();
          })
          .catch((err) => {
            enqueueSnackbar(
              `${err.data
                ? JSON.stringify(err.data)
                : "Cập nhập cấu hình thất bại!"
              }`,
              { variant: "error" }
            );
          });
      } else {
        // INSERT
        const createAutoBotRequest: AutoBotSettingRequest = {
          config_name: values.configName,
          follower: +selectedBotAccount.value,
          account_type: selectedAccountType.value.toString(),
          reverse: values.reverse,
          young_profit: values.youngProfit ? convertStringToNumber(String(values.youngProfit)) : null,
          young_loss: values.young_loss ? convertStringToNumber(String(values.young_loss)) : null,
          second_action: values.secondAction,
          budgetmanagement_id: +selectedBotCapitalManagement.value,
          o_amount: +values.amountPerOrder,
          // order_value: !values.orderValue
          //   ? ""
          //   : convertOrderValueToNumber(values.orderValue),
          order_value: orderRes,
          increase_type: +selectedIncreaseType.value,
          step_type: values.stepType,
          aim_min: +values.aimMin,
          aim_max: +values.aimMax,
          status: "active",
          block_status: "none",
          auto_fillindemo: values.autoFillInDemo,
          signal_id: +selectedSignalBot?.value,
          signalpersonal_id: +selectedSignalPersonal?.value,
          condition_fire: values.conditionFire,
          fire_one: +values.fireOne,
          fire_two: +values.fireTwo,
          fire_three: +values.fireThree,
          fire_four: +values.fireFour,
          buget_position: {},
          is_master: values.isMasterConfig,
        };
        if (values.isSignal) {
          delete createAutoBotRequest.signalpersonal_id;
        } else {
          delete createAutoBotRequest.signal_id;
        }
        axios
          .post(APIs.createAutoBot, createAutoBotRequest)
          .then(() => {
            getAllAutoBotSettings(page + 1);
            enqueueSnackbar("Tạo cấu hình bot thành công!", {
              variant: "success",
            });
            handleCloseUpsertModal();
          })
          .catch((err) => {
            enqueueSnackbar(
              `${err.data
                ? JSON.stringify(err.data)
                : "Tạo cấu hình bot thất bại!"
              }`,
              { variant: "error" }
            );
          });
      }
    },
  });

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

  const reloadDemoBalance = useCallback(
    (id: number | string) => {
      axios
        .get(`${APIs.reloadDemoBalance}${id}/`)
        .then((res) => {
          enqueueSnackbar("Đặt lại số dư ví DEMO thành công!", {
            variant: "success",
          });
          getBalance(selectedBotAccount.value);
        })
        .catch(() => {
          enqueueSnackbar("Đặt lại số dư ví DEMO thất bại!", {
            variant: "error",
          });
        });
    },
    [enqueueSnackbar, getBalance, selectedBotAccount.value]
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

  // USE EFFECT getAllBotSettings
  useEffect(() => {
    getAllAutoBotSettings(page + 1);
  }, [getAllAutoBotSettings, page]);

  // USE EFFECT GET BUDGET MANAGEMENT OPTIONS
  useEffect(() => {
    getAllBotManagementList();
    getAllBotSignals();
    getAllPersonalSignals();
  }, [getAllBotSignals, getAllBotManagementList, getAllPersonalSignals]);

  // USE EFFECT CHECK USERNAME
  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     if (formikUpsert.values.username !== '') {
  //       axios
  //         .get(`${APIs.partnerSearch}${formikUpsert.values.username}/`)
  //         .then((response) => {
  //           console.log(response.data);
  //           if (response.data && response.data?.length > 0) {
  //             setIsMasterAccountValid(true);
  //             formikUpsert.setFieldValue('master', response.data.id);
  //             // formikUpsert.setFieldValue('masterName', response.data.id);
  //           } else {
  //             setIsMasterAccountValid(false);
  //           }
  //         })
  //         .catch((err) => {
  //           setIsMasterAccountValid(false);
  //         });
  //     }
  //   }, 500);

  //   return () => clearTimeout(getData);
  // }, [formikUpsert.values.username]);

  // USE EFFECT SHOW/HIDE VALIDATING AMOUNT PER ORDER MODAL
  useEffect(() => {
    if (
      +formikUpsert.values.amountPerOrder < 1 &&
      !isAmountPerOrderAmountFocus
    ) {
      setModalAttributes((prev) => ({
        ...prev,
        isOpen: true,
        icon: images.copy.warning,
        headingMessage: "Giá trị lệnh không hợp lệ",
        message: (
          <>
            Giá trị lệnh phải lớn hơn <span className="font-bold">0</span>
          </>
        ),
        buttonMessage: "Xác nhận",
        handleOpen: handleOpenValidAmountPopupModal,
        handleClose: handleCloseValidAmountPopupModal,
      }));
    }
  }, [isAmountPerOrderAmountFocus]);

  let isCreateTableValid = MANAGEMENT_LIST.DEU_LENH.includes(
    selectedBotCapitalManagement?.label.toString()
  );

  if (
    !MANAGEMENT_LIST.DEU_LENH.includes(
      selectedBotCapitalManagement?.label.toString()
    ) &&
    Object.keys(formikUpsert.values.orderValue).length > 0
  ) {
    const orderValues = formikUpsert.values.orderValue;
    isCreateTableValid = true;
    let maxRowLength = 0;
    Object.keys(orderValues).forEach((key) => {
      maxRowLength = Math.max(maxRowLength, orderValues[key].length);
    });
    Object.keys(orderValues).forEach((key) => {
      for (let i = 0; i < maxRowLength; i++) {
        if (
          typeof orderValues[key][i] === "undefined" ||
          orderValues[key][i] === ""
        ) {
          isCreateTableValid = false;
          break;
        }
      }
    });
    if (
      MANAGEMENT_LIST.VICTOR.includes(
        selectedBotCapitalManagement?.label.toString()
      ) &&
      Object.keys(orderValues).length < 2
    ) {
      isCreateTableValid = false;
    } else if (
      MANAGEMENT_LIST.CUSTOM.includes(
        selectedBotCapitalManagement?.label.toString()
      )
    ) {
      if (Object.keys(orderValues).length !== 3) {
        isCreateTableValid = false;
      } else {
        Object.keys(orderValues)
          .filter((key) => key !== "layer1")
          .forEach((key) => {
            orderValues[key].forEach((value) => {
              if (+value >= 30 || +value <= 0) {
                isCreateTableValid = false;
                return;
              }
            });
          });
      }
    }
  }

  const isStepOneCompleted =
    // isCreateTableValid &&
    +formikUpsert.values.amountPerOrder > 0 &&
    formikUpsert.touched.configName &&
    !Boolean(formikUpsert.errors.orderValueText) &&
    !Boolean(formikUpsert.errors.configName) &&
    !Boolean(formikUpsert.errors.youngProfit) &&
    !Boolean(formikUpsert.errors.secondAction) &&
    !Boolean(formikUpsert.errors.aimMax) &&
    !Boolean(formikUpsert.errors.aimMin);

  const isStepOneCompletedEditing =
    // isCreateTableValid &&
    !Boolean(formikUpsert.errors.orderValueText) &&
    !Boolean(formikUpsert.errors.configName) &&
    !Boolean(formikUpsert.errors.youngProfit) &&
    !Boolean(formikUpsert.errors.secondAction) &&
    !Boolean(formikUpsert.errors.aimMax) &&
    !Boolean(formikUpsert.errors.aimMin);

  const isCustomAutoWin = MANAGEMENT_LIST.CUSTOM.includes(
    selectedBotCapitalManagement.label.toString()
  );

  const fetchAutoBotList = async () => {
    try {
      await axios.get(APIs.followbotschedule, {
        params: {
          page,
        },
      }).then((res) => {
        const arr: FollowBotSchedule[] | undefined = res.data
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
    fetchAutoBotList()
  }, [])

  const postGift = async () => {
    try {
      if (selectedGift && successUser) {
        const exist = successUser
        const follower = exist.value
        const x = {
          account_type: selectedGift.account_type,
          aim_max: selectedGift.aim_max,
          aim_min: selectedGift.aim_min,
          auto_fillindemo: selectedGift.auto_fillindemo,
          block_status: selectedGift.block_status,
          budgetmanagement_id: selectedGift.budgetmanagement_id,
          buget_position: {},
          condition_fire: selectedGift.condition_fire,
          config_name: selectedGift.config_name,
          fire_four: selectedGift.fire_four,
          fire_one: selectedGift.fire_one,
          fire_three: selectedGift.fire_three,
          signalpersonal_id: selectedGift.signalpersonal_id,
          fire_two: selectedGift.fire_two,
          follower: follower,
          increase_type: selectedGift.increase_type,
          o_amount: selectedGift.o_amount,
          order_value: selectedGift.order_value,
          reverse: selectedGift.reverse,
          second_action: selectedGift.second_action,
          signal_id: selectedGift.signal_id,
          status: selectedGift.status,
          step_type: selectedGift.step_type,
          young_loss: selectedGift.young_loss,
          young_profit: selectedGift.young_profit,
          is_master: selectedGift.is_master
        }
        await axios.post(APIs.donateAutoBot, x)
          .then(() => {
            getAllAutoBotSettings(page + 1);
            enqueueSnackbar("Tặng cấu hình bot thành công!", {
              variant: "success",
            });
            setSuccessUser(null)
            setResearch(0)
          })
          .catch((err) => {
            enqueueSnackbar(
              `${err.data
                ? JSON.stringify(err.data)
                : "Tặng cấu hình bot thất bại!"
              }`,
              { variant: "error" }
            );
          });
      }

    } catch (err) {

    }
  }

  const fetchUser = async () => {
    try {
      await axios
        .get(`${APIs.partnerSearch}${searchUser}/`)
        .then((response) => {
          if (response.data && response.data?.length > 0) {
            setSuccessUser({
              label: response.data[0].username,
              value: response.data[0].id
            });
          } else {
            setSuccessUser(null)
          }
        })
        .catch((err) => {
          setSuccessUser(null)
        });
    } catch (err) {
      setSuccessUser(null)
    } finally {
      setResearch((prev) => prev + 1)
    }
  }

  useEffect(() => {
    let handler: NodeJS.Timeout | null = null
    if (searchUser.length > 0) {
      handler = setTimeout(() => {
        fetchUser();
      }, 500);
    }
    if (searchUser.length <= 0) {
      if (handler != null)
        clearTimeout(handler);
    }
    return () => {
      if (handler != null)
        clearTimeout(handler);
    };
  }, [searchUser])

  return (
    <>
      <CustomModal
        isOpen={selectedGift != null}
        // handleOpen={handleOpenGiftPopupModal}
        handleClose={() => {
          setSelectedGift(null)
        }}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl">
          <div className="p-6 border-b border-ink-10 flex justify-between items-center">
            <h3 className="text-xl text-ink-100 font-semibold">
              Tặng cấu hình
            </h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={() => {
                setSelectedGift(null)
              }}
            />
          </div>
          <div className="p-6">
            <TextInput
              id="giftUsername"
              name="giftUsername"
              type="text"
              label="Tên tài khoản muốn tặng"
              fullWidth
              value={searchUser}
              onChange={(e) => {
                setSearchUser(e.target.value ?? '')
              }}
              onBlur={() => { }}
              error={reSearch > 0 && successUser == null}
              helperText={reSearch > 0 && successUser == null ? "Người được tặng không hợp lệ" : ''}
              containerClassName="mb-6"
            />
            <div className="flex justify-center md:justify-end">
              <CustomButton
                className={`w-full md:w-[12rem] py-4 ${successUser == null ? 'cursor-not-allowed' : ''}`}
                background={successUser == null ? "bg-ink-10" : "bg-primary-100"}
                textColor="bg-background-100"
                textClassName="font-bold"
                onClick={async () => {
                  await postGift()
                }}
              >
                Gửi tặng
              </CustomButton>
            </div>
          </div>
        </div>
      </CustomModal>
      <div className="mb-6 h-fit bg-background-80 rounded-3xl">
        <div className="flex flex-col gap-4 p-6 border-b border-ink-10 md:flex-row md:justify-between md:items-center">
          <h1 className="text-xl font-semibold text-ink-100">
            Danh sách cấu hình Bot đã tạo
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
        {allBotSettingResults.length === 0 && (
          <div className="py-[5rem] flex flex-col justify-center items-center gap-y-6">
            <img
              className="w-[10.25rem]"
              src={images.copy.empty}
              alt="BotLambotrade"
            />
            <p className="text-ink-60">Danh sách cấu hình Bot Trade trống</p>
          </div>
        )}
        {allBotSettingResults.length > 0 && (
          <div className="flex flex-col p-6 gap-y-6">
            {/* SEARCH */}
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

            {/* SELECTED CHECK BOX */}
            {Object.values(selectedIds).filter((value) => value === true)
              .length > 0 && (
                <div className="flex flex-col gap-4 px-4 py-3 bg-ink-05 rounded-xl md:flex-row md:justify-between md:items-center">
                  <p className="font-semibold text-ink-100">
                    {`Đã chọn ${Object.values(selectedIds).filter((value) => value === true)
                      .length
                      }`}
                  </p>
                  <div className="grid items-center justify-center grid-cols-2 gap-4 md:flex">
                    {/* <button
                    className="px-8 py-3 bg-primary-100 rounded-xl"
                    onClick={() => {
                      setIsDeletingByList(true);
                      // deleteSettingByListIds();
                      handleOpenPopupModal();
                    }}
                  >
                    <p className="font-semibold text-transparent bg-background-100 bg-clip-text">
                      Xoá
                    </p>
                  </button> */}
                    <BotTradeSettingButton
                      icon={images.bot.on_gold}
                      iconHover={images.bot.on}
                      classNameHover="background-animation"
                      onClick={() => {
                        const selectedListIds = Object.entries(selectedIds)
                          .filter((selected) => selected[1])
                          .map((selected) => +selected[0]);
                        updateSettingStatusByIds(selectedListIds, "active");
                        resetToggleButton();
                      }}
                    >
                      Bật
                    </BotTradeSettingButton>
                    <BotTradeSettingButton
                      icon={images.bot.off_gold}
                      iconHover={images.bot.off}
                      classNameHover="background-animation"
                      onClick={() => {
                        const selectedListIds = Object.entries(selectedIds)
                          .filter((selected) => selected[1])
                          .map((selected) => +selected[0]);
                        updateSettingStatusByIds(selectedListIds, "inactive");
                        resetToggleButton();
                      }}
                    >
                      Tắt
                    </BotTradeSettingButton>
                    <BotTradeSettingButton
                      icon={images.bot.delete_gold}
                      iconHover={images.bot.delete}
                      classNameHover="background-animation"
                      onClick={() => {
                        setIsDeletingByList(true);
                        handleOpenPopupModal();
                      }}
                    >
                      Xoá
                    </BotTradeSettingButton>
                    <BotTradeSettingButton
                      icon={images.bot.reload_gold}
                      iconHover={images.bot.reload}
                      classNameHover="background-animation"
                      onClick={() => {
                        // showIsDevelopingModal();
                        resetAllCurrent();
                      }}
                    >
                      Nạp lại
                    </BotTradeSettingButton>
                  </div>
                </div>
              )}

            {/* TABLE */}
            <div>
              <div
                className={`border border-ink-05 rounded-2xl w-full ${!isDesktop ? "overflow-x-scroll" : ""
                  }`}
              >
                <table className="w-full" {...getTableProps()}>
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            className="p-4 last:w-[1%] whitespace-nowrap xl:whitespace-normal last:whitespace-nowrap bg-primary-05 first-of-type:rounded-tl-2xl last-of-type:rounded-tr-2xl text-sm text-ink-100 font-normal"
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
                  menuPortalClassName={`min-w-[10.25rem] ${isMobile ? "translate-x-[-3.2rem]" : ""
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

      {/* UPSERT MODAL MOBILE */}

      {/* UPSERT MODAL DESKTOP */}
      <CustomModal
        isOpen={isUpsertModalOpen}
        handleOpen={handleOpenUpsertModal}
        handleClose={handleCloseUpsertModal}
      >
        <animated.div style={isMobile ? animationUpsertModalMobile : {}}>
          <form onSubmit={formikUpsert.handleSubmit}>
            <div className="absolute flex flex-col md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] bg-background-80 h-[100svh] w-full md:w-[45rem] md:h-auto md:rounded-3xl">
              {/* HEADING */}
              <div className="flex items-center justify-between p-6 border-b border-ink-10">
                <h1 className="text-xl font-semibold text-ink-100">
                  {!isEditing ? "Thêm cấu hình Bot" : "Chỉnh sửa cấu hình Bot"}
                </h1>
                <CloseOutlined
                  className="cursor-pointer"
                  onClick={handleCloseUpsertModal}
                />
              </div>
              {/* FORM */}
              <div
                className="md:max-h-[calc(100vh-19rem)] p-6 overflow-y-auto overflow-x-hidden"
                ref={scrollElement}
              >
                {/* FORMIK STEPS */}
                <div className="relative mb-9">
                  <div className="grid grid-cols-2">
                    <div className="flex flex-col items-center gap-y-3">
                      <p
                        className={`${isStepOneCompleted ||
                          (isEditing && isStepOneCompletedEditing)
                          ? "p-[0.375rem]"
                          : "px-4 py-2"
                          } rounded-full bg-primary-100 border-circle-primary text-xl text-background-100 font-bold text-center`}
                      >
                        {isStepOneCompleted ||
                          (isEditing && isStepOneCompletedEditing) ? (
                          <img
                            src={images.bot.completed_V}
                            alt="BotLambotrade"
                          />
                        ) : (
                          "1"
                        )}
                      </p>
                      <p className="text-center text-ink-100">
                        Cấu hình {isMobile && <br />} quản lý vốn
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-y-3">
                      <p
                        className={`${!isSettingCapitalManagement && formikUpsert.isValid
                          ? "p-[0.375rem]"
                          : "px-4 py-2"
                          } rounded-full ${isStepOneCompleted ||
                            (isEditing &&
                              isStepOneCompletedEditing &&
                              !isSettingCapitalManagement)
                            ? "bg-primary-100 border-circle-primary text-background-100"
                            : "bg-ink-10 border-circle-ink text-ink-60"
                          } text-xl font-bold text-center`}
                      >
                        {!isSettingCapitalManagement && formikUpsert.isValid ? (
                          <img
                            src={images.bot.completed_V}
                            alt="BotLambotrade"
                          />
                        ) : (
                          "2"
                        )}
                      </p>
                      <p
                        className={`${isStepOneCompleted ||
                          (isEditing &&
                            isStepOneCompletedEditing &&
                            !isSettingCapitalManagement)
                          ? "text-ink-100"
                          : "text-ink-60"
                          } text-center`}
                      >
                        Cấu hình {isMobile && <br />} phương pháp
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-[50%] top-[1.75rem] translate-x-[-50%] bg-primary-20 w-[calc(50%-4rem)] md:w-[16.375rem] h-[1px]" />
                </div>

                {/* FORMIK INPUT */}
                {isSettingCapitalManagement && (
                  <animated.div style={animationSettingCapitalManagement}>
                    <div className="flex flex-col">
                      {/* SELECT PARTNER */}
                      <div className="p-4 mb-6 bg-ink-05 rounded-2xl">
                        <CopyTradeZoomSelectInput
                          containerClassName="mb-4"
                          inputValue={selectedAccountType}
                          onSelectChange={onSelectedAccountTypeChange}
                          options={ACCOUNT_TYPES}
                          isSearchEnabled={false}
                          labelName="Loại tài khoản"
                        />
                        {partnerBotDatas.length > 0 && (
                          <CopyTradeZoomSelectInput
                            containerClassName="mb-4"
                            inputValue={selectedBotAccount}
                            onSelectChange={onSelectedBotAccountChange}
                            options={accountOptions}
                            isSearchEnabled={false}
                            labelName="Tài khoản giao dịch"
                          />
                        )}
                        {partnerBotDatas.length > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center px-3 gap-x-2">
                              <p className="text-sm text-ink-100">Số dư ví:</p>
                              {selectedAccountType.value === "DEMO" && (
                                <img
                                  onClick={() => {
                                    reloadDemoBalance(selectedBotAccount.value);
                                  }}
                                  className="w-[1.5rem] cursor-pointer"
                                  src={images.home.reload}
                                  alt="BotLambotrade"
                                />
                              )}
                            </div>
                            <p className="text-xl text-transparent bg-primary-100 bg-clip-text">
                              $
                              {selectedAccountType.value === "DEMO"
                                ? botBalance.demo_balance.toLocaleString(
                                  "en-US",
                                  options
                                )
                                : selectedAccountType.value === "LIVE"
                                  ? botBalance.balance.toLocaleString(
                                    "en-US",
                                    options
                                  )
                                  : 0}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Tên cấu hình Bot and Lãi con */}
                      <div className="grid justify-center grid-cols-2 gap-4 mb-4 md:mb-6 md:grid-cols-2">
                        <div className="col-span-2">
                          <TextInput
                            fullWidth={true}
                            name="configName"
                            id="configName"
                            label="Tên cấu hình Bot"
                            type="text"
                            value={formikUpsert.values.configName}
                            onChange={formikUpsert.handleChange}
                            resetValue={() => {
                              formikUpsert.setFieldValue("configName", "");
                            }}
                            onBlur={formikUpsert.handleBlur}
                            placeholder="Tên cấu hình Bot"
                            error={
                              formikUpsert.touched.configName &&
                              Boolean(formikUpsert.errors.configName)
                            }
                            helperText={
                              formikUpsert.touched.configName &&
                              formikUpsert.errors.configName
                            }
                          />
                        </div>
                        <TextInput
                          fullWidth={true}
                          name="youngProfit"
                          id="youngProfit"
                          label="Lãi con"
                          type="string"
                          value={formikUpsert.values.youngProfit}
                          onChange={formikUpsert.handleChange}
                          onBlur={formikUpsert.handleBlur}
                          placeholder="Lãi con"
                          error={
                            formikUpsert.touched.youngProfit &&
                            Boolean(formikUpsert.errors.youngProfit)
                          }
                          helperText={
                            formikUpsert.touched.youngProfit &&
                            formikUpsert.errors.youngProfit ? String(formikUpsert.errors.youngProfit) : ''
                          }
                        />
                        <TextInput
                          fullWidth={true}
                          name="young_loss"
                          id="young_loss"
                          label="Lỗ con"
                          type="string"
                          value={formikUpsert.values.young_loss}
                          onChange={formikUpsert.handleChange}
                          onBlur={formikUpsert.handleBlur}
                          placeholder="Lỗ con"
                          error={
                            formikUpsert.touched.young_loss &&
                            Boolean(formikUpsert.errors.young_loss)
                          }
                          helperText={
                            formikUpsert.touched.young_loss &&
                            formikUpsert.errors.young_loss ? String(formikUpsert.errors.young_loss) : ''
                          }
                        />
                      </div>

                      {/* Quản lý vốn and Giây vào lệnh */}
                      <div className="grid justify-center grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                        <SelectInput
                          value={selectedBotCapitalManagement}
                          label="Quản lý vốn"
                          onChange={handleSelectBotCapitalManagement}
                          name="select-partner-account"
                          options={botCapitalManagementOptions}
                        />

                        {!isMobile && (
                          <TextInput
                            fullWidth={true}
                            name="secondAction"
                            id="secondAction"
                            label="Giây vào lệnh"
                            type="text"
                            value={formikUpsert.values.secondAction}
                            onChange={formikUpsert.handleChange}
                            onBlur={formikUpsert.handleBlur}
                            placeholder="Giây vào lệnh"
                            error={
                              formikUpsert.touched.secondAction &&
                              Boolean(formikUpsert.errors.secondAction)
                            }
                            helperText={
                              formikUpsert.touched.secondAction &&
                              formikUpsert.errors.secondAction
                            }
                            symbol={"s"}
                          />
                        )}

                        {isMobile &&
                          selectedBotCapitalManagement.label != null &&
                          (MANAGEMENT_LIST.FIBO.includes(
                            selectedBotCapitalManagement.label.toString()
                          ) ||
                            MANAGEMENT_LIST.MARTINGALE.includes(
                              selectedBotCapitalManagement.label.toString()
                            )) && (
                            <SelectInput
                              value={selectedIncreaseType}
                              label="Hình thức tăng giá trị"
                              onChange={handleSelectIncreaseType}
                              name="select-partner-account"
                              options={INCREASE_TYPE_OPTIONS}
                            />
                          )}
                      </div>

                      {!isMobile &&
                        selectedBotCapitalManagement.label != null &&
                        (MANAGEMENT_LIST.FIBO.includes(
                          selectedBotCapitalManagement.label.toString()
                        ) ||
                          MANAGEMENT_LIST.MARTINGALE.includes(
                            selectedBotCapitalManagement.label.toString()
                          )) && (
                          <div className="grid justify-center grid-cols-1 gap-4 mb-6">
                            <SelectInput
                              value={selectedIncreaseType}
                              label="Hình thức tăng giá trị"
                              onChange={handleSelectIncreaseType}
                              name="select-partner-account"
                              options={INCREASE_TYPE_OPTIONS}
                            />
                          </div>
                        )}

                      {isMobile && (
                        <div className="grid justify-center grid-cols-1 gap-4 mb-6">
                          <TextInput
                            fullWidth={true}
                            name="secondAction"
                            id="secondAction"
                            label="Giây vào lệnh"
                            type="text"
                            value={formikUpsert.values.secondAction}
                            onChange={formikUpsert.handleChange}
                            onBlur={formikUpsert.handleBlur}
                            placeholder="Giây vào lệnh"
                            error={
                              formikUpsert.touched.secondAction &&
                              Boolean(formikUpsert.errors.secondAction)
                            }
                            helperText={
                              formikUpsert.touched.secondAction &&
                              formikUpsert.errors.secondAction
                            }
                            symbol={"s"}
                          />
                        </div>
                      )}

                      {/* GIÁ TRỊ 1 LỆNH */}
                      <div className="mb-6">
                        <div className="flex justify-between mb-4 text-sm">
                          <p className="text-ink-100">GIÁ TRỊ 1 LỆNH</p>
                          <p
                            className="text-transparent cursor-pointer border-bottom-primary bg-primary-100 bg-clip-text"
                            onClick={() => {
                              handleOpenGuidePopupModal();
                            }}
                          >
                            Xem hướng dẫn
                          </p>
                        </div>
                        {/* Đều lệnh */}
                        {selectedBotCapitalManagement.label != null &&
                          MANAGEMENT_LIST.DEU_LENH.includes(
                            selectedBotCapitalManagement.label.toString()
                          ) && (
                            <CustomInputSpinner
                              fullWidth={true}
                              name="amountPerOrder"
                              id="amountPerOrder"
                              value={formikUpsert.values.amountPerOrder}
                              placeholder="Mời nhập giá trị lệnh"
                              error={
                                formikUpsert.touched.amountPerOrder &&
                                Boolean(formikUpsert.errors.amountPerOrder)
                              }
                              helperText={
                                formikUpsert.touched.amountPerOrder &&
                                formikUpsert.errors.amountPerOrder
                              }
                              onValueChange={(value, _, values) => {
                                handleAmount(value, "amountPerOrder", values);
                              }}
                              onFocus={() => {
                                setIsAmountPerOrderAmountFocus(true);
                              }}
                              onBlur={(e) => {
                                formikUpsert.handleBlur(e);
                                if (Number((e.target.value.replace('$', '').trim() || 0)) <= 0) {
                                  setIsAmountPerOrderAmountFocus(false);
                                }
                              }}
                              handleValueMinusOne={() => {
                                handleAmountMinusOne(
                                  formikUpsert.values.amountPerOrder,
                                  "amountPerOrder"
                                );
                              }}
                              handleValuePlusOne={() => {
                                handleOrderAmountPlusOne(
                                  formikUpsert.values.amountPerOrder,
                                  "amountPerOrder"
                                );
                              }}
                              onFixedValueChange={(value: string | number) => {
                                // CHECK IF PARTNER BOT ALREADY ASSOCIATED
                                formikUpsert.setFieldValue("orderValue", {});
                                const balance =
                                  selectedAccountType.value === "DEMO"
                                    ? botBalance.demo_balance
                                    : botBalance.balance;
                                if (typeof value === "number") {
                                  const plusAmount = +formikUpsert.values.amountPerOrder + value;
                                  if (plusAmount <= balance) {
                                    // console.log(plusAmount, 'plusAmount')
                                    formikUpsert.setFieldValue(
                                      "amountPerOrder",
                                      plusAmount
                                    );
                                  } else {
                                    // console.log(balance, 'balance')
                                    formikUpsert.setFieldValue(
                                      "amountPerOrder",
                                      balance
                                    );
                                  }
                                } else {
                                  // ALL
                                  formikUpsert.setFieldValue(
                                    "amountPerOrder",
                                    balance
                                  );
                                }
                              }}
                              PREFIX_VALUE="+"
                              VALUES={PLUS_VALUES}
                            />
                          )}

                        {/* OTHER METHODS */}
                        {selectedBotCapitalManagement.label != null &&
                          !MANAGEMENT_LIST.DEU_LENH.includes(
                            selectedBotCapitalManagement.label.toString()
                          ) && (
                            <div className="flex flex-col gap-y-4">

                              <div className="flex flex-col flex-auto w-full overflow-auto border-collapse rounded-xl">
                                {/* TABLE */}
                                {totalCreateTableRows.length <= 1
                                  ? <TextInput
                                    fullWidth={true}
                                    name="orderValueText"
                                    id="orderValueText"
                                    label="Giá trị vào lệnh"
                                    type="text"
                                    value={formikUpsert.values.orderValueText}
                                    onChange={formikUpsert.handleChange}
                                    resetValue={() => {
                                      formikUpsert.setFieldValue("orderValueText", "");
                                    }}
                                    onBlur={formikUpsert.handleBlur}
                                    placeholder="Giá trị vào lệnh"
                                    error={
                                      formikUpsert.touched.orderValueText &&
                                      Boolean(formikUpsert.errors.orderValueText)
                                    }
                                    helperText={
                                      formikUpsert.touched.orderValueText &&
                                      formikUpsert.errors.orderValueText
                                    }
                                  />
                                  : <TextArea
                                    fullWidth={true}
                                    name="orderValueText"
                                    id="orderValueText"
                                    label="Giá trị vào lệnh"
                                    type="text"
                                    value={formikUpsert.values.orderValueText}
                                    onChange={formikUpsert.handleChange}
                                    resetValue={() => {
                                      formikUpsert.setFieldValue("orderValueText", "");
                                    }}
                                    onBlur={formikUpsert.handleBlur}
                                    placeholder="Giá trị vào lệnh"
                                    error={
                                      formikUpsert.touched.orderValueText &&
                                      Boolean(formikUpsert.errors.orderValueText)
                                    }
                                    helperText={
                                      formikUpsert.touched.orderValueText &&
                                      formikUpsert.errors.orderValueText
                                    }
                                  />
                                }
                                <div className="flex flex-wrap items-center justify-between gap-4 p-4">
                                  {MANAGEMENT_LIST.FIBO.includes(
                                    selectedBotCapitalManagement.label.toString()
                                  ) && (
                                      <div className="flex gap-6">
                                        <CustomRadioNoBackground
                                          checked={
                                            formikUpsert.values.stepType === 1
                                          }
                                          onClick={() => {
                                            formikUpsert.setFieldValue(
                                              "stepType",
                                              1
                                            );
                                          }}
                                          containerClassName="flex-grow"
                                          label="Step 1"
                                        />
                                        <CustomRadioNoBackground
                                          checked={
                                            formikUpsert.values.stepType === 2
                                          }
                                          onClick={() => {
                                            formikUpsert.setFieldValue(
                                              "stepType",
                                              2
                                            );
                                          }}
                                          label="Step 2"
                                        />
                                        <CustomRadioNoBackground
                                          checked={
                                            formikUpsert.values.stepType === 3
                                          }
                                          onClick={() => {
                                            formikUpsert.setFieldValue(
                                              "stepType",
                                              3
                                            );
                                          }}
                                          label="Step 3"
                                        />
                                      </div>
                                    )}
                                </div>
                              </div>
                              {/* ERROR MESSAGE */}
                              {/* {!isCreateTableValid && (
                                <div className="text-red-100">
                                  Please input the right amount of value
                                </div>
                              )} */}
                            </div>
                          )}
                      </div>

                      {/* AIM */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <TextInput
                          fullWidth={true}
                          name="aimMax"
                          id="aimMax"
                          label="Mục tiêu chốt lãi"
                          type="number"
                          value={formikUpsert.values.aimMax}
                          onValueChange={(value, _, values) => {
                            handleAmount(value, "aimMax", values);
                          }}
                          onBlur={formikUpsert.handleBlur}
                          placeholder="Mục tiêu chốt lãi"
                          error={
                            formikUpsert.touched.aimMax &&
                            Boolean(formikUpsert.errors.aimMax)
                          }
                          helperText={
                            formikUpsert.touched.aimMax &&
                            formikUpsert.errors.aimMax
                          }
                          inputClassName="!text-green-100 !caret-green-100"
                          symbolClassName="text-green-100"
                          symbol="$"
                          prefix=""
                        />
                        <TextInput
                          fullWidth={true}
                          name="aimMin"
                          id="aimMin"
                          label="Mục tiêu cắt lỗ"
                          type="number"
                          value={formikUpsert.values.aimMin}
                          onValueChange={(value, _, values) => {
                            handleAmount(value, "aimMin", values);
                          }}
                          onBlur={formikUpsert.handleBlur}
                          placeholder="Mục tiêu cắt lỗ"
                          error={
                            formikUpsert.touched.aimMin &&
                            Boolean(formikUpsert.errors.aimMin)
                          }
                          helperText={
                            formikUpsert.touched.aimMin &&
                            formikUpsert.errors.aimMin
                          }
                          inputClassName="!text-red-100 !caret-red-100"
                          symbolClassName="text-red-100"
                          symbol="$"
                          prefix=""
                        />
                      </div>

                      {/* Tự nạp DEMO khi không đủ số dư */}
                      <div className="flex items-center mb-6 gap-x-2">
                        <input
                          type="checkbox"
                          className="text-center checkbox"
                          checked={formikUpsert.values.autoFillInDemo}
                          onChange={() => {
                            handleInputCheckbox(
                              "autoFillInDemo",
                              !formikUpsert.values.autoFillInDemo
                            );
                          }}
                        />
                        <p className="text-ink-100">
                          Tự nạp DEMO khi không đủ số dư
                        </p>
                      </div>
                    </div>
                  </animated.div>
                )}

                {!isSettingCapitalManagement && (
                  <animated.div style={animationSettingMethod}>
                    {/* CÔNG THỨC GIAO DỊCH */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <p className="text-sm text-ink-100">
                        CÔNG THỨC GIAO DỊCH
                      </p>
                      <div className="flex items-center gap-x-2">
                        <input
                          type="checkbox"
                          className="text-center checkbox"
                          checked={formikUpsert.values.reverse}
                          onChange={() => {
                            handleInputCheckbox(
                              "reverse",
                              !formikUpsert.values.reverse
                            );
                          }}
                        />
                        <p className="text-ink-100">Đảo lệnh</p>
                      </div>
                    </div>

                    {/* Phương pháp */}
                    <div className="grid items-center justify-center grid-cols-1 gap-4 mb-6 md:grid-flow-col md:grid-cols-2 md:auto-cols-fr">
                      <CustomRadio
                        checked={formikUpsert.values.isSignal}
                        onClick={() => {
                          formikUpsert.setFieldValue("isSignal", true);
                        }}
                        containerClassName="flex-grow"
                        label="Signal Telegram"
                      />
                      <CustomRadio
                        checked={!formikUpsert.values.isSignal}
                        onClick={() => {
                          formikUpsert.setFieldValue("isSignal", false);
                        }}
                        label="Phương pháp cá nhân"
                      />
                    </div>

                    {/* Danh sách Signal (Bot hoặc Personal) */}
                    <div className="mb-8">
                      {formikUpsert.values.isSignal ? (
                        <SelectInput
                          value={selectedSignalBot}
                          label="Danh sách Bot"
                          onChange={handleSelectSignalBot}
                          name="select-signal-bot"
                          options={signalBotOptions}
                          fullWidth
                        />
                      ) : (
                        <SelectInput
                          value={selectedSignalPersonal}
                          label="Danh sách phương pháp"
                          onChange={handleSelectSignalPersonal}
                          name="select-signal-personal"
                          options={signalPersonalOptions}
                          fullWidth
                        />
                      )}
                      {signalError && (
                        <p className="px-2 py-3 text-sm text-red-100">
                          {signalError}
                        </p>
                      )}
                    </div>

                    {/* ĐIỀU KIỆN CHÁY */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-ink-100">ĐIỀU KIỆN CHÁY</p>
                        <CustomSwitch
                          checked={formikUpsert.values.conditionFire}
                          onChange={(e) => {
                            formikUpsert.setFieldValue(
                              "conditionFire",
                              !formikUpsert.values.conditionFire
                            );
                            formikUpsert.setFieldValue("fireOne", 1);
                            formikUpsert.setFieldValue("fireTwo", 1);
                            formikUpsert.setFieldValue("fireThree", 1);
                            formikUpsert.setFieldValue("fireFour", 1);
                          }}
                        />
                      </div>
                      {formikUpsert.values.conditionFire && (
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <TextInput
                            fullWidth={true}
                            name="fireOne"
                            id="fireOne"
                            label="Cháy x phiên"
                            type="number"
                            value={formikUpsert.values.fireOne}
                            onValueChange={(value, _, values) => {
                              if (typeof value !== "undefined") {
                                const wholeNumber = parseInt(value);
                                handleAmount(wholeNumber, "fireOne", values);
                              } else {
                                handleAmount(value, "fireOne", values);
                              }
                            }}
                            onBlur={formikUpsert.handleBlur}
                            placeholder="Cháy x phiên"
                            error={
                              formikUpsert.touched.fireOne &&
                              Boolean(formikUpsert.errors.fireOne)
                            }
                            helperText={
                              formikUpsert.touched.fireOne &&
                              formikUpsert.errors.fireOne
                            }
                            decimalScale={0}
                          />
                          <TextInput
                            fullWidth={true}
                            name="fireTwo"
                            id="fireTwo"
                            label="Trong x phiên"
                            type="number"
                            value={formikUpsert.values.fireTwo}
                            onValueChange={(value, _, values) => {
                              if (typeof value !== "undefined") {
                                const wholeNumber = parseInt(value);
                                handleAmount(wholeNumber, "fireTwo", values);
                              } else {
                                handleAmount(value, "fireTwo", values);
                              }
                            }}
                            onBlur={formikUpsert.handleBlur}
                            placeholder="Trong x phiên"
                            error={
                              formikUpsert.touched.fireTwo &&
                              Boolean(formikUpsert.errors.fireTwo)
                            }
                            helperText={
                              formikUpsert.touched.fireTwo &&
                              formikUpsert.errors.fireTwo
                            }
                            decimalScale={0}
                            decimalsLimit={0}
                          />
                          <TextInput
                            fullWidth={true}
                            name="fireThree"
                            id="fireThree"
                            label="Bỏ x phiên"
                            type="number"
                            value={formikUpsert.values.fireThree}
                            onValueChange={(value, _, values) => {
                              if (typeof value !== "undefined") {
                                const wholeNumber = parseInt(value);
                                handleAmount(wholeNumber, "fireThree", values);
                              } else {
                                handleAmount(value, "fireThree", values);
                              }
                            }}
                            onBlur={formikUpsert.handleBlur}
                            placeholder="Bỏ x phiên"
                            error={
                              formikUpsert.touched.fireThree &&
                              Boolean(formikUpsert.errors.fireThree)
                            }
                            helperText={
                              formikUpsert.touched.fireThree &&
                              formikUpsert.errors.fireThree
                            }
                            decimalScale={0}
                            decimalsLimit={0}
                            fixedDecimalLength={0}
                          />
                          <TextInput
                            fullWidth={true}
                            name="fireFour"
                            id="fireFour"
                            label="Đánh x phiên"
                            type="number"
                            value={formikUpsert.values.fireFour}
                            onValueChange={(value, _, values) => {
                              if (typeof value !== "undefined") {
                                const wholeNumber = parseInt(value);
                                handleAmount(wholeNumber, "fireFour", values);
                              } else {
                                handleAmount(value, "fireFour", values);
                              }
                            }}
                            onBlur={formikUpsert.handleBlur}
                            placeholder="Đánh x phiên"
                            error={
                              formikUpsert.touched.fireFour &&
                              Boolean(formikUpsert.errors.fireFour)
                            }
                            helperText={
                              formikUpsert.touched.fireFour &&
                              formikUpsert.errors.fireFour
                            }
                            decimalScale={0}
                            decimalsLimit={0}
                          />
                        </div>
                      )}
                    </div>

                    {/* TIỆN ÍCH */}
                    <div className="mb-6">
                      <p className="mb-6 text-sm text-ink-100">TIỆN ÍCH</p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div
                          className="p-4 flex items-center justify-between gap-x-[0.625rem] rounded-xl border-input-ink cursor-pointer"
                          onClick={() => {
                            formikUpsert.setFieldValue(
                              "isShareConfig",
                              !formikUpsert.values.isShareConfig
                            );
                          }}
                        >
                          <p className="text-ink-100">Chia sẻ cấu hình</p>
                          <CustomSwitch
                            checked={formikUpsert.values.isShareConfig}
                            onChange={(e) => {
                              formikUpsert.setFieldValue(
                                "isShareConfig",
                                !formikUpsert.values.isShareConfig
                              );
                            }}
                          />
                        </div>
                        <></>
                        <div
                          className="p-4 flex items-center justify-between gap-x-[0.625rem] rounded-xl border-input-ink cursor-pointer"
                          onClick={() => {
                            formikUpsert.setFieldValue(
                              "isMasterConfig",
                              !formikUpsert.values.isMasterConfig
                            );
                          }}
                        >
                          <p className="text-ink-100">Chế độ chuyên gia</p>
                          <CustomSwitch
                            checked={formikUpsert.values.isMasterConfig}
                            onChange={(e) => {
                              formikUpsert.setFieldValue(
                                "isMasterConfig",
                                !formikUpsert.values.isMasterConfig
                              );
                            }}
                          />
                        </div>
                        <div
                          className="p-4 flex items-center justify-between gap-x-[0.625rem] rounded-xl border-input-ink cursor-pointer"
                          onClick={() => {
                            formikUpsert.setFieldValue(
                              "isTelegramConfig",
                              !formikUpsert.values.isTelegramConfig
                            );
                          }}
                        >
                          <p className="text-ink-100">
                            Gửi tiến hiệu về Telegram
                          </p>
                          <CustomSwitch
                            checked={formikUpsert.values.isTelegramConfig}
                            onChange={(e) => {
                              formikUpsert.setFieldValue(
                                "isTelegramConfig",
                                !formikUpsert.values.isTelegramConfig
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </animated.div>
                )}
              </div>
              {/* BUTTON */}
              <div className="grid items-center justify-end grid-cols-2 gap-4 p-6 mt-auto md:flex">
                {isSettingCapitalManagement && !isEditing && (
                  <CustomButton
                    className={`py-4 px-[3.5rem] col-span-2 md:col-auto flex-grow md:flex-initial ${isStepOneCompleted
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                      }`}
                    background={`${isStepOneCompleted ? "bg-primary-100" : "bg-ink-10"
                      }`}
                    textClassName={`${isStepOneCompleted ? "bg-background-100" : "bg-primary-60"
                      }`}
                    onClick={() => {
                      if (isStepOneCompleted) {
                        setIsSettingCapitalManagement(false);
                        if (scrollElement.current) {
                          scrollElement.current.scrollTop = 0;
                        }
                      }
                    }}
                  >
                    Tiếp theo
                  </CustomButton>
                )}

                {isSettingCapitalManagement && isEditing && (
                  <CustomButton
                    className={`py-4 px-[3.5rem] col-span-2 md:col-auto flex-grow md:flex-initial ${isStepOneCompletedEditing
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                      }`}
                    background={`${isStepOneCompletedEditing ? "bg-primary-100" : "bg-ink-10"
                      }`}
                    textClassName={`${isStepOneCompletedEditing
                      ? "bg-background-100"
                      : "bg-primary-60"
                      }`}
                    onClick={() => {
                      if (isStepOneCompletedEditing) {
                        setIsSettingCapitalManagement(false);
                        if (scrollElement.current) {
                          scrollElement.current.scrollTop = 0;
                        }
                      }
                    }}
                  >
                    Tiếp theo
                  </CustomButton>
                )}

                {!isSettingCapitalManagement && (
                  <>
                    <CustomButton
                      className={`py-4 md:min-w-[12rem] basis-1/2 md:basis-auto flex-grow md:flex-initial`}
                      background="bg-ink-05"
                      textClassName="bg-primary-100"
                      onClick={() => {
                        setIsSettingCapitalManagement(true);
                        if (scrollElement.current) {
                          scrollElement.current.scrollTop = 0;
                        }
                      }}
                    >
                      Trở lại
                    </CustomButton>
                    <CustomButton
                      className={`py-4 md:min-w-[12rem] basis-1/2 md:basis-auto flex-grow md:flex-initial ${formikUpsert.isValid
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                        }`}
                      background={`${formikUpsert.isValid ? "bg-primary-100" : "bg-ink-10"
                        }`}
                      textClassName={`${formikUpsert.isValid
                        ? "bg-background-100"
                        : "bg-primary-60"
                        }`}
                      onClick={() => {
                        formikUpsert.handleSubmit();
                      }}
                    >
                      Lưu cấu hình
                    </CustomButton>
                  </>
                )}
              </div>
            </div>
          </form>
        </animated.div>
      </CustomModal>

      {/* DELETE COPY TRADE */}
      <CustomModal
        isOpen={isPopupOpen}
        handleOpen={handleOpenPopupModal}
        handleClose={handleClosePopupModal}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 w-[calc(100vw-2rem)] md:min-w-[31.25rem] md:max-w-[31.25rem] bg-background-80 rounded-3xl text-center">
          <div className="flex items-center justify-center">
            <img
              className="mb-4 w-[5.5rem]"
              src={images.copy.delete}
              alt="BotLambotrade"
            />
          </div>
          <h3 className="mb-2 mx-auto max-w-[18.75rem] text-xl text-ink-100">
            Xoá cấu hình copy trade
          </h3>
          <p className="mb-12 mx-auto max-w-[18.75rem] text-ink-80">
            Bạn có chắc chắn muốn xoá cấu hình copy trade không?
          </p>
          <div className="grid items-center justify-center grid-cols-1 gap-4 md:grid-cols-2">
            <GreyButton onClick={handleClosePopupModal}>Huỷ</GreyButton>
            <GoldButton
              onClick={() => {
                if (isDeletingByList) {
                  deleteAutoBotSettingByListIds();
                } else {
                  deleteAutoBotSettingById();
                }
                handleClosePopupModal();
                resetToggleButton();
              }}
            >
              Xoá
            </GoldButton>
          </div>
        </div>
      </CustomModal>

      {/* Xem hướng dẫn */}
      <CustomModal
        isOpen={isGuidePopupOpen}
        handleOpen={handleOpenGuidePopupModal}
        handleClose={handleCloseGuidePopupModal}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl">
          <div className="flex items-center justify-between p-6 border-b border-ink-10">
            <h3 className="text-xl font-semibold text-ink-100">
              Xem hướng dẫn
            </h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={handleCloseGuidePopupModal}
            />
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-4 mb-9">
              <p className="text-xl font-bold text-transparent bg-primary-100 bg-clip-text">
                {MANAGEMENT_LIST.DEU_LENH.includes(
                  selectedBotCapitalManagement.label.toString()
                )
                  ? "Đều lệnh:"
                  : MANAGEMENT_LIST.MARTINGALE.includes(
                    selectedBotCapitalManagement.label.toString()
                  )
                    ? "Martingale (Gấp thếp):"
                    : MANAGEMENT_LIST.VICTOR.includes(
                      selectedBotCapitalManagement.label.toString()
                    )
                      ? "Victor đa tầng:"
                      : MANAGEMENT_LIST.FIBO.includes(
                        selectedBotCapitalManagement.label.toString()
                      )
                        ? "Fibo đa tầng:"
                        : MANAGEMENT_LIST.CUSTOM.includes(
                          selectedBotCapitalManagement.label.toString()
                        )
                          ? "Custom:"
                          : "Abc"}
              </p>
              <div className="text-ink-100">
                {MANAGEMENT_LIST.DEU_LENH.includes(
                  selectedBotCapitalManagement.label.toString()
                ) ? (
                  <p>Đi đều tiền theo giá trị cài đặt</p>
                ) : MANAGEMENT_LIST.MARTINGALE.includes(
                  selectedBotCapitalManagement.label.toString()
                ) ? (
                  <p>
                    Tiến từ trái sang phải theo hình thức tăng giá trị ( win
                    hoặc lose ) . Nếu cài đặt Tăng giá trị khi Lose thì Win sẽ
                    quay về vị trí lệnh đầu tiên và ngược lại. Trong trường hợp
                    luôn tăng giá trị thì sẽ đi hết 1 chu kỳ từ trái sang phải
                    mới quay về lệnh đầu tiên
                  </p>
                ) : MANAGEMENT_LIST.VICTOR.includes(
                  selectedBotCapitalManagement.label.toString()
                ) ? (
                  <p>
                    Muốn thêm tầng thì ấn nút thêm tầng ( dấu + Thêm ) Mặc định
                    sẽ là 2 tầng có 2 hàng trên và dưới , di chuyển từ trái sang
                    phải khi lose ở hàng trên, win tại lệnh nào gấp đôi tại lệnh
                    tương ứng tại hàng dưới, Nếu win 2 lệnh tiếp tiếp thì về
                    lệnh đầu tiên tương tự như vậy ở các tầng tiếp theo
                  </p>
                ) : MANAGEMENT_LIST.FIBO.includes(
                  selectedBotCapitalManagement.label.toString()
                ) ? (
                  <ul className="pl-2 list-disc list-inside">
                    <li className="mb-4">
                      Lựa chọn Fibo Step 1 - 2 - 3 và điền giá trị lệnh theo quy
                      luật từ trái sang phải.
                    </li>
                    <li className="mb-4">
                      Thua thì tiến , thắng thì lùi theo dãy giá trị
                    </li>
                    <li className="mb-4">
                      Fibo Step 1 Lose tăng 1 đơn vị (vị trí đi tiền ) , win lùi
                      1 đơn vị ( vị trí đi tiền )
                    </li>
                    <li className="mb-4">
                      Fibo Step 2 : Lose tăng 1 đơn vị (vị trí đi tiền ), win
                      lùi 2 đơn vị ( ví trí đi tiền )
                    </li>
                    <li>
                      Fibo Step 3 : Lose tăng 1 đơn vị (vị trí đi tiền ), win
                      lùi 3 đơn vị ( ví trí đi tiền )
                    </li>
                  </ul>
                ) : MANAGEMENT_LIST.CUSTOM.includes(
                  selectedBotCapitalManagement.label.toString()
                ) ? (
                  <ul className="pl-2 list-disc list-inside">
                    <li className="mb-4">Theo chu kì từ trái sang phải</li>
                    <li className="mb-4">Hàng 1 : vị trí lệnh khi Lose</li>
                    <li className="mb-4">Hàng 2 : giá trị lệnh</li>
                    <li>Hàng 3 : vị trí lệnh khi Win</li>
                  </ul>
                ) : (
                  "Abc"
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <CustomButton
                className="px-16 py-4"
                textClassName="font-bold"
                onClick={handleCloseGuidePopupModal}
              >
                Đã hiểu
              </CustomButton>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* INFORMATION Popup Modal */}
      <CustomModal
        isOpen={isInformationModalOpen}
        handleOpen={handleOpenInformationModal}
        handleClose={handleCloseInformationModal}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25vw] bg-background-80 rounded-3xl">
          <div className="flex justify-between px-6 py-5 border-b border-ink-10">
            <p className="text-xl font-bold text-ink-100">
              Thông tin cấu hình Bot
            </p>
            <div
              onClick={() => {
                handleCloseInformationModal();
              }}
            >
              <TableCancelSvg className="w-[2rem] text-ink-100 cursor-pointer" />
            </div>
          </div>

          <div className="flex flex-col px-6 pb-2">
            {/* Tên cấu hình Bot */}
            <div className="flex items-center justify-between py-4 border-b border-ink-10">
              <p className="text-sm text-ink-80">Tên cấu hình Bot</p>
              <p className="font-bold text-ink-100">
                {selectedAutoBotSettingResult.config_name}
              </p>
            </div>

            {/* Loại tài khoản */}
            <div className="flex items-center justify-between py-4 border-b border-ink-10">
              <p className="text-sm text-ink-80">Loại tài khoản</p>
              <p
                className={`px-2 ${selectedAutoBotSettingResult.account_type === "DEMO"
                  ? "bg-blue-80"
                  : "bg-purple-100"
                  } rounded-3xl text-ink-100 text-xs`}
              >
                {selectedAutoBotSettingResult.account_type}
              </p>
            </div>

            {/* Trạng thái */}
            <div className="flex items-center justify-between py-4 border-b border-ink-10">
              <p className="text-sm text-ink-80">Trạng thái</p>
              <p
                className={`w-fit px-2 rounded-[0.375rem] text-xs text-ink-100 leading-5 ${selectedAutoBotSettingResult.status === "active"
                  ? "bg-green-100"
                  : "bg-red-100"
                  }`}
              >
                {selectedAutoBotSettingResult.status === "active"
                  ? STATUSES_MAP.active
                  : STATUSES_MAP.inactive}
              </p>
            </div>

            {/* Lợi nhuận */}
            <div className="flex items-center justify-between py-4 border-b border-ink-10">
              <p className="text-sm text-ink-80">Lợi nhuận</p>
              <p
                className={`font-bold  ${selectedAutoBotSettingResult.current_profit >= 0
                  ? "text-green-100"
                  : "text-red-100"
                  }`}
              >
                {selectedAutoBotSettingResult.current_profit >= 0 ? "$" : "-$"}
                {Math.abs(
                  selectedAutoBotSettingResult.current_profit
                ).toLocaleString("en-US", options)}
              </p>
            </div>

            {/* Tổng Win/Lose */}
            <div className="flex items-center justify-between py-4 border-b border-ink-10">
              <p className="text-sm text-ink-80">Tổng Win/Lose</p>
              <p className={`text-ink-100 font-bold`}>
                <span className="text-green-100">
                  {selectedAutoBotSettingResult.total_win}
                </span>
                /
                <span className="text-red-100">
                  {selectedAutoBotSettingResult.total_lose}
                </span>
              </p>
            </div>

            {/* LN ngày/LN tổng */}
            <div className="flex items-center justify-between py-4 border-b border-ink-10">
              <p className="text-sm text-ink-80">LN ngày/LN tổng</p>
              <p className={`text-ink-100 font-bold`}>
                <span
                  className={`${selectedAutoBotSettingResult.current_date_profit > 0
                    ? "text-green-100"
                    : selectedAutoBotSettingResult.current_date_profit === 0
                      ? "bg-primary-100 bg-clip-text text-transparent"
                      : "text-red-100"
                    }`}
                >
                  {selectedAutoBotSettingResult.current_date_profit >= 0
                    ? "$"
                    : "-$"}
                  {Math.abs(
                    selectedAutoBotSettingResult.current_date_profit
                  ).toLocaleString("en-US", options)}
                </span>
                /
                <span
                  className={`${selectedAutoBotSettingResult.current_profit > 0
                    ? "text-green-100"
                    : selectedAutoBotSettingResult.current_profit === 0
                      ? "bg-primary-100 bg-clip-text text-transparent"
                      : "text-red-100"
                    }`}
                >
                  {selectedAutoBotSettingResult.current_profit >= 0
                    ? "$"
                    : "-$"}
                  {Math.abs(
                    selectedAutoBotSettingResult.current_profit
                  ).toLocaleString("en-US", options)}
                </span>
              </p>
            </div>

            {/* Volume ngày/Volume tổng */}
            <div className="flex items-center justify-between py-4 border-b border-ink-10">
              <p className="text-sm text-ink-80">Volume ngày/Volume tổng</p>
              <p className={`text-ink-100 font-bold`}>
                <span className="text-teal-100">
                  $
                  {selectedAutoBotSettingResult.current_date_volume.toLocaleString(
                    "en-US",
                    options
                  )}
                </span>
                /
                <span className="text-teal-100">
                  $
                  {selectedAutoBotSettingResult.current_volume.toLocaleString(
                    "en-US",
                    options
                  )}
                </span>
              </p>
            </div>

            {/* Thời gian tạo */}
            <div className="flex items-center justify-between py-4">
              <p className="text-sm text-ink-80">Thời gian tạo</p>
              <p className={`text-ink-100 font-bold`}>
                {moment(selectedAutoBotSettingResult.created_at).format(
                  "DD/MM/YYYY HH:mm"
                )}
              </p>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* UPSERT TABLE ZOOM MODAL */}
      <CustomModal
        isOpen={isUpsertZoomTableOpen}
        handleOpen={handleOpenUpsertZoomTableModal}
        handleClose={handleCloseUpsertZoomTableModal}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[80vw] bg-background-80 rounded-3xl">
          <div className="p-4">
            <p className="mb-4 text-sm text-ink-100">GIÁ TRỊ 1 LỆNH</p>

            {/* OTHER METHODS */}
            {selectedBotCapitalManagement.label != null &&
              !MANAGEMENT_LIST.DEU_LENH.includes(
                selectedBotCapitalManagement.label.toString()
              ) && (
                <div className="flex flex-col gap-y-4">
                  <div className="border border-collapse border-ink-10 rounded-xl">
                    <div className="flex flex-col flex-auto w-full overflow-auto border-collapse rounded-xl">
                      {/* TABLE */}
                      {!isCustomAutoWin && (
                        <div
                          className="rt-thead flex-auto flex flex-col items-stretch z-[3]"
                          style={{
                            minWidth: MIN_WIDTH,
                          }}
                        >
                          {/* HEADER */}
                          <div className="rt-tr flex-auto flex z-[3] border-b border-ink-10">
                            <div className="left-0 sticky rt-th w-[7.375rem] max-w-[7.375rem] p-4 flex-[100_0_auto] bg-background-80 border-r border-ink-10 z-[100] text-sm cursor-pointer overflow-visible whitespace-nowrap text-ellipsis">
                              Vị trí
                            </div>
                            {COLUMNS_ARR.map((num) => {
                              const isLastIndex =
                                num === COLUMNS_ARR.length - 1;
                              return (
                                <div
                                  key={num}
                                  className={`rt-th w-[5.625rem] max-w-[5.625rem] p-4 sticky flex-[100_0_auto] text-sm text-end ${isLastIndex ? "" : "border-r border-ink-10"
                                    } z-[11] cursor-pointer overflow-visible`}
                                  style={{
                                    width: CELL_WIDTH,
                                    minWidth: CELL_WIDTH,
                                  }}
                                >
                                  {num + 1}
                                </div>
                              );
                            })}
                          </div>
                          {totalCreateTableRows.map((row, rowIndex) => {
                            const convertedRowToLayer = "layer" + rowIndex;

                            return (
                              <div
                                key={row}
                                className="rt-tr flex-auto flex z-[3] border-b border-ink-10"
                              >
                                <BotTradeSettingViewTableRow
                                  row={rowIndex}
                                  onDeleteRow={() => {
                                    delete formikUpsert.values.orderValue?.[
                                      convertedRowToLayer
                                    ];
                                    Object.keys(formikUpsert.values.orderValue)
                                      .sort() // sort the keys in ascending order
                                      .reduce((acc: OrderValue, key, index) => {
                                        const newIndex = index; // calculate the new index
                                        const newKey = `layer${newIndex}`; // create the new key

                                        if (key !== newKey) {
                                          formikUpsert.values.orderValue[
                                            newKey
                                          ] =
                                            formikUpsert.values.orderValue[key]; // update the object with the new key
                                          delete formikUpsert.values.orderValue[
                                            key
                                          ]; // delete the old key
                                        }

                                        acc[newKey] =
                                          formikUpsert.values.orderValue[
                                          newKey
                                          ]; // add the key and value to the new object

                                        return acc;
                                      }, {});

                                    // console.log("arrBeforeRemoveRow: ", [
                                    //   ...totalCreateTableRows,
                                    // ]);

                                    const arrAfterRemoveRow = [
                                      ...totalCreateTableRows,
                                    ];
                                    arrAfterRemoveRow.splice(rowIndex, 1);
                                    // console.log(
                                    //   "arrAfterRemoveRow",
                                    //   arrAfterRemoveRow
                                    // );
                                    setTotalCreateTableRows(arrAfterRemoveRow);
                                  }}
                                />
                                {COLUMNS_ARR.map((col) => {
                                  const isLastIndex =
                                    col === COLUMNS_ARR.length - 1;
                                  return (
                                    <div
                                      key={col}
                                      className={`rt-th w-[5.625rem] max-w-[5.625rem] sticky flex-[100_0_auto] text-end ${isLastIndex
                                        ? ""
                                        : "border-r border-ink-10"
                                        } z-[11] cursor-pointer overflow-visible`}
                                      style={{
                                        width: CELL_WIDTH,
                                        minWidth: CELL_WIDTH,
                                      }}
                                    >
                                      <CustomNumberInputWithFocus
                                        value={
                                          formikUpsert.values.orderValue?.[
                                          convertedRowToLayer
                                          ]?.[col]
                                        }
                                        decimalsLimit={3}
                                        maxLength={13}
                                        onValueChange={(value, _, values) => {
                                          handleTableInputAmount(
                                            value,
                                            col,
                                            rowIndex.toString()
                                          );
                                        }}
                                        inputClassName="p-4 text-end bg-clip-text text-transparent bg-primary-100"
                                        prefix={"$"}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {isCustomAutoWin && (
                        <div
                          className="rt-thead flex-auto flex flex-col items-stretch z-[3]"
                          style={{
                            minWidth: MIN_WIDTH,
                          }}
                        >
                          {Array(3)
                            .fill(0)
                            .map((row, rowIndex) => {
                              const convertedRowToLayer = "layer" + rowIndex;

                              return (
                                <div
                                  key={rowIndex}
                                  className="rt-tr flex-auto flex z-[3] border-b border-ink-10"
                                >
                                  <div className="left-0 sticky rt-th w-[7.375rem] max-w-[7.375rem] py-[0.375rem] px-4 flex-[100_0_auto] flex items-center bg-background-80 border-r border-ink-10 z-[100] text-sm cursor-pointer overflow-visible text-ellipsis">
                                    {rowIndex === 2
                                      ? "Vị trí lệnh khi thắng"
                                      : rowIndex === 1
                                        ? "Giá trị lệnh"
                                        : "Vị trí lệnh khi thua"}
                                  </div>
                                  {COLUMNS_ARR.map((col) => {
                                    const isLastIndex =
                                      col === COLUMNS_ARR.length - 1;
                                    return (
                                      <div
                                        key={col}
                                        className={`rt-th w-[5.625rem] max-w-[5.625rem] sticky flex-[100_0_auto] text-end ${isLastIndex
                                          ? ""
                                          : "border-r border-ink-10"
                                          } z-[11] cursor-pointer overflow-visible`}
                                        style={{
                                          width: CELL_WIDTH,
                                          minWidth: CELL_WIDTH,
                                        }}
                                      >
                                        <CustomNumberInputWithFocus
                                          value={
                                            formikUpsert.values.orderValue?.[
                                            convertedRowToLayer
                                            ]?.[col]
                                          }
                                          decimalsLimit={3}
                                          maxLength={13}
                                          onValueChange={(
                                            value,
                                            test,
                                            values
                                          ) => {
                                            // console.log("test", test);
                                            handleTableInputAmount(
                                              value,
                                              col,
                                              rowIndex.toString()
                                            );
                                          }}
                                          inputClassName={`p-4 text-end bg-clip-text text-transparent ${rowIndex === 1
                                            ? "bg-primary-100"
                                            : "bg-ink-100"
                                            }`}
                                          prefix={rowIndex === 1 ? "$" : ""}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div>
                        {MANAGEMENT_LIST.FIBO.includes(
                          selectedBotCapitalManagement.label.toString()
                        ) && (
                            <div className="flex gap-6">
                              <CustomRadioNoBackground
                                checked={formikUpsert.values.stepType === 1}
                                onClick={() => {
                                  formikUpsert.setFieldValue("stepType", 1);
                                }}
                                containerClassName="flex-grow"
                                label="Step 1"
                              />
                              <CustomRadioNoBackground
                                checked={formikUpsert.values.stepType === 2}
                                onClick={() => {
                                  formikUpsert.setFieldValue("stepType", 2);
                                }}
                                label="Step 2"
                              />
                              <CustomRadioNoBackground
                                checked={formikUpsert.values.stepType === 3}
                                onClick={() => {
                                  formikUpsert.setFieldValue("stepType", 3);
                                }}
                                label="Step 3"
                              />
                            </div>
                          )}

                        {MANAGEMENT_LIST.VICTOR.includes(
                          selectedBotCapitalManagement.label.toString()
                        ) && (
                            <div
                              className={`flex gap-[0.625rem] items-center text-sm ${totalCreateTableRows.length < 6
                                ? "cursor-pointer"
                                : "cursor-not-allowed"
                                }`}
                              onClick={() => {
                                if (totalCreateTableRows.length < 6) {
                                  const newArr = Array(
                                    totalCreateTableRows.length + 1
                                  )
                                    .fill(0)
                                    .map((_, index) => index);
                                  setTotalCreateTableRows(newArr);
                                }
                              }}
                            >
                              {totalCreateTableRows.length < 6 ? (
                                <img
                                  className="w-[1.5rem]"
                                  src={images.bot.add_gold_100}
                                  alt="BotLambotrade"
                                />
                              ) : (
                                <img
                                  className="w-[1.5rem]"
                                  src={images.bot.add_gold_60}
                                  alt="BotLambotrade"
                                />
                              )}
                              <p
                                className={`${totalCreateTableRows.length < 6
                                  ? "bg-primary-100"
                                  : "bg-primary-60"
                                  } bg-clip-text text-transparent`}
                              >
                                Thêm
                              </p>
                            </div>
                          )}
                      </div>
                      <div className="flex items-center justify-end">
                        <BotTableZoomOut
                          className="cursor-pointer"
                          onClick={() => {
                            handleCloseUpsertZoomTableModal();
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ERROR MESSAGE */}
                  {!isCreateTableValid && (
                    <div className="text-red-100">
                      Please input the right amount of value
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </CustomModal>

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
    </>
  );
};

export default BotTradeSettingView;
