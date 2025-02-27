import React, { useState, useEffect } from "react";

function Tracker() {
  const [settings, setSettings] = useState(null);
  const [balance, setBalance] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [tradesLogged, setTradesLogged] = useState([]);

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem("tradeSettings"));
    if (storedSettings) {
      setSettings(storedSettings);
      setBalance(storedSettings.initialBalance || 500);
    }
    const storedTrades = JSON.parse(localStorage.getItem("tradesLogged"));
    if (storedTrades) {
      setTradesLogged(storedTrades);
      // Optionally restore day/balance from the last trade if desired
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tradesLogged", JSON.stringify(tradesLogged));
  }, [tradesLogged]);

  if (!settings) {
    return <p>Loading settings...</p>;
  }

  // Calculate how many contracts for the day
  const dailyRisk = balance * (settings.riskPercent / 100);
  const riskPerContract = settings.stopLoss * settings.dollarValueOfPoints;
  const rawContracts = Math.floor(dailyRisk / riskPerContract);
  const contractsForDay = rawContracts < 1 ? 0 : rawContracts;

  const handleLogTrade = (tradeNum, outcome) => {
    let updatedBalance = balance;
    if (contractsForDay > 0) {
      if (outcome === "win") {
        const profit = contractsForDay * (settings.target * settings.dollarValueOfPoints);
        updatedBalance += profit;
      } else {
        const loss = contractsForDay * (settings.stopLoss * settings.dollarValueOfPoints);
        updatedBalance -= loss;
      }
    }

    const newTrade = {
      day: currentDay,
      tradeNum,
      outcome,
      contracts: contractsForDay,
      oldBalance: balance,
      newBalance: updatedBalance
    };

    setBalance(updatedBalance);
    setTradesLogged([...tradesLogged, newTrade]);
  };

  const handleNextDay = () => {
    setCurrentDay(currentDay + 1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Day {currentDay} Tracker</h1>
      <p>Current Balance: ${balance.toFixed(2)}</p>
      <p>Contracts for Today: {contractsForDay}</p>
      <div className="mt-4">
        {Array.from({ length: settings.tradesPerDay }).map((_, i) => (
          <div key={i} className="flex gap-2 my-2">
            <span>Trade {i + 1}:</span>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => handleLogTrade(i + 1, "win")}
            >
              Win
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleLogTrade(i + 1, "loss")}
            >
              Loss
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleNextDay}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
      >
        Next Day
      </button>
    </div>
  );
}

export default Tracker;
