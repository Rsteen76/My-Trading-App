// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
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
  const [tradesToday, setTradesToday] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [summaryStats, setSummaryStats] = useState(null);
  const [contractsForTrade, setContractsForTrade] = useState(0);
  const [stopLossRemaining, setStopLossRemaining] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = () => {
      const storedSettings = JSON.parse(localStorage.getItem("tradeSettings"));
      if (storedSettings) {
        console.log("Settings loaded:", storedSettings);
        setSettings(storedSettings);
        setBalance(Number(storedSettings.initialBalance) || 500);
        setDailyStartBalance(Number(storedSettings.initialBalance) || 500);

        if (storedSettings.mode === "fixedStop") {
          setStopLossRemaining(Number(storedSettings.fixedStopLoss) || 0);
        }
      }
    };
    
    loadSettings();
  }, []);

  // Load historical data from all trades
  useEffect(() => {
    const loadHistoricalData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tradesLogged"));
        const allTrades = querySnapshot.docs.map(doc => doc.data());
        
        // Update local storage with Firebase data
        localStorage.setItem("tradesLogged", JSON.stringify(allTrades));
        
        // Update historical stats
        aggregateHistoricalData(allTrades);
      } catch (error) {
        console.error("Error loading historical data:", error);
        
        // Fallback to local storage if Firebase fails
        const storedTrades = JSON.parse(localStorage.getItem("tradesLogged")) || [];
        aggregateHistoricalData(storedTrades);
      }
    };
    
    loadHistoricalData();
  }, []);

  // CRITICAL EFFECT: Initialize trades for current date based on settings
  useEffect(() => {
    if (!settings) return;
    
    console.log("Initializing trades for date:", currentDate.toLocaleDateString());
    
    const initializeTradesForCurrentDate = () => {
      // Get completed trades for today
      const storedTrades = JSON.parse(localStorage.getItem("tradesLogged")) || [];
      const completedTrades = storedTrades.filter(
        trade => trade.tradeDate === currentDate.toLocaleDateString()
      );
      
      if (settings.mode === "fixedStop") {
        // Fixed stop mode: show one pending trade if stop loss isn't hit
        if (stopLossRemaining > 0) {
          setTradesToday([...completedTrades, null]);
        } else {
          setTradesToday(completedTrades);
        }
      } 
      else if (settings.mode === "fixedTrades") {
        // Fixed trades mode: show the correct number of trades based on settings
        const maxTrades = parseInt(settings.tradesPerDay, 10) || 0;
        console.log(`Fixed trades mode: ${completedTrades.length}/${maxTrades} completed`);
        
        if (maxTrades <= 0) {
          setTradesToday([]);
          return;
        }
        
        // Create array with completed trades + enough null values to reach maxTrades
        const pendingTradesCount = Math.max(0, maxTrades - completedTrades.length);
        
        // IMPORTANT: Create the array in one go, not incrementally
        const newTradesArray = [
          ...completedTrades,
          ...Array(pendingTradesCount).fill(null)
        ];
        
        console.log("Setting trades array:", newTradesArray);
        setTradesToday(newTradesArray);
      }
    };
    
    // Immediately initialize trades when this effect runs
    initializeTradesForCurrentDate();
    
  }, [settings, currentDate, stopLossRemaining]);

  // Calculate contracts for trade based on risk settings
  useEffect(() => {
    if (settings && dailyStartBalance > 0) {
      const riskPercentDecimal = Number(settings.riskPercent) / 100;
      const dailyRiskAmount = dailyStartBalance * riskPercentDecimal;
      const stopLossPoints = Number(settings.stopLossPoints);
      const pointValue = Number(settings.dollarValueOfPoints);
      const riskPerContract = stopLossPoints * pointValue;
      
      let contracts = 0;
      if (riskPerContract > 0) {
        contracts = Math.floor(dailyRiskAmount / riskPerContract);
      }
      
      setContractsForTrade(contracts);
    }
  }, [dailyStartBalance, settings]);

  // Process historical data for charts and statistics
  const aggregateHistoricalData = (trades) => {
    const dayMap = {};
    
    trades.forEach((trade) => {
      const tradeDate = trade.tradeDate;
      if (!dayMap[tradeDate]) {
        dayMap[tradeDate] = {
          day: tradeDate,
          profit: 0,
          trades: [],
          breakEvenCount: 0,
        };
      }
      
      if (trade.isBreakEven) {
        dayMap[tradeDate].breakEvenCount = (dayMap[tradeDate].breakEvenCount || 0) + 1;
      } else {
        const profit = trade.newBalance - trade.oldBalance;
        dayMap[tradeDate].profit += profit;
      }
      
      dayMap[tradeDate].trades.push(trade);
    });
    
    const daysArray = Object.values(dayMap).sort((a, b) => a.day - b.day);
    setHistoricalData(daysArray);

    // Calculate summary stats
    const totalProfit = daysArray.reduce((sum, d) => sum + d.profit, 0);
    const totalTrades = trades.length;
    const breakEvenTrades = trades.filter((t) => t.isBreakEven).length;
    const totalDays = daysArray.length;
    const averageProfit = totalDays > 0 ? totalProfit / totalDays : 0;

    setSummaryStats({
      totalProfit,
      averageProfit,
      totalTrades,
      lossTrades: trades.filter((t) => t.outcome === "loss").length,
      breakEvenTrades,
      totalDays,
    });
  };

  // Save a trade to both Firestore and local storage
  const saveTradeLog = async (trade) => {
    const tradeToSave = {
      ...trade,
      tradeDate: currentDate.toLocaleDateString(),
      userId: auth.currentUser ? auth.currentUser.uid : null,
    };
    
    try {
      // Save to Firestore
      await addDoc(collection(db, "tradesLogged"), tradeToSave);
      
      // Update local storage
      const storedTrades = JSON.parse(localStorage.getItem("tradesLogged")) || [];
      const updatedTrades = [...storedTrades, tradeToSave];
      localStorage.setItem("tradesLogged", JSON.stringify(updatedTrades));
      
      // Update historical data
      aggregateHistoricalData(updatedTrades);
      
      return tradeToSave;
    } catch (error) {
      console.error("Error saving trade:", error);
      
      // Still update local storage if Firestore fails
      const storedTrades = JSON.parse(localStorage.getItem("tradesLogged")) || [];
      const updatedTrades = [...storedTrades, tradeToSave];
      localStorage.setItem("tradesLogged", JSON.stringify(updatedTrades));
      
      return tradeToSave;
    }
  };

  // Handle trade outcome (win, loss, breakEven)
  const handleTradeOutcome = async (tradeIndex, outcome) => {
    console.log(`Processing outcome for trade ${tradeIndex}: ${outcome}`);
    
    // Create the trade object
    const updatedTrade = {
      outcome,
      profit: 0,
      loss: 0,
      isBreakEven: false
    };
    
    // Calculate profit/loss
    if (outcome !== "breakEven") {
      if (contractsForTrade > 0) {
        if (outcome === "win") {
          updatedTrade.profit = contractsForTrade * (Number(settings.target) * Number(settings.dollarValueOfPoints));
        } else if (outcome === "loss") {
          updatedTrade.loss = contractsForTrade * (Number(settings.stopLossPoints) * Number(settings.dollarValueOfPoints));
        }
      }
    } else {
      updatedTrade.isBreakEven = true;
    }

    // Update balance
    const newBalance = balance + updatedTrade.profit - updatedTrade.loss;
    setBalance(newBalance);
    
    // Update stop loss remaining if in fixedStop mode and this was a loss
    if (settings.mode === "fixedStop" && outcome === "loss") {
      const newStopLossRemaining = stopLossRemaining - updatedTrade.loss;
      setStopLossRemaining(newStopLossRemaining);
    }
    
    // Save the trade
    const tradeToSave = {
      ...updatedTrade,
      oldBalance: balance,
      newBalance
    };
    
    await saveTradeLog(tradeToSave);
    
    // Re-initialize trades for today based on updated data
    const storedTrades = JSON.parse(localStorage.getItem("tradesLogged")) || [];
    const completedTrades = storedTrades.filter(
      trade => trade.tradeDate === currentDate.toLocaleDateString()
    );
    
    if (settings.mode === "fixedStop") {
      // For fixedStop mode
      if (stopLossRemaining - updatedTrade.loss > 0) {
        setTradesToday([...completedTrades, null]);
      } else {
        setTradesToday(completedTrades);
      }
    } 
    else if (settings.mode === "fixedTrades") {
      // For fixedTrades mode
      const maxTrades = parseInt(settings.tradesPerDay, 10) || 0;
      const pendingTradesCount = Math.max(0, maxTrades - completedTrades.length);
      
      setTradesToday([
        ...completedTrades,
        ...Array(pendingTradesCount).fill(null)
      ]);
    }
  };

  // Handle date navigation
  const handlePreviousDay = () => {
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    setCurrentDate(yesterday);
  };

  const handleNextDay = () => {
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    setCurrentDate(tomorrow);
  };

  // Force initialize fixed trades if needed
  const forceInitFixedTrades = () => {
    if (settings?.mode === "fixedTrades") {
      const maxTrades = parseInt(settings.tradesPerDay, 10) || 0;
      setTradesToday(Array(maxTrades).fill(null));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8">
      {/* Current Stats Card */}
      <CurrentStatsCard
        balance={balance}
        contractsForTrade={contractsForTrade}
        tradesToday={tradesToday}
        tradesPerDay={settings?.tradesPerDay}
        stopLossRemaining={stopLossRemaining}
        isFixedStop={settings?.mode === "fixedStop"}
      />

      {/* Rules Card */}
      <RulesCard settings={settings} />

      {settings && settings.mode === "fixedStop" && stopLossRemaining <= 0 && (
        <div className="text-center text-red-500 font-bold text-2xl mb-4">
          YOU ARE DONE FOR THE DAY
        </div>
      )}

      {settings && settings.mode !== "fixedStop" &&
        tradesToday.filter((trade) => trade !== null).length >=
          parseInt(settings?.tradesPerDay || "0", 10) && (
        <div className="text-center text-red-500 font-bold text-2xl mb-4">
          YOU ARE DONE FOR THE DAY
        </div>
      )}

      {settings?.mode === "fixedTrades" && tradesToday.length === 0 && (
        <button 
          onClick={forceInitFixedTrades}
          className="w-full py-3 bg-blue-500 text-white font-bold rounded mb-4 hover:bg-blue-600"
        >
          Create Trades for Today
        </button>
      )}

      <TrackerSection
        tradesToday={tradesToday}
        onTradeOutcome={handleTradeOutcome}
        onNextDay={handleNextDay}
        onPreviousDay={handlePreviousDay}
        settings={settings}
        stopLossRemaining={stopLossRemaining}
        currentDate={currentDate}
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
