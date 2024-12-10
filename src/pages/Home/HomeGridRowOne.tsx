import APIs from "apis";
import images from "assets";
import axios from "axios";
import CustomButton from "components/CustomButton";
import CustomModalWithHeader from "components/CustomModalWithHeader";
import TextInput from "components/TextInput";
import { useEnqueueSnackbar } from "hooks/useEnqueueSnackbar";
import { useCallback, useDeferredValue, useEffect, useState } from "react";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { uiActions } from "stores/uiSlice";
import { userActions } from "stores/userSlice";
import HomeWalletSvg from "svgs/HomeWalletSvg";
import BotAimMaxMin from "types/BotAimMaxMin";
import { BotBalance } from "types/BotBalance";
import BotData from "types/BotData";
import InputSelectOption from "types/InputSelectOption";
import DashboardResetRequest from "types/requests/DashboardResetRequest";
import DashboardResponse from "types/responses/DashboardResponse";
import convertToThreeDecimalPlaces from "utils/ConvertToThreeDecimalPlaces";
import fixNumber from "utils/fixNumber";
import _isEmpty from "../../utils/isEmpty";
import HomeBalanceInput from "./HomeBalanceInput";
import HomeSelectInput from "./HomeSelectInput";

interface InputValueState {
  error: null | string;
  touched: boolean;
}

const INITIAL_BOT_BALANCE = {
  balance: 1,
  demo_balance: 1,
  usdt_balance: 1,
};

const INITIAL_BOT_AIM_MAX_MIN = [
  {
    aim_min: 0,
    aim_max: 0,
    created_at: "",
    updated_at: "",
  },
];

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

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: "decimal",
};

const INITIAL_INPUT_VALUE_STATE: InputValueState = {
  error: null,
  touched: false,
};

const HomeGridRowOne = () => {
  // const [profitTakeAmount, setProfitTakeAmount] = useState<string | number>(
  //   1000000
  // );
  // const [stopLossAmount, setStopLossAmount] = useState<string | number>(500000);
  const [botBalance, setBotBalance] = useState<BotBalance>(INITIAL_BOT_BALANCE);
  const [selectedAccountType, setSelectedAccountType] =
    useState<InputSelectOption>(INITIAL_SELECTED_ACCOUNT_TYPE);
  const [selectedBotAccount, setSelectedBotAccount] =
    useState<InputSelectOption>(INITIAL_SELECTED_OPTION);
  const [accountOptions, setAccountOptions] = useState<InputSelectOption[]>(
    INITIAL_SELECT_OPTIONS
  );
  const [partnerBotDatas, setPartnerBotDatas] = useState<BotData[]>([]);
  const [botAimMaxMin, setBotAimMaxMin] = useState<BotAimMaxMin[]>(
    INITIAL_BOT_AIM_MAX_MIN
  );
  const isDesktop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px)",
  });

  // INITIAL PARTNER BOT USEFFECT
  const [isPartnerBotInitialized, setIsPartnerBotInitialized] = useState(false);

  // Dashboard
  const [dashboardResponse, setDashboardResponse] = useState<DashboardResponse>(
    {
      id: 0,
      date: "",
      owner: 0,
      current_profit: 0,
      volume: 0,
      profit: 0,
      total_win: 0,
      total_lose: 0,
      account_type: "",
      total_draft: 0,
      created_at: "",
      updated_at: "",
    }
  );

  // MODAL
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isTransferByUSDT, setIsTransferByUSDT] = useState(true);
  const [transferAmount, setTransferAmount] = useState<string | number>(0);
  const [transferState, setTransferState] = useState<InputValueState>(
    INITIAL_INPUT_VALUE_STATE
  );
  const deferredTransferAmount = useDeferredValue(transferAmount);

  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

  const handleOpenTransferPopupModal = () => {
    getBalance(selectedBotAccount.value);
    setIsTransferModalOpen(true);
  };

  const handleCloseTransferPopupModal = () => {
    setIsTransferModalOpen(false);
    setTransferAmount(0);
    setTransferState(INITIAL_INPUT_VALUE_STATE);
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

  const handleProfitTakeAmount: CurrencyInputProps["onValueChange"] = (
    value,
    _,
    values
  ): void => {
    // const valueToSet = value === undefined || +value <= 0 ? 0 : value || ' ';
    const valueToSet = value === undefined ? "" : value;
    const botAimMaxMinToUpdate = [...botAimMaxMin];
    const convertedValue = convertToThreeDecimalPlaces(valueToSet);
    botAimMaxMinToUpdate[0].aim_max = convertedValue;

    setBotAimMaxMin(botAimMaxMinToUpdate);
    // setBotAimMaxMin((prev) => ({
    //   ...prev,
    //   aim_max: valueToSet,
    // }));
  };

  const handleTransferUSDT = () => {
    const transferData = {
      PartnerAcc_id: selectedBotAccount.value,
      amount: transferAmount,
    };

    if (isTransferByUSDT) {
      axios
        .post(`${APIs.transferUSDTToLive}`, transferData)
        .then((res) => {
          getBalance(selectedBotAccount.value);
          enqueueSnackbar("Chuyển tiền thành công!", {
            variant: "success",
          });
        })
        .catch((err) => {
          enqueueSnackbar("Có lỗi xảy ra", {
            variant: "error",
          });
        });
    } else {
      axios
        .post(`${APIs.transferLiveToUSDT}`, transferData)
        .then((res) => {
          getBalance(selectedBotAccount.value);
          enqueueSnackbar("Chuyển tiền thành công!", {
            variant: "success",
          });
        })
        .catch((err) => {
          enqueueSnackbar("Có lỗi xảy ra", {
            variant: "error",
          });
        });
    }
  };

  const handleStopLossAmount: CurrencyInputProps["onValueChange"] = (
    value,
    _,
    values
  ): void => {
    // const valueToSet = value === undefined || +value <= 0 ? 0 : value || ' ';
    const valueToSet = value === undefined ? "" : value;
    const botAimMaxMinToUpdate = [...botAimMaxMin];
    const convertedValue = convertToThreeDecimalPlaces(valueToSet);
    botAimMaxMinToUpdate[0].aim_min = convertedValue;

    setBotAimMaxMin(botAimMaxMinToUpdate);
    // setBotAimMaxMin((prev) => ({
    //   ...prev,
    //   aim_min: valueToSet,
    // }));
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
      })
      .catch((err) => {
        enqueueSnackbar("Không thể lấy bot datas!", {
          variant: "error",
        });
      });
  }, [enqueueSnackbar]);

  const getDashboardMetric = useCallback(() => {
    axios
      .get(APIs.dashboard)
      .then((res) => {
        const datas: DashboardResponse[] = res.data;
        if (datas.length > 0) {
          setDashboardResponse(datas[0]);
        }
      })
      .catch((err) => {
        enqueueSnackbar("Không thể lấy dashboard metric!", {
          variant: "error",
        });
      });
  }, [enqueueSnackbar]);

  const resetDashboardByField = (request: DashboardResetRequest) => {
    axios
      .patch(`${APIs.dashboardReset}${dashboardResponse.id}/`, request)
      .then((res) => {
        getDashboardMetric();
        enqueueSnackbar("Làm mới thành công!", {
          variant: "success",
        });
      })
      .catch((err) => {
        enqueueSnackbar("Không thể làm mới!", {
          variant: "error",
        });
      });
  };

  const getBalance = useCallback(
    (id: number | string) => {
      axios
        .get(`${APIs.balanceById}${id}/`)
        .then((res) => {
          const data: BotBalance = res.data;
          setBotBalance(data);
        })
        .catch(() => {
          enqueueSnackbar("Không thể lấy được số dư ví!", {
            variant: "error",
          });
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

  const getBotAimMaxMin = useCallback(() => {
    axios
      .get(APIs.aim)
      .then((res) => {
        console.log(res.data);
        setBotAimMaxMin(res.data);
      })
      .catch((err) => {
        enqueueSnackbar("Lấy mục tiêu thất bại", { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const updateBotAimMaxMin = useCallback(() => {
    const aimMaxMinToUpdate: BotAimMaxMin = {
      aim_max: botAimMaxMin[0].aim_max,
      aim_min: botAimMaxMin[0].aim_min,
    };
    axios
      .post(APIs.aim, aimMaxMinToUpdate)
      .then((res) => {
        enqueueSnackbar("Lưu mục tiêu thành công", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Lưu mục tiêu thất bại", { variant: "error" });
      });
  }, [botAimMaxMin, enqueueSnackbar]);

  const resetBotAimMaxMin = useCallback(() => {
    const aimMaxMinToUpdate: BotAimMaxMin = {
      aim_max: 0,
      aim_min: 0,
    };
    axios
      .post(APIs.aim, aimMaxMinToUpdate)
      .then((res) => {
        getBotAimMaxMin();
        enqueueSnackbar("Làm mới mục tiêu thành công", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Làm mới mục tiêu thất bại", { variant: "error" });
      });
  }, [enqueueSnackbar, getBotAimMaxMin]);

  const convertPartnerBotsToPartnerAccountOptions = useCallback(() => {
    if (partnerBotDatas && partnerBotDatas.length > 0) {
      const accountOptions = partnerBotDatas.map((botData) => ({
        value: botData.id,
        label: botData.botname,
      }));
      setAccountOptions(accountOptions);
    }
  }, [partnerBotDatas]);

  const showIsDevelopingModal = () => {
    dispatch(uiActions.updateIsModalOpen(true));
  };

  useEffect(() => {
    getAllPartnerBots();
  }, [getAllPartnerBots]);

  useEffect(() => {
    getBotAimMaxMin();
  }, [getBotAimMaxMin]);

  useEffect(() => {
    getDashboardMetric();
  }, [getDashboardMetric]);

  useEffect(() => {
    if (_isEmpty(deferredTransferAmount) && transferState.touched) {
      setTransferState((prev) => ({
        ...prev,
        error: "Transfer amount cannot be empty",
      }));
    } else if (
      isTransferByUSDT &&
      transferState.touched &&
      +deferredTransferAmount > +botBalance.usdt_balance
    ) {
      setTransferState((prev) => ({
        ...prev,
        error: "Transfer amount cannot be greater than balance",
      }));
    } else if (
      !isTransferByUSDT &&
      transferState.touched &&
      +deferredTransferAmount > +botBalance.balance
    ) {
      setTransferState((prev) => ({
        ...prev,
        error: "Transfer amount cannot be greater than balance",
      }));
    } else {
      setTransferState((prev) => ({
        ...prev,
        error: null,
      }));
    }
  }, [deferredTransferAmount]);

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

  const isTransferError =
    !transferState.touched ||
    (transferState.touched && Boolean(transferState.error));

  return (
    <>
      <div
        className={`grid ${isDesktop ? "grid-cols-3" : "grid-cols-1"
          } gap-6 mb-6`}
      >
        {/* GRID 1 */}
        <div className="flex flex-col p-6 bg-background-80 rounded-3xl">
          {/* Trade Account */}
          <div className="flex mb-8 gap-x-5 text-ink-100/80">
            <img
              className="w-[3.5rem]"
              src={images.home.gold_wallet}
              alt="BotLambotrade"
            />
            <div>
              <p className="pb-2">Tài khoản giao dịch</p>
              <img
                className="w-[7.8125rem]"
                src={images.home.fibo_win}
                alt="BotLambotrade"
              />
            </div>
          </div>
          {/* Select Trade Account */}
          <div className="p-4 mb-6 bg-ink-05 rounded-2xl">
            <HomeBalanceInput
              selectedAccountType={selectedAccountType}
              selectedBotAccount={selectedBotAccount}
              onSelectedAccountTypeChange={onSelectedAccountTypeChange}
              onSelectedBotAccountChange={onSelectedBotAccountChange}
              accountOptions={accountOptions}
              botBalance={botBalance}
              partnerBotDatas={partnerBotDatas}
            // reloadDemoBalance={reloadDemoBalance}
            />
          </div>
          {/* Buttons */}
          <div
            className={`flex ${!isDesktop && !isTablet ? "flex-col" : ""
              } items-center gap-4 mt-auto`}
          >
            {partnerBotDatas &&
              partnerBotDatas.length > 0 &&
              selectedAccountType.value === "LIVE" && (
                <>
                  <div
                    className="flex-grow flex items-center justify-center rounded-xl py-4 w-full bg-primary-05 gap-x-[0.625rem] cursor-pointer"
                    onClick={() => {
                      handleOpenTransferPopupModal();
                    }}
                  >
                    <img
                      className="w-[1.5rem]"
                      srcSet={images.home.gold_trade}
                      alt="BotLambotrade"
                    />
                    <p className={`font-semibold text-gold`}>Chuyển tiền</p>
                  </div>
                  {/* <div
                  className="flex-grow flex items-center justify-center rounded-xl py-4 w-full bg-primary-05 gap-x-[0.625rem] cursor-pointer"
                  onClick={() => {
                    showIsDevelopingModal();
                  }}
                >
                  <img
                    className="w-[1.5rem]"
                    srcSet={images.home.gold_trade}
                    alt="BotLambotrade"
                  />
                  <p className={`font-semibold text-gold`}>Quản lý ví</p>
                </div> */}
                </>
              )}

            {partnerBotDatas.length > 0 &&
              selectedAccountType.value === "DEMO" && (
                <div
                  className="flex-grow flex items-center justify-center rounded-xl py-4 w-full bg-primary-05 gap-x-[0.625rem] cursor-pointer"
                  onClick={() => {
                    reloadDemoBalance(selectedBotAccount.value);
                  }}
                >
                  <img
                    className="w-[1.5rem]"
                    srcSet={images.home.reload}
                    alt="BotLambotrade"
                  />
                  <p className={`font-semibold text-gold`}>Làm mới số dư ví</p>
                </div>
              )}

            {partnerBotDatas.length === 0 && (
              <Link
                to="/account_trade"
                className="flex-grow flex items-center justify-center rounded-xl py-4 w-full bg-primary-05 gap-x-[0.625rem] cursor-pointer"
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
        </div>

        {/* GRID 2 */}
        <div className="flex flex-col justify-between p-6 bg-background-80 rounded-3xl">
          {/* Lợi nhuận ngày  */}
          <div className="flex mb-8 gap-x-5 text-ink-100/80">
            <img
              className="w-[3.5rem] flex-shrink-0"
              src={images.home.profit}
              alt="BotLambotrade"
            />
            <div className="flex-grow">
              <p className="pb-1">Lợi nhuận ngày</p>
              <p
                className={`text-3.5xl font-semibold  ${dashboardResponse.current_profit >= 0
                  ? "text-green-100"
                  : "text-red-100"
                  }`}
              >
                {dashboardResponse.current_profit >= 0 ? "$" : "-$"}
                {Math.abs(dashboardResponse.current_profit).toLocaleString(
                  "en-US",
                  options
                )}
              </p>
            </div>
            <img
              className="cursor-pointer w-[2.75rem]"
              src={images.home.bg_reload}
              alt="BotLambotrade"
              onClick={() => {
                // showIsDevelopingModal();
                // getDashboardMetric();
                const dashboardRequestId: DashboardResetRequest = {
                  current_profit: 0,
                };
                resetDashboardByField(dashboardRequestId);
              }}
            />
          </div>
          <hr className="mb-8 border-white/10" />

          {/* Volume ngày */}
          <div className="flex mb-8 gap-x-5 text-ink-100/80">
            <img
              className="w-[3.5rem] flex-shrink-0"
              src={images.home.volume}
              alt="BotLambotrade"
            />
            <div className="flex-grow">
              <p className="pb-1">Volume ngày</p>
              <p className="text-teal-100 text-3.5xl font-semibold">
                ${dashboardResponse.volume.toLocaleString("en-US", options)}
              </p>
            </div>
            <img
              className="cursor-pointer w-[2.75rem]"
              src={images.home.bg_reload}
              alt="BotLambotrade"
              onClick={() => {
                // showIsDevelopingModal();
                // getDashboardMetric();
                const dashboardRequestId: DashboardResetRequest = {
                  volume: 0,
                };
                resetDashboardByField(dashboardRequestId);
              }}
            />
          </div>
          <hr className="mb-8 border-white/10" />

          {/* Win/ Lose */}
          <div className="flex gap-x-5 text-ink-100/80">
            <img
              className="w-[3.5rem] flex-shrink-0"
              src={images.home.win_lose}
              alt="BotLambotrade"
            />
            <div className="flex-grow">
              <p className="pb-1">Win/ Lose</p>
              <p className="text-3.5xl font-semibold">
                <span className="text-green-100">
                  {dashboardResponse.total_win}
                </span>{" "}
                <span className="text-black-opacity-40">/</span>{" "}
                <span className="text-red-100">
                  {dashboardResponse.total_lose}
                </span>
              </p>
            </div>
            <img
              className="cursor-pointer w-[2.75rem]"
              src={images.home.bg_reload}
              alt="BotLambotrade"
              onClick={() => {
                // showIsDevelopingModal();
                // getDashboardMetric();
                const dashboardRequestId: DashboardResetRequest = {
                  total_win: 0,
                  total_lose: 0,
                };
                resetDashboardByField(dashboardRequestId);
              }}
            />
          </div>
        </div>

        {/* GRID 3 */}
        <div className="flex flex-col p-6 bg-background-80 rounded-3xl">
          {/* Mục tiêu */}
          <div className="flex mb-8 gap-x-5 text-ink-100/80">
            <img
              className="w-[3.5rem] flex-shrink-0"
              src={images.home.aim}
              alt="BotLambotrade"
            />
            <div>
              <p className="pb-2 font-semibold text-ink-100">
                Mục tiêu chốt lợi nhuận ngày
              </p>
              <p className="3xl:text-sm 2xl:text-xs text-ink-80">
                Thiết lập mục tiêu sẽ giúp bạn chốt được lợi nhuận mong muốn và
                dễ dàng quản lý rủi ro
              </p>
            </div>
          </div>
          {/* Select Trade Account */}
          <div>
            <div className="flex items-center justify-between mb-6 cursor-pointer">
              <div className="flex-grow">
                <div className="relative">
                  <div className="absolute flex items-center pt-[6px] pl-3 pointer-events-none">
                    <label
                      htmlFor="default-search"
                      className="mb-2 text-xs text-ink-60"
                    >
                      Chốt lãi
                    </label>
                  </div>
                  {/* <input
                  type="text"
                  id="default-search"
                  className="block w-full pt-6 pb-1 pl-3 pr-6 text-xl font-bold text-green-100 border border-ink-20 rounded-xl bg-ink-05 focus:ring-blue-500 focus:border-blue-500 placeholder-black-opacity-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Chốt lãi"
                  value={profitOrderAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/\D/, '');
                    setProfitOrderAmount(+newValue);
                  }}
                  pattern="[0-9]*"
                  required
                /> */}
                  <CurrencyInput
                    className="block w-full pt-6 pb-1 pl-3 pr-6 text-xl font-bold text-green-100 border border-ink-20 rounded-xl bg-ink-05 focus:ring-blue-500 focus:border-blue-500 placeholder-black-opacity-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={botAimMaxMin[0].aim_max}
                    onValueChange={handleProfitTakeAmount}
                    placeholder="Mời nhập số tiền"
                    // prefix={'$'}
                    step={1}
                    allowNegativeValue={false}
                    decimalsLimit={3}
                  />

                  <p className="absolute flex items-center text-green-100 pointer-events-none top-6 right-3">
                    $
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 cursor-pointer">
              <div className="flex-grow">
                <div className="relative">
                  <div className="absolute flex items-center pt-[6px] pl-3 pointer-events-none">
                    <label
                      htmlFor="default-search"
                      className="mb-2 text-xs text-ink-60"
                    >
                      Cắt lỗ
                    </label>
                  </div>
                  {/* <input
                  type="text"
                  id="default-search"
                  className="block w-full pt-6 pb-1 pl-3 pr-6 text-xl font-bold text-red-100 border border-ink-20 rounded-xl bg-ink-05 focus:ring-blue-500 focus:border-blue-500 placeholder-black-opacity-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Chốt lãi"
                  value={stopLossAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/\D/, '');
                    setStopLossAmount(+newValue);
                  }}
                  pattern="[0-9]*"
                  required
                /> */}
                  <CurrencyInput
                    className="block w-full pt-6 pb-1 pl-3 pr-6 text-xl font-bold text-red-100 border border-ink-20 rounded-xl bg-ink-05 focus:ring-blue-500 focus:border-blue-500 placeholder-black-opacity-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={botAimMaxMin[0].aim_min}
                    onValueChange={handleStopLossAmount}
                    placeholder="Mời nhập số tiền"
                    // prefix={'$'}
                    step={1}
                    allowNegativeValue={false}
                    decimalsLimit={3}
                  />

                  <p className="absolute flex items-center text-red-100 pointer-events-none top-6 right-3">
                    $
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-4">
              <p className="text-sm">Chốt lợi nhuận tổng:</p>
              {" "}
              <p className={`w-fit ${dashboardResponse.profit >= 0
                ? 'bg-green-100'
                : 'bg-red-100'
                } text-sm flex items-center justify-center px-2 rounded-[0.375rem] text-ink-100 leading-5`}>
                {dashboardResponse.profit >= 0 ? '$' : '-$'}
                {Math.abs(
                  dashboardResponse.profit
                ).toLocaleString('en-US', options)}
              </p>
            </div>
            <img
              className="cursor-pointer w-[2.75rem]"
              src={images.home.bg_reload}
              alt="BotLambotrade"
              onClick={() => {
                const dashboardRequestId: DashboardResetRequest = {
                  volume: 0,
                };
                resetDashboardByField(dashboardRequestId);
              }}
            />
          </div>
          {/* Buttons */}
          <div
            className={`flex ${!isDesktop && !isTablet ? "flex-col" : ""
              } items-center gap-4 mt-auto`}
          >
            <div
              className="flex-grow flex items-center justify-center rounded-xl py-4 w-full bg-primary-05 gap-x-[0.625rem] cursor-pointer"
              onClick={resetBotAimMaxMin}
            >
              <img
                className="w-[1.5rem]"
                srcSet={images.home.reload}
                alt="BotLambotrade"
              />
              <p className={`font-semibold text-gold`}>Làm mới mục tiêu</p>
            </div>
            <div
              className="flex-grow flex items-center justify-center rounded-xl py-4 w-full bg-primary-100 background-animation gap-x-[0.625rem] cursor-pointer"
              onClick={updateBotAimMaxMin}
            >
              <img
                className="w-[1.5rem]"
                srcSet={images.home.save_target}
                alt="BotLambotrade"
              />
              <p className={`font-semibold text-background-100`}>
                Lưu mục tiêu
              </p>
            </div>
          </div>
        </div>
      </div>

      <CustomModalWithHeader
        open={isTransferModalOpen}
        handleOpen={handleOpenTransferPopupModal}
        handleClose={handleCloseTransferPopupModal}
        title="Chuyển tiền"
        content={
          <div className="flex flex-col px-6 pt-6 pb-6">
            <div className="flex items-start justify-center gap-6 mb-9">
              <div className="flex-[1_1_100%] flex flex-col gap-3 text-center">
                <p className="text-sm font-semibold text-ink-100">
                  {isTransferByUSDT ? "USDT Wallet" : "Tài khoản thực"}
                </p>
                <p className="text-2xl font-semibold text-ink-100">
                  {isTransferByUSDT
                    ? fixNumber(botBalance.usdt_balance)
                    : fixNumber(botBalance.balance)}
                </p>
              </div>
              <div
                className="flex-shrink-0 p-3 rounded-full bg-primary-10"
                onClick={() => {
                  setIsTransferByUSDT((prev) => !prev);
                }}
              >
                <img
                  className="w-[1.5rem] cursor-pointer"
                  src={images.home.gold_trade}
                  alt="BotLambotrade"
                />
              </div>
              <div className="flex-[1_1_100%] flex flex-col gap-3 text-center">
                <p className="text-sm font-semibold text-ink-100">
                  {isTransferByUSDT ? "Tài khoản thực" : "USDT Wallet"}
                </p>
                <p className="text-2xl font-semibold text-ink-100">
                  {isTransferByUSDT
                    ? fixNumber(botBalance.balance)
                    : fixNumber(botBalance.usdt_balance)}
                </p>
              </div>
            </div>

            <TextInput
              id="transferAmount"
              name="transferAmount"
              type="number"
              label="Số tiền muốn chuyển"
              fullWidth
              value={fixNumber(transferAmount)}
              // onChange={(e) => {
              //   setTransferAmount((prev) => ({
              //     ...prev,
              //     value: e.target.value,
              //   }));
              // }}
              onValueChange={(value, _, values) => {
                const valueToSet = value === undefined ? "" : value;
                setTransferAmount(valueToSet);
                setTransferState((prev) => ({ ...prev, touched: true }));
              }}
              onBlur={() => {
                setTransferState((prev) => ({ ...prev, touched: true }));
              }}
              error={transferState.touched && Boolean(transferState.error)}
              helperText={transferState.touched && transferState.error}
              button={
                <CustomButton
                  onClick={() => {
                    const transferAmountToSet = isTransferByUSDT
                      ? botBalance.usdt_balance
                      : botBalance.balance;
                    setTransferAmount(transferAmountToSet.toString());
                    setTransferState({
                      touched: true,
                      error: null,
                    });
                  }}
                >
                  Tất cả
                </CustomButton>
              }
            />
          </div>
        }
        button={
          <div className="p-6">
            <CustomButton
              className={`!p-4 w-full text-base font-bold ${isTransferError ? "cursor-not-allowed" : ""
                }`}
              textClassName="font-bold"
              onClick={() => {
                if (transferState.touched && !transferState.error) {
                  handleTransferUSDT();
                }
              }}
              background={
                isTransferError ? "bg-background-60" : "bg-primary-100"
              }
              textColor={
                isTransferError ? "bg-primary-100" : "bg-background-100"
              }
            >
              Chuyển tiền
            </CustomButton>
          </div>
        }
      />
    </>
  );
};

export default HomeGridRowOne;
