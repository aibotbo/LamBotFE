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
import { uiActions } from 'stores/uiSlice';
import { faker } from '@faker-js/faker';
import CustomButton from 'components/CustomButton';
import CustomRadio from 'components/CustomRadio';
import Tile from 'components/Tile';
import Bubble from 'components/Bubble';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import BotSignalPersonal, {
  BotSignalPersonalResult,
} from 'types/BotSignalPersonal';
import BotSignalPersonalUpsert from 'types/BotSignalPersonalUpsert';
import { Button, Form, Select, Space, Tabs, TabsProps } from 'antd';
import { uniqueId } from 'lodash';

type BotTradeMethodBubbleProps = {};

interface ListMasterCopyTradeSetting {
  master?: string | number;
}

interface ListFollowerCopyTradeSetting {
  follower?: string | number;
}

interface FormikValueType {
  configName: string | undefined;
  ownerType: string | undefined;
  conditions: Conditions;
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

const PAGE_SIZE_OPTIONS: InputSelectOption[] = [
  { value: 10, label: '10/page' },
  { value: 20, label: '20/page' },
  { value: 30, label: '30/page' },
  { value: 40, label: '40/page' },
];

const METHOD_OWN_TYPES: InputSelectOption[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'own', label: 'Phương pháp của tôi' },
  { value: 'gifted', label: 'Phương pháp được tặng' },
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
  configName: '',
  ownerType: '',
  conditions: {},
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

const INITIAL_BOT_PERSONAL_SIGNAL_RESULT: BotSignalPersonalResult = {
  id: 0,
  config_name: '',
  owner_type: '',
  config_type: '',
  conditions: {},
  fconditions: []
};

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: 'decimal',
};

// const generateFakeData = (): BotPersonalSignalResult[] => {
//   return Array(5)
//     .fill(0)
//     .map((_, index) => ({
//       id: faker.datatype.uuid(),
//       type: index % 2 === 0 ? 'self' : 'gifted',
//       number_of_conditions: Math.floor(1 + Math.random() * 5),
//     }));
// };

const generateArrayOfAndFrom = (length: number, from: number) =>
  Array.from({ length }, (_, idx) => idx + from);

const generateBaseBubbleOption = () => ({
  '1': Array(20).fill(0),
  '2': Array(20).fill(0),
  '3': Array(20).fill(0),
  '4': Array(20).fill(0),
  '5': Array(20).fill(0),
  order_type: 'BUY',
});

const FAKE_SELECTED_BUBBLE_METHOD: FormikValueType = {
  configName: 'test',
  ownerType: '',
  conditions: {
    '1': {
      '1': [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      '2': [0, -1, -1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      '3': [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      '4': [0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      '5': [0, 0, 2, -1, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      order_type: 'SELL',
    },
    '3': {
      '1': [1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      '2': [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      '3': [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      '4': [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      '5': [-1, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      order_type: 'BUY',
    },
  },
};

interface TypeConditionChid {
  board: number //Bảng
  bubble: number //Bóng
  result_type: number // 1/2
  id: string
}

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
interface TypeConditionsForm {
  betType: number
  bubble: number
  conditions: TypeConditionChid[]
  fconditions: BubbleOptions
  id: string
}

const BotTradeMethodBubble: FC<BotTradeMethodBubbleProps> = () => {
  const [selectedIds, setSelectedIds] = useState<SelectedIdsType>({});
  const [selectAll, setSelectAll] = useState(0);

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
  const [accountOptions, setAccountOptions] = useState<InputSelectOption[]>([]);
  const [allBotAccountOptions, setAllBotAccountOptions] = useState<
    InputSelectOption[]
  >([]);

  // SETTINGS
  const [botPersonalSignalData, setBotPersonalSignalData] =
    useState<BotSignalPersonal>({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
  const [allBotPersonalSignalResults, setAllBotPersonalSignalResults] =
    useState<BotSignalPersonalResult[]>([]);
  const userData = useAppSelector((state) => state.user.user);
  const [isDeletingByList, setIsDeletingByList] = useState(false);

  // MODAL
  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConditionPopupOpen, setIsConditionPopupOpen] = useState(false);
  const [isGiftPopupOpen, setIsGiftPopupOpen] = useState(false);
  const [isBubbleOptionOpen, setIsBubbleOptionOpen] = useState(false);
  const [isBubbleGuideOpen, setIsBubbleGuideOpen] = useState(false);

  const [form] = Form.useForm();

  // SEARCH AND FILTER
  const [searchInput, setSearchInput] = useState('');
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
      icon: '',
      headingMessage: '',
      message: '',
      buttonMessage: '',
      handleOpen: () => { },
      handleClose: () => { },
    });

  // FORMIK RELATED STATES
  const [formikValues, setFormikValues] = useState<FormikValueType>(
    INITIAL_FORMIK_VALUES
  );
  const [selectedBotPersonalSignalResult, setSelectedBotPersonalSignalResult] =
    useState<BotSignalPersonalResult>(INITIAL_BOT_PERSONAL_SIGNAL_RESULT);
  const [conditionViews, setConditionView] = useState<BubbleOptions>(generateBaseBubbleOption())
  const [isEditing, setIsEditing] = useState(false);
  const [giftUsername, setGiftUsername] = useState({
    value: '',
    error: null,
    touched: false,
  });

  // INITIAL PARTNER BOT USEFFECT
  const [isPartnerBotInitialized, setIsPartnerBotInitialized] = useState(false);
  const animationUpsertModalMobile = useSpring({
    to: {
      opacity: isUpsertModalOpen ? 1 : 0,
      transform: isUpsertModalOpen ? 'translateX(0%)' : 'translateX(-100%)',
    },
  });

  // ! BUBBLE
  const [selectedBubbleIdx, setSelectedBubbleIdx] = useState(0);
  const [tempBubbleOption, setTempBubbleOption] = useState<BubbleOptions>(
    generateBaseBubbleOption()
  );
  const [selectedCondition, setSelectedCondition] = useState<TypeConditionsForm | null>(null)
  // dung de hien thi o popup xem dieu kien
  const [
    selectedBubbleMethodConditionToView,
    setSelectedBubbleMethodConditionToView,
  ] = useState<string | number>(1);
  const [conditionError, setConditionError] = useState('');

  // { label: 'Điều kiện 1', children: 'Content of Tab 1', key: '1' }

  const [conditionsForm, setConditionsForm] = useState<TypeConditionsForm[]>([])
  const [chidConditions, setChidConditions] = useState<TypeConditionChid[]>([])
  const [selectedBetType, setSelectedBetType] = useState(1)
  const [activeKey, setActiveKey] = useState('1');
  const newTabIndex = useRef(1);

  const tab = (obj: BubbleOptions, key: string) => {
    return <div className="p-6 grid grid-cols-2 gap-6 md:gap-8 md:grid-cols-4 bg-ink-05 rounded-xl">
      {Object.entries(obj).map(([key, values]) => {
        if (key === 'order_type') return;
        return (
          <div key={key}>
            <p className="mb-3">Bảng {key}</p>
            <div className="flex flex-col gap-[2px]">
              {generateArrayOfAndFrom(4, 0).map((rowIdx) => (
                <div key={rowIdx} className="flex gap-[2px]">
                  {generateArrayOfAndFrom(5, 0).map((colIdx) => {
                    const idxInValues = rowIdx + 4 * colIdx;
                    const isWin = values[idxInValues] === 1;
                    const isLose = values[idxInValues] === -1;
                    const isDraw = values[idxInValues] === 5;
                    return (
                      <div
                        key={rowIdx + 4 * colIdx}
                        className={`w-[1.5rem] h-[1.5rem] rounded-full cursor-pointer ${isWin
                          ? 'bg-green-circle'
                          : isLose
                            ? 'bg-red-circle'
                            : isDraw
                              ? 'bg-orange-100'
                              : 'bg-ink-10'
                          }`}
                        onClick={() => {
                          const tempBubbleToSet = {
                            ...tempBubbleOption,
                          };
                          if (isWin) {
                            tempBubbleToSet[key][idxInValues] = -1;
                          } else if (isLose) {
                            tempBubbleToSet[key][idxInValues] = 5;
                          } else if (isDraw) {
                            tempBubbleToSet[key][idxInValues] = 0;
                          } else {
                            tempBubbleToSet[key][idxInValues] = 1;
                          }
                          setTempBubbleOption(tempBubbleToSet);
                        }}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const [items, setItems] = useState([
    { label: <p className='label'>Điều kiện 1</p>, children: tab(tempBubbleOption, '1'), key: '1', closable: false }
  ]);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    newTabIndex.current++
    const newActiveKey = `${newTabIndex.current}`;
    const newPanes = [...items];
    newPanes.push({ label: <p className='label'>Điều kiện {newActiveKey}</p>, children: tab(generateBaseBubbleOption(), newActiveKey), key: newActiveKey, closable: true });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    // setChidConditions((prev) => prev.filter((e) => e.table !== Number(targetKey)))
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };
  // ! RESPONSIVE
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

  const data = React.useMemo<BotSignalPersonalResult[]>(
    () => allBotPersonalSignalResults,
    [allBotPersonalSignalResults]
  );

  // ! Tooltips
  const [isTooltipOpen, setIsTooltipOpen] = useState<TooltipToggle>({});

  const handleTooltipOpen = useCallback((rowIndex: string | number) => {
    console.log('handleTooltipOpen');
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
    dispatch(userActions.updateSelectedBotAccount(option));
  };

  const onSelectedMasterChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: InputSelectOption
  ) => {
    setSelectedMasterAccount(option);
  };

  // FUNCTIONS FOR MODAL
  const showIsDevelopingModal = () => {
    dispatch(uiActions.updateIsModalOpen(true));
  };

  const handleOpenUpsertModal = () => {
    setIsUpsertModalOpen(true);
  };

  const handleCloseUpsertModal = () => {
    setIsUpsertModalOpen(false);
    formikUpsert.resetForm();
    setFormikValues(INITIAL_FORMIK_VALUES);
    setSelectedAccountType(INITIAL_SELECTED_ACCOUNT_TYPE);
    setSelectedBotAccount(INITIAL_SELECTED_OPTION);
    setConditionError('');
    setConditionsForm([])
    // form.resetFields()
    // setChidConditions([])
    setSelectedCondition(null)
    // setSelectedMasterAccount(INITIAL_SELECTED_OPTION);
  };

  const handleOpenPopupModal = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopupModal = () => {
    setIsPopupOpen(false);
  };

  const handleOpenGiftPopupModal = () => {
    setIsGiftPopupOpen(true);
  };

  const handleCloseGiftPopupModal = () => {
    setIsGiftPopupOpen(false);
  };

  const handleOpenConditionPopupModal = () => {
    setIsConditionPopupOpen(true);
  };

  const handleCloseConditionPopupModal = () => {
    setIsConditionPopupOpen(false);
  };

  const handleOpenBubbleOptionPopupModal = () => {
    setIsBubbleOptionOpen(true);
  };

  const handleCloseBubbleOptionPopupModal = () => {
    // form.resetFields()
    setIsBubbleOptionOpen(false);
  };

  const handleOpenBubbleGuidePopupModal = () => {
    setIsBubbleGuideOpen(true);
  };

  const handleCloseBubbleGuidePopupModal = () => {
    setIsBubbleGuideOpen(false);
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
  const getAllBotSignalBubbleSettings = useCallback(
    (page: number) => {
      // Must have partnerBot to have API key
      if (partnerBotDatas.length > 0) {
        axios
          .get(`${APIs.botSignalBubbleList}`, {
            params: {
              page,
              page_size: selectedPageSizeOption.value,
            },
          })
          .then((res) => {
            const data: BotSignalPersonal = res.data;
            setBotPersonalSignalData(data);
            setAllBotPersonalSignalResults(data.results);
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
    [enqueueSnackbar, partnerBotDatas, selectedPageSizeOption]
  );

  const deleteSettingById = () => {
    axios
      .delete(
        `${APIs.deleteBotSignalPersonal}${selectedBotPersonalSignalResult.id}`
      )
      .then((res) => {
        getAllBotSignalBubbleSettings(page + 1);
        setSelectedIds({});
        setSelectAll(0);
        enqueueSnackbar('Xoá cấu hình thành công!', { variant: 'success' });
      })
      .catch(() => {
        enqueueSnackbar('Không thể xoá cấu hình!', { variant: 'error' });
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
        getAllBotSignalBubbleSettings(page + 1);
        setSelectedIds({});
        setSelectAll(0);
        enqueueSnackbar('Xoá cấu hình thành công!', { variant: 'success' });
      })
      .catch(() => {
        enqueueSnackbar('Xoá cấu hình thất bại!', { variant: 'error' });
      });
  };

  const updateModelData = useCallback(
    (botPersonalSignalResult: BotSignalPersonalResult) => {
      // UPDATE FORM MODAL
      const updatedFormikValues: FormikValueType = {
        configName: botPersonalSignalResult.config_name,
        ownerType: botPersonalSignalResult.owner_type,
        conditions: botPersonalSignalResult.conditions,
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
      getAllBotSignalBubbleSettings(1);
    }
  };

  const handlePageChange = useCallback(
    ({ selected }: { selected: number }) => {
      console.log(selected);
      const page = selected + 1;
      setPage(selected);
      getAllBotSignalBubbleSettings(page);
    },
    [getAllBotSignalBubbleSettings]
  );

  console.log(form.getFieldValue('conditions'), conditionsForm)

  // TABLE
  const columns = React.useMemo<Column<BotSignalPersonalResult>[]>(
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
          return <div className="text-left">Tên phương pháp</div>;
        },
        accessor: 'config_name',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex items-center gap-x-1">
              <p className="text-sm text-ink-100">{original.config_name}</p>
            </div>
          );
        },
      },
      {
        Header: () => {
          return <div className="text-center">Sở hữu phương pháp</div>;
        },
        accessor: 'owner_type',
        Cell: (props) => {
          const original = props.cell.row.original;
          const isPersonal = original.owner_type === 'personal';
          return (
            <div className="flex justify-center gap-x-1">
              <p
                className={`px-2 ${isPersonal
                  ? 'bg-primary-100 text-background-80'
                  : 'bg-green-100 text-ink-100'
                  } rounded-3xl text-ink-100 text-xs`}
              >
                {isPersonal ? 'Cá nhân' : 'Được tặng'}
              </p>
            </div>
          );
        },
      },
      {
        Header: () => {
          return <div className="text-left">Điều kiện</div>;
        },
        accessor: 'conditions',
        Cell: (props) => {
          const original = props.cell.row.original;
          return (
            <div className="flex gap-x-1">
              <p
                className="underline-primary bg-primary-100 bg-clip-text text-transparent text-sm cursor-pointer"
                onClick={() => {
                  setSelectedBotPersonalSignalResult(original);
                  setSelectedBubbleMethodConditionToView(
                    Object.keys(original.conditions)[0]
                  );
                  handleOpenConditionPopupModal();
                }}
              >
                Xem điều kiện
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
                  <>
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenGiftPopupModal();
                        handleTooltipClose(original.id);
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={images.table.gift_gold}
                        alt="BotLambotrade"
                      />
                      <p className="text-ink-100 text-base">Tặng</p>
                    </div>
                    <div
                      className="p-3 min-w-[11.25rem] hover:bg-primary-10 flex items-center gap-x-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        // const newC = original.fconditions.map((e) => {
                        //   let obj: any = generateBaseBubbleOption()
                        //   const arr = e.conditions
                        //   arr.forEach((x) => {
                        //     const { board, bubble, result_type } = x;
                        //     obj[board][bubble - 1] = result_type;
                        //     return obj
                        //   })
                        //   return {
                        //     ...e,
                        //     fconditions: {...obj, id: `${uniqueId()}`}
                        //   }
                        // })
                        handleOpenUpsertModal();
                        setIsEditing(true);
                        updateModelData(original);
                        setSelectedBotPersonalSignalResult(original);
                        setConditionsForm(original.fconditions);
                        handleTooltipClose(original.id);
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
                        setSelectedBotPersonalSignalResult(original);
                        handleTooltipClose(original.id);
                      }}
                    >
                      <img
                        className="w-[1.5rem]"
                        src={images.table.delete}
                        alt="BotLambotrade"
                      />
                      <p className="text-ink-100 text-base">Xoá cấu hình</p>
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
                // onClick={() => {
                //   handleTooltipToggle(original.id);
                // }}
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
      selectedIds,
      toggleAllRow,
      toggleRow,
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
      configName: Yup.string()
        .required('Vui lòng nhập tên phương pháp')
        .max(50, 'Vui lòng nhập tên cấu hình bot dưới 50 ký tự')
        .matches(
          /^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ][_-a-zA-Z0-9àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ ]*$/gi,
          'Cấu hình bot phải bắt đầu bằng chữ và không chứa ký tự đặc biệt'
        ),
    }),
    onSubmit: async (values, helpers) => {
      if (Object.keys(values.conditions).length === 0) {
        setConditionError('Vui lòng nhập ít nhất một điều kiện');
        return;
      }
      if (isEditing) {
        // UPDATE
        const updateSignalPersonalData = {
          config_name: values.configName,
          owner_type: selectedBotPersonalSignalResult.owner_type,
          config_type: selectedBotPersonalSignalResult.config_type,
          conditions: values.conditions,
          fconditions: conditionsForm.map((e) => ({
            ...e,
            betType: e.betType,
            bubble: e.bubble,
            conditions: e.conditions,
          })),
          is_onlytrade: selectedBotPersonalSignalResult.is_onlytrade,
        };
        axios
          .patch(
            `${APIs.updateBotSignalPersonal}${selectedBotPersonalSignalResult.id}/`,
            updateSignalPersonalData
          )
          .then(() => {
            getAllBotSignalBubbleSettings(page + 1);
            enqueueSnackbar('Cập nhập cấu hình thành công!', {
              variant: 'success',
            });
            handleCloseUpsertModal();
          })
          .catch((err) => {
            enqueueSnackbar(
              `${err.data
                ? JSON.stringify(err.data)
                : 'Cập nhập cấu hình thất bại!'
              }`,
              { variant: 'error' }
            );
          });
      } else {
        // INSERT
        const createSignalPersonalData = {
          config_name: values.configName,
          owner_type: 'personal',
          config_type: 'bubble',
          fconditions: conditionsForm.map((e) => ({
            betType: e.betType,
            bubble: e.bubble,
            conditions: e.conditions,
            id: e.id
          })),
          conditions: tempBubbleOption,
          is_onlytrade: false,
        };
        axios
          .post(APIs.createBotSignalPersonal, createSignalPersonalData)
          .then(() => {
            getAllBotSignalBubbleSettings(page + 1);
            enqueueSnackbar('Tạo cấu hình thành công!', {
              variant: 'success',
            });
            handleCloseUpsertModal();
          })
          .catch((err) => {
            enqueueSnackbar(
              `${err.data ? JSON.stringify(err.data) : 'Tạo cấu hình thất bại!'
              }`,
              { variant: 'error' }
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
        enqueueSnackbar('Không thể lấy bot datas', { variant: 'error' });
      });
  }, [enqueueSnackbar]);

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
    form.setFieldValue('conditions', chidConditions)
  }, [chidConditions])


  useEffect(() => {
    if (partnerBotDatas && partnerBotDatas.length > 0) {
      if (selectedAccountType.value === 'LIVE' && !isPartnerBotInitialized) {
        const firstBotOption = {
          value: partnerBotDatas[0].id,
          label: partnerBotDatas[0].botname,
        };
        setSelectedBotAccount(firstBotOption);
        setIsPartnerBotInitialized(true);
        dispatch(userActions.updateSelectedBotAccount(firstBotOption));
      }
      convertPartnerBotsToPartnerAccountOptions();
      convertAllPartnerBotsToPartnerAccountOptions();
    }
  }, [
    partnerBotDatas,
    convertPartnerBotsToPartnerAccountOptions,
    selectedAccountType,
    selectedBotAccount.value,
    convertAllPartnerBotsToPartnerAccountOptions,
    dispatch,
    isPartnerBotInitialized,
  ]);

  useEffect(() => {
    getAllBotSignalBubbleSettings(page + 1);
  }, [getAllBotSignalBubbleSettings, page]);

  return (
    <>
      <div className="h-fit mb-6 bg-background-80 rounded-3xl">
        <div className="p-6 border-b border-ink-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-xl text-ink-100 font-semibold">
            Danh sách cấu hình {isMobile && <br />} phương pháp đã tạo
          </h1>
          <button
            className="px-3 py-[0.625rem] w-full md:w-auto rounded-xl flex justify-center items-center gap-[0.625rem] bg-primary-100"
            onClick={() => {
              // Bật lại
              // if (partnerBotDatas.length === 0) {
              //   setModalAttributes((prev) => ({
              //     ...prev,
              //     isOpen: true,
              //     icon: images.copy.account_not_integrate,
              //     headingMessage: 'Bạn chưa liên kết tài khoản',
              //     message: (
              //       <>
              //         Liên kết tài khoản ngay để thực hiện giao dịch cùng đội
              //         ngũ chuyên gia của AI BotTrade
              //       </>
              //     ),
              //     buttonMessage: 'Liên kết tài khoản',
              //     handleOpen: handleOpenAccountTradePopupModal,
              //     handleClose: handleCloseAccountTradePopupModal,
              //   }));
              //   return;
              // }
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
        {allBotPersonalSignalResults.length === 0 && (
          <div className="py-[5rem] flex flex-col justify-center items-center gap-y-6">
            <img
              className="w-[10.25rem]"
              src={images.copy.empty}
              alt="BotLambotrade"
            />
            <p className="text-ink-60">
              Danh sách cấu hình phương pháp đã tạo trống
            </p>
          </div>
        )}
        {allBotPersonalSignalResults.length > 0 && (
          <div className="p-6 flex flex-col gap-y-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
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
                  setSearchInput('');
                }}
                placeholder="Tìm kiếm"
                searchIcon={images.table.search}
                searchIconClassName="!w-[1.25rem]"
                containerClassName="w-full md:w-[21.375rem]"
                inputClassName="!py-2 text-sm"
              />

              {/* HÌNH THỨC SỞ HƯU PHƯƠNG PHÁP */}
              <SelectInput
                value={selectedMethodOwnType}
                onChange={handleSelectMethodOwnType}
                fullWidth={!isDesktop && !isTablet}
                inputClassName="!py-2 !pr-8 text-sm w-full md:w-[21.375rem]"
                indicatorContainerClassName="!right-3"
                indicatorContainerIconClassName="!w-[1rem]"
                // menuPortalClassName={`min-w-[10.25rem] ${
                //   isMobile ? 'translate-x-[-3.2rem]' : ''
                // }`}
                name="select"
                options={METHOD_OWN_TYPES}
              />
            </div>

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
                        showIsDevelopingModal();
                        // resetAllCurrent();
                      }}
                    >
                      Tặng
                    </BotTradeSettingButton>
                  </div>
                </div>
              )}

            <div
              className={`border border-ink-05 rounded-2xl w-full ${!isLargeDesktop ? 'overflow-x-scroll border-collapse' : ''
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
        zIndex={19}
      >
        <animated.div style={isMobile ? animationUpsertModalMobile : {}}>
          <form onSubmit={formikUpsert.handleSubmit}>
            <div className="absolute flex flex-col md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] bg-background-80 h-[100svh] w-full md:w-[45rem] md:h-auto md:rounded-3xl overflow-y-auto">
              {/* HEADING */}
              <div className="p-6 border-b border-ink-10 flex justify-between items-center">
                <h1 className="text-xl text-ink-100 font-semibold">
                  {!isEditing
                    ? 'Thêm mới cấu hình phương pháp Xbot - Bóng nước'
                    : 'Chỉnh sửa cấu hình phương pháp Xbot - Bóng nước'}
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
                  {/* Tên phương pháp */}
                  <TextInput
                    fullWidth={true}
                    name="configName"
                    id="configName"
                    label="Tên phương pháp"
                    type="text"
                    value={formikUpsert.values.configName}
                    onChange={formikUpsert.handleChange}
                    resetValue={() => {
                      formikUpsert.setFieldValue('configName', '');
                    }}
                    onBlur={formikUpsert.handleBlur}
                    placeholder="Tên phương pháp"
                    error={
                      formikUpsert.touched.configName &&
                      Boolean(formikUpsert.errors.configName)
                    }
                    helperText={
                      formikUpsert.touched.configName &&
                      formikUpsert.errors.configName
                    }
                    containerClassName="mb-6"
                  />

                  {/* CHỌN BÓNG MUỐN THÊM */}
                  <div className="mb-6">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-ink-100">
                        CHỌN BÓNG MUỐN THÊM
                      </p>
                    </div>

                    <div className="p-6 rounded-xl bg-ink-05">
                      <div className="mx-auto max-w-[284px] flex flex-col gap-4">
                        {generateArrayOfAndFrom(4, 1).map((rowIdx) => (
                          <div
                            key={rowIdx}
                            className="grid grid-cols-5 items-center justify-center gap-4"
                          >
                            {generateArrayOfAndFrom(5, 0).map((colIdx) => {
                              const doesExist = conditionsForm.some(
                                (val) => Number(val.bubble) === rowIdx + 4 * colIdx
                              );
                              const isDisabled = rowIdx % 2 === 0;

                              return (
                                <Bubble
                                  key={rowIdx + 4 * colIdx}
                                  className={`rounded-full ${isDisabled
                                    ? 'bg-primary-05 cursor-not-allowed'
                                    : doesExist
                                      ? 'bg-primary-100 cursor-pointer'
                                      : 'border-primary-button cursor-pointer'
                                    }`}
                                  textClassName={`bg-clip-text text-transparent ${isDisabled
                                    ? 'bg-primary-100'
                                    : doesExist
                                      ? 'bg-background-80'
                                      : 'bg-primary-100'
                                    }`}
                                  text={rowIdx + 4 * colIdx}
                                  onClick={() => {
                                    form.setFieldValue('conditions', [
                                      { board: 4, bubble: 1, result_type: 1 }
                                    ])
                                    // console.log(rowIdx + 4 * colIdx, 'bubbleIdx')
                                    if (!isDisabled) {
                                      const bubbleIdx = rowIdx + 4 * colIdx;
                                      setTempBubbleOption(
                                        generateBaseBubbleOption()
                                      );
                                      setSelectedBubbleIdx(bubbleIdx);
                                      handleOpenBubbleOptionPopupModal();
                                    }
                                  }}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Điều kiện đã thêm */}
                  <div className="mb-6">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-ink-100">ĐIỀU KIỆN ĐÃ THÊM</p>
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          formikUpsert.setFieldValue('conditions', {});
                          setConditionsForm([])
                          // setChidConditions([])
                        }}
                      >
                        <img
                          className="w-[1.5rem]"
                          src={images.bot.delete_gold}
                          alt="BotLambotrade"
                        />
                        <p className="text-ink-100">Xoá tất cả</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-ink-05">

                      <div className="mx-auto max-w-[284px] grid grid-cols-5 items-center justify-center gap-4">
                        {conditionsForm.map((e) => (
                          <div className='relative cursor-pointer' onClick={() => {
                            // setTempBubbleOption(e.fconditions);
                            form.setFieldValue('conditions', e.conditions)
                            // setChidConditions(e.conditions)
                            setSelectedBubbleIdx(e.bubble)
                            setSelectedCondition(e)
                            setSelectedBetType(e.betType)
                            handleOpenBubbleOptionPopupModal();
                          }}>
                            <div className='count-bubble'>{e.conditions.length}</div>
                            <Bubble
                              key={e.bubble}
                              text={e.bubble}
                              className={e.betType === 1 ? "bg-green-circle" : "bg-red-circle"}
                              textClassName="text-ink-100"
                            />
                          </div>
                        )
                        )}
                      </div>
                    </div>

                    {conditionError && (
                      <div className="px-2 py-3 text-red-100 text-sm">
                        {conditionError}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* BUTTON */}
              <div className="mt-auto p-6 flex justify-end items-center">
                <GoldButton
                  type="submit"
                  buttonClassName="flex-grow md:flex-initial"
                >
                  {!isEditing ? 'Lưu phương pháp' : 'Cập nhật phương pháp'}
                </GoldButton>
              </div>
            </div>
          </form>
        </animated.div>
      </CustomModal>

      {/* Delete Modal */}
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
            Xoá phương pháp
          </h3>
          <p className="mb-12 mx-auto max-w-[18.75rem] text-ink-80">
            Bạn có chắc chắn muốn xoá phương pháp này không?
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

      {/* GIFT POPUP MODAL */}
      <CustomModal
        isOpen={isGiftPopupOpen}
        handleOpen={handleOpenGiftPopupModal}
        handleClose={handleCloseGiftPopupModal}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl">
          <div className="p-6 border-b border-ink-10 flex justify-between items-center">
            <h3 className="text-xl text-ink-100 font-semibold">
              Tặng phương pháp
            </h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={handleCloseGiftPopupModal}
            />
          </div>
          <div className="p-6">
            <TextInput
              id="giftUsername"
              name="giftUsername"
              type="text"
              label="Tên tài khoản muốn tặng"
              fullWidth
              value={giftUsername.value}
              onChange={(e) => {
                setGiftUsername((prev) => ({ ...prev, value: e.target.value }));
              }}
              onBlur={() => {
                setGiftUsername((prev) => ({ ...prev, touched: true }));
              }}
              error={giftUsername.touched && Boolean(giftUsername.error)}
              helperText={giftUsername.touched && giftUsername.error}
              containerClassName="mb-6"
            />
            <div className="flex justify-center md:justify-end">
              <CustomButton
                className="w-full md:w-[12rem] py-4"
                background="bg-primary-100"
                textColor="bg-background-100"
                textClassName="font-bold"
              >
                Gửi tặng
              </CustomButton>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* Thêm điều kiện cho bóng */}
      <CustomModal
        isOpen={isBubbleOptionOpen}
        handleOpen={handleOpenBubbleOptionPopupModal}
        handleClose={handleCloseBubbleOptionPopupModal}
        zIndex={20}
      >
        <div className="absolute flex flex-col md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] bg-background-80 h-[100svh] w-full md:w-[45rem] md:h-auto md:rounded-3xl overflow-y-auto">
          <div className="p-6 border-b border-ink-10 flex justify-between items-center">
            <h3 className="text-xl text-ink-100 font-semibold">
              Thêm điều kiện cho bóng số : {selectedBubbleIdx}
            </h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={handleCloseBubbleOptionPopupModal}
            />
          </div>
          <div className="p-6 md:max-h-[calc(100vh-19rem)] overflow-y-auto">
            {/* LỆNH VÀO */}
            <div className="mb-6">
              <p className="mb-4 text-sm text-ink-100">LỆNH VÀO</p>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 flex items-center justify-center gap-2 rounded-xl cursor-pointer ${selectedBetType === 1
                    ? 'bg-primary-05 border-primary'
                    : 'bg-primary-05-hover border-input-ink'
                    }`}
                  onClick={() => {
                    const tempBubbleToSet = { ...tempBubbleOption };
                    tempBubbleToSet['order_type'] = 'BUY';
                    setTempBubbleOption(tempBubbleToSet);
                    setSelectedBetType(1)
                  }}
                >
                  <img
                    className="w-[1.5rem]"
                    src={images.table.buy}
                    alt="BotLambotrade"
                  />
                  <p className="text-ink-100">Tăng</p>
                </div>
                <div
                  className={`p-4 flex items-center justify-center gap-2 rounded-xl cursor-pointer ${selectedBetType === - 1
                    ? 'bg-primary-05 border-primary'
                    : 'bg-primary-05-hover border-input-ink'
                    }`}
                  onClick={() => {
                    const tempBubbleToSet = { ...tempBubbleOption };
                    tempBubbleToSet['order_type'] = 'SELL';
                    setTempBubbleOption(tempBubbleToSet);
                    setSelectedBetType(-1)
                  }}
                >
                  <img
                    className="w-[1.5rem]"
                    src={images.table.sell}
                    alt="BotLambotrade"
                  />
                  <p className="text-ink-100">Giảm</p>
                </div>
              </div>
            </div>

            {/* BẢNG ĐIỀU KIỆN & TÍN HIỆU */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-ink-100">
                  BẢNG ĐIỀU KIỆN & TÍN HIỆU
                </p>
                {/* <p
                  className="underline-primary bg-primary-100 bg-clip-text text-transparent text-sm cursor-pointer"
                  onClick={handleOpenBubbleGuidePopupModal}
                >
                  Xem hướng dẫn
                </p> */}
              </div>
              <div className='flex flex-col gap-4'>
                <Form
                  name="dynamic_form_nest_item"
                  onFinish={(v) => {}}
                  autoComplete="off"
                  layout='vertical'
                  form={form}
                >
                  <Form.List name="conditions">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} className='space-ant-custom' align="baseline">
                            <Form.Item
                              initialValue={4}
                              {...restField}
                              className='class-item-custom'
                              label={<p className='custom-label'>Bảng</p>}
                              name={[name, 'board']}
                            >
                              <Select dropdownClassName='dropdown-custom' className='bb-custom-select' placeholder="Chọn bảng" style={{
                                width: '100%'
                              }} options={Array.from({ length: 5 }).map((_, index: number) => {
                                return {
                                  label: index + 1,
                                  value: index + 1
                                };
                              })} />
                            </Form.Item>
                            <Form.Item
                              initialValue={1}
                              {...restField}
                              className='class-item-custom'
                              label={<p className='custom-label'>Bóng</p>}
                              name={[name, 'bubble']}
                            >
                              <Select dropdownClassName='dropdown-custom' className='bb-custom-select' placeholder="Chọn bóng" options={Array.from({ length: 20 }).map((_, index: number) => {
                                return {
                                  label: index + 1,
                                  value: index + 1
                                };
                              })} />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              initialValue={1}
                              className='class-item-custom'
                              label={<p className='custom-label'>Kết quả</p>}
                              name={[name, 'result_type']}
                            >
                              <Select dropdownClassName='dropdown-custom center' className='bb-custom-select' placeholder="Chọn bảng" style={{
                                width: '100%'
                              }} options={[
                                { label: <div className="w-[1rem] h-[1rem] rounded-full cursor-pointer bg-green-circle"></div>, value: 1 },
                                { label: <div className="w-[1rem] h-[1rem] rounded-full cursor-pointer bg-red-circle"></div>, value: -1 },
                                { label: <div className="w-[1rem] h-[1rem] rounded-full cursor-pointer bg-orange-100"></div>, value: 5 }
                              ]} />

                            </Form.Item>
                            <div onClick={() => {
                              if (fields.length > 1)
                                remove(name)
                            }} style={{
                              color: '#f8fafc',
                              top: '35px',
                              left: '25%'
                            }} className={`${fields.length < 2 ? "disable-remove" : ''} absolute w-[1.5rem] h-[1.5rem] flex items-center justify-center rounded-full cursor-pointer bg-red-circle`}>
                              <CloseOutlined />
                            </div>
                          </Space>
                        ))}
                        <Form.Item>
                          <Button className='flex flex-row justify-center items-center bg-green-circle custom-add-field' onClick={() => {
                            add()
                            // const existing: TypeConditionChid[] = Array.isArray(form.getFieldValue('conditions')) ? form.getFieldValue('conditions').filter((e: any) => e != null) : []
                            // const newChidConditions = [...existing, { board: 4, bubble: 1, result_type: 1, id: `${uniqueId()}41` }]
                            // form.setFieldValue('conditions', newChidConditions)
                          }} block icon={<PlusOutlined />}>
                            Thêm tín hiệu
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form>

                {/* <div className="p-6 grid grid-cols-2 gap-6 md:gap-8 md:grid-cols-4 bg-ink-05 rounded-xl">
                  {Object.entries(tempBubbleOption).map(([key, values]) => {
                    if (key === 'order_type') return;
                    return (
                      <div key={key}>
                        <p className="mb-3">Bảng {key}</p>
                        <div className="flex flex-col gap-[2px]">
                          {generateArrayOfAndFrom(4, 0).map((rowIdx) => (
                            <div key={rowIdx} className="flex gap-[2px]">
                              {generateArrayOfAndFrom(5, 0).map((colIdx) => {
                                const idxInValues = rowIdx + 4 * colIdx;
                                const isWin = values[idxInValues] === 1;
                                const isLose = values[idxInValues] === -1;
                                const isDraw = values[idxInValues] === 5;

                                return (
                                  <div
                                    key={rowIdx + 4 * colIdx}
                                    className={`w-[1.5rem] h-[1.5rem] rounded-full cursor-pointer ${isWin
                                      ? 'bg-green-circle'
                                      : isLose
                                        ? 'bg-red-circle'
                                        : isDraw
                                          ? 'bg-orange-100'
                                          : 'bg-ink-10'
                                      }`}
                                    onClick={() => {
                                      const tempBubbleToSet = {
                                        ...tempBubbleOption,
                                      };
                                      let result_type = 0
                                      if (isWin) {
                                        tempBubbleToSet[key][idxInValues] = -1;
                                        result_type = -1
                                      } else if (isLose) {
                                        tempBubbleToSet[key][idxInValues] = 5;
                                        result_type = 5
                                      } else if (isDraw) {
                                        tempBubbleToSet[key][idxInValues] = 0;
                                        result_type = 0
                                      } else {
                                        tempBubbleToSet[key][idxInValues] = 1;
                                        result_type = 1
                                      }
                                      setChidConditions(prev => {
                                        const arr = [...prev];
                                        const foundIndex = arr.findIndex(e => String(e.board) === String(key) && String(e.bubble) === String(idxInValues + 1));
                                        if (foundIndex !== -1) {
                                          arr[foundIndex] = { ...arr[foundIndex], result_type: result_type };
                                        } else {
                                          arr.push({
                                            board: Number(key),
                                            bubble: idxInValues + 1,
                                            result_type: result_type
                                          });
                                        }
                                        if (result_type === 0) {
                                          return arr.filter((e) => String(e.bubble) !== String(idxInValues + 1))
                                        } else {
                                          return arr
                                        }
                                      });
                                      setTempBubbleOption(tempBubbleToSet);
                                    }}
                                  ></div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div> */}
              </div>
            </div>
          </div>

          <div className="mt-auto p-6 grid grid-cols-2 md:flex justify-end items-center gap-4">
            <CustomButton
              className={`py-4 md:min-w-[12rem] basis-1/2 md:basis-auto flex-grow md:flex-initial`}
              background="bg-ink-05"
              textClassName="bg-primary-100 font-bold"
              onClick={() => {
                // setChidConditions([])
                form.resetFields()
                handleCloseBubbleOptionPopupModal();
                const conditionsToSet = { ...formikUpsert.values.conditions };
                delete conditionsToSet[selectedBubbleIdx];
                const sortedConditionsToSet = Object.keys(conditionsToSet)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .reduce((acc: Conditions, key) => {
                    acc[key] = conditionsToSet[key];
                    return acc;
                  }, {});
                formikUpsert.setFieldValue('conditions', sortedConditionsToSet);
              }}
            >
              Xoá
            </CustomButton>
            <CustomButton
              className={`py-4 md:min-w-[12rem] basis-1/2 md:basis-auto flex-grow md:flex-initial`}
              background={`bg-primary-100`}
              textClassName={`bg-background-100 font-bold`}
              onClick={() => {
                setConditionsForm(prev => {
                  const newArr = [...prev];
                  const foundIndex = newArr.findIndex(e => e.id === selectedCondition?.id);

                  const eConditions = Array.isArray(form.getFieldValue('conditions')) ? form.getFieldValue('conditions') : []
                  if (foundIndex !== -1) {
                    newArr[foundIndex] = { ...newArr[foundIndex], bubble: selectedBubbleIdx, conditions: eConditions, fconditions: tempBubbleOption, betType: selectedBetType };
                  } else {
                    newArr.push({
                      betType: selectedBetType,
                      bubble: selectedBubbleIdx,
                      conditions: eConditions,
                      fconditions: tempBubbleOption,
                      id: uniqueId() + String(Math.random())
                    });
                  }
                  // console.log(newArr, 'new')
                  return newArr.filter((e) => e.conditions.length > 0);
                });
                setSelectedCondition(null)
                // form.resetFields()
                // setChidConditions([])
                handleCloseBubbleOptionPopupModal();
                const conditionsToSet = { ...formikUpsert.values.conditions };
                conditionsToSet[selectedBubbleIdx] = tempBubbleOption;
                const sortedConditionsToSet = Object.keys(conditionsToSet)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .reduce((acc: Conditions, key) => {
                    acc[key] = conditionsToSet[key];
                    return acc;
                  }, {});
                formikUpsert.setFieldValue('conditions', sortedConditionsToSet);
                // Remove error on conditions
                setConditionError('');
              }}
            >
              Xác nhận
            </CustomButton>
          </div>
        </div>
      </CustomModal>

      {/* Xem Dieu Kien */}
      <CustomModal
        isOpen={isConditionPopupOpen}
        handleOpen={handleOpenConditionPopupModal}
        handleClose={() => {
          setConditionView(generateBaseBubbleOption())
          handleCloseConditionPopupModal()
        }}
      >
        <div className="absolute flex flex-col md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] bg-background-80 h-[100svh] w-full md:w-[45rem] md:h-auto md:rounded-3xl overflow-y-auto">
          <div className="p-6 border-b border-ink-10 flex justify-between items-center">
            <h3 className="text-xl text-ink-100 font-semibold">
              Xem điều kiện
            </h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={() => {
                setConditionView(generateBaseBubbleOption())
                handleCloseConditionPopupModal()
              }}
            />
          </div>
          <div className="p-6">
            {/* BÓNG ĐÃ THÊM */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-ink-100">BÓNG ĐÃ THÊM</p>
              </div>

              <div className="p-6 rounded-xl bg-ink-05">
                <div className="mx-auto max-w-[284px] grid grid-cols-5 items-center justify-center gap-4">
                  {/* {Object.keys(selectedBotPersonalSignalResult.conditions)
                    .length === 0 && <div className="w-[44px] h-[44px]"></div>}
                  {Object.keys(selectedBotPersonalSignalResult.conditions)
                    .length > 0 &&
                    Object.entries(
                      selectedBotPersonalSignalResult.conditions
                    ).map(([key, value]) => {
                      return (
                        <Bubble
                          key={key}
                          text={key}
                          className={`${selectedBubbleMethodConditionToView === key
                            ? 'bg-green-circle'
                            : 'bg-ink-10'
                            } cursor-pointer`}
                          textClassName={`${selectedBubbleMethodConditionToView === key
                            ? 'text-ink-100'
                            : 'text-green-100'
                            }`}
                          onClick={() => {
                            setSelectedBubbleMethodConditionToView(key);
                          }}
                        />
                      );
                    })} */}
                  {selectedBotPersonalSignalResult.fconditions.map((e) => (
                    <Bubble
                      key={e.id}
                      text={e.bubble}
                      className={`${e.id === selectedBubbleMethodConditionToView
                        ? e.betType === 1 ? 'bg-green-circle' : e.betType === -1 ? 'bg-red-circle' : 'bg-orange-100'
                        : 'bg-ink-10'
                        } cursor-pointer`}
                      textClassName={`${e.id === selectedBubbleMethodConditionToView
                        ? 'text-ink-100'
                        : 'text-green-100'
                        }`}
                      onClick={() => {
                        setSelectedBubbleMethodConditionToView(e.id);
                        let obj: any = generateBaseBubbleOption()
                        const arr = e.conditions
                        arr.forEach(item => {
                          let { board, bubble, result_type } = item;
                          obj[board][bubble - 1] = result_type;
                        });

                        setConditionView(obj)
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* BẢNG ĐIỀU KIỆN & TÍN HIỆU */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-ink-100">
                  BẢNG ĐIỀU KIỆN & TÍN HIỆU
                </p>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6 md:gap-8 md:grid-cols-4 bg-ink-05 rounded-xl">
                {Object.entries(conditionViews).map(([key, values]) => {
                  if (key === 'order_type') return;
                  return (
                    <div key={key}>
                      <p className="mb-3">Bảng {key}</p>
                      <div className="flex flex-col gap-[2px]">
                        {generateArrayOfAndFrom(4, 0).map((rowIdx) => (
                          <div key={rowIdx} className="flex gap-[2px]">
                            {generateArrayOfAndFrom(5, 0).map((colIdx) => {
                              const idxInValues = rowIdx + 4 * colIdx;
                              const isWin = values[idxInValues] === 1;
                              const isLose = values[idxInValues] === -1;
                              const isDraw = values[idxInValues] === 5;
                              return (
                                <div
                                  key={rowIdx + 4 * colIdx}
                                  className={`w-[1.5rem] h-[1.5rem] rounded-full cursor-pointer ${isWin
                                    ? 'bg-green-circle'
                                    : isLose
                                      ? 'bg-red-circle'
                                      : isDraw
                                        ? 'bg-orange-100'
                                        : 'bg-ink-10'
                                    }`}
                                  onClick={() => {
                                    const tempBubbleToSet = {
                                      ...tempBubbleOption,
                                    };
                                    let result_type = 0
                                    if (isWin) {
                                      tempBubbleToSet[key][idxInValues] = -1;
                                      result_type = -1
                                    } else if (isLose) {
                                      tempBubbleToSet[key][idxInValues] = 5;
                                      result_type = 5
                                    } else if (isDraw) {
                                      tempBubbleToSet[key][idxInValues] = 0;
                                      result_type = 0
                                    } else {
                                      tempBubbleToSet[key][idxInValues] = 1;
                                      result_type = 1
                                    }
                                    // setChidConditions(prev => {
                                    //   const arr = [...prev];
                                    //   const foundIndex = arr.findIndex(e => String(e.board) === String(key) && String(e.bubble) === String(idxInValues + 1));
                                    //   if (foundIndex !== -1) {
                                    //     arr[foundIndex] = { ...arr[foundIndex], result_type: result_type };
                                    //   } else {
                                    //     arr.push({
                                    //       board: Number(key),
                                    //       bubble: idxInValues + 1,
                                    //       result_type: result_type,
                                    //       id: `${uniqueId()}${key}${idxInValues + 1}`
                                    //     });
                                    //   }
                                    //   if (result_type === 0) {
                                    //     return arr.filter((e) => String(e.bubble) !== String(idxInValues + 1))
                                    //   } else {
                                    //     return arr
                                    //   }
                                    // });
                                    setTempBubbleOption(tempBubbleToSet);
                                  }}
                                ></div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* <div className="p-6 grid grid-cols-2 gap-6 md:gap-8 md:grid-cols-4 bg-ink-05 rounded-xl">
                {selectedBotPersonalSignalResult?.conditions?.[
                  selectedBubbleMethodConditionToView
                ] &&
                  Object.entries(
                    selectedBotPersonalSignalResult.conditions[
                    selectedBubbleMethodConditionToView
                    ]
                  ).map(([key, values]) => {
                    if (key === 'order_type') return;

                    return (
                      <div key={key}>
                        <p className="mb-3">Bảng {key}</p>
                        <div className="flex flex-col gap-[2px]">
                          {generateArrayOfAndFrom(4, 0).map((rowIdx) => (
                            <div key={rowIdx} className="flex gap-[2px]">
                              {generateArrayOfAndFrom(5, 0).map((colIdx) => {
                                const idxInValues = rowIdx + 4 * colIdx;
                                const isWin = values[idxInValues] === 1;
                                const isLose = values[idxInValues] === -1;
                                const isDraw = values[idxInValues] === 5;

                                return (
                                  <div
                                    key={rowIdx + 4 * colIdx}
                                    className={`w-[1.5rem] h-[1.5rem] rounded-full ${isWin
                                      ? 'bg-green-circle'
                                      : isLose
                                        ? 'bg-red-circle'
                                        : isDraw
                                          ? 'bg-orange-100'
                                          : 'bg-ink-10'
                                      }`}
                                  ></div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div> */}
            </div>
          </div>
        </div>
      </CustomModal>

      {/* Xem hướng dẫn */}
      <CustomModal
        isOpen={isBubbleGuideOpen}
        handleOpen={handleOpenBubbleGuidePopupModal}
        handleClose={handleCloseBubbleGuidePopupModal}
        zIndex={20}
      >
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl">
          <div className="p-6 border-b border-ink-10 flex justify-between items-center">
            <h3 className="text-xl text-ink-100 font-semibold">
              Xem hướng dẫn
            </h3>
            <CloseOutlined
              className="cursor-pointer"
              onClick={handleCloseBubbleGuidePopupModal}
            />
          </div>
          <div className="p-6">
            <div className="mb-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img
                  className="w-[1.5rem]"
                  src={images.table.buy}
                  alt="BotLambotrade"
                />
                <p className="text-sm text-ink-100">Bóng tăng ấn 1 lần</p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  className="w-[1.5rem]"
                  src={images.table.sell}
                  alt="BotLambotrade"
                />
                <p className="text-sm text-ink-100">Bóng giảm ấn 2 lần</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[1.5rem] h-[1.5rem] bg-ink-10 rounded-full"></div>
                <p className="text-sm text-ink-100">
                  Bỏ qua bóng vui lòng ko ấn hoặc ấn 3 lần nếu đã chọn
                </p>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <CustomButton
                className="w-full md:w-[12rem] py-4"
                background="bg-primary-100"
                textColor="bg-background-100"
                textClassName="font-bold"
                onClick={handleCloseBubbleGuidePopupModal}
              >
                Đã hiểu
              </CustomButton>
            </div>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default BotTradeMethodBubble;
