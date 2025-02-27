import React from "react";

function TrackerSection({ tradesToday, onTradeOutcome, onNextDay, settings }) {
  if (!settings) return null;

  // Find the first incomplete trade
  const firstIncompleteTradeIndex = tradesToday.findIndex((trade) => trade === null);

  return (
    <div className="max-w-5xl mx-auto bg-white text-gray-900 rounded-lg shadow-lg p-6 mb-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Today's Trades</h2>
      <div className="space-y-4">
        {tradesToday.map((trade, idx) => (
          <div key={idx} className="flex justify-between items-center border-b pb-2">
            <span className="text-lg font-medium">Trade {idx + 1}</span>
            {trade === null ? (
              <div className="flex gap-4">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => onTradeOutcome(idx, "win")}
                  disabled={idx !== firstIncompleteTradeIndex}
                >
                  Win
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => onTradeOutcome(idx, "loss")}
                  disabled={idx !== firstIncompleteTradeIndex}
                >
                  Loss
                </button>
              </div>
            ) : (
              <span className="font-semibold text-lg">
                {trade.outcome === "win"
                  ? `Win (+$${trade.profit ? trade.profit.toFixed(2) : "0.00"})`
                  : trade.outcome === "loss"
                  ? `Loss (-$${trade.loss ? trade.loss.toFixed(2) : "0.00"})`
                  : trade.note}
              </span>
            )}
          </div>
        ))}
        {settings.mode === "fixedStop" && firstIncompleteTradeIndex === -1 && (
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-lg font-medium">Trade {tradesToday.length + 1}</span>
            <div className="flex gap-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => onTradeOutcome(tradesToday.length, "win")}
              >
                Win
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => onTradeOutcome(tradesToday.length, "loss")}
              >
                Loss
              </button>
            </div>
          </div>
        )}
      </div>
      {firstIncompleteTradeIndex === -1 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onNextDay}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
          >
            Next Day
          </button>
        </div>
      )}
    </div>
  );
}

export default TrackerSection;
