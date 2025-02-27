import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function SummaryPage() {
  const [historicalData, setHistoricalData] = useState([]);
  const [settings, setSettings] = useState(null);

  // Load settings and trade logs on mount
  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem("tradeSettings"));
    if (storedSettings) {
      setSettings({
        initialBalance: Number(storedSettings.initialBalance) || 500,
      });
    }
    const storedTrades = JSON.parse(localStorage.getItem("tradesLogged")) || [];
    console.log("Loaded trade logs:", storedTrades);
    aggregateHistoricalData(storedTrades);
  }, []);

  // Aggregate historical trade data by day.
  // Each trade must have { day, oldBalance, newBalance }.
  const aggregateHistoricalData = (trades) => {
    const dayMap = {};
    trades.forEach((trade) => {
      if (!trade.day) {
        console.warn("Trade missing day property:", trade);
        return;
      }
      const day = trade.day;
      if (!dayMap[day]) {
        dayMap[day] = { day, profit: 0, finalBalance: 0 };
      }
      // Profit per trade: newBalance - oldBalance
      const profit = Number(trade.newBalance) - Number(trade.oldBalance);
      dayMap[day].profit += profit;
      // Assume the last trade of the day provides the final balance
      dayMap[day].finalBalance = Number(trade.newBalance);
    });
    const daysArray = Object.values(dayMap).sort((a, b) => a.day - b.day);
    console.log("Aggregated historical data:", daysArray);
    setHistoricalData(daysArray);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-10">
        Summary & Historical Performance
      </h1>

      {/* Historical Profit Chart Card */}
      <div className="max-w-5xl mx-auto bg-white text-gray-900 rounded-lg shadow-xl p-6 mb-10">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Historical Profit
        </h2>
        {historicalData.length === 0 ? (
          <p className="text-center text-gray-600">
            No historical data available.
          </p>
        ) : (
          <div className="w-full h-64 overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  label={{
                    value: "Day",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Profit",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Daily Performance Table Card */}
      <div className="max-w-5xl mx-auto bg-white text-gray-900 rounded-lg shadow-xl p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Daily Performance</h2>
        {historicalData.length === 0 ? (
          <p className="text-center text-gray-600">
            No historical data available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-4 py-2">Day</th>
                  <th className="px-4 py-2">Profit</th>
                  <th className="px-4 py-2">Final Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {historicalData.map((row) => (
                  <tr key={row.day}>
                    <td className="px-4 py-2">{row.day}</td>
                    <td className="px-4 py-2">${row.profit.toFixed(2)}</td>
                    <td className="px-4 py-2">${row.finalBalance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryPage;
