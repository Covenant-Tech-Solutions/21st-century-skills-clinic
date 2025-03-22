"use client"
import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';

const StatisticsPieChartCanvas = ({ width, height, values, strokeWidth, totalBattles }) => {
  const [displayTotalBattles, setDisplayTotalBattles] = useState(totalBattles);

  const pi = 3.1415926535897932;

  const paintCanvas = (ctx) => {
    const halfWidth = width * 0.5;
    const center = { x: width * 0.5, y: halfWidth };
    const radius = 50;

    const total = values.reduce((prev, v) => prev + v.no, 0);

    const drawCircle = () => {
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, 2 * pi);
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    };

    if (total === 0) {
      drawCircle();
      return;
    }

    const pi2 = pi * 2;
    let oldStart = 3 * (pi * 0.5); // 0 deg

    for (const val of values) {
      const sweep = (val.no * pi2) / total;

      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, oldStart, oldStart + sweep);
      ctx.strokeStyle = val.arcColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();

      oldStart += sweep;
    }

    // Update the state variable to display total battles in the span
    setDisplayTotalBattles(totalBattles);
  };

  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        paintCanvas(ctx);
      }
    }
  }, [values, width, height, strokeWidth, totalBattles]);

  return (
    <div className='battles_circle'>

      <canvas ref={canvasRef} width={width} height={height} className='treeValuesProgressBar' />
      <span className='total_battles'>
        <span>
          {displayTotalBattles}
        </span>
        <span>
          {t("battles")}
        </span>
      </span>

    </div>
  );
};

export default StatisticsPieChartCanvas;
