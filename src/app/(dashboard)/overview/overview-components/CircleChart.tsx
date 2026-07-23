"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useMobile } from "@/components/hooks/useMobile";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CircleChart() {
  const{theme}=useTheme();
  const isMobile = useMobile();
  const chartSeries = [75.55];

  const chartOptions: any = {
    chart: {
      type: "radialBar",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#5A73F3"],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
         hollow: {
          size: "80%",
        },
        track: {
          background: "#EEF2F6",
          strokeWidth: "80%",
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: isMobile ? -10 : -20,
            fontSize: isMobile ? "24px" : "36px",
            fontWeight: "800",
            color: theme==="dark"?"#ffffff":"#5A73F3",
            formatter: function (val: number) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "small",
    },
    stroke: {
      lineCap: "round"
    },
  };

  return (
    <div className="p-6 w-full relative transition-all duration-300 flex flex-col items-center">
      
      

      <div className="w-full max-w-[320px] min-h-[180px] mt-4 relative flex justify-center">
        <Chart options={chartOptions} series={chartSeries} type="radialBar" height={320} />
        
        <div className="absolute bottom-2 flex justify-center w-full">
          <span className="flex items-center text-[13px] font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
            +10%
          </span>
        </div>
      </div>

    </div>
  );
}
