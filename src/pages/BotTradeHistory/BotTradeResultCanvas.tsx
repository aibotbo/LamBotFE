import React, { FC } from "react";
import { Stage, Layer, Circle } from "react-konva";
import { useMediaQuery } from "react-responsive";

type BotTradeResultCanvasProps = {
  results: boolean[];
};

const BotTradeResultCanvas: FC<BotTradeResultCanvasProps> = ({ results }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
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

  const baseWidth = 128;
  const baseHeight = 102;
  const baseRadius = 12;
  // const baseWidth = isDesktopOrLaptop ? 128 : 88;
  // const baseHeight = isDesktopOrLaptop ? 102 : 70;
  // const baseRadius = isDesktopOrLaptop ? 12 : 8;
  const baseSpace = 2;
  return (
    <div className="h-fit p-6 mb-6 bg-background-80 rounded-3xl">
      <div className="grid grid-cols-2 grid-rows-3 lg:grid-cols-5 lg:grid-rows-1 xl:flex justify-center items-center gap-x-8 gap-y-6">
        {results?.map((resultChild: any, index) => (
          <Stage
            key={index * Math.random() * 100}
            width={baseWidth}
            height={baseHeight}
            className="last-of-type:col-span-2 lg:last-of-type:col-span-1 justify-self-center"
          >
            <Layer>
              {resultChild.map((result: any, index: any) => {
                const id = index * Math.random() * 1000;
                const x =
                  baseRadius +
                  (baseRadius * 2 + baseSpace) * Math.floor(index / 4);
                const y =
                  baseRadius + (baseRadius * 2 + baseSpace) * (index % 4);
                const fill =
                  result == null
                    ? "#696363"
                    : result
                    ? "#07A42E"
                    : "#C2180F";
                return (
                  <Circle
                    key={id}
                    x={x}
                    y={y}
                    radius={baseRadius}
                    id={id.toString()}
                    fill={fill}
                  />
                );
              })}
              <Circle />
            </Layer>
          </Stage>
        ))}
      </div>
    </div>
  );
};

export default BotTradeResultCanvas;
