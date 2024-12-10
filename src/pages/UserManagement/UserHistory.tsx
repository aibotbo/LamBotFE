import { faker } from "@faker-js/faker";
import APIs from "apis";
import images from "assets";
import axios from "axios";
import CustomRangePickerV2 from "components/CustomDatePickerV2";
import dayjs from "dayjs";
import { useEnqueueSnackbar } from "hooks/useEnqueueSnackbar";
import { FC, useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "stores/hooks";
import { userActions } from "stores/userSlice";
import TableLeftArrowSvg from "svgs/TableLeftArrowSvg";
import { BotAllData } from "types/BotAllData";
import BotData from "types/BotData";
import InputSelectOption from "types/InputSelectOption";
import { UserHistoryProps } from "types/UserHistoryProps";
import { UserHistoryResponseResult } from "types/UserHistoryResponse";

interface Props {
  userHistory: UserHistoryProps;
  setUserHistory: React.Dispatch<React.SetStateAction<UserHistoryProps>>;
}

const INITIAL_SELECTED_OPTION: InputSelectOption = {
  value: "",
  label: "",
};

const INITIAL_SELECTED_ACCOUNT_TYPE: InputSelectOption = {
  value: "LIVE",
  label: "Tài khoản LIVE",
};

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

const generateFakeData = (): UserHistoryResponseResult[] => {
  return Array(15)
    .fill(0)
    .map((_) => ({
      id: faker.datatype.uuid(),
      date: faker.date.between("2020-01-01T00:00:00.000Z", dayjs().toDate()),
      ip: faker.internet.ip(),
    }));
};

const UserHistory: FC<Props> = ({ userHistory, setUserHistory }) => {
  // BOT
  const [allBotDatas, setAllBotDatas] = useState<BotAllData[]>([]);
  const [partnerBotDatas, setPartnerBotDatas] = useState<BotData[]>([]);
  const [selectedAccountType, setSelectedAccountType] =
    useState<InputSelectOption>(INITIAL_SELECTED_ACCOUNT_TYPE);
  const [selectedBotAccount, setSelectedBotAccount] =
    useState<InputSelectOption>(INITIAL_SELECTED_OPTION);
  const [accountOptions, setAccountOptions] = useState<InputSelectOption[]>([]);
  const [allBotAccountOptions, setAllBotAccountOptions] = useState<
    InputSelectOption[]
  >([]);
  const [historyResults, setAdminResults] = useState<
    UserHistoryResponseResult[]
  >(generateFakeData());

  // ! INITIAL PARTNER BOT USEFFECT
  const [isPartnerBotInitialized, setIsPartnerBotInitialized] = useState(false);

  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

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

  return (
    <>
      <div className="mb-6 h-fit bg-background-80 rounded-3xl">
        <div className="flex flex-col gap-4 p-6 border-b border-ink-10 md:flex-row md:justify-between md:items-center">
          <h1 className="text-xl font-semibold text-ink-100">
            Lịch sử hoạt động
          </h1>
          <button
            className="px-3 py-[0.625rem] w-full md:w-auto rounded-xl flex justify-center items-center gap-[0.625rem] bg-primary-100"
            onClick={() => {
              setUserHistory((prev) => ({
                ...prev,
                isShowing: false,
              }));
            }}
          >
            <TableLeftArrowSvg className="text-background-100" />{" "}
            <p className="font-semibold text-transparent bg-background-100 bg-clip-text">
              Trở lại
            </p>
          </button>
        </div>
        {historyResults.length === 0 && (
          <div className="py-[5rem] flex flex-col justify-center items-center gap-y-6">
            <img
              className="w-[10.25rem]"
              srcSet={`${images.user.empty} 2x`}
              alt="BotLambotrade"
            />
            <p className="text-ink-60">Không có lịch sử hoạt động</p>
          </div>
        )}
        {historyResults.length > 0 && (
          <div className="flex flex-col gap-4 p-4 md:p-6 md:gap-6">
            <CustomRangePickerV2 placeholder={["Từ Ngày", "Đến ngày"]} />
            <div className="flex flex-col gap-2 p-4 border text-ink-100 border-ink-20 rounded-2xl">
              {historyResults.map((data) => (
                <p>
                  {dayjs(data.date).format("DD/MM/YYYY")} - {data.ip}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserHistory;
