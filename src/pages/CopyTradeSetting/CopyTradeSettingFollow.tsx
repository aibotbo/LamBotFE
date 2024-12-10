import { CloseOutlined } from '@mui/icons-material';
import { ClickAwayListener, Tooltip } from '@mui/material';
import APIs from 'apis';
import images from 'assets';
import axios from 'axios';
import CustomModal from 'components/CustomModal';
import CustomNumberInput from 'components/CustomNumberInput';
import CustomSwitch from 'components/CustomSwitch';
import CustomValidateModel from 'components/CustomValidateModal';
import GoldButton from 'components/GoldButton';
import GreyButton from 'components/GreyButton';
import TextInput from 'components/TextInput';
import { useFormik } from 'formik';
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import moment from 'moment';
import CopyTradeZoomSelectInput from 'pages/CopyTradeZoom/CopyTradeZoomSelectInput';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { CurrencyInputOnChangeValues } from 'react-currency-input-field/dist/components/CurrencyInputProps';
import { useNavigate } from 'react-router-dom';
import ReactSwitch from 'react-switch';
import { Column, usePagination, useTable } from 'react-table';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { userActions } from 'stores/userSlice';
import { BotAllData } from 'types/BotAllData';
import { BotBalance } from 'types/BotBalance';
import BotData from 'types/BotData';
import BotSetting, { BotSettingResult } from 'types/BotSetting';
import BotSettingUpdate from 'types/BotSettingUpdate';
import CustomValidateModelProps from 'types/CustomValidateProps';
import InputSelectOption from 'types/InputSelectOption';
import * as Yup from 'yup';
import { BotCopyTrade } from '../../types/BotCopyTrade';
import { ActionMeta, SingleValue } from 'react-select';
import SelectInput from 'components/SelectInput';
import ReactPaginate from 'react-paginate';
import convertToThreeDecimalPlaces from 'utils/ConvertToThreeDecimalPlaces';
import { useMediaQuery } from 'react-responsive';
import { animated, useSpring } from 'react-spring';
import BotTradeSettingButton from 'pages/BotTradeSetting/BotTradeSettingButton';

type CopyTradeFollowProps = {
  isFollowing?: boolean;
  setIsFollowing?: React.Dispatch<React.SetStateAction<boolean>>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
};

interface ListMasterCopyTradeSetting {
  master?: string | number;
}

interface ListFollowerCopyTradeSetting {
  follower?: string | number;
}

interface FormikValueType {
  master: number;
  username: string;
  amountPerOrder: number;
  multiply: number;
  aimMin: number;
  aimMax: number;
  aiBotTelegramEnabled: boolean;
  aiBasicEnabled: boolean;
  copyTradeEnabled: boolean;
  status: string;
}

interface TooltipToggle {
  [x: string | number]: boolean;
}

type SelectedIdsType = {
  [key: string]: boolean;
};

const PAGE_SIZE_OPTIONS: InputSelectOption[] = [
  { value: 10, label: '10/page' },
  { value: 20, label: '20/page' },
  { value: 30, label: '30/page' },
  { value: 40, label: '40/page' },
];

const PLUS_VALUES = [5, 10, 20, 50, 100, 'All'];
const MULTIPLY_VALUES = [2, 5, 10, 20, 40, 100];
const OPTIONS = [
  {
    value: 10,
    name: 'Ten',
  },
  {
    value: 15,
    name: 'Fifteen',
  },
  {
    value: 20,
    name: 'Twenty',
  },
  {
    value: 25,
    name: 'Twenty-five',
  },
];

const INITIAL_BOT_BALANCE = {
  balance: 1,
  demo_balance: 1,
  usdt_balance: 1,
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
  value: 'LIVE',
  label: 'Tài khoản LIVE',
};

const INITIAL_FORMIK_VALUES: FormikValueType = {
  master: 0,
  username: '',
  amountPerOrder: 1,
  multiply: 1,
  aimMin: 0,
  aimMax: 0,
  aiBotTelegramEnabled: true,
  aiBasicEnabled: true,
  copyTradeEnabled: true,
  status: 'inactive',
};

const ACCOUNT_TYPES = [
  {
    value: 'DEMO',
    label: 'Tài khoản DEMO',
  },
  {
    value: 'LIVE',
    label: 'Tài khoản LIVE',
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

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: 'decimal',
};

const CopyTradeSettingFollow: FC<CopyTradeFollowProps> = ({
  isFollowing,
  setIsFollowing,
  searchInput,
  setSearchInput,
}) => {
  const [currentTimer, setCurrentTimer] = useState(moment());
  const [selectedIds, setSelectedIds] = useState<SelectedIdsType>({});
  const [selectAll, setSelectAll] = useState(0);
  const [isMasterNameFocus, setIsMasterNameFocus] = useState(false);
  const [isTakeProfitFocus, setIsTakeProfitFocus] = useState(false);
  const [isStopLossFocus, setIsStopLossFocus] = useState(false);
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
  const [botSettingData, setBotSettingData] = useState<BotSetting>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [allBotSettingResults, setAllBotSettingResults] = useState<
    BotSettingResult[]
  >([]);
  const userData = useAppSelector((state) => state.user.user);
  const [isDeletingByList, setIsDeletingByList] = useState(false);

  // MODAL
  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isValidAmountPopupOpen, setIsValidAmountPopupOpen] = useState(false);

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
      icon: '',
      headingMessage: '',
      message: '',
      buttonMessage: '',
      handleOpen: () => {},
      handleClose: () => {},
    });
  const [isAmountPerOrderAmountFocus, setIsAmountPerOrderAmountFocus] =
    useState(false);
  const [isMultiplyAmountFocus, setIsMultiplyAmountFocus] = useState(false);

  // FORMIK RELATED STATES
  const [formikValues, setFormikValues] = useState<FormikValueType>(
    INITIAL_FORMIK_VALUES
  );
  const [selectedBotSettingResult, setSelectedBotSettingResult] =
    useState<BotSettingResult>(INITIAL_BOT_SETTING_RESULT);
  const [isEditing, setIsEditing] = useState(false);

  // INITIAL PARTNER BOT USEFFECT
  const [isPartnerBotInitialized, setIsPartnerBotInitialized] = useState(false);
  const animationUpsertModalMobile = useSpring({
    to: {
      opacity: isUpsertModalOpen ? 1 : 0,
      transform: isUpsertModalOpen ? 'translateX(0%)' : 'translateX(-100%)',
    },
  });

  // RESPONSIVE
  const isLargeDesktop = useMediaQuery({
    query: '(min-width: 1368px)',
  });
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
  const navigate = useNavigate();
  const scrollElement = useRef<HTMLDivElement>(null);

  const data = React.useMemo<BotSettingResult[]>(
    () => allBotSettingResults,
    [allBotSettingResults]
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
    console.log('1')
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
  };

  const handleCloseUpsertModal = () => {
    setIsUpsertModalOpen(false);
    formikUpsert.resetForm();
    setIsMasterAccountValid(false);
    setFormikValues(INITIAL_FORMIK_VALUES);
    setSelectedAccountType(INITIAL_SELECTED_ACCOUNT_TYPE);
    console.log('2')
    setSelectedBotAccount(INITIAL_SELECTED_OPTION);
    // setSelectedMasterAccount(INITIAL_SELECTED_OPTION);
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

  const handleCloseValidAmountPopupModal = () => {
    setModalAttributes((prev) => ({
      ...prev,
      isOpen: false,
    }));
    formikUpsert.setFieldValue('amountPerOrder', 1);
    formikUpsert.setFieldValue('multiply', 1);
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
    navigate('/account_trade');
  };

  // FUNCTIONS FOR INPUT AMOUNT
  const handleAmount = (
    value: string | undefined,
    fieldName: string,
    values: CurrencyInputOnChangeValues | undefined
  ): void => {
    // const valueToSet = value === undefined || +value <= 0 ? 0 : value || ' ';
    const valueToSet = value === undefined ? '' : value;
    const convertedValue = convertToThreeDecimalPlaces(valueToSet);
    formikUpsert.setFieldValue(fieldName, convertedValue);
  };

  const handleAmountMinusOne = (value: number, fieldName: string) => {
    if (value - 1 <= 1) return;
    const convertedValue = convertToThreeDecimalPlaces(+value - 1);
    formikUpsert.setFieldValue(fieldName, convertedValue);
  };

  const handleOrderAmountPlusOne = (value: number, fieldName: string) => {
    const convertedValue = convertToThreeDecimalPlaces(+value + 1);
    formikUpsert.setFieldValue(fieldName, convertedValue);
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
        newSelected[x.id] = true;
      });
    }
    setSelectedIds(newSelected);
    setSelectAll((prev) => (prev === 0 ? 1 : 0));
  }, [data, selectAll]);

  // COMMON FUNCTIONS
  const getAllBotSettings = useCallback(
    (page: number) => {
      if (partnerBotDatas.length > 0) {
        // const data: ListMasterCopyTradeSetting = {
        //   master: userData.pk,
        // };
        const followerIds = partnerBotDatas.map((botData) =>
          botData.id.toString()
        );
        axios
          .get(
            `${APIs.listCopyTradeSetting}`,
            {
              params: {
                page,
                page_size: selectedPageSizeOption,
              },
            }
            // `${APIs.listCopyTradeMasterFollowedByFollowerIds}${followerIds.join(
            //   ','
            // )}`
          )
          .then((res) => {
            const data: BotSetting = res.data;
            setBotSettingData(data);
            setAllBotSettingResults(data.results);
            if (data.count != null && selectedPageSizeOption.value != null) {
              setTotalPages(
                Math.ceil(data.count / +selectedPageSizeOption.value)
              );
            }
          })
          .catch(() => {
            // const notification = {
            //   id: Math.floor(Math.random() * 101 + 1),
            //   title: 'Thất bại',
            //   description: 'Không thể lấy bot settings!',
            //   backgroundColor: 'text-red-100',
            //   icon: images.toast.error,
            // };
            // dispatch(uiActions.showNotifications(notification));
            enqueueSnackbar('Không thể lấy bot settings!', {
              variant: 'error',
            });
          });
      }
    },
    [enqueueSnackbar, partnerBotDatas, selectedPageSizeOption]
  );

  const updateSettingStatus = useCallback(
    (botSettingResult: BotSettingResult, statusToUpdate: string) => {
      let data: BotSettingUpdate = {
        status: statusToUpdate,
        // block_status: botSetting.block_status,
        // master: botSetting.master,
        // master_name: botSetting.master_name,
        // o_amount: botSetting.o_amount,
        // fold_command: botSetting.fold_command,
        // aim_min: botSetting.aim_min,
        // aim_max: botSetting.aim_max,
      };
      if (statusToUpdate === 'inactive') {
        data = {
          ...data,
          current_profit: 0,
          current_date_profit: 0,
          current_volume: 0,
          current_date_volume: 0,
        };
      }
      axios
        .patch(`${APIs.updateSettingUltimateIds}${botSettingResult.id}/`, data)
        .then((res) => {
          getAllBotSettings(page + 1);
          enqueueSnackbar(
            `${
              statusToUpdate === 'active' ? 'Bật' : 'Tắt'
            } cấu hình thành công!`,
            {
              variant: 'success',
            }
          );
        })
        .catch((err) => {
          // const notification = {
          //   id: Math.floor(Math.random() * 101 + 1),
          //   title: 'Thất bại',
          //   description: 'Không thể update bot setting status!',
          //   backgroundColor: 'text-red-100',
          //   icon: images.toast.error,
          // };
          // dispatch(uiActions.showNotifications(notification));
          enqueueSnackbar(
            `${statusToUpdate === 'active' ? 'Bật' : 'Tắt'} cấu hình thất bại!`,
            {
              variant: 'error',
            }
          );
        });
    },
    [enqueueSnackbar, getAllBotSettings, page]
  );

  const deleteSettingById = () => {
    axios
      .delete(`${APIs.deleteSettingById}${selectedBotSettingResult.id}`)
      .then((res) => {
        // const notification = {
        //   id: Math.floor(Math.random() * 101 + 1),
        //   title: 'Thành công',
        //   description: 'Xoá cấu hình thành công!',
        //   backgroundColor: 'text-green-100',
        //   icon: images.toast.check,
        // };
        // dispatch(uiActions.showNotifications(notification));
        getAllBotSettings(page + 1);
        enqueueSnackbar('Xoá cấu hình thành công!', { variant: 'success' });
      })
      .catch(() => {
        // const notification = {
        //   id: Math.floor(Math.random() * 101 + 1),
        //   title: 'Thất bại',
        //   description: 'Không thể xoá cấu hình!',
        //   backgroundColor: 'text-red-100',
        //   icon: images.toast.error,
        // };
        // dispatch(uiActions.showNotifications(notification));
        enqueueSnackbar('Không thể xoá cấu hình!', { variant: 'error' });
      });
  };

  const deleteSettingByListIds = () => {
    // ENTRY: string: boolean
    const selectedListIds = Object.entries(selectedIds)
      .filter((selected) => selected[1])
      .map((selected) => selected[0]);
    console.log('selectedListIds:', selectedListIds);
    axios
      .delete(`${APIs.deleteSettingById}${selectedListIds}`)
      .then((res) => {
        getAllBotSettings(page + 1);
        enqueueSnackbar('Xoá cấu hình thành công!', { variant: 'success' });
      })
      .catch(() => {
        enqueueSnackbar('Xoá cấu hình thất bại!', { variant: 'error' });
      });
  };

  const updateModelData = useCallback(
    (botSettingResult: BotSettingResult) => {
      // FIND SELECTED ACCOUNT TYPE
      // const accountType = {
      //   value: 'LIVE',
      //   label: 'Tài khoản LIVE',
      // };
      const accountType = ACCOUNT_TYPES.filter(
        (accountType) => accountType.value === botSettingResult.account_type
      )[0];

      // FIND SELECTED BOT MASTER ACCOUNT
      // const masterAccount = {
      //   value: botSetting.master,
      //   label: botSetting.master_name,
      // };

      // FIND SELECTED BOT ACCOUNT
      const botAccount = accountOptions.filter(
        (botAccount) => botAccount.value === botSettingResult.follower
      )[0];

      console.log(botSettingResult);
      console.log(accountType);
      console.log(accountOptions);
      console.log(botAccount);

      // UPDATE FORM MODAL
      const updatedFormikValues = {
        master: botSettingResult.master,
        username: botSettingResult.master_name,
        amountPerOrder: botSettingResult.o_amount,
        multiply: botSettingResult.fold_command,
        aimMin: botSettingResult.aim_min,
        aimMax: botSettingResult.aim_max,
        aiBotTelegramEnabled: true,
        aiBasicEnabled: true,
        copyTradeEnabled: true,
        status: botSettingResult.status,
        block_status: botSettingResult.block_status,
      };

      setSelectedAccountType(accountType);
      console.log('3')
      // setSelectedMasterAccount(masterAccount);
      setSelectedBotAccount(botAccount);
      setFormikValues(updatedFormikValues);
    },
    [accountOptions]
  );

  const resetAllCurrent = useCallback(() => {
    const data: BotSettingUpdate = {
      current_profit: 0,
      current_date_profit: 0,
      current_volume: 0,
      current_date_volume: 0,
    };
    const selectedListIds = Object.entries(selectedIds)
      .filter((selected) => selected[1])
      .map((selected) => selected[0]);
    console.log('selectedListIds:', selectedListIds);
    axios
      .patch(`${APIs.updateSettingUltimateIds}${selectedListIds}/`, data)
      .then((res) => {
        getAllBotSettings(page + 1);
        enqueueSnackbar(`Nạp lại cấu hình thành công!`, {
          variant: 'success',
        });
      })
      .catch((err) => {
        enqueueSnackbar(`Nạp lại cấu hình thất bại!`, {
          variant: 'error',
        });
      });
  }, [enqueueSnackbar, getAllBotSettings, page, selectedIds]);

  // PAGINATION FUNCTION
  const handleSelectPageSize = (
    option: SingleValue<InputSelectOption>,
    actionMeta: ActionMeta<InputSelectOption>
  ) => {
    if (option != null) {
      setSelectedPageSizeOption(option);
      setPage(0);
      getAllBotSettings(1);
    }
  };

  const handlePageChange = useCallback(
    ({ selected }: { selected: number }) => {
      console.log(selected);
      const page = selected + 1;
      setPage(selected);
      getAllBotSettings(page);
    },
    [getAllBotSettings]
  );

  // TABLE
  const columns = React.useMemo<Column<BotSettingResult>[]>(
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
        sortable: false,
        width: 45,
      },
      {
        Header: () => {
          return <div className="text-left">Tên chuyên gia</div>;
        },
        accessor: 'master',
        Cell: (props) => {
          const original = props.cell.row.original;
          const isBlocked = original.block_status === 'blocked';
          return (
            <div className="flex items-center gap-x-1">
              <p className="text-sm text-ink-100">{original.master_name}</p>
              {isBlocked && (
                <p className="text-xs text-purple-800">(Đã bị chặn)</p>
              )}
            </div>
          );
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
        accessor: 'follower_name',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex items-center gap-x-1">
              <p className="text-sm text-ink-100">{original.follower_name}</p>
            </div>
          );
        },
      },
      {
        Header: () => <div className="text-end">Volume Lệnh</div>,
        accessor: 'o_amount',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="text-end">
              <span className="rounded-3xl text-teal-100 text-sm font-semibold">
                ${original.current_volume?.toLocaleString('en-US', options)}
              </span>
            </div>
          );
        },
      },
      {
        Header: () => <div className="text-end">LN ngày/LN tổng</div>,
        accessor: 'profitAndTotalProfit',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="text-end text-sm font-semibold">
              <span
                className={`${
                  original.current_date_profit > 0
                    ? 'text-green-100'
                    : original.current_date_profit === 0
                    ? 'bg-primary-100 bg-clip-text text-transparent'
                    : 'text-red-100'
                }`}
              >
                {original.current_date_profit >= 0 ? '$' : '-$'}
                {Math.abs(original.current_date_profit).toLocaleString(
                  'en-US',
                  options
                )}
              </span>
              /
              <span
                className={`${
                  original.current_profit > 0
                    ? 'text-green-100'
                    : original.current_profit === 0
                    ? 'bg-primary-100 bg-clip-text text-transparent'
                    : 'text-red-100'
                }`}
              >
                {original.current_profit >= 0 ? '$' : '-$'}
                {Math.abs(original.current_profit).toLocaleString(
                  'en-US',
                  options
                )}
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
        Header: () => <div className="text-left">Cập nhật gần nhất</div>,
        accessor: 'updated_at',
        Cell: (props) => {
          const original = props.cell.row.original;
          // 2023-01-26T10:15:54.834029Z
          return (
            <div className="flex items-center gap-x-1">
              {/* <p>{original.lastUpdated}</p> */}
              <p>{moment(original.updated_at).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          );
        },
      },
      {
        Header: () => <div className="text-center">Trạng thái</div>,
        accessor: 'status',
        Cell: (props) => {
          const original = props.cell.row.original;
          const status = original.status;
          const handleClick = () => {
            console.log(status);
            if (status === 'active') {
              updateSettingStatus(original, 'inactive');
            } else {
              updateSettingStatus(original, 'active');
            }
          };
          const isCopyTradeEnabled = status === 'active';
          // const [checkButton, setcheckButton] = useState(
          //   original.status === 'active'
          // );
          // const handleClick = () => {
          //   setcheckButton((prev) => !prev);
          // };
          return (
            <div className="flex items-center justify-center gap-x-1">
              <ReactSwitch
                onChange={handleClick}
                checkedIcon={
                  <div className="h-full flex justify-center items-center text-xs bg-background-100 bg-clip-text text-transparent font-medium">
                    Bật
                  </div>
                }
                uncheckedIcon={
                  <div className="h-full flex justify-center items-center text-xs text-ink-40">
                    Tắt
                  </div>
                }
                checked={isCopyTradeEnabled}
                className="react-switch"
              />
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
                    className:
                      '!w-[1rem] !translate-x-[9.6875rem] !before:bg-dropdown',
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
                      handleTooltipClose(original.id);
                      e.stopPropagation();
                    }}
                  >
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={(e) => {
                        console.log(original);
                        handleOpenUpsertModal();
                        setIsEditing(true);
                        updateModelData(original);
                        setSelectedBotSettingResult(original);
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={images.table.edit}
                        alt="BotLambotrade"
                      />
                      <p className="text-ink-100 text-base">Chỉnh sửa</p>
                    </div>
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={() => {
                        handleOpenPopupModal();
                        setIsDeletingByList(false);
                        setSelectedBotSettingResult(original);
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
                placement={`${isDesktop ? 'bottom-end' : 'bottom'}`}
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
    [
      handleTooltipOpen,
      isDesktop,
      isTooltipOpen,
      selectAll,
      selectedIds,
      toggleAllRow,
      toggleRow,
      updateModelData,
      updateSettingStatus,
    ]
  );

  const tableInstance = useTable({ columns, data }, usePagination);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  // FORMIK
  const formikUpsert = useFormik({
    initialValues: formikValues,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: Yup.object({
      // accountType: Yup.string().required('Vui lòng nhập loại tài khoản'),
      // email: Yup.string().required('Vui lòng nhập loại tài khoản'),
      // balance: Yup.number().min(0).typeError('Số dư không thể âm'),
      username: Yup.string().required('Vui lòng nhập tên chuyên gia'),
      // amountPerOrder: Yup.number()
      //   .min(0, 'Giá trị 1 lệnh không nhỏ hơn 1')
      //   .typeError('Giá trị 1 lệnh không nhỏ hơn 1')
      //   .required("Cần nhập giá trị 1 lệnh"),
      // multiply: Yup.number()
      //   .min(1, 'Hệ số gấp lệnh không thể nhỏ hơn 1')
      //   .max(100, 'Hệ số gấp lệnh không thể lớn hơn 100')
      //   .required("Cần nhập hệ số gấp lệnh"),
      aimMin: Yup.number().min(0).typeError('Giá trị cắt lỗ không thể âm'),
      aimMax: Yup.number().min(0).typeError('Giá trị chốt lãi không thể âm'),
    }),
    onSubmit: async (values, helpers) => {
      console.log(values);
      if (isMasterAccountValid) {
        if (isEditing) {
          // UPDATE
          // copyTradeEnabled = status
          console.log(selectedBotSettingResult);
          const masterId = allBotDatas.filter(
            (botData) => botData.username === values.username
          )[0].id;
          console.log('allBotDatas:', allBotDatas);
          console.log('masterId', masterId);
          const updateCopyTradeData: BotSettingUpdate = {
            account_type: selectedAccountType.value,
            master: masterId,
            master_name: values.username,
            o_amount: values.amountPerOrder,
            fold_command: values.multiply,
            status: values.status,
            block_status: selectedBotSettingResult.block_status,
            current_profit: selectedBotSettingResult.current_profit,
            aim_min: values.aimMin,
            aim_max: values.aimMax,
          };
          console.log(updateCopyTradeData);
          axios
            .patch(
              `${APIs.updateSettingByIds}${selectedBotSettingResult.id}/`,
              updateCopyTradeData
            )
            .then(() => {
              getAllBotSettings(page + 1);
              enqueueSnackbar('Cập nhập cấu hình thành công!', {
                variant: 'success',
              });
              handleCloseUpsertModal();
            })
            .catch((err) => {
              enqueueSnackbar(
                `${
                  err.data
                    ? JSON.stringify(err.data)
                    : 'Cập nhập cấu hình thất bại!'
                }`,
                { variant: 'error' }
              );
            });
        } else {
          // INSERT
          // copyTradeEnabled = status
          const masterId = allBotDatas.filter(
            (botData) => botData.username === values.username
          )[0].id;
          console.log('allBotDatas:', allBotDatas);
          console.log('masterId', masterId);
          const createCopyTradeData: BotCopyTrade = {
            account_type: selectedAccountType.value,
            master: masterId,
            // master_name: values.masterName,
            follower: +selectedBotAccount.value,
            // follower_name: selectedBotAccount.label.toString(),
            o_amount: values.amountPerOrder,
            fold_command: values.multiply,
            ai_bot_telegram_enabled: values.aiBotTelegramEnabled,
            ai_basic_enabled: values.aiBasicEnabled,
            copy_trade_enabled: values.copyTradeEnabled,
            status: values.status,
            aim_min: values.aimMin,
            aim_max: values.aimMax,
          };
          console.log('createCopyTradeData:', createCopyTradeData);
          axios
            .post(APIs.createCopyTradeSetting, createCopyTradeData)
            .then(() => {
              // const notification = {
              //   id: Math.floor(Math.random() * 101 + 1),
              //   title: 'Thành công',
              //   description: 'Tạo cấu hình thành công!',
              //   backgroundColor: 'text-green-100',
              //   icon: images.toast.check,
              // };
              // dispatch(uiActions.showNotifications(notification));
              getAllBotSettings(page + 1);
              enqueueSnackbar('Tạo cấu hình thành công!', {
                variant: 'success',
              });
              handleCloseUpsertModal();
            })
            .catch((err) => {
              // const notification = {
              //   id: Math.floor(Math.random() * 101 + 1),
              //   title: 'Thất bại',
              //   description: `${
              //     err.data ? JSON.stringify(err.data) : 'Tạo cấu hình thất bại!'
              //   }`,
              //   backgroundColor: 'text-red-100',
              //   icon: images.toast.error,
              // };
              // dispatch(uiActions.showNotifications(notification));
              enqueueSnackbar(
                `${
                  err.data ? JSON.stringify(err.data) : 'Tạo cấu hình thất bại!'
                }`,
                { variant: 'error' }
              );
            });
        }
      } else {
        scrollElement.current?.scrollIntoView();
      }
    },
  });

  console.log(selectedBotAccount, 'selectedBotAccount')

  // BOT SELECT
  const getAllAccounts = useCallback(() => {
    axios
      .get(APIs.allAccounts)
      .then((res) => {
        const data = res.data;
        setAllBotDatas(data);
      })
      .catch(() => {
        // const notification = {
        //   id: Math.floor(Math.random() * 101 + 1),
        //   title: 'Thất bại',
        //   description: 'Không thể lấy tài khoản master',
        //   backgroundColor: 'text-red-100',
        //   icon: images.toast.error,
        // };
        // dispatch(uiActions.showNotifications(notification));
        enqueueSnackbar('Không thể lấy tài khoản master', { variant: 'error' });
      });
  }, [enqueueSnackbar]);

  const getAllPartnerBots = useCallback(() => {
    axios
      .get(APIs.partnerAccount)
      .then((res) => {
        const datas: BotData[] = res.data;
        const partnerBotDatas = datas.filter(
          (data) => data.status === 'active'
        );
        setPartnerBotDatas(partnerBotDatas);
      })
      .catch((err) => {
        // const notification = {
        //   id: Math.floor(Math.random() * 101 + 1),
        //   title: 'Thất bại',
        //   description: 'Không thể lấy bot datas',
        //   backgroundColor: 'text-red-100',
        //   icon: images.toast.error,
        // };
        // dispatch(uiActions.showNotifications(notification));
        enqueueSnackbar('Không thể lấy bot datas', { variant: 'error' });
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
          // const notification = {
          //   id: Math.floor(Math.random() * 101 + 1),
          //   title: 'Thất bại',
          //   description: 'Không thể lấy được số dư ví',
          //   backgroundColor: 'text-red-100',
          //   icon: images.toast.error,
          // };
          // dispatch(uiActions.showNotifications(notification));
          enqueueSnackbar('Không thể lấy được số dư ví', { variant: 'error' });
        });
    },
    [enqueueSnackbar]
  );

  const reloadDemoBalance = useCallback(
    (id: number | string) => {
      axios
        .get(`${APIs.reloadDemoBalance}${id}/`)
        .then((res) => {
          enqueueSnackbar('Đặt lại số dư ví DEMO thành công!', {
            variant: 'success',
          });
          getBalance(selectedBotAccount.value);
        })
        .catch(() => {
          enqueueSnackbar('Đặt lại số dư ví DEMO thất bại!', {
            variant: 'error',
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
    console.log('HERE');
    if (partnerBotDatas && partnerBotDatas.length > 0) {
      if (selectedAccountType.value === 'LIVE' && !isPartnerBotInitialized) {
        getBalance(partnerBotDatas[0].id);
        const firstBotOption = {
          value: partnerBotDatas[0].id,
          label: partnerBotDatas[0].botname,
        };
        console.log('4')
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

  useEffect(() => {
    getAllBotSettings(page + 1);
  }, [getAllBotSettings, page]);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (formikUpsert.values.username !== '') {
        axios
          .get(`${APIs.partnerSearch}${formikUpsert.values.username}/`)
          .then((response) => {
            console.log(response.data, 'eeeee');
            if (response.data && response.data?.length > 0) {
              setIsMasterAccountValid(true);
              formikUpsert.setFieldValue('master', response.data.id);
              // formikUpsert.setFieldValue('masterName', response.data.id);
            } else {
              setIsMasterAccountValid(false);
            }
          })
          .catch((err) => {
            setIsMasterAccountValid(false);
          });
      }
    }, 500);

    return () => clearTimeout(getData);
  }, [formikUpsert.values.username]);

  // USE EFFECT SHOW/HIDE VALIDATING AMOUNT PER ORDER MODAL
  useEffect(() => {
    if (
      +formikUpsert.values.amountPerOrder <= 0 &&
      !isAmountPerOrderAmountFocus
    ) {
      setModalAttributes((prev) => ({
        ...prev,
        isOpen: true,
        icon: images.copy.warning,
        headingMessage: 'Giá trị lệnh không hợp lệ',
        message: (
          <>
            Giá trị lệnh phải lớn hơn <span className="font-bold">0</span>
          </>
        ),
        buttonMessage: 'Xác nhận',
        handleOpen: handleOpenValidAmountPopupModal,
        handleClose: handleCloseValidAmountPopupModal,
      }));
    }
  }, [isAmountPerOrderAmountFocus]);

  // USE EFFECT SHOW/HIDE VALIDATING MULTIPLY AMOUNT MODAL
  useEffect(() => {
    if (!isMultiplyAmountFocus) {
      if (+formikUpsert.values.multiply < 1) {
        setModalAttributes((prev) => ({
          ...prev,
          isOpen: true,
          icon: images.copy.warning,
          headingMessage: 'Hệ số lệnh không hợp lệ',
          message: (
            <>
              Hệ số lệnh tối thiểu là <span className="font-bold">X1</span>
            </>
          ),
          buttonMessage: 'Xác nhận',
          handleOpen: handleOpenValidAmountPopupModal,
          handleClose: handleCloseValidAmountPopupModal,
        }));
      } else if (+formikUpsert.values.multiply > 100) {
        setModalAttributes((prev) => ({
          ...prev,
          isOpen: true,
          icon: images.copy.warning,
          headingMessage: 'Hệ số lệnh không hợp lệ',
          message: (
            <>
              Hệ số lệnh tối đa là <span className="font-bold">X100</span>
            </>
          ),
          buttonMessage: 'Xác nhận',
          handleOpen: handleOpenValidAmountPopupModal,
          handleClose: handleCloseValidAmountPopupModal,
        }));
      }
    }
  }, [isMultiplyAmountFocus]);

  // USE EFFECT SHOW/HIDE VALIDATING MULTIPLY AMOUNT MODAL

  return (
    <>
      <div className="h-fit mb-6 bg-background-80 rounded-3xl">
        <div className="p-6 border-b border-ink-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-xl text-ink-100 font-semibold">
            Danh sách cấu hình {isMobile && <br />} Copy Trade đã tạo
          </h1>
          <button
            className="px-3 py-[0.625rem] w-full md:w-auto rounded-xl flex justify-center items-center gap-[0.625rem] bg-primary-100"
            onClick={() => {
              if (partnerBotDatas.length === 0) {
                setModalAttributes((prev) => ({
                  ...prev,
                  isOpen: true,
                  icon: images.copy.account_not_integrate,
                  headingMessage: 'Bạn chưa liên kết tài khoản',
                  message: (
                    <>
                      Liên kết tài khoản ngay để thực hiện giao dịch cùng đội
                      ngũ chuyên gia của AI BotTrade
                    </>
                  ),
                  buttonMessage: 'Liên kết tài khoản',
                  handleOpen: handleOpenAccountTradePopupModal,
                  handleClose: handleCloseAccountTradePopupModal,
                }));
                return;
              }else{
                const firstBotOption = {
                  value: partnerBotDatas[0].id,
                  label: partnerBotDatas[0].botname,
                };
                if(!selectedBotAccount.value){
                  setSelectedBotAccount(firstBotOption)
                }
              }
              handleOpenUpsertModal();
              setIsEditing(false);
            }}
          >
            <img src={images.copy.plus} alt="BotLambotrade" />
            <p className="bg-background-100 bg-clip-text text-transparent font-semibold">
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
            <p className="text-ink-60">Danh sách cấu hình Copy Trade trống</p>
          </div>
        )}
        {allBotSettingResults.length > 0 && (
          <div className="p-6 flex flex-col gap-y-6">
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

            {Object.values(selectedIds).filter((value) => value === true)
              .length > 0 && (
              <div className="px-4 py-3 bg-ink-05 rounded-xl flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <p className="text-ink-100 font-semibold">
                  {`Đã chọn ${
                    Object.values(selectedIds).filter((value) => value === true)
                      .length
                  }`}
                </p>
                <div className="grid grid-cols-2 md:flex items-center justify-center gap-4">
                  {/* <button
                    className="px-8 py-3 bg-primary-100 rounded-xl"
                    onClick={() => {
                      setIsDeletingByList(true);
                      // deleteSettingByListIds();
                      handleOpenPopupModal();
                    }}
                  >
                    <p className="bg-background-100 bg-clip-text text-transparent font-semibold">
                      Xoá
                    </p>
                  </button> */}
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

            <div>
              <div
                className={`border border-ink-05 rounded-2xl w-full ${
                  !isLargeDesktop ? 'overflow-x-scroll border-collapse' : ''
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
      {isMobile && (
        <CustomModal
          isOpen={isUpsertModalOpen}
          handleOpen={handleOpenUpsertModal}
          handleClose={handleCloseUpsertModal}
        >
          <animated.div style={animationUpsertModalMobile}>
            <form onSubmit={formikUpsert.handleSubmit}>
              <div className="absolute flex flex-col md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] bg-background-80 h-[100svh] w-full md:w-[45rem] md:h-auto md:rounded-3xl overflow-y-auto">
                {/* HEADING */}
                <div className="p-6 border-b border-ink-10 flex justify-between items-center">
                  <h1 className="text-xl text-ink-100 font-semibold">
                    {!isEditing
                      ? 'Thêm cấu hình Copy Trade'
                      : 'Chỉnh sửa cấu hình Copy Trade'}
                  </h1>
                  <CloseOutlined
                    className="cursor-pointer"
                    onClick={handleCloseUpsertModal}
                  />
                </div>
                {/* FORM */}
                <div className="md:max-h-[calc(100vh-19rem)] overflow-y-auto">
                  <div
                    className="bg-background-80 rounded-3xl p-6 flex flex-col"
                    ref={scrollElement}
                  >
                    <div className="p-4 mb-6 bg-ink-05 rounded-2xl">
                      <CopyTradeZoomSelectInput
                        containerClassName="mb-4"
                        inputValue={selectedAccountType}
                        onSelectChange={onSelectedAccountTypeChange}
                        options={ACCOUNT_TYPES}
                        isSearchEnabled={false}
                        labelName="Loại tài khoản"
                      />
                      {partnerBotDatas.length > 0 &&
                        selectedAccountType.value === 'LIVE' && (
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
                          <div className="px-3 flex items-center gap-x-2">
                            <p className="text-sm text-ink-100">Số dư ví:</p>
                            {selectedAccountType.value === 'DEMO' && (
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
                          <p className="bg-primary-100 bg-clip-text text-transparent text-xl">
                            $
                            {selectedAccountType.value === 'DEMO'
                              ? botBalance.demo_balance.toLocaleString(
                                  'en-US',
                                  options
                                )
                              : selectedAccountType.value === 'LIVE'
                              ? botBalance.balance.toLocaleString(
                                  'en-US',
                                  options
                                )
                              : 0}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* <CopyTradeZoomSelectInput
                  containerClassName="mb-4"
                  inputValue={selectedMasterAccount}
                  onSelectChange={onSelectedMasterChange}
                  options={allBotAccountOptions}
                  isSearchEnabled={false}
                  labelName="Tên chuyên gia"
                /> */}

                    <TextInput
                      fullWidth={true}
                      name="username"
                      id="username"
                      label="Tên chuyên gia"
                      type="text"
                      value={formikUpsert.values.username}
                      onChange={formikUpsert.handleChange}
                      resetValue={() => {
                        formikUpsert.setFieldValue('username', '');
                      }}
                      onBlur={formikUpsert.handleBlur}
                      placeholder="Tên chuyên gia"
                      error={
                        (!isMasterAccountValid &&
                          Boolean(formikUpsert.values.username)) ||
                        (formikUpsert.touched.username &&
                          Boolean(formikUpsert.errors.username))
                      }
                      helperText={
                        !isMasterAccountValid &&
                        Boolean(formikUpsert.values.username)
                          ? 'Tên chuyên gia không đúng, vui lòng nhập lại'
                          : formikUpsert.touched.username &&
                            formikUpsert.errors.username
                      }
                      containerClassName="mb-6"
                      icon={
                        isMasterAccountValid &&
                        Boolean(formikUpsert.values.username) &&
                        images.input.correct
                      }
                    />

                    {/* GIÁ TRỊ 1 LỆNH 
                    <div className="mb-6">
                      <p className="mb-4 text-sm text-ink-100">
                        GIÁ TRỊ 1 LỆNH
                      </p>
                      <div className="flex justify-between gap-x-3 mb-4">
                        <div
                          onClick={() => {
                            handleAmountMinusOne(
                              formikUpsert.values.amountPerOrder,
                              'amountPerOrder'
                            );
                          }}
                          className="p-4 bg-ink-05 border border-ink-20 hover:bg-ink-20 hover:border-ink-10 rounded-xl text-ink-60 cursor-pointer"
                        >
                          <img
                            className="w-[1.5rem]"
                            src={images.copy.minus}
                            alt="BotLambotrade"
                          />
                        </div>
                        <CurrencyInput
                          className="flex-grow text-center bg-ink-05 border border-ink-10 text-ink-100 font-semibold rounded-xl"
                          value={formikUpsert.values.amountPerOrder}
                          onValueChange={(value, _, values) => {
                            handleAmount(value, 'amountPerOrder', values);
                          }}
                          onFocus={() => {
                            setIsAmountPerOrderAmountFocus(true);
                          }}
                          onBlur={(e) => {
                            if(Number((e.target.value.replace('$', '').trim() || 0)) <= 0)
                             setIsAmountPerOrderAmountFocus(false);
                          }}
                          placeholder="Mời nhập số tiền"
                          prefix={'$ '}
                          step={1}
                          allowNegativeValue={false}
                          decimalsLimit={3}
                        />
                        <div
                          onClick={() => {
                            handleOrderAmountPlusOne(
                              formikUpsert.values.amountPerOrder,
                              'amountPerOrder'
                            );
                          }}
                          className="p-4 bg-ink-05 border border-ink-20 hover:bg-ink-20 hover:border-ink-10 rounded-xl cursor-pointer"
                        >
                          <img
                            className="w-[1.5rem]"
                            src={images.copy.plus_gold}
                            alt="BotLambotrade"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-6 gap-x-2">
                        {PLUS_VALUES.map((value, index) => {
                          let renderText = '+' + value;
                          if (value === 'All') renderText = 'All';
                          return (
                            <div
                              key={index * Math.random() * 100}
                              className="flex-grow xl:px-3 xl:py-3 px-2 py-2 text-center bg-ink-05 hover:bg-ink-20 text-ink-100 rounded-xl cursor-pointer"
                              onClick={() => {
                                // CHECK IF PARTNER BOT ALREADY ASSOCIATED
                                const balance =
                                  selectedAccountType.value === 'DEMO'
                                    ? botBalance.demo_balance
                                    : botBalance.balance;
                                if (typeof value === 'number') {
                                  const plusAmount =
                                    formikUpsert.values.amountPerOrder + value;
                                  if (plusAmount <= balance) {
                                    formikUpsert.setFieldValue(
                                      'amountPerOrder',
                                      plusAmount
                                    );
                                  }
                                } else {
                                  // ALL
                                  formikUpsert.setFieldValue(
                                    'amountPerOrder',
                                    balance
                                  );
                                }
                              }}
                            >
                              {renderText}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    */}
                    {/* HỆ SỐ GẤP LỆNH */}
                    <div className="mb-6">
                      <p className="mb-4 text-sm text-ink-100">
                        HỆ SỐ GẤP LỆNH
                      </p>
                      <div className="flex justify-between gap-x-3 mb-4">
                        <div
                          onClick={() => {
                            handleAmountMinusOne(
                              formikUpsert.values.multiply,
                              'multiply'
                            );
                          }}
                          className="p-4 bg-ink-05 border border-ink-20 hover:bg-ink-20 hover:border-ink-10 rounded-xl text-ink-60 cursor-pointer"
                        >
                          <img
                            className="w-[1.5rem]"
                            src={images.copy.minus}
                            alt="BotLambotrade"
                          />
                        </div>
                        <CurrencyInput
                          className="flex-grow text-center bg-ink-05 border border-ink-10 text-ink-100 font-semibold rounded-xl"
                          value={formikUpsert.values.multiply}
                          onValueChange={(value, _, values) => {
                            console.log(_);
                            handleAmount(value, 'multiply', values);
                          }}
                          onFocus={() => {
                            setIsMultiplyAmountFocus(true);
                          }}
                          onBlur={() => {
                            setIsMultiplyAmountFocus(false);
                          }}
                          placeholder="Mời nhập số tiền"
                          prefix={'X '}
                          step={1}
                          allowNegativeValue={false}
                          decimalsLimit={3}
                        />
                        <div
                          onClick={() => {
                            handleOrderAmountPlusOne(
                              formikUpsert.values.multiply,
                              'multiply'
                            );
                          }}
                          className="p-4 bg-ink-05 border border-ink-20 hover:bg-ink-20 hover:border-ink-10 rounded-xl cursor-pointer"
                        >
                          <img
                            className="w-[1.5rem]"
                            src={images.copy.plus_gold}
                            alt="BotLambotrade"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-6 gap-x-2">
                        {MULTIPLY_VALUES.map((value, index) => {
                          let renderText = 'X' + value;
                          return (
                            <div
                              key={index * Math.random() * 100}
                              className="flex-grow xl:px-3 xl:py-3 px-2 py-2 text-center bg-ink-05 hover:bg-ink-20 text-ink-100 rounded-xl cursor-pointer"
                              onClick={() => {
                                formikUpsert.setFieldValue('multiply', value);
                              }}
                            >
                              {renderText}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* AIM */}
                    
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <CustomNumberInput
                        formik={formikUpsert}
                        isInputFocus={isTakeProfitFocus}
                        setIsInputFocus={setIsTakeProfitFocus}
                        inputValue={formikUpsert.values.aimMax}
                        inputError={formikUpsert.errors.aimMax}
                        name="aimMax"
                        id="aimMax"
                        label="Mục tiêu chốt lãi"
                        inputColor="text-green-100"
                        symbol="$"
                      />
                      <CustomNumberInput
                        formik={formikUpsert}
                        isInputFocus={isStopLossFocus}
                        setIsInputFocus={setIsStopLossFocus}
                        inputValue={formikUpsert.values.aimMin}
                        inputError={formikUpsert.errors.aimMin}
                        name="aimMin"
                        id="aimMin"
                        label="Mục tiêu cắt lỗ"
                        inputColor="text-red-100"
                        symbol="$"
                      />
                    </div>

                    {/* STATUS */}
                 
                    <div className="flex flex-col gap-y-4">
                      {/*}
                      <div className="flex justify-between">
                        <p>Trạng thái Copy AI Bot Telegram</p>
                        <CustomSwitch
                          checked={formikUpsert.values.aiBotTelegramEnabled}
                          onChange={(e) => {
                            formikUpsert.setFieldValue(
                              'aiBotTelegramChecked',
                              !formikUpsert.values.aiBotTelegramEnabled
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <p>Trạng thái Copy AI Basic</p>
                        <CustomSwitch
                          checked={formikUpsert.values.aiBasicEnabled}
                          onChange={(e) => {
                            formikUpsert.setFieldValue(
                              'aiBasicChecked',
                              !formikUpsert.values.aiBasicEnabled
                            );
                          }}
                        />
                      </div>
                        */}
                      <div className="flex justify-between">
                        <p>Trạng thái Copy Trade</p>
                        <CustomSwitch
                          checked={formikUpsert.values.status === 'active'}
                          onChange={(e) => {
                            if (formikUpsert.values.status === 'active') {
                              formikUpsert.setFieldValue('status', 'inactive');
                            } else {
                              formikUpsert.setFieldValue('status', 'active');
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* BUTTON */}
                <div className="mt-auto p-6 flex justify-end items-center">
                  <GoldButton
                    type="submit"
                    buttonClassName="flex-grow md:flex-initial"
                  >
                    {!isEditing ? 'Lưu cấu hình' : 'Cập nhật cấu hình'}
                  </GoldButton>
                </div>
              </div>
            </form>
          </animated.div>
        </CustomModal>
      )}

      {/* UPSERT MODAL DESKTOP */}
      {!isMobile && (
        <CustomModal
          isOpen={isUpsertModalOpen}
          handleOpen={handleOpenUpsertModal}
          handleClose={handleCloseUpsertModal}
        >
          <form onSubmit={formikUpsert.handleSubmit}>
            <div className="absolute flex flex-col md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] bg-background-80 h-[100svh] w-full md:w-[45rem] md:h-auto md:rounded-3xl">
              {/* HEADING */}
              <div className="p-6 border-b border-ink-10 flex justify-between items-center">
                <h1 className="text-xl text-ink-100 font-semibold">
                  {!isEditing
                    ? 'Thêm cấu hình Copy Trade'
                    : 'Chỉnh sửa cấu hình Copy Trade'}
                </h1>
                <CloseOutlined
                  className="cursor-pointer"
                  onClick={handleCloseUpsertModal}
                />
              </div>
              {/* FORM */}
              <div className="md:max-h-[calc(100vh-19rem)] overflow-y-auto">
                <div
                  className="bg-background-80 rounded-3xl p-6 flex flex-col"
                  ref={scrollElement}
                >
                  <div className="p-4 mb-6 bg-ink-05 rounded-2xl">
                    <CopyTradeZoomSelectInput
                      containerClassName="mb-4"
                      inputValue={selectedAccountType}
                      onSelectChange={onSelectedAccountTypeChange}
                      options={ACCOUNT_TYPES}
                      isSearchEnabled={false}
                      labelName="Loại tài khoản"
                    />
                    {partnerBotDatas.length > 0 &&
                      selectedAccountType.value === 'LIVE' && (
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
                        <div className="px-3 flex items-center gap-x-2">
                          <p className="text-sm text-ink-100">Số dư ví:</p>
                          {selectedAccountType.value === 'DEMO' && (
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
                        <p className="bg-primary-100 bg-clip-text text-transparent text-xl">
                          $
                          {selectedAccountType.value === 'DEMO'
                            ? botBalance.demo_balance.toLocaleString(
                                'en-US',
                                options
                              )
                            : selectedAccountType.value === 'LIVE'
                            ? botBalance.balance.toLocaleString(
                                'en-US',
                                options
                              )
                            : 0}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* <CopyTradeZoomSelectInput
                  containerClassName="mb-4"
                  inputValue={selectedMasterAccount}
                  onSelectChange={onSelectedMasterChange}
                  options={allBotAccountOptions}
                  isSearchEnabled={false}
                  labelName="Tên chuyên gia"
                /> */}

                  <TextInput
                    fullWidth={true}
                    name="username"
                    id="username"
                    label="Tên chuyên gia"
                    type="text"
                    value={formikUpsert.values.username}
                    onChange={formikUpsert.handleChange}
                    resetValue={() => {
                      formikUpsert.setFieldValue('username', '');
                    }}
                    onBlur={formikUpsert.handleBlur}
                    placeholder="Tên chuyên gia"
                    error={
                      (!isMasterAccountValid &&
                        Boolean(formikUpsert.values.username)) ||
                      (formikUpsert.touched.username &&
                        Boolean(formikUpsert.errors.username))
                    }
                    helperText={
                      !isMasterAccountValid &&
                      Boolean(formikUpsert.values.username)
                        ? 'Tên chuyên gia không đúng, vui lòng nhập lại'
                        : formikUpsert.touched.username &&
                          formikUpsert.errors.username
                    }
                    containerClassName="mb-6"
                    icon={
                      isMasterAccountValid &&
                      Boolean(formikUpsert.values.username) &&
                      images.input.correct
                    }
                  />

                  {/* GIÁ TRỊ 1 LỆNH 
                  <div className="mb-6">
                    <p className="mb-4 text-sm text-ink-100">GIÁ TRỊ 1 LỆNH</p>
                    <div className="flex justify-between gap-x-3 mb-4">
                      <div
                        onClick={() => {
                          handleAmountMinusOne(
                            formikUpsert.values.amountPerOrder,
                            'amountPerOrder'
                          );
                        }}
                        className="p-4 bg-ink-05 border border-ink-20 hover:bg-ink-20 hover:border-ink-10 rounded-xl text-ink-60 cursor-pointer"
                      >
                        <img
                          className="w-[1.5rem]"
                          src={images.copy.minus}
                          alt="BotLambotrade"
                        />
                      </div>
                      <CurrencyInput
                        className="flex-grow text-center bg-ink-05 border border-ink-10 text-ink-100 font-semibold rounded-xl"
                        value={formikUpsert.values.amountPerOrder}
                        onValueChange={(value, _, values) => {
                          handleAmount(value, 'amountPerOrder', values);
                        }}
                        onFocus={() => {
                          setIsAmountPerOrderAmountFocus(true);
                        }}
                        onBlur={(e) => {
                          if(Number((e.target.value.replace('$', '').trim() || 0)) <= 0)
                            setIsAmountPerOrderAmountFocus(false);
                        }}
                        placeholder="Mời nhập số tiền"
                        prefix={'$ '}
                        step={1}
                        allowNegativeValue={false}
                        decimalsLimit={3}
                      />
                      <div
                        onClick={() => {
                          handleOrderAmountPlusOne(
                            formikUpsert.values.amountPerOrder,
                            'amountPerOrder'
                          );
                        }}
                        className="p-4 bg-ink-05 border border-ink-20 hover:bg-ink-20 hover:border-ink-10 rounded-xl cursor-pointer"
                      >
                        <img
                          className="w-[1.5rem]"
                          src={images.copy.plus_gold}
                          alt="BotLambotrade"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-x-2">
                      {PLUS_VALUES.map((value, index) => {
                        let renderText = '+' + value;
                        if (value === 'All') renderText = 'All';
                        return (
                          <div
                            key={index * Math.random() * 100}
                            className="flex-grow xl:px-3 xl:py-3 px-2 py-2 text-center bg-ink-05 hover:bg-ink-20 text-ink-100 rounded-xl cursor-pointer"
                            onClick={() => {
                              // CHECK IF PARTNER BOT ALREADY ASSOCIATED
                              const balance =
                                selectedAccountType.value === 'DEMO'
                                  ? botBalance.demo_balance
                                  : botBalance.balance;
                              if (typeof value === 'number') {
                                const plusAmount =
                                  formikUpsert.values.amountPerOrder + value;
                                if (plusAmount <= balance) {
                                  formikUpsert.setFieldValue(
                                    'amountPerOrder',
                                    plusAmount
                                  );
                                }
                              } else {
                                // ALL
                                formikUpsert.setFieldValue(
                                  'amountPerOrder',
                                  balance
                                );
                              }
                            }}
                          >
                            {renderText}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  */}    
                  {/* HỆ SỐ GẤP LỆNH */}
                  <div className="mb-6">
                    <p className="mb-4 text-sm text-ink-100">HỆ SỐ GẤP LỆNH</p>
                    <div className="flex justify-between gap-x-3 mb-4">
                      <div
                        onClick={() => {
                          handleAmountMinusOne(
                            formikUpsert.values.multiply,
                            'multiply'
                          );
                        }}
                        className="p-4 bg-ink-05 border border-ink-20 hover:bg-ink-20 hover:border-ink-10 rounded-xl text-ink-60 cursor-pointer"
                      >
                        <img
                          className="w-[1.5rem]"
                          src={images.copy.minus}
                          alt="BotLambotrade"
                        />
                      </div>
                      <CurrencyInput
                        className="flex-grow text-center bg-ink-05 border border-ink-10 text-ink-100 font-semibold rounded-xl"
                        value={formikUpsert.values.multiply}
                        onValueChange={(value, _, values) => {
                          console.log(_);
                          handleAmount(value, 'multiply', values);
                        }}
                        onFocus={() => {
                          setIsMultiplyAmountFocus(true);
                        }}
                        onBlur={() => {
                          setIsMultiplyAmountFocus(false);
                        }}
                        placeholder="Mời nhập số tiền"
                        prefix={'X '}
                        step={1}
                        allowNegativeValue={false}
                        decimalsLimit={3}
                      />
                      <div
                        onClick={() => {
                          handleOrderAmountPlusOne(
                            formikUpsert.values.multiply,
                            'multiply'
                          );
                        }}
                        className="p-4 bg-ink-05 border border-ink-20 hover:bg-ink-20 hover:border-ink-10 rounded-xl cursor-pointer"
                      >
                        <img
                          className="w-[1.5rem]"
                          src={images.copy.plus_gold}
                          alt="BotLambotrade"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-x-2">
                      {MULTIPLY_VALUES.map((value, index) => {
                        let renderText = 'X' + value;
                        return (
                          <div
                            key={index * Math.random() * 100}
                            className="flex-grow xl:px-3 xl:py-3 px-2 py-2 text-center bg-ink-05 hover:bg-ink-20 text-ink-100 rounded-xl cursor-pointer"
                            onClick={() => {
                              formikUpsert.setFieldValue('multiply', value);
                            }}
                          >
                            {renderText}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* AIM */}
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <CustomNumberInput
                      formik={formikUpsert}
                      isInputFocus={isTakeProfitFocus}
                      setIsInputFocus={setIsTakeProfitFocus}
                      inputValue={formikUpsert.values.aimMax}
                      inputError={formikUpsert.errors.aimMax}
                      name="aimMax"
                      id="aimMax"
                      label="Mục tiêu chốt lãi"
                      inputColor="text-green-100"
                      symbol="$"
                    />
                    <CustomNumberInput
                      formik={formikUpsert}
                      isInputFocus={isStopLossFocus}
                      setIsInputFocus={setIsStopLossFocus}
                      inputValue={formikUpsert.values.aimMin}
                      inputError={formikUpsert.errors.aimMin}
                      name="aimMin"
                      id="aimMin"
                      label="Mục tiêu cắt lỗ"
                      inputColor="text-red-100"
                      symbol="$"
                    />
                  </div>

                  {/* STATUS */}
                  <div className="flex flex-col gap-y-4">
                    {/*
                    <div className="flex justify-between">
                      <p>Trạng thái Copy AI Bot Telegram</p>
                      <CustomSwitch
                        checked={formikUpsert.values.aiBotTelegramEnabled}
                        onChange={(e) => {
                          formikUpsert.setFieldValue(
                            'aiBotTelegramChecked',
                            !formikUpsert.values.aiBotTelegramEnabled
                          );
                        }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <p>Trạng thái Copy AI Basic</p>
                      <CustomSwitch
                        checked={formikUpsert.values.aiBasicEnabled}
                        onChange={(e) => {
                          formikUpsert.setFieldValue(
                            'aiBasicChecked',
                            !formikUpsert.values.aiBasicEnabled
                          );
                        }}
                      />
                    </div>
                    */}
                    <div className="flex justify-between">
                      <p>Trạng thái Copy Trade</p>
                      <CustomSwitch
                        checked={formikUpsert.values.status === 'active'}
                        onChange={(e) => {
                          if (formikUpsert.values.status === 'active') {
                            formikUpsert.setFieldValue('status', 'inactive');
                          } else {
                            formikUpsert.setFieldValue('status', 'active');
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* BUTTON */}
              <div className="mt-auto p-6 flex justify-end items-center">
                <GoldButton
                  type="submit"
                  buttonClassName="flex-grow md:flex-initial"
                >
                  {!isEditing ? 'Lưu cấu hình' : 'Cập nhật cấu hình'}
                </GoldButton>
              </div>
            </div>
          </form>
        </CustomModal>
      )}

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
            Xoá cấu hình copy trade
          </h3>
          <p className="mb-12 mx-auto max-w-[18.75rem] text-ink-80">
            Bạn có chắc chắn muốn xoá cấu hình copy trade không?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4">
            <GreyButton onClick={handleClosePopupModal}>Huỷ</GreyButton>
            <GoldButton
              onClick={() => {
                if (isDeletingByList) {
                  deleteSettingByListIds();
                } else {
                  deleteSettingById();
                }
                handleClosePopupModal();
              }}
            >
              Xoá
            </GoldButton>
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

export default CopyTradeSettingFollow;
