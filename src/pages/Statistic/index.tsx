import APIs from "apis";
import axios from "axios";
import CustomRangePickerV2 from "components/CustomDatePickerV2";
import SelectInput from "components/SelectInput";
import dayjs from "dayjs";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEnqueueSnackbar } from "hooks/useEnqueueSnackbar";
import random from "lodash/random";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMediaQuery } from "react-responsive";
import { ActionMeta, SingleValue } from "react-select";
import BotData from "types/BotData";
import InputSelectOption from "types/InputSelectOption";

const METHOD_OWN_TYPES: InputSelectOption[] = [
  { value: "all", label: "Tất cả tài khoản giao dịch" },
  { value: "bot_trade_123", label: "Bot Trade 123" },
  { value: "bot_trade_1234", label: "Bot Trade 1234" },
];

// const generateRandomData = () => {
//   const data = [];
//   for (let i = 1; i <= 10; i++) {
//     const randomProfit = random(1000, 100000); // Random value between 0 and 100000
//     data.push({ x: i, y: randomProfit });
//   }
//   return data;
// };

const generateRandomData = ():
  | Highcharts.SeriesAreasplineOptions[]
  | undefined => [
  {
    id: "bot_trade_123",
    name: "Bot Trade 123",
    data: Array(20)
      .fill(0)
      .reduce((acc: any[], _, idx) => {
        acc.push([
          dayjs().add(idx, "day").valueOf(),
          idx === 0 ? 0 : random(55000, 100000),
        ]);
        return acc;
      }, []),
    type: "areaspline",
    color: "#34C759",
    lineWidth: 4,
    fillColor: {
      linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
      stops: [
        [0, "rgba(52, 199, 89, 0.4)"], // Start color (at 0%)
        [1, "rgba(52, 199, 89, 0)"], // End color (at 100%)
      ],
    },
  },
  {
    id: "bot_trade_1234",
    name: "Bot Trade 1234",
    data: Array(20)
      .fill(0)
      .reduce((acc: any[], _, idx) => {
        acc.push([
          dayjs().add(idx, "day").valueOf(),
          idx === 0 ? 0 : random(1000, 50000),
        ]);
        return acc;
      }, []),
    type: "areaspline",
    lineWidth: 4,
    color: "#FF9500",
    fillColor: {
      linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
      stops: [
        [0, "rgba(255, 149, 0, 0.4)"], // Start color (at 0%)
        [1, "rgba(255, 149, 0, 0)"], // End color (at 100%)
      ],
    },
  },
];

const Statistic = () => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [partnerBotDatas, setPartnerBotDatas] = useState<BotData[]>([]);
  const [chartData, setChartData] = useState(generateRandomData());
  const [selectedPartnerBot, setSelectedPartnerBot] =
    useState<InputSelectOption>(METHOD_OWN_TYPES[0]);

  const enqueueSnackbar = useEnqueueSnackbar();

  // RESPONSIVE
  const isDesktop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px)",
  });
  const isMobile = useMediaQuery({
    query: "(max-width: 767px)",
  });

  const series = chartData?.reduce((acc: any[], data) => {
    if (selectedPartnerBot.value === "all") {
      acc.push(data);
    } else if (
      selectedPartnerBot.value === "bot_trade_123" &&
      data.id === "bot_trade_123"
    ) {
      acc.push(data);
    } else if (
      selectedPartnerBot.value === "bot_trade_1234" &&
      data.id === "bot_trade_1234"
    ) {
      acc.push(data);
    }

    return acc;
  }, []);

  const options: Highcharts.Options = {
    title: {
      text: "",
    },
    chart: {
      type: "areaspline",
      backgroundColor: "#1d1b18",
      height: 768,
    },
    legend: {
      // layout: "vertical",
      // align: "left",
      // verticalAlign: "top",
      // x: 120,
      // y: 70,
      // floating: true,
      // borderWidth: 1,
      // backgroundColor: "#FFFFFF",
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      visible: true,
      labels: {
        format: "{value:%b %e}", // Format the x-axis labels (e.g., Jan 1)
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        enabled: true, // Hide X-axis labels
        style: {
          color: "#fff",
          fontSize: "14",
        },
      },
      min: 0,
      gridLineColor: "rgba(255, 255, 255, 0.1)",
    },
    tooltip: {
      // split: true,
      // headerFormat: "",
      // formatter: function (this: Highcharts.TooltipFormatterContextObject) {
      //   console.log("this", this);
      //   const tooltipValue = `$ ${this.y}`;
      //   const tooltipDate = Highcharts.dateFormat("%m/%d/%Y", this.x as number); // Use the timestamp directly for the date
      //   return `<div className="px-4 py-2 flex flex-col text-ink-100 font-semibold bg-green-100"><p>${tooltipValue}</p><p>${tooltipDate}</p></div>`;
      // },
      // formatter: function (this: Highcharts.TooltipFormatterContextObject) {
      //   const tooltipValue = `$ ${this.y}`;
      //   const tooltipDate = Highcharts.dateFormat("%m/%d/%Y", this.x as number); // Use the timestamp directly for the date
      //   return `${tooltipValue}<br>${tooltipDate}`;
      // },
      // formatter: function () {
      //   // The first returned item is the header, subsequent items are the
      //   // points
      //   return [""].concat(
      //     this.points
      //       ? this.points.map(function (point) {
      //           return (
      //             "$ " +
      //             point.y?.toLocaleString() +
      //             "<br/>" +
      //             Highcharts.dateFormat("%m/%d/%Y", point.x as number)
      //           );
      //         })
      //       : []
      //   );
      // },
      split: true,
      useHTML: true,
      headerFormat: "",
      pointFormat:
        '<div class="px-4 py-2 flex flex-col font-semibold rounded-2xl" style="color: {series.color}"><p>${point.y}</p><p>{point.x: %m/%d/%Y}</p></div>',
      // pointFormat: '<tr><td style="color: {series.color}">{series.name} </td>' +
      //     '<td style="text-align: right"><b>{point.y} EUR</b></td></tr>',
      backgroundColor: "#FFFFFF",
      footerFormat: "",
      padding: 0,
      borderRadius: 16,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      // series: {
      //   pointStart: 0,
      // },
      areaspline: {
        pointStart: 0,
        threshold: 20,
        fillOpacity: 0,
        marker: {
          enabled: true, // Display data point markers
          symbol: "circle", // Use circles as the marker symbol
          radius: 6, // Set the radius of the circles
          lineWidth: 3, // Set the border width of the circles
          lineColor: "#FFFFFF", // Disable the border color of the circles
        },
      },
    },
    series: series,
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

  const handleSelectMethodOwnType = (
    option: SingleValue<InputSelectOption>,
    actionMeta: ActionMeta<InputSelectOption>
  ) => {
    if (option != null) {
      setSelectedPartnerBot(option);
    }
  };

  useEffect(() => {
    getAllPartnerBots();
  }, [getAllPartnerBots]);

  return (
    <>
      <Helmet>
        <title>BotLambotrade | Bot Trade</title>
      </Helmet>
      <div className="h-fit mb-6 bg-background-80 rounded-3xl">
        <div className="p-6 border-b border-ink-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-xl text-ink-100 font-semibold">
            Thống kê tài khoản giao dịch
          </h1>
        </div>
        <div className="mb-6 p-6 flex flex-col gap-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* TÀI KHOẢN GIAO DỊCH */}
            <SelectInput
              value={selectedPartnerBot}
              onChange={handleSelectMethodOwnType}
              fullWidth={!isDesktop && !isTablet}
              inputClassName="!py-2 !pr-8 text-sm w-full md:w-[21.375rem]"
              indicatorContainerClassName="!right-3"
              indicatorContainerIconClassName="!w-[1rem]"
              name="select"
              options={METHOD_OWN_TYPES}
            />
            <CustomRangePickerV2 placeholder={["Từ Ngày", "Đến ngày"]} />
          </div>
        </div>
        <div className="pl-6 pb-6">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartComponentRef}
          />
        </div>
      </div>
    </>
  );
};

export default Statistic;
