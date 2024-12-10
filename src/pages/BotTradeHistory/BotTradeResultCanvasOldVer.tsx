import React, { FC } from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import { useMediaQuery } from 'react-responsive';

type BotTradeResultCanvasOldVerProps = {
  results: boolean[];
};

const BotTradeResultCanvasOldVer: FC<BotTradeResultCanvasOldVerProps> = ({ results }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)',
  });

  const baseWidth = isDesktopOrLaptop ? 128 : 88;
  const baseHeight = isDesktopOrLaptop ? 102 : 70;
  const baseRadius = isDesktopOrLaptop ? 12 : 8;
  const baseSpace = 2;

  return (
    <div className="h-fit p-6 mb-6 bg-background-80 rounded-3xl">
      <div className="flex justify-center items-center gap-x-8">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <Stage
              key={index * Math.random() * 100}
              width={baseWidth}
              height={baseHeight}
            >
              <Layer>
                {results.map((result, index) => {
                  const id = index * Math.random() * 1000;
                  const x =
                    baseRadius +
                    (baseRadius * 2 + baseSpace) * Math.floor(index / 4);
                  const y =
                    baseRadius + (baseRadius * 2 + baseSpace) * (index % 4);
                  const fill =
                    result == null ? 'grey' : result ? 'green' : 'red';
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

export default BotTradeResultCanvasOldVer;
