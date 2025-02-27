import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function HistoricalChart({ historicalData }) {
  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-xl p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Historical Profit</h2>
      {historicalData.length === 0 ? (
        <p className="text-center">No historical data available.</p>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: "Day", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Profit", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#1f2937"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default HistoricalChart;
