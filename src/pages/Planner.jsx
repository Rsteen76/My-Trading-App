import React, { useState, useEffect } from "react";

function Planner() {
  const [tradesPerDay, setTradesPerDay] = useState(3);
  const [stopLoss, setStopLoss] = useState(10);
  const [winRate, setWinRate] = useState(60);
  const [riskPercent, setRiskPercent] = useState(5);
  const [target, setTarget] = useState(15);
  const [dollarValueOfPoints, setDollarValueOfPoints] = useState(2);
  const [initialBalance, setInitialBalance] = useState(500);

  // For showing a "Saved!" message
  const [savedMessage, setSavedMessage] = useState("");

  // Load from localStorage if available
  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem("tradeSettings"));
    if (storedSettings) {
      setTradesPerDay(storedSettings.tradesPerDay ?? 3);
      setStopLoss(storedSettings.stopLoss ?? 10);
      setWinRate(storedSettings.winRate ?? 60);
      setRiskPercent(storedSettings.riskPercent ?? 5);
      setTarget(storedSettings.target ?? 15);
      setDollarValueOfPoints(storedSettings.dollarValueOfPoints ?? 2);
      setInitialBalance(storedSettings.initialBalance ?? 500);
    }
  }, []);

  // Optionally, you can auto-save on change. But here, we only save on button click.
  const handleSave = () => {
    const settings = {
      tradesPerDay,
      stopLoss,
      winRate,
      riskPercent,
      target,
      dollarValueOfPoints,
      initialBalance,
    };
    localStorage.setItem("tradeSettings", JSON.stringify(settings));
    
    // Show a success message
    setSavedMessage("Preferences saved!");
    // Hide the message after 2 seconds
    setTimeout(() => setSavedMessage(""), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-6">Planner</h1>

      {/* Form Container */}
      <div className="bg-white text-gray-800 max-w-md w-full p-6 rounded shadow">
        {/* If we have a savedMessage, display it */}
        {savedMessage && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
            {savedMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block font-medium mb-1">Trades Per Day</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={tradesPerDay}
              onChange={(e) => setTradesPerDay(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Stop Loss (Points)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Win Rate (%)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={winRate}
              onChange={(e) => setWinRate(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Risk % (of Account Balance)
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Target (Points)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Dollar Value of Points
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={dollarValueOfPoints}
              onChange={(e) => setDollarValueOfPoints(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Initial Account Balance
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={initialBalance}
              onChange={(e) => setInitialBalance(Number(e.target.value))}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Planner;
