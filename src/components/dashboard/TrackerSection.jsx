import React from "react";

function TrackerSection({ tradesToday, onTradeOutcome, onNextDay, settings }) {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Today's Trades</h2>
        <button
          onClick={onNextDay}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-bold"
        >
          Next Day
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-center font-semibold text-sm text-gray-700 w-24">#</th>
              <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Outcome</th>
              <th className="py-3 px-4 text-center font-semibold text-sm text-gray-700">P/L</th>
              <th className="py-3 px-4 text-center font-semibold text-sm text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tradesToday.map((trade, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-gray-200 text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {trade !== null && (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      trade.outcome === "win" 
                        ? "bg-green-100 text-green-800" 
                        : trade.outcome === "breakEven"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}>
                      {trade.outcome === "win" 
                        ? "Win" 
                        : trade.outcome === "breakEven"
                          ? "Break Even"
                          : "Loss"}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {trade !== null && (
                    <span className={`font-medium ${
                      trade.outcome === "win" 
                        ? "text-green-600" 
                        : trade.outcome === "breakEven"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}>
                      {trade.outcome === "win" 
                        ? `+$${trade.profit}` 
                        : trade.outcome === "breakEven"
                          ? "$0.00"
                          : `-$${trade.loss}`}
                    </span>
                  )}
                  {trade?.note && (
                    <p className="text-xs text-gray-500 mt-1 text-center">{trade.note}</p>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {trade === null && (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onTradeOutcome(index, "win")}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Win
                      </button>
                      <button
                        onClick={() => onTradeOutcome(index, "loss")}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Loss
                      </button>
                      <button
                        onClick={() => onTradeOutcome(index, "breakEven")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm"
                      >
                        B/E
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {tradesToday.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No trades available for today.
        </div>
      )}
    </div>
  );
}

export default TrackerSection;
