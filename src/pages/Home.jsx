import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function Home() {
  const [dailyData, setDailyData] = useState([]);
  const [stats, setStats] = useState({
    totalTrades: 0,
    totalProfit: 0,
    averageProfit: 0
  });

  useEffect(() => {
    // 1) Load trades from localStorage
    const storedTrades = JSON.parse(localStorage.getItem("tradesLogged")) || [];
    // storedTrades might look like:
    // [
    //   { day: 1, tradeNum: 1, outcome: "win", contracts: 1, oldBalance: 500, newBalance: 530 },
    //   { day: 1, tradeNum: 2, outcome: "loss", ... },
    //   { day: 2, tradeNum: 1, ... },
    //   ...
    // ]

    // 2) Aggregate daily profit
    // We'll create a map: day -> totalProfitForThatDay
    const dayProfitMap = {};
    let totalTrades = 0;

    storedTrades.forEach((t) => {
      totalTrades++;
      const dayKey = t.day;
      const dailyProfit = t.newBalance - t.oldBalance;

      if (!dayProfitMap[dayKey]) {
        dayProfitMap[dayKey] = 0;
      }
      dayProfitMap[dayKey] += dailyProfit;
    });

    // 3) Convert dayProfitMap to an array sorted by day
    // E.g. {1: 20, 2: -10} -> [{day: 1, profit: 20}, {day: 2, profit: -10}]
    const aggregatedData = Object.keys(dayProfitMap)
      .map((dayStr) => ({
        day: Number(dayStr),
        profit: dayProfitMap[dayStr]
      }))
      .sort((a, b) => a.day - b.day);

    // 4) Calculate totalProfit and averageProfit
    const totalProfit = aggregatedData.reduce((sum, d) => sum + d.profit, 0);
    const averageProfit = aggregatedData.length
      ? totalProfit / aggregatedData.length
      : 0;

    // 5) Update state
    setDailyData(aggregatedData);
    setStats({
      totalTrades,
      totalProfit,
      averageProfit
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* Quick Stats Panel */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <div className="bg-white text-gray-800 p-4 rounded shadow w-40">
          <h2 className="font-bold text-xl">Total Trades</h2>
          <p className="text-2xl">{stats.totalTrades}</p>
        </div>
        <div className="bg-white text-gray-800 p-4 rounded shadow w-40">
          <h2 className="font-bold text-xl">Total Profit</h2>
          <p className="text-2xl">${stats.totalProfit.toFixed(2)}</p>
        </div>
        <div className="bg-white text-gray-800 p-4 rounded shadow w-40">
          <h2 className="font-bold text-xl">Avg Profit</h2>
          <p className="text-2xl">${stats.averageProfit.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white text-gray-800 rounded shadow p-4 w-full max-w-2xl">
        <h2 className="font-bold text-xl mb-4">Daily Profit</h2>
        {dailyData.length === 0 ? (
          <p>No data to display.</p>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={true}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
