import APIs from "apis";
import images from "assets";
import axios from "axios";
import React, { FC, useCallback, useEffect, useState } from "react";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import ICurrentSession, {
  ISession,
  ISessionLocal,
} from "../../types/ICurrentSession";
import moment from "moment";
import CopyTradeZoomSelectInput from "./CopyTradeZoomSelectInput";
import { useAppDispatch } from "stores/hooks";
import BotData from "types/BotData";
import { uiActions } from "stores/uiSlice";
import { BotBalance } from "types/BotBalance";
import InputSelectOption from "types/InputSelectOption";
import { BotPlaceOrderResponse } from "types/BotPlaceOrderResponse";
import { Link, useNavigate } from "react-router-dom";
import { userActions } from "stores/userSlice";
import { useEnqueueSnackbar } from "hooks/useEnqueueSnackbar";
import useWindowFocus from "hooks/useWindowFocus";
import CustomModal from "components/CustomModal";
import GoldButton from "components/GoldButton";
import CustomButton from "components/CustomButton";
import CustomValidateModel from "components/CustomValidateModal";
import CustomValidateModelProps from "types/CustomValidateProps";
import convertToThreeDecimalPlaces from "../../utils/ConvertToThreeDecimalPlaces";
import CustomInputSpinner from "components/CustomInputSpinner";
import { CopyTradeTotalFollowResponse } from "types/responses/CopyTradeTotalFollowResponse";

interface IPlaceOrder {
  orderType: string;
  orderAmount: string;
  accountType: string;
  botId: number;
}

enum OrderType {
  BUY = "BUY",
  SELL = "SELL",
}

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

const SESSION_TYPES = ["WAIT", "TRADE"];

type CopyTradeInformationProps = {
  isMaster: number;
  callback: (value: boolean) => void;
};

const PLUS_VALUES = [5, 10, 20, 50, 100, "All"];
const MULTIPLY_VALUES = [2, 5, 10, 20, 40, 100];

const TIME_IN_ONE_SESSION = 30;

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: "decimal",
};

const CopyTradeInformation: FC<CopyTradeInformationProps> = ({
  isMaster,
  callback,
}) => {
  const [partnerBotDatas, setPartnerBotDatas] = useState<BotData[]>([]);
  const [botBalance, setBotBalance] = useState<BotBalance>(INITIAL_BOT_BALANCE);
  const [orderAmount, setOrderAmount] = useState<string | number>(1);
  const [multiplyAmount, setMultiplyAmount] = useState<string | number>(1);
  const [isOrderAmountFocus, setIsOrderAmountFocus] = useState(false);
  const [isMultiplyAmountFocus, setIsMultiplyAmountFocus] = useState(false);
  const [selectedAccountType, setSelectedAccountType] =
    useState<InputSelectOption>(INITIAL_SELECTED_ACCOUNT_TYPE);
  const [selectedBotAccount, setSelectedBotAccount] =
    useState<InputSelectOption>(INITIAL_SELECTED_OPTION);
  const [accountOptions, setAccountOptions] = useState<InputSelectOption[]>(
    INITIAL_SELECT_OPTIONS
  );

  // SESSION
  const [sessionLocal, setSessionLocal] = useState<ISessionLocal>({
    ss_t: "",
    r_second: 0,
  });
  const [sessionId, setSessionId] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [startSession, setStartSession] = useState<ISession>({
    ss_id: 0,
    ss_t: "WAIT",
    o_price: 0,
    c_price: 0,
    r_second: 0,
    st_time: moment().format("YYYY-MM-DDTHH:mm:ss.SSSS"),
  });

  // FOLLOWERS
  const [totalFollowData, setTotalFollowData] =
    useState<CopyTradeTotalFollowResponse>({
      totalfollow: 0,
      totalfollowactive: 0,
    });

  // INITIAL PARTNER BOT USEFFECT
  const [isPartnerBotInitialized, setIsPartnerBotInitialized] = useState(false);

  // MODAL
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

  // HOOKS
  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();
  const navigate = useNavigate();

  const handleOpenValidAmountPopupModal = () => {
    // setIsValidAmountPopupOpen(true);
    setModalAttributes((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleCloseValidAmountPopupModal = () => {
    // setIsValidAmountPopupOpen(false);
    setModalAttributes((prev) => ({
      ...prev,
      isOpen: false,
    }));
    if (
      (selectedAccountType.value === "DEMO" && botBalance.demo_balance >= 1) ||
      (selectedAccountType.value !== "DEMO" && botBalance.balance >= 1)
    ) {
      setOrderAmount(1);
    } else {
      setOrderAmount(Math.max(+orderAmount, 0));
    }
    setMultiplyAmount(1);
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

  // const isTabVisible = useWindowFocus(() => {
  //   getCurrentSession();
  // });

  const handleOrderAmountMinusOne = () => {
    // console.log(+orderAmount);
    // if (+orderAmount - 1 <= 1) {
    //   setOrderAmount(1);
    // } else {
    //   setOrderAmount((prev) => {
    //     const convertedValue = convertToThreeDecimalPlaces(+prev - 1);
    //     // +prev.toLocaleString(undefined, { maximumFractionDigits: 3 }) - 1
    //     return convertedValue;
    //   });
    // }
    setOrderAmount((prev) => Math.max(0, +prev - 1));
  };

  const handleOrderAmountPlusOne = () => {
    // console.log(+orderAmount);
    const isDemoAccount = selectedAccountType.value === "DEMO";
    if (partnerBotDatas.length === 0) {
      setOrderAmount((prev) => {
        const convertedValue = convertToThreeDecimalPlaces(+prev + 1);
        // +prev.toLocaleString(undefined, { maximumFractionDigits: 3 }) - 1
        return convertedValue;
      });
      return;
    }
    // CHECK IF DID HAVE ACCOUNT TRADE
    if (isDemoAccount) {
      const demoBalance = botBalance.demo_balance;
      const plusAmount = +orderAmount + 1;
      if (plusAmount <= demoBalance) {
        setOrderAmount((prev) => {
          const convertedValue = convertToThreeDecimalPlaces(+prev + 1);
          // +prev.toLocaleString(undefined, { maximumFractionDigits: 3 }) - 1
          return convertedValue;
        });
      } else {
        setOrderAmount(demoBalance);
      }
    }

    if (!isDemoAccount) {
      const liveBalance = botBalance.balance;
      const plusAmount = +orderAmount + 1;
      if (plusAmount <= liveBalance) {
        setOrderAmount((prev) => {
          const convertedValue = convertToThreeDecimalPlaces(+prev + 1);
          // +prev.toLocaleString(undefined, { maximumFractionDigits: 3 }) - 1
          return convertedValue;
        });
      } else {
        setOrderAmount(liveBalance);
      }
    }
  };

  const handleMultiplyAmountPlusOne = () => {
    if (+multiplyAmount >= 100) {
      setMultiplyAmount(100);
    } else {
      setMultiplyAmount((prev) => {
        const convertedValue = convertToThreeDecimalPlaces(+prev + 1);
        // +prev.toLocaleString(undefined, { maximumFractionDigits: 3 }) - 1
        return convertedValue;
      });
    }
  };

  const handleMultiplyAmountMinusOne = () => {
    if (+multiplyAmount - 1 <= 1) {
      setMultiplyAmount(1);
    } else {
      setMultiplyAmount((prev) => {
        const convertedValue = convertToThreeDecimalPlaces(+prev - 1);
        // +prev.toLocaleString(undefined, { maximumFractionDigits: 3 }) - 1
        return convertedValue;
      });
    }
  };

  const handleOrderAmount: CurrencyInputProps["onValueChange"] = (
    value,
    _,
    values
  ): void => {
    const valueToSet = value === undefined ? "" : value;
    const convertedValue = convertToThreeDecimalPlaces(valueToSet);
    setOrderAmount(convertedValue);

    // const selectedAccountTypeDemo = selectedAccountType.value === 'DEMO';
    // if (
    //   selectedAccountTypeDemo &&
    //   +valueToSet > botBalance.demo_balance &&
    //   partnerBotDatas.length > 0
    // ) {
    //   setOrderAmount(botBalance.demo_balance);
    //   // setOrderAmount(Math.round(botBalance.demo_balance * 100) / 100);
    // } else if (
    //   !selectedAccountTypeDemo &&
    //   +valueToSet > botBalance.balance &&
    //   partnerBotDatas.length > 0
    // ) {
    //   setOrderAmount(
    //     botBalance.balance.toLocaleString(undefined, {
    //       maximumFractionDigits: 3,
    //     })
    //   );
    //   // setOrderAmount(botBalance.balance);
    // } else {
    //   setOrderAmount(valueToSet);
    // }
  };

  const handleMultiplyAmount: CurrencyInputProps["onValueChange"] = (
    value,
    _,
    values
  ): void => {
    const valueToSet = value === undefined ? "" : value;
    const convertedValue = convertToThreeDecimalPlaces(valueToSet);
    // console.log('convertedValue', convertedValue);
    setMultiplyAmount(convertedValue);
    // if (+valueToSet > 100) {
    //   setMultiplyAmount(100);
    // } else {
    //   setMultiplyAmount(valueToSet);
    // }
  };

  const onSelectedAccountTypeChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: InputSelectOption
  ) => {
    setSelectedAccountType(option);
    setOrderAmount(1);
    dispatch(userActions.updateSelectedAccountType(option));
  };

  const onSelectedBotAccountChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: InputSelectOption
  ) => {
    setSelectedBotAccount(option);
    dispatch(userActions.updateSelectedBotAccount(option));
  };

  const getAllPartnerBots = useCallback(() => {
    axios
      .get(APIs.partnerAccount)
      .then((res) => {
        const datas: BotData[] = res.data;
        const partnerBotDatas = datas.filter(
          (data) => data.status === "active"
        );
        setPartnerBotDatas(partnerBotDatas);
        dispatch(userActions.updatePartnerBotDatas(partnerBotDatas));
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
        enqueueSnackbar("Không thể lấy bot datas", { variant: "error" });
      });
  }, [dispatch, enqueueSnackbar]);

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

  const getCurrentSessionByLocalTime = useCallback(() => {
    // GET START SESSION AND CONSTANTS
    const currentSecond = moment().second() - 1;
    const MAXIMUM_SECOND_IN_A_MINUTE = 60;
    const START_SESSION_SECOND_CONVERTED = +moment(startSession.st_time).format(
      "ss"
    );

    const START_SESSION =
      START_SESSION_SECOND_CONVERTED <= 30
        ? START_SESSION_SECOND_CONVERTED
        : Math.abs(30 - START_SESSION_SECOND_CONVERTED);

    // RETRIEVE START SESSION TYPE
    let middleSessionType: string;
    let notMiddleSessionType: string;
    if (START_SESSION_SECOND_CONVERTED <= 30) {
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
      // console.log('15 <= sess < 45', currentSecond);
      timeLeft = START_SESSION + TIME_IN_ONE_SESSION - currentSecond;
    } else if (currentSecond >= START_SESSION + TIME_IN_ONE_SESSION) {
      // 45 <= sess < 60
      // console.log('45 <= sess < 60', currentSecond);
      const START_SESSION_UPPER = START_SESSION + TIME_IN_ONE_SESSION;
      timeLeft = START_SESSION_UPPER + TIME_IN_ONE_SESSION - currentSecond;
    } else {
      // 0 <= sess < 15
      // console.log('0 <= sess < 15', currentSecond);
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
      getAllPartnerBots();
    }
    if (timeLeft === 25 || timeLeft === 29) {
      callback(sessionType === "TRADE");
    }
    setSessionLocal({
      r_second: timeLeft,
      ss_t: sessionType,
    });
  }, [getAllPartnerBots, sessionId, startSession.ss_t, startSession.st_time]);

  const placeOrder = async (orderType: OrderType) => {
    const noLoadingAxios = axios.create();

    if (isMaster === 1) {
      // SELF ORDER
      const orderAmountConverted = +orderAmount.toString().replace(',', '');
      const order = {
        orderType,
        accountType: selectedAccountType.value.toString(),
        orderAmount: orderAmountConverted.toString(),
        botId: selectedBotAccount.value,
        fold: 1,
      };
      noLoadingAxios
        .post(APIs.placeOrder, order)
        .then((res) => {
          if (res.data.ok) {
            getBalance(selectedBotAccount.value);
            enqueueSnackbar(`Đặt lệnh $${orderAmount} thành công!`, {
              variant: 'success',
            });
          } else {
            enqueueSnackbar(`Đặt lệnh thất bại: ${res.data.m}`, {
              variant: 'error',
            });
          }
        })
        .catch((err) => {
          getCurrentSession();
          enqueueSnackbar('', {
            variant: 'error',
          });
        });
    } else {
      // MASTER ORDER
      const orderAmountConverted = +orderAmount.toString().replace(',', '');
      const order = {
        orderType,
        orderAmount: orderAmountConverted.toString(),
        botId: selectedBotAccount.value,
        fold: 1,
      };
      noLoadingAxios
        .post(APIs.placeCopyTradeOrder, order)
        .then((res) => {
          getBalance(selectedBotAccount.value);
          enqueueSnackbar('Đặt lệnh thành công!', {
            variant: 'success',
          });
        })
        .catch((err) => {
          getCurrentSession();
          enqueueSnackbar('Đặt lệnh thất bại', {
            variant: 'error',
          });
        });
    }
  };

  const getBalance = useCallback(
    (id: number | string) => {
      const noLoadingAxios = axios.create();
      noLoadingAxios
        .get(`${APIs.balanceById}${id}/`)
        .then((res) => {
          const data: BotBalance = res.data;
          dispatch(userActions.updateBotBalance(data));
          setBotBalance(data);
        })
        .catch(() => {
          enqueueSnackbar("Không thể lấy được số dư ví", {
            variant: "error",
          });
        });
    },
    [dispatch, enqueueSnackbar]
  );

  const getTotalFollow = useCallback(() => {
    axios
      .get(`${APIs.copyTradeTotalFollow}`)
      .then((res) => {
        const datas: CopyTradeTotalFollowResponse[] = res.data;
        if (datas.length > 0) {
          setTotalFollowData(datas[0]);
        }
      })
      .catch(() => {
        enqueueSnackbar("Không thể lấy được số dư ví", {
          variant: "error",
        });
      });
  }, [enqueueSnackbar]);

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

  // GET ALL PARTNER BOTS
  useEffect(() => {
    getAllPartnerBots();
    getTotalFollow();
  }, [getAllPartnerBots, getTotalFollow]);

  // GET BALANCE AND SET SELECTED BOT ACCOUNT
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
    }
  }, [
    partnerBotDatas,
    convertPartnerBotsToPartnerAccountOptions,
    getBalance,
    selectedAccountType,
    selectedBotAccount.value,
    dispatch,
    isPartnerBotInitialized,
  ]);

  const checkIsValidSubmit = () => {
    const orderAmountConverted = +orderAmount.toString().replace(",", "");
    const order = {
      orderType: OrderType.BUY,
      accountType: selectedAccountType.value.toString(),
      orderAmount: orderAmountConverted.toString(),
      botId: selectedBotAccount.value,
      fold: 1,
    };
    if (isMaster === 2 && isBuySellValid) {
      placeOrder(OrderType.BUY);
      return;
    }
    if (+orderAmount <= 0) {
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
      return;
    }
    if (partnerBotDatas.length > 0) {
      if (
        selectedAccountType.value === "DEMO" &&
        +orderAmount > botBalance.demo_balance
      ) {
        setModalAttributes((prev) => ({
          ...prev,
          isOpen: true,
          icon: images.copy.warning,
          headingMessage: "Giá trị lệnh không hợp lệ",
          message: (
            <>
              Giá trị lệnh của bạn đã vượt quá số dư <br /> tài khoản nguồn, vui
              lòng thử lại
            </>
          ),
          buttonMessage: "Xác nhận",
          handleOpen: handleOpenValidAmountPopupModal,
          handleClose: handleCloseValidAmountPopupModal,
        }));
        return;
      }
      if (
        selectedAccountType.value === "LIVE" &&
        +orderAmount > botBalance.balance
      ) {
        setModalAttributes((prev) => ({
          ...prev,
          isOpen: true,
          icon: images.copy.warning,
          headingMessage: "Giá trị lệnh không hợp lệ",
          message: (
            <>
              Giá trị lệnh của bạn đã vượt quá số dư tài khoản nguồn, vui lòng
              thử lại
            </>
          ),
          buttonMessage: "Xác nhận",
          handleOpen: handleOpenValidAmountPopupModal,
          handleClose: handleCloseValidAmountPopupModal,
        }));
        return;
      }
    }
    if (partnerBotDatas.length === 0 && isBuySellValid) {
      setModalAttributes((prev) => ({
        ...prev,
        isOpen: true,
        icon: images.copy.account_not_integrate,
        headingMessage: "Bạn chưa liên kết tài khoản",
        message: (
          <>
            Liên kết tài khoản ngay để thực hiện giao dịch cùng đội ngũ chuyên
            gia của BotLambotrade
          </>
        ),
        buttonMessage: "Liên kết tài khoản",
        handleOpen: handleOpenAccountTradePopupModal,
        handleClose: handleCloseAccountTradePopupModal,
      }));
    } else if (isBuySellValid) {
      placeOrder(OrderType.BUY);
    }
  };

  const isSessionTrading = sessionLocal.ss_t === "TRADE";

  // const isBuySellValid = isSessionTrading && partnerBotDatas.length > 0;
  const isBuySellValid = isSessionTrading;

  return (
    <>
      <div className="flex flex-col">
        <p className="p-6 2xl:py-5 py-4 border-b border-ink-10 bg-background-80 rounded-tl-3xl rounded-tr-3xl text-xl text-ink-100 font-semibold">
          Thông tin giao dịch
        </p>
        <div className="p-6 flex-grow flex flex-col bg-background-80 rounded-bl-3xl rounded-br-3xl">
          {isMaster !== 2 && (
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
                <div className="px-3 flex items-center justify-between">
                  <div className="flex items-center gap-x-2">
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
                  <p className="bg-primary-100 bg-clip-text text-transparent text-xl">
                    $
                    {selectedAccountType.value === "DEMO"
                      ? botBalance.demo_balance.toLocaleString("en-US", options)
                      : selectedAccountType.value === "LIVE"
                      ? botBalance.balance.toLocaleString("en-US", options)
                      : 0}
                  </p>
                </div>
              )}

              {partnerBotDatas.length === 0 && (
                <div className="mb-4 flex justify-between items-center">
                  <p className={`font-semibold text-sm text-gold`}>
                    Bạn chưa liên kết tài khoản Lambotradevới sàn, vui lòng ấn
                    vào nút thêm mới tài khoản giao dịch để thực hiện liên kết
                    tài khoản giao dịch
                  </p>
                </div>
              )}

              {partnerBotDatas.length === 0 && (
                <Link
                  to="/account_trade"
                  className="flex-grow flex items-center justify-center rounded-xl py-4 bg-primary-05 gap-x-[0.625rem] cursor-pointer"
                >
                  <img
                    className="w-[1.5rem]"
                    srcSet={images.copy.plus_gold}
                    alt="BotLambotrade"
                  />
                  <p className={`font-semibold text-gold`}>
                    Thêm mới tài khoản giao dịch
                  </p>
                </Link>
              )}
            </div>
          )}

          <p className="mb-4 text-sm text-ink-100">
            GIÁ TRỊ LỆNH
            {/* {isMaster ? 'GIÁ TRỊ LỆNH' : 'GIÁ TRỊ LỆNH'} */}
          </p>

          {/* <div className="flex justify-between gap-x-3 mb-4">
            {!isMaster && (
              <>
                <div
                  onClick={handleOrderAmountMinusOne}
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
                  value={orderAmount}
                  onValueChange={handleOrderAmount}
                  onFocus={() => {
                    setIsOrderAmountFocus(true);
                  }}
                  onBlur={() => {
                    setIsOrderAmountFocus(false);
                  }}
                  placeholder="Mời nhập số tiền"
                  prefix={'$ '}
                  step={1}
                  allowNegativeValue={false}
                  decimalsLimit={3}
                />
                <div
                  onClick={handleOrderAmountPlusOne}
                  className="p-4 bg-ink-05 border border-ink-20 hover:bg-ink-20 hover:border-ink-10 rounded-xl cursor-pointer"
                >
                  <img
                    className="w-[1.5rem]"
                    src={images.copy.plus_gold}
                    alt="BotLambotrade"
                  />
                </div>
              </>
            )}
            {isMaster && (
              <>
                <div
                  onClick={handleMultiplyAmountMinusOne}
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
                  value={multiplyAmount}
                  onValueChange={handleMultiplyAmount}
                  onFocus={() => {
                    setIsMultiplyAmountFocus(true);
                  }}
                  onBlur={() => {
                    setIsMultiplyAmountFocus(false);
                  }}
                  placeholder="Mời nhập hệ số"
                  prefix={'X '}
                  step={1}
                  allowNegativeValue={false}
                  decimalsLimit={3}
                />
                <div
                  onClick={handleMultiplyAmountPlusOne}
                  className="p-4 bg-ink-05 border border-ink-20 hover:bg-ink-20 hover:border-ink-10 rounded-xl cursor-pointer"
                >
                  <img
                    className="w-[1.5rem]"
                    src={images.copy.plus_gold}
                    alt="BotLambotrade"
                  />
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-6 gap-x-2 mb-4">
            {!isMaster &&
              PLUS_VALUES.map((value, index) => {
                let renderText = '+' + value;
                if (value === 'All') renderText = 'All';
                return (
                  <div
                    key={index * Math.random() * 100}
                    className="xl:px-3 xl:py-3 px-2 py-2 text-center bg-ink-05 hover:bg-ink-20 text-ink-100 rounded-xl cursor-pointer"
                    onClick={() => {
                      console.log('TYPE OF VALUE: ', typeof value);
                      // CHECK PARTNER BOT NOT INTEGRATED
                      if (partnerBotDatas.length === 0) {
                        if (typeof value === 'number') {
                          setOrderAmount((prev) => +prev + +value);
                        } else {
                          setModalAttributes((prev) => ({
                            ...prev,
                            isOpen: true,
                            icon: images.copy.account_not_integrate,
                            headingMessage: 'Bạn chưa liên kết tài khoản',
                            message: (
                              <>
                                Liên kết tài khoản ngay để thực hiện giao dịch
                                cùng đội ngũ chuyên gia của BotLambotrade
                              </>
                            ),
                            buttonMessage: 'Liên kết tài khoản',
                            handleOpen: handleOpenAccountTradePopupModal,
                            handleClose: handleCloseAccountTradePopupModal,
                          }));
                        }
                        return;
                      }

                      // CHECK IF PARTNER BOT ALREADY ASSOCIATED
                      const isDemoAccount =
                        selectedAccountType.value === 'DEMO';
                      if (isDemoAccount) {
                        const demoBalance = botBalance.demo_balance;
                        const plusAmount = +orderAmount + +value;
                        if (
                          typeof value === 'number' &&
                          plusAmount <= demoBalance
                        ) {
                          setOrderAmount((prev) => +prev + +value);
                        } else {
                          setOrderAmount(demoBalance);
                        }
                      }

                      if (!isDemoAccount) {
                        const liveBalance = botBalance.balance;
                        const plusAmount = +orderAmount + +value;
                        if (
                          typeof value === 'number' &&
                          plusAmount <= liveBalance
                        ) {
                          setOrderAmount((prev) => +prev + +value);
                        } else {
                          setOrderAmount(liveBalance);
                        }
                      }

                      // if (typeof value === 'number') {
                      //   setOrderAmount((prev) => +prev + +value);
                      // } else if () {
                      //   setOrderAmount(botBalance.demo_balance);
                      // } else {
                      //   setOrderAmount(botBalance.balance);
                      // }
                    }}
                  >
                    {renderText}
                  </div>
                );
              })}

            {isMaster &&
              MULTIPLY_VALUES.map((value, index) => {
                let renderText = 'X' + value;
                return (
                  <div
                    key={index * Math.random() * 100}
                    className="flex-grow xl:px-3 xl:py-3 px-2 py-2 text-center bg-ink-05 hover:bg-ink-20 text-ink-100 rounded-xl cursor-pointer"
                    onClick={() => {
                      setMultiplyAmount(value);
                    }}
                  >
                    {renderText}
                  </div>
                );
              })}
          </div> */}

          <div className="mb-4">
            {/* GIAO DICH CA NHAN */}
            {isMaster === 2 && (
              <CustomInputSpinner
                fullWidth={true}
                name="orderAmount"
                value={orderAmount}
                placeholder="Mời nhập giá trị lệnh"
                onValueChange={handleOrderAmount}
                onFocus={() => {
                  setIsOrderAmountFocus(true);
                }}
                onBlur={(e) => {
                  if (Number(e.target.value.replace("$", "").trim() || 0) <= 0)
                    setIsOrderAmountFocus(false);
                }}
                handleValueMinusOne={handleOrderAmountMinusOne}
                handleValuePlusOne={handleOrderAmountPlusOne}
                onFixedValueChange={(value: string | number) => {
                  // console.log('TYPE OF VALUE: ', typeof value);
                  // CHECK PARTNER BOT NOT INTEGRATED
                  if (partnerBotDatas.length === 0) {
                    if (typeof value === "number") {
                      setOrderAmount((prev) => +prev + +value);
                    } else {
                      setModalAttributes((prev) => ({
                        ...prev,
                        isOpen: true,
                        icon: images.copy.account_not_integrate,
                        headingMessage: "Bạn chưa liên kết tài khoản",
                        message: (
                          <>
                            Liên kết tài khoản ngay để thực hiện giao dịch cùng
                            đội ngũ chuyên gia của BotLambotrade
                          </>
                        ),
                        buttonMessage: "Liên kết tài khoản",
                        handleOpen: handleOpenAccountTradePopupModal,
                        handleClose: handleCloseAccountTradePopupModal,
                      }));
                    }
                    return;
                  }

                  // CHECK IF PARTNER BOT ALREADY ASSOCIATED
                  const isDemoAccount = selectedAccountType.value === "DEMO";
                  if (isDemoAccount) {
                    const demoBalance = botBalance.demo_balance;
                    const plusAmount = +value;
                    // +orderAmount + +value
                    if (
                      typeof value === "number" &&
                      plusAmount <= demoBalance
                    ) {
                      setOrderAmount((prev) => +prev + plusAmount);
                    } else {
                      setOrderAmount(demoBalance);
                    }
                  }

                  if (!isDemoAccount) {
                    const liveBalance = botBalance.balance;
                    const plusAmount = +orderAmount + +value;
                    if (
                      typeof value === "number" &&
                      plusAmount <= liveBalance
                    ) {
                      setOrderAmount((prev) => +prev + +value);
                    } else {
                      setOrderAmount(liveBalance);
                    }
                  }
                }}
                prefix={"$ "}
                PREFIX_VALUE="+"
                VALUES={PLUS_VALUES}
              />
            )}

            {/* GIAO DICH CHUYEN GIA */}
            {isMaster === 2 && (
              /*<CustomInputSpinner
                fullWidth={true}
                name="multiplyAmount"
                value={multiplyAmount}
                placeholder="Mời nhập hệ số"
                onValueChange={handleMultiplyAmount}
                onFocus={() => {
                  setIsMultiplyAmountFocus(true);
                }}
                onBlur={() => {
                  setIsMultiplyAmountFocus(false);
                }}
                handleValueMinusOne={handleMultiplyAmountMinusOne}
                handleValuePlusOne={handleMultiplyAmountPlusOne}
                onFixedValueChange={(value: string | number) => {
                  setMultiplyAmount(value);
                }}
                prefix={'X '}
                PREFIX_VALUE="X"
                VALUES={MULTIPLY_VALUES}
              />
              */
              <CustomInputSpinner
                fullWidth={true}
                name="orderAmount"
                value={orderAmount}
                placeholder="Mời nhập giá trị lệnh"
                onValueChange={handleOrderAmount}
                onFocus={() => {
                  setIsOrderAmountFocus(true);
                }}
                onBlur={(e) => {
                  if (Number(e.target.value.replace("$", "").trim() || 0) <= 0)
                    setIsOrderAmountFocus(false);
                }}
                handleValueMinusOne={handleOrderAmountMinusOne}
                handleValuePlusOne={handleOrderAmountPlusOne}
                onFixedValueChange={(value: string | number) => {
                  // console.log('TYPE OF VALUE: ', typeof value);
                  // CHECK PARTNER BOT NOT INTEGRATED
                  // if (partnerBotDatas.length === 0) {
                  //   if (typeof value === 'number') {
                  //     setOrderAmount((prev) => +prev + +value);
                  //   } else {
                  //     setModalAttributes((prev) => ({
                  //       ...prev,
                  //       isOpen: true,
                  //       icon: images.copy.account_not_integrate,
                  //       headingMessage: 'Bạn chưa liên kết tài khoản',
                  //       message: (
                  //         <>
                  //           Liên kết tài khoản ngay để thực hiện giao dịch cùng
                  //           đội ngũ chuyên gia của BotLambotrade
                  //         </>
                  //       ),
                  //       buttonMessage: 'Liên kết tài khoản',
                  //       handleOpen: handleOpenAccountTradePopupModal,
                  //       handleClose: handleCloseAccountTradePopupModal,
                  //     }));
                  //   }
                  //   return;
                  // }

                  // CHECK IF PARTNER BOT ALREADY ASSOCIATED
                  const isDemoAccount = selectedAccountType.value === "DEMO";
                  if (isDemoAccount) {
                    const demoBalance = botBalance.demo_balance;
                    const plusAmount = +orderAmount + +value;
                    if (
                      typeof value === "number" &&
                      plusAmount <= demoBalance
                    ) {
                      setOrderAmount((prev) => +prev + +value);
                    } else {
                      setOrderAmount(demoBalance);
                    }
                  }

                  if (!isDemoAccount) {
                    const liveBalance = botBalance.balance;
                    const plusAmount = +orderAmount + +value;
                    if (
                      typeof value === "number" &&
                      plusAmount <= liveBalance
                    ) {
                      setOrderAmount((prev) => +prev + +value);
                    } else {
                      setOrderAmount(liveBalance);
                    }
                  }
                }}
                prefix={"$ "}
                PREFIX_VALUE="+"
                VALUES={PLUS_VALUES}
              />
            )}
          </div>

          {isMaster !== 2 && (
            <div className="mb-9 p-4 flex justify-between items-center bg-ink-05 rounded-2xl">
              <p>
                LỢI NHUẬN{" "}
                <span className="px-2 bg-ink-10 rounded-lg text-green-100 font-semibold">
                  95%
                </span>
              </p>
              <p
                className={`text-xl ${
                  +orderAmount >= 0 ? "text-green-100" : "text-red-100"
                } font-semibold`}
              >
                {+orderAmount >= 0 ? "+" : "-"}$
                {(+orderAmount * 0.95).toLocaleString("en-US", options)}
              </p>
            </div>
          )}

          <div className="mt-auto">
            <button
              className={`py-4 mb-3 flex justify-center gap-x-[0.625rem] w-full rounded-2xl font-semibold ${
                isBuySellValid ? "bg-green-100" : "bg-ink-10 cursor-not-allowed"
              }`}
              onClick={() => {
                // if(!(typeof orderAmount === 'number') || orderAmount <= 0){
                //   setModalAttributes((prev) => ({
                //     ...prev,
                //     isOpen: true,
                //     icon: images.copy.warning,
                //     headingMessage: 'Giá trị lệnh không hợp lệ',
                //     message: (
                //       <>
                //         Giá trị lệnh phải lớn hơn <span className="font-bold">0</span>
                //       </>
                //     ),
                //     buttonMessage: 'Xác nhận',
                //     handleOpen: handleOpenValidAmountPopupModal,
                //     handleClose: handleCloseValidAmountPopupModal,
                //   }));
                //   return
                // }
                // if (partnerBotDatas.length === 0 && isBuySellValid) {
                //   setModalAttributes((prev) => ({
                //     ...prev,
                //     isOpen: true,
                //     icon: images.copy.account_not_integrate,
                //     headingMessage: 'Bạn chưa liên kết tài khoản',
                //     message: (
                //       <>
                //         Liên kết tài khoản ngay để thực hiện giao dịch cùng đội
                //         ngũ chuyên gia của BotLambotrade
                //       </>
                //     ),
                //     buttonMessage: 'Liên kết tài khoản',
                //     handleOpen: handleOpenAccountTradePopupModal,
                //     handleClose: handleCloseAccountTradePopupModal,
                //   }));
                // } else if (isBuySellValid) {
                //   placeOrder(OrderType.BUY);
                // }
                checkIsValidSubmit();
              }}
            >
              <span
                className={`${
                  isBuySellValid
                    ? "text-ink-100"
                    : "bg-primary-60 bg-clip-text text-transparent"
                }`}
              >
                Mua
              </span>
              {isBuySellValid ? (
                <img
                  className="w-[1.5rem]"
                  src={images.copy.buy}
                  alt="BotLambotrade"
                />
              ) : (
                <img
                  className="w-[1.5rem]"
                  src={images.copy.buy_disabled}
                  alt="BotLambotrade"
                />
              )}
            </button>

            <div className="py-4 mb-3 flex justify-center gap-x-[0.625rem] w-full rounded-2xl bg-ink-05 font-semibold">
              <p className="bg-primary-100 bg-clip-text text-transparent font-medium">
                Phiên {sessionId} :{" "}
                {isSessionTrading ? "Hãy đặt lệnh" : "Chờ kết quả"} (
                {sessionLocal.r_second}
                s)
              </p>
            </div>

            <button
              className={`py-4 flex justify-center gap-x-[0.625rem] w-full rounded-2xl font-semibold ${
                isBuySellValid ? "bg-red-100" : "bg-ink-10 cursor-not-allowed"
              }`}
              onClick={() => {
                if (partnerBotDatas.length === 0 && isBuySellValid) {
                  setModalAttributes((prev) => ({
                    ...prev,
                    isOpen: true,
                    icon: images.copy.account_not_integrate,
                    headingMessage: "Bạn chưa liên kết tài khoản",
                    message: (
                      <>
                        Liên kết tài khoản ngay để thực hiện giao dịch cùng đội
                        ngũ chuyên gia của BotLambotrade
                      </>
                    ),
                    buttonMessage: "Liên kết tài khoản",
                    handleOpen: handleOpenAccountTradePopupModal,
                    handleClose: handleCloseAccountTradePopupModal,
                  }));
                } else if (isBuySellValid) {
                  placeOrder(OrderType.SELL);
                }
              }}
            >
              <span
                className={`${
                  isBuySellValid
                    ? "text-ink-100"
                    : "bg-primary-60 bg-clip-text text-transparent"
                }`}
              >
                Bán
              </span>
              {isSessionTrading &&
              +orderAmount > 0 &&
              partnerBotDatas.length > 0 ? (
                <img
                  className="w-[1.5rem]"
                  src={images.copy.sell}
                  alt="BotLambotrade"
                />
              ) : (
                <img
                  className="w-[1.5rem]"
                  src={images.copy.sell_disabled}
                  alt="BotLambotrade"
                />
              )}
            </button>
          </div>
        </div>

        {isMaster === 2 && partnerBotDatas.length > 0 && (
          <div className="text-sm text-ink-80">
            <div className="mt-6 mb-6 p-6 flex items-center justify-between bg-ink-05 rounded-3xl">
              <div className="flex items-center gap-x-3">
                <img
                  className="w-[2rem]"
                  src={images.copy.follower}
                  alt="BotLambotrade"
                />
                <p>Tổng số người đang theo dõi bạn</p>
              </div>
              <div className="px-[0.875rem] py-1 rounded-lg bg-primary-10">
                <p className="bg-primary-100 bg-clip-text text-transparent text-base font-bold">
                  {totalFollowData.totalfollow}
                </p>
              </div>
            </div>

            <div className="p-6 flex items-center justify-between bg-ink-05 rounded-3xl">
              <div className="flex items-center gap-x-3">
                <img
                  className="w-[2rem]"
                  src={images.copy.settings_enabled}
                  alt="BotLambotrade"
                />
                <p>Tổng số cấu hình bạn đang bật</p>
              </div>
              <div className="px-[0.875rem] py-1 rounded-lg bg-primary-10">
                <p className="bg-primary-100 bg-clip-text text-transparent text-base font-bold">
                  {totalFollowData.totalfollowactive}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

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

export default CopyTradeInformation;
