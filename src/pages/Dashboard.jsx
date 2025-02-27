import React, { useState, useEffect } from "react";
import CurrentStatsCard from "../components/dashboard/CurrentStatsCard";
import TrackerSection from "../components/dashboard/TrackerSection";
import SummaryStatsCard from "../components/dashboard/SummaryStatsCard";
import HistoricalChart from "../components/dashboard/HistoricalChart";

function Dashboard() {
  const [settings, setSettings] = useState(null);
  const [balance, setBalance] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [tradesToday, setTradesToday] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [summaryStats, setSummaryStats] = useState(null);

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem("tradeSettings"));
    if (storedSettings) {
      setSettings(storedSettings);
      setBalance(Number(storedSettings.initialBalance));
      setTradesToday(Array(Number(storedSettings.tradesPerDay)).fill(null));
    }
    const storedTrades = JSON.parse(localStorage.getItem("tradesLogged")) || [];
    aggregateHistoricalData(storedTrades);
  }, []);

  const aggregateHistoricalData = (trades) => {
    const dayMap = {};
    trades.forEach((trade) => {
      const day = trade.day;
      if (!dayMap[day]) {
        dayMap[day] = { day, profit: 0, trades: [] };
      }
      const profit = trade.newBalance - trade.oldBalance;
      dayMap[day].profit += profit;
      dayMap[day].trades.push(trade);
    });
    const daysArray = Object.values(dayMap).sort((a, b) => a.day - b.day);
    setHistoricalData(daysArray);
    const totalProfit = daysArray.reduce((sum, d) => sum + d.profit, 0);
    const totalTrades = trades.length;
    const totalDays = daysArray.length;
    const averageProfit = totalDays > 0 ? totalProfit / totalDays : 0;
    setSummaryStats({
      totalProfit,
      averageProfit,
      totalTrades,
      totalDays,
    });
  };

  const saveTradeLog = (trade) => {
    const storedTrades = JSON.parse(localStorage.getItem("tradesLogged")) || [];
    const updatedTrades = [...storedTrades, trade];
    localStorage.setItem("tradesLogged", JSON.stringify(updatedTrades));
    aggregateHistoricalData(updatedTrades);
  };

  if (!settings) {
    return <p className="text-center py-8">Loading settings...</p>;
  }

  // Calculate daily risk and number of contracts per trade
  const dailyRisk = balance * (Number(settings.riskPercent) / 100);
  const riskPerContract = Number(settings.stopLoss) * Number(settings.dollarValueOfPoints);
  const contractsForTrade = riskPerContract ? Math.floor(dailyRisk / riskPerContract) : 0;

  const handleTradeOutcome = (tradeIndex, outcome) => {
    if (tradesToday[tradeIndex] !== null) return;
    const oldBalance = balance;
    let newBalance = balance;
    let tradeResult = {};

    if (contractsForTrade > 0) {
      if (outcome === "win") {
        const profit = contractsForTrade * (Number(settings.target) * Number(settings.dollarValueOfPoints));
        newBalance += profit;
        tradeResult = { outcome, profit };
      } else {
        const loss = contractsForTrade * (Number(settings.stopLoss) * Number(settings.dollarValueOfPoints));
        newBalance -= loss;
        tradeResult = { outcome, loss };
      }
    } else {
      tradeResult = { outcome, note: "No trade (insufficient risk budget)" };
    }

    setBalance(newBalance);
    const updatedTrades = [...tradesToday];
    updatedTrades[tradeIndex] = tradeResult;
    setTradesToday(updatedTrades);

    const tradeLog = {
      day: currentDay,
      tradeNum: tradeIndex + 1,
      outcome,
      contracts: contractsForTrade,
      oldBalance,
      newBalance,
    };
    saveTradeLog(tradeLog);
  };

  const handleNextDay = () => {
    setCurrentDay(currentDay + 1);
    setTradesToday(Array(Number(settings.tradesPerDay)).fill(null));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-10">Trading Dashboard</h1>
      
      {/* Current Stats Cards */}
      <CurrentStatsCard 
        balance={balance} 
        contractsForTrade={contractsForTrade} 
        tradesToday={tradesToday} 
        tradesPerDay={settings.tradesPerDay} 
      />

      {/* Tracker Section */}
      <TrackerSection
        tradesToday={tradesToday}
        onTradeOutcome={handleTradeOutcome}
        onNextDay={handleNextDay}
      />

      {/* Summary and Historical Sections */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <SummaryStatsCard summaryStats={summaryStats} />
        <HistoricalChart historicalData={historicalData} />
      </div>
    </div>
  );
}

export default Dashboard;
