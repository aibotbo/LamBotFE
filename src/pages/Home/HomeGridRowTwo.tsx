import images from 'assets';
import HomeWalletSvg from 'svgs/HomeWalletSvg';
import { useState, useEffect, useCallback } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import moment from 'moment';
import HomeLeftArrowSvg from 'svgs/HomeLeftArrowSvg';
import HomeRightArrowSvg from 'svgs/HomeRightArrowGoldSvg';
import HomeSelectInput from './HomeSelectInput';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import InputSelectOption from 'types/InputSelectOption';
import BotSetting, { BotSettingResult } from 'types/BotSetting';
import axios from 'axios';
import APIs from 'apis';
import { uiActions } from 'stores/uiSlice';
import GreyButton from 'components/GreyButton';
import { useEnqueueSnackbar } from 'hooks/useEnqueueSnackbar';
import BotData from 'types/BotData';
import DashboardResponse from 'types/responses/DashboardResponse';
import { useMediaQuery } from 'react-responsive';

const INITIAL_SELECTED_OPTION: InputSelectOption = {
  value: '',
  label: '',
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

const INITIAL_DASHBOARD_RESPONSE: DashboardResponse = {
  id: 0,
  date: '',
  owner: 0,
  current_profit: 0,
  volume: 0,
  profit: 0,
  total_win: 0,
  total_lose: 0,
  account_type: '',
  total_draft: 0,
  created_at: '',
  updated_at: '',
};

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const options: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: 'decimal',
};

const HomeGridRowTwo = () => {
  const [totalVolume, setTotalVolume] = useState(1500);
  const [totalProfit, setTotalProfit] = useState(5000);
  const [masterName, setMasterName] = useState('Lucas Tran');
  const [calendar, setCalendar] = useState<moment.Moment[][]>([]);
  const [currentMoment, setCurrentMoment] = useState(moment());
  const [monthUpDown, setMonthUpDown] = useState(0);
  const [volumeDate, setVolumeDate] = useState(20000);
  const [successVolume, setSuccessVolume] = useState(100000);

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

  // SETTINGS
  const [selectedBotSetting, setSelectedBotSetting] =
    useState<InputSelectOption>(INITIAL_SELECTED_OPTION);
  const [selectedBotSettingModal, setSelectedBotSettingModal] =
    useState<BotSettingResult>(INITIAL_BOT_SETTING_RESULT);
  const [partnerBotDatas, setPartnerBotDatas] = useState<BotData[]>([]);

  const [allBotSettingData, setAllBotSettingData] = useState<BotSetting>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [allBotSettingResults, setAllBotSettingResults] = useState<
    BotSettingResult[]
  >([]);
  const [allBotSettingOptions, setAllBotSettingOptions] = useState<
    InputSelectOption[]
  >([]);

  // Dashboard
  const [dashboardResponseMonthSum, setDashboardResponseMonthSum] =
    useState<DashboardResponse>(INITIAL_DASHBOARD_RESPONSE);

  const [dashboardResponseMonths, setDashboardResponseMonths] = useState<
    DashboardResponse[]
  >([INITIAL_DASHBOARD_RESPONSE]);

  // GLOBAL STATES
  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();
  const selectedBotAccount = useAppSelector(
    (state) => state.user.selectedBotAccount
  );

  const onSelectedBotSettingChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: InputSelectOption
  ) => {
    setSelectedBotSetting(option);
    if (option.value === -1)
      setSelectedBotSettingModal(INITIAL_BOT_SETTING_RESULT);
    for (const botSetting of allBotSettingResults) {
      if (botSetting.id === option.value) {
        setSelectedBotSettingModal(botSetting);
        break;
      }
    }
  };

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

  const getAllBotSettings = useCallback(() => {
    if (partnerBotDatas.length > 0) {
      const followerIds = partnerBotDatas.map((botData) =>
        botData.id.toString()
      );
      axios
        .get(
          `${APIs.listCopyTradeSetting}`
          // `${APIs.listCopyTradeMasterFollowedByFollowerIds}${followerIds.join(
          //   ','
          // )}`
        )
        .then((res) => {
          const data: BotSetting = res.data;
          setAllBotSettingData(data);
          setAllBotSettingResults(data.results);
        })
        .catch(() => {
          enqueueSnackbar('Không thể lấy bot settings!', {
            variant: 'error',
          });
        });
    }
  }, [enqueueSnackbar, partnerBotDatas]);

  const getDashboardMonthSum = useCallback(() => {
    if (partnerBotDatas.length > 0) {
      const startOfMonth = currentMoment.startOf('month').format('YYYY-MM-DD');
      const endOfMonth = currentMoment.endOf('month').format('YYYY-MM-DD');
      axios
        .get(`${APIs.dashboardMonthSum}${startOfMonth}/${endOfMonth}`)
        .then((res) => {
          const datas: DashboardResponse[] = res.data;
          if (datas.length > 0) {
            setDashboardResponseMonthSum(datas[0]);
          }
        })
        .catch(() => {
          enqueueSnackbar('Không thể lấy dashboard month sum!', {
            variant: 'error',
          });
        });
    }
  }, [currentMoment, enqueueSnackbar, partnerBotDatas.length]);

  const getDashboardMonth = useCallback(() => {
    if (partnerBotDatas.length > 0) {
      const startOfMonth = currentMoment.startOf('month').format('YYYY-MM-DD');
      const endOfMonth = currentMoment.endOf('month').format('YYYY-MM-DD');
      axios
        .get(`${APIs.dashboardMonth}${startOfMonth}/${endOfMonth}`)
        .then((res) => {
          const datas: DashboardResponse[] = res.data;
          if (datas.length > 0) {
            setDashboardResponseMonths(datas);
          }
        })
        .catch(() => {
          enqueueSnackbar('Không thể lấy dashboard month sum!', {
            variant: 'error',
          });
        });
    }
  }, [currentMoment, enqueueSnackbar, partnerBotDatas.length]);

  const convertSelectedBotSettingToBotSetting = useCallback(() => {
    if (selectedBotSetting) {
      const allBotSettingsOptions = allBotSettingResults.map((botSetting) => ({
        value: botSetting.id,
        label: botSetting.master_name,
      }));
      allBotSettingsOptions.unshift({
        value: -1,
        label: 'None',
      });
      setAllBotSettingOptions(allBotSettingsOptions);
    }
  }, [allBotSettingResults, selectedBotSetting]);

  const resetCurrentMonth = () => {
    console.log('Test');
    setMonthUpDown(0);
    setCurrentMoment(moment());
  };

  const handleSubtractOneMonth = () => {
    setMonthUpDown((prev) => prev - 1);
    setCurrentMoment(moment().add(monthUpDown - 1, 'month'));
  };

  const handlePlusOneMonth = () => {
    setMonthUpDown((prev) => prev + 1);
    setCurrentMoment(moment().add(monthUpDown + 1, 'month'));
  };

  useEffect(() => {
    const startDay = currentMoment.clone().startOf('month').startOf('isoWeek');
    const endDay = currentMoment.clone().endOf('month').endOf('isoWeek');
    const startDayMobile = currentMoment.clone().startOf('month');
    const endDayMobile = currentMoment.clone().endOf('month');
    const day = startDay.clone().subtract(1, 'day');
    const dayMobile = startDayMobile.clone().subtract(1, 'day');

    const a = [];
    if (isDesktop) {
      // if (deviceType === 'desktop') {
      console.log('HERE');
      const daysInWeek = 7;
      while (day.isBefore(endDay, 'day')) {
        a.push(
          Array(daysInWeek)
            .fill(0)
            .map(() => day.add(1, 'day').clone())
        );
      }
    } else {
      console.log('HERE 2');
      const daysInWeek = 3;
      while (dayMobile.isBefore(endDayMobile, 'day')) {
        console.log('AC');
        a.push(
          Array(daysInWeek)
            .fill(0)
            .map(() => dayMobile.add(1, 'day').clone())
        );
      }
    }
    console.log('HERE');
    setCalendar(a);
  }, [currentMoment, isDesktop, isTablet]);

  useEffect(() => {
    getAllBotSettings();
  }, [getAllBotSettings]);

  useEffect(() => {
    getAllPartnerBots();
  }, [getAllPartnerBots]);

  useEffect(() => {
    if (allBotSettingResults.length > 0) {
      convertSelectedBotSettingToBotSetting();
    }
  }, [allBotSettingResults.length, convertSelectedBotSettingToBotSetting]);

  useEffect(() => {
    getDashboardMonthSum();
  }, [getDashboardMonthSum]);

  useEffect(() => {
    getDashboardMonth();
  }, [getDashboardMonth]);

  const isCurrentMonthSelected =
    moment().month() === currentMoment.month() &&
    moment().year() === currentMoment.year();

  return (
    <div
      className={`grid ${isDesktop ? 'grid-cols-3' : 'grid-cols-1'} gap-6 mb-6`}
    >
      {/* GRID 1 */}
      <div className="bg-background-80 rounded-3xl p-6 flex flex-col">
        {/* Master name */}
        <div className="flex items-center gap-x-5 mb-8 text-ink-100/80">
          <img
            className="w-[3.5rem] flex-shrink-0"
            src={images.home.master_name}
            alt="BotLambotrade"
          />
          <div className="flex-grow">
            {/* <div className="py-2 pl-3 pr-4 bg-ink-05 rounded-2xl">
              <div className="flex justify-between items-center pb- cursor-pointer">
                <div>
                  <p className="pb-1 text-xs text-ink-60">Tên chuyên gia</p>
                  <p className="text-ink-100">Lucas Tran</p>
                </div>
                <img
                  className="w-[1.5rem]"
                  src={images.home.white_dropdown}
                  alt="BotLambotrade"
                />
              </div>
            </div> */}
            <HomeSelectInput
              label="Tên chuyên gia"
              inputValue={selectedBotSetting}
              onSelectChange={onSelectedBotSettingChange}
              options={allBotSettingOptions}
              isSearchEnabled={false}
            />
          </div>
        </div>

        {/* Account Type */}
        <div className="flex gap-x-5 mb-8 text-ink-100/80">
          <img
            className="w-[3.5rem] flex-shrink-0"
            src={images.home.account_type}
            alt="BotLambotrade"
          />
          <div className="flex flex-col justify-center">
            <p className="pb-1">Loại tài khoản</p>
            <p className="text-xl text-ink-100">
              {selectedBotSettingModal.id !== 0
                ? ACCOUNT_TYPES.filter(
                    (accountType) => accountType.value === 'LIVE'
                  )[0].label
                : '---'}
            </p>
          </div>
        </div>

        {/* Loại tài khoản */}
        <div className="flex gap-x-5 mb-8 text-ink-100/80">
          <img
            className="w-[3.5rem] flex-shrink-0"
            src={images.home.bot_account}
            alt="BotLambotrade"
          />
          <div className="flex flex-col justify-center">
            <p className="mb-1">Tài khoản giao dịch</p>
            <p className="text-xl text-ink-100">
              {!!selectedBotSettingModal.master_name
                ? selectedBotSettingModal.master_name
                : '---'}
            </p>
          </div>
        </div>

        {/* Volume Amount */}
        <div className="flex gap-x-5 mb-8 text-ink-100/80">
          <img
            className="w-[3.5rem] flex-shrink-0"
            src={images.home.volume_amount}
            alt="BotLambotrade"
          />
          <div className="flex flex-col justify-center">
            <p className="mb-1">Giá trị lệnh</p>
            <h3 className="text-xl text-ink-100 font-semibold">
              $
              {selectedBotSettingModal.o_amount.toLocaleString(
                'en-US',
                options
              )}
            </h3>
          </div>
        </div>

        {/* AIM MAX */}
        <div className="flex gap-x-5 mb-8 text-ink-100/80">
          <img
            className="w-[3.5rem] flex-shrink-0"
            src={images.home.aim_max}
            alt="BotLambotrade"
          />
          <div className="flex flex-col justify-center">
            <p className="mb-1">Mục tiêu chốt lãi</p>
            <h3 className="text-xl text-green-100 font-semibold">
              {selectedBotSettingModal.aim_max <= 0
                ? '$0'
                : `$${selectedBotSettingModal.aim_max}`}
            </h3>
          </div>
        </div>

        {/* AIM MIN */}
        <div className="flex gap-x-5 mb-8 text-ink-100/80">
          <img
            className="w-[3.5rem] flex-shrink-0"
            src={images.home.aim_min}
            alt="BotLambotrade"
          />
          <div className="flex flex-col justify-center">
            <p className="mb-1">Mục tiêu cắt lỗ</p>
            <h3 className="text-xl text-red-100 font-semibold">
              {selectedBotSettingModal.aim_min <= 0
                ? '$0'
                : `$${selectedBotSettingModal.aim_min}`}
            </h3>
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-x-5 mb-8 text-ink-100/80">
          <img
            className="w-[3.5rem] flex-shrink-0"
            src={images.home.status}
            alt="BotLambotrade"
          />
          <div className="flex flex-col justify-center">
            <p className="mb-1">Trạng thái</p>
            <p
              className={`w-fit px-2 leading-5 rounded-md text-xs text-ink-100 font-semibold ${
                selectedBotSettingModal.status === 'active'
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            >
              {selectedBotSettingModal.status === 'active'
                ? 'Đang bật'
                : 'Đang tắt'}
            </p>
          </div>
        </div>
      </div>

      {/* GRID 2 */}
      <div
        className={`${
          isDesktop ? 'col-span-2' : ''
        } bg-background-80 rounded-3xl p-6 `}
      >
        <div
          className={`flex ${
            isDesktop && isTablet ? 'gap-x-[100px]' : 'flex-col gap-4'
          } mb-6 text-ink-100/80`}
        >
          {/* Tổng Volume */}
          <div className="flex gap-x-5">
            <img
              className="w-[3.5rem] flex-shrink-0"
              src={images.home.total_volume}
              alt="BotLambotrade"
            />
            <div>
              <p className="mb-1">Tổng Volume</p>
              <h3 className="text-3.5xl text-teal-100 font-semibold">
                $
                {dashboardResponseMonthSum.volume.toLocaleString(
                  'en-US',
                  options
                )}
              </h3>
            </div>
          </div>
          {/* Tổng lợi nhuận */}
          <div className="flex gap-x-5">
            <img
              className="w-[3.5rem] flex-shrink-0"
              src={images.home.total_profit}
              alt="BotLambotrade"
            />
            <div>
              <p className="mb-1">Tổng lợi nhuận</p>
              <h3
                className={`text-3.5xl font-semibold ${
                  dashboardResponseMonthSum.current_profit >= 0
                    ? 'text-green-100'
                    : 'text-red-100'
                }`}
              >
                {dashboardResponseMonthSum.current_profit >= 0 ? '$' : '-$'}
                {Math.abs(
                  dashboardResponseMonthSum.current_profit
                ).toLocaleString('en-US', options)}
              </h3>
            </div>
          </div>
        </div>
        {/* Time Table */}
        <div
          className={`border border-ink-05 rounded-2xl w-full`}
        >
          <div
            className={`px-4 md:px-6 py-4 flex justify-between items-center`}
          >
            <p className="text-ink-100 text-base md:text-2xl font-semibold">
              Tháng {currentMoment.format('MM/YYYY')}
            </p>
            <div className="flex items-center gap-4">
              {isDesktop && (
                <GreyButton
                  buttonClassName={`${isDesktop ? 'px-3' : 'px-[0.5rem]'} ${
                    isCurrentMonthSelected ? 'opacity-60' : ''
                  }`}
                  onClick={resetCurrentMonth}
                  disabled={isCurrentMonthSelected}
                >
                  Hôm nay
                </GreyButton>
              )}
              <div
                className="flex items-center justify-center p-1 md:p-2 xl:p-3 bg-primary-05 rounded-full cursor-pointer"
                onClick={handleSubtractOneMonth}
              >
                <img
                  className="w-[1.25rem]"
                  src={images.home.left_arrow_gold}
                  alt="BotLambotrade"
                />
              </div>
              <div
                className="flex items-center justify-center p-1 md:p-2 xl:p-3 bg-primary-05 rounded-full cursor-pointer"
                onClick={handlePlusOneMonth}
              >
                <img
                  className="w-[1.25rem]"
                  src={images.home.right_arrow_gold}
                  alt="BotLambotrade"
                />
              </div>
            </div>
          </div>
          {!isDesktop && (
            <div className="px-4 pb-4 w-full border-b border-ink-10">
              <GreyButton
                buttonClassName={`w-full ${
                  isDesktop || isTablet ? 'px-3' : 'px-[0.5rem]'
                } ${isCurrentMonthSelected ? 'opacity-60' : ''} text-sm`}
                onClick={resetCurrentMonth}
                disabled={isCurrentMonthSelected}
              >
                Hôm nay
              </GreyButton>
            </div>
          )}

          {isDesktop && (
            <div className="grid grid-cols-7 text-ink-60 text-sm">
              {DAYS.map((day, indexDay, days) => {
                const isFirstDay = indexDay === 0;
                const isLastDay = indexDay + 1 === days.length;
                return (
                  <p
                    key={indexDay * Math.random()}
                    className={`w-full px-3 py-2 ${
                      isFirstDay
                        ? 'border-t border-b border-r'
                        : isLastDay
                        ? 'border-t border-b'
                        : 'border-t border-b border-r'
                    } border-ink-05 text-end`}
                  >
                    {day}
                  </p>
                );
              })}
            </div>
          )}
          {calendar.map((week, indexWeek, rowWeek) => (
            <div
              key={indexWeek * Math.random()}
              className={`grid ${
                isDesktop && isTablet ? 'grid-cols-7' : 'grid-cols-3'
              } border-collapse rounded-2xl overhidden-hidden`}
            >
              {week.map((day, indexDay, rowDay) => {
                // CHECK INDEX
                const isLastIndexWeek = indexWeek + 1 === rowWeek.length;
                const isLastIndexDay = indexDay + 1 === rowDay.length;

                // CHECK DAY
                const isCurrentMonth = currentMoment.month() === day.month();
                const isToday =
                  moment().format('DD') === day.format('DD') &&
                  moment().month() === day.month();

                const dataAfterFilter = dashboardResponseMonths.filter(
                  (data) => data.date === day.format('YYYY-MM-DD')
                );

                let currentData: DashboardResponse;
                if (dataAfterFilter.length > 0) {
                  currentData = dataAfterFilter[0];
                } else {
                  currentData = INITIAL_DASHBOARD_RESPONSE;
                }
                const isProfit = currentData.current_profit > 0;
                const isDraft = currentData.current_profit === 0;
                const isLoss = currentData.current_profit < 0;
                // SUCCESS
                const profitText =
                  isProfit &&
                  '+$' +
                    Math.abs(currentData.current_profit).toLocaleString(
                      'en-US',
                      options
                    );

                // DRAFT
                const draftText = isDraft && '$0';

                // FAIL
                const lossText =
                  isLoss &&
                  '-$' +
                    Math.abs(currentData.current_profit).toLocaleString(
                      'en-US',
                      options
                    );

                const isHavingRecords =
                  currentData.current_profit !== 0 ||
                  currentData.total_draft !== 0 ||
                  currentData.total_lose !== 0 ||
                  currentData.total_win !== 0;
                const isCurrentMonthAndSelectedBotAccountNotEmpty =
                  isCurrentMonth &&
                  selectedBotAccount.value !== '' &&
                  isHavingRecords;

                return (
                  <div
                    key={indexDay * Math.random()}
                    className={`flex flex-col ${
                      !isLastIndexDay ? 'border-r' : ''
                    }  ${
                      !isLastIndexWeek ? 'border-b' : ''
                    } border border-ink-05 py-2 px-3 m-0 relative w-full text-end`}
                  >
                    <p
                      className={`mb-1 ${
                        !isToday || !isCurrentMonth
                          ? 'bg-primary-100 bg-clip-text text-transparent'
                          : 'text-ink-100'
                      } text-sm`}
                    >
                      {isCurrentMonth ? day.format('D') : ' '}
                    </p>
                    <p
                      className={`${
                        isProfit
                          ? 'text-green-100'
                          : isDraft
                          ? 'bg-primary-100 bg-clip-text text-transparent'
                          : 'text-red-100'
                      } text-xs ${
                        isCurrentMonthAndSelectedBotAccountNotEmpty
                          ? ''
                          : 'opacity-0'
                      }`}
                    >
                      {isCurrentMonthAndSelectedBotAccountNotEmpty
                        ? `${
                            isProfit
                              ? profitText
                              : isDraft
                              ? draftText
                              : lossText
                          }`
                        : 'o'}
                    </p>
                    <p
                      className={`text-teal-100 text-xs ${
                        isCurrentMonthAndSelectedBotAccountNotEmpty
                          ? ''
                          : 'opacity-0'
                      }`}
                    >
                      {isCurrentMonthAndSelectedBotAccountNotEmpty
                        ? `$${currentData.volume.toLocaleString(
                            'en-US',
                            options
                          )}`
                        : 'o'}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeGridRowTwo;
