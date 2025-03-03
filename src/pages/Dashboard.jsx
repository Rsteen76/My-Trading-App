import React, { useState, useEffect } from "react";
import CurrentStatsCard from "../components/dashboard/CurrentStatsCard";
import TrackerSection from "../components/dashboard/TrackerSection";
import SummaryStatsCard from "../components/dashboard/SummaryStatsCard";
import HistoricalChart from "../components/dashboard/HistoricalChart";
import PlannerStatsCard from "../components/dashboard/PlannerStatsCard";
import RulesCard from "../components/dashboard/RulesCard";

function Dashboard() {
  const [settings, setSettings] = useState(null);
  const [balance, setBalance] = useState(0);
  const [dailyStartBalance, setDailyStartBalance] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [tradesToday, setTradesToday] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [summaryStats, setSummaryStats] = useState(null);
  const [contractsForTrade, setContractsForTrade] = useState(0);
  const [stopLossRemaining, setStopLossRemaining] = useState(0);

  // Load initial settings and historical data
  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem("tradeSettings"));
    if (storedSettings) {
      setSettings(storedSettings);
      const initialBalance = Number(storedSettings.initialBalance) || 500;
      setBalance(initialBalance);
      setDailyStartBalance(initialBalance);

      if (storedSettings.mode === "fixedStop") {
        setTradesToday([]);
        setStopLossRemaining(Number(storedSettings.fixedStopLoss) || 0);
      } else {
        setTradesToday(Array(Number(storedSettings.tradesPerDay) || 3).fill(null));
      }
    }
    const storedTrades = JSON.parse(localStorage.getItem("tradesLogged")) || [];
    aggregateHistoricalData(storedTrades);
  }, []);

  // Calculate contracts for trade based on daily starting balance and settings
  useEffect(() => {
    if (settings && dailyStartBalance > 0) {
      // Get risk percent as a decimal (e.g., 2% becomes 0.02)
      const riskPercentDecimal = Number(settings.riskPercent) / 100;
      
      // Calculate daily risk amount in dollars
      const dailyRiskAmount = dailyStartBalance * riskPercentDecimal;
      
      // Calculate risk per contract in dollars
      const stopLossPoints = Number(settings.stopLossPoints);
      const pointValue = Number(settings.dollarValueOfPoints);
      const riskPerContract = stopLossPoints * pointValue;
      
      // Calculate number of contracts (floor to be conservative)
      let contracts = 0;
      if (riskPerContract > 0) {
        contracts = Math.floor(dailyRiskAmount / riskPerContract);
      }
      
      // For debugging
      console.log({
        dailyStartBalance,
        riskPercentDecimal,
        dailyRiskAmount,
        stopLossPoints,
        pointValue,
        riskPerContract,
        contractsCalculated: contracts
      });
      
      setContractsForTrade(contracts);
    }
  }, [dailyStartBalance, settings]);

useEffect(() => {
  if (settings && settings.mode === "fixedStop") {
    setTradesToday([null]);
  } else if (settings && settings.mode !== "fixedStop") {
    setTradesToday(Array(Number(settings.tradesPerDay)).fill(null));
  }
}, [currentDay, settings]);
  // Aggregates historical data
  const aggregateHistoricalData = (trades) => {
    const dayMap = {};
    trades.forEach((trade) => {
      const day = trade.day;
      if (!dayMap[day]) {
        dayMap[day] = { 
          day, 
          profit: 0, 
          trades: [],
          breakEvenCount: 0 
        };
      }
      
      // Only add profit/loss for non-break-even trades
      if (trade.isBreakEven) {
        // Count break-even trades separately
        dayMap[day].breakEvenCount = (dayMap[day].breakEvenCount || 0) + 1;
      } else {
        // For regular trades, calculate profit
        const profit = trade.newBalance - trade.oldBalance;
        dayMap[day].profit += profit;
      }
      
      dayMap[day].trades.push(trade);
    });
    
    const daysArray = Object.values(dayMap).sort((a, b) => a.day - b.day);
    setHistoricalData(daysArray);

    const totalProfit = daysArray.reduce((sum, d) => sum + d.profit, 0);
    const totalTrades = trades.length;
    const breakEvenTrades = trades.filter(t => t.isBreakEven).length;
    const totalDays = daysArray.length;
    const averageProfit = totalDays > 0 ? totalProfit / totalDays : 0;
    
    setSummaryStats({
      totalProfit,
      averageProfit,
      totalTrades,
      lossTrades: trades.filter(t => t.outcome === "loss").length,
      breakEvenTrades,
      totalDays,
    });
  };

  // Saves each trade log
  const saveTradeLog = (trade) => {
    const storedTrades = JSON.parse(localStorage.getItem("tradesLogged")) || [];
    const updatedTrades = [...storedTrades, trade];
    localStorage.setItem("tradesLogged", JSON.stringify(updatedTrades));
    aggregateHistoricalData(updatedTrades);
  };

  if (!settings) {
    return <p className="text-center py-8">Loading settings...</p>;
  }

  // Handler for each trade outcome
  const handleTradeOutcome = (tradeIndex, outcome) => {
    // If we're in fixedStop mode
    if (settings.mode === "fixedStop") {
      const oldBalance = balance;
      let newBalance = balance;
      let tradeResult = {};

      // Handle break even case
      if (outcome === "breakEven") {
        // For break even, we don't change the balance
        tradeResult = { 
          outcome: "breakEven", 
          profit: 0,
          loss: 0
        };
        
        const updatedTrades = [...tradesToday];
        updatedTrades[tradeIndex] = tradeResult;
        setTradesToday(updatedTrades);
        
        const tradeLog = {
          day: currentDay,
          tradeNum: tradeIndex + 1,
          outcome: "breakEven",
          contracts: contractsForTrade,
          oldBalance,
          newBalance,
          isBreakEven: true
        };
        
        saveTradeLog(tradeLog);
        
        // Add another trade if stop loss has not been reached
        if (stopLossRemaining > 0) {
          setTradesToday((prevTrades) => [...prevTrades, null]);
        }
        
        return;
      } else if (outcome === "win") {
        const profit =
          contractsForTrade *
          (Number(settings.target) * Number(settings.dollarValueOfPoints));
        newBalance += profit;
        tradeResult = { outcome, profit };
      } else if (outcome === "loss") {
        const loss =
          contractsForTrade *
          (Number(settings.stopLossPoints) * Number(settings.dollarValueOfPoints));
        newBalance -= loss;
        setStopLossRemaining(stopLossRemaining - loss);
        tradeResult = { outcome, loss };
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
        profit: tradeResult.profit,
        loss: tradeResult.loss,
        isBreakEven: false
      };
      saveTradeLog(tradeLog);

      // Add another trade if stop loss has not been reached
      if (stopLossRemaining > 0) {
        setTradesToday((prevTrades) => [...prevTrades, null]);
      }

      return;
    }

    // "trades" mode logic
    if (tradesToday[tradeIndex] !== null) return;
    const oldBalance = balance;
    let newBalance = balance;
    let tradeResult = {};

    // Handle break even case for trades mode
    if (outcome === "breakEven") {
      // For break even, we don't change the balance
      tradeResult = { 
        outcome: "breakEven", 
        profit: 0,
        loss: 0
      };
      
      const updatedTrades = [...tradesToday];
      updatedTrades[tradeIndex] = tradeResult;
      setTradesToday(updatedTrades);
      
      const tradeLog = {
        day: currentDay,
        tradeNum: tradeIndex + 1,
        outcome: "breakEven",
        contracts: contractsForTrade,
        oldBalance,
        newBalance,
        isBreakEven: true
      };
      
      saveTradeLog(tradeLog);
      return;
    } else if (contractsForTrade > 0) {
      if (outcome === "win") {
        const profit =
          contractsForTrade *
          (Number(settings.target) * Number(settings.dollarValueOfPoints));
        newBalance += profit;
        tradeResult = { outcome, profit };
      } else if (outcome === "loss") {
        const loss =
          contractsForTrade *
          (Number(settings.stopLossPoints) * Number(settings.dollarValueOfPoints));
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
      profit: tradeResult.profit,
      loss: tradeResult.loss,
      isBreakEven: false
    };
    saveTradeLog(tradeLog);
  };

  // Next Day
  const handleNextDay = () => {
    setCurrentDay(currentDay + 1);
    setDailyStartBalance(balance); // Update daily start balance for the new day
    
    if (settings.mode !== "fixedStop") {
      setTradesToday(Array(Number(settings.tradesPerDay)).fill(null));
    } else {
      setStopLossRemaining(Number(settings.fixedStopLoss) || 0);
      setTradesToday([null]); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8">
      {/* Current Stats Card */}
      <CurrentStatsCard
        balance={balance}
        contractsForTrade={contractsForTrade}
        tradesToday={tradesToday}
        tradesPerDay={settings.tradesPerDay}
        stopLossRemaining={stopLossRemaining}
        isFixedStop={settings.mode === "fixedStop"}
      />

      {/* Rules Card */}
      <RulesCard settings={settings} />

      {settings.mode === "fixedStop" && stopLossRemaining <= 0 && (
        <div className="text-center text-red-500 font-bold text-2xl mb-4">
          YOU ARE DONE FOR THE DAY
        </div>
      )}

      {settings.mode !== "fixedStop" && tradesToday.filter(trade => trade !== null).length >= settings.tradesPerDay && (
        <div className="text-center text-red-500 font-bold text-2xl mb-4">
          YOU ARE DONE FOR THE DAY
        </div>
      )}

      <TrackerSection
        tradesToday={tradesToday}
        onTradeOutcome={handleTradeOutcome}
        onNextDay={handleNextDay}
        settings={settings}
      />
      {/*Summary Stats Card*/}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-1 pb-6 gap-8">
        <SummaryStatsCard summaryStats={summaryStats} />
        
      </div>
      
      {/* Historical Chart */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8">     
        <HistoricalChart historicalData={historicalData} />
      </div>

      {/* Planner Stats Card */}
      <PlannerStatsCard settings={settings} />
    </div>
  );
}

export default Dashboard;
