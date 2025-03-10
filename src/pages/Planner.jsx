import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase"; // Import auth and db
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions

function Planner() {
  // ... (rest of your state variables: mode, tradesPerDay, etc.) ...
  const [mode, setMode] = useState("trades"); // "trades" or "fixedStop"
  const [tradesPerDay, setTradesPerDay] = useState(3);
  const [fixedStopLoss, setFixedStopLoss] = useState(10); // Now interpreted as daily loss amount in dollars
  const [winRate, setWinRate] = useState(60);
  const [riskPercent, setRiskPercent] = useState(5);
  const [target, setTarget] = useState(15);
  const [dollarValueOfPoints, setDollarValueOfPoints] = useState(2);
  const [initialBalance, setInitialBalance] = useState(500);
  const [stopLossPoints, setStopLossPoints] = useState(10); // New state for stop loss points
  const [savedMessage, setSavedMessage] = useState("");
  const [beTriggerPoints, setBeTriggerPoints] = useState(1); // NEW: State for B/E Trigger Points

  useEffect(() => {
    const fetchSettings = async () => {
      if (auth.currentUser) {
        // User is logged in, load from Firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userSettings = docSnap.data().settings;
          setMode(userSettings.mode || "trades");
          setTradesPerDay(Number(userSettings.tradesPerDay) || 3);
          setFixedStopLoss(Number(userSettings.fixedStopLoss) || 10);
          setWinRate(Number(userSettings.winRate) || 60);
          setRiskPercent(Number(userSettings.riskPercent) || 5);
          setTarget(Number(userSettings.target) || 15);
          setDollarValueOfPoints(Number(userSettings.dollarValueOfPoints) || 2);
          setInitialBalance(Number(userSettings.initialBalance) || 500);
          setStopLossPoints(Number(userSettings.stopLossPoints) || 10);
          setBeTriggerPoints(Number(userSettings.beTriggerPoints) || 1); // NEW: Load B/E Trigger Points
        } else {
          // handle if no document exists. In this case, get from localStorage
          const storedSettings = JSON.parse(localStorage.getItem("tradeSettings"));
          if (storedSettings) {
            setMode(storedSettings.mode || "trades");
            setTradesPerDay(Number(storedSettings.tradesPerDay) || 3);
            setFixedStopLoss(Number(storedSettings.fixedStopLoss) || 10);
            setWinRate(Number(storedSettings.winRate) || 60);
            setRiskPercent(Number(storedSettings.riskPercent) || 5);
            setTarget(Number(storedSettings.target) || 15);
            setDollarValueOfPoints(Number(storedSettings.dollarValueOfPoints) || 2);
            setInitialBalance(Number(storedSettings.initialBalance) || 500);
            setStopLossPoints(Number(storedSettings.stopLossPoints) || 10);
            setBeTriggerPoints(Number(storedSettings.beTriggerPoints) || 1); // NEW: Load B/E Trigger Points
          }
        }
      } else {
        // Not logged in, load from localStorage
        const storedSettings = JSON.parse(localStorage.getItem("tradeSettings"));
        if (storedSettings) {
          setMode(storedSettings.mode || "trades");
          setTradesPerDay(Number(storedSettings.tradesPerDay) || 3);
          setFixedStopLoss(Number(storedSettings.fixedStopLoss) || 10);
          setWinRate(Number(storedSettings.winRate) || 60);
          setRiskPercent(Number(storedSettings.riskPercent) || 5);
          setTarget(Number(storedSettings.target) || 15);
          setDollarValueOfPoints(Number(storedSettings.dollarValueOfPoints) || 2);
          setInitialBalance(Number(storedSettings.initialBalance) || 500);
          setStopLossPoints(Number(storedSettings.stopLossPoints) || 10);
          setBeTriggerPoints(Number(storedSettings.beTriggerPoints) || 1); // NEW: Load B/E Trigger Points
        }
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    const settings = {
      mode,
      tradesPerDay,
      fixedStopLoss,
      winRate,
      riskPercent,
      target,
      dollarValueOfPoints,
      initialBalance,
      stopLossPoints,
      beTriggerPoints, // NEW: Save B/E Trigger Points
    };

    if (auth.currentUser) {
      // User is logged in, save to Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { settings }, { merge: true });
    }

    // Always save to local storage (fallback if not logged in, and for immediate persistence)
    localStorage.setItem("tradeSettings", JSON.stringify(settings));
    setSavedMessage("Preferences saved!");
    setTimeout(() => setSavedMessage(""), 2000);
  };

  // ... (rest of your component's JSX) ...
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-6">Planner</h1>
      <div className="bg-white text-gray-900 max-w-md w-full p-6 rounded shadow">
        {savedMessage && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
            {savedMessage}
          </div>
        )}
        <div className="mb-4">
          <label className="block font-medium mb-1">Choose Mode:</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                value="trades"
                checked={mode === "trades"}
                onChange={(e) => setMode(e.target.value)}
              />
              <span className="ml-2">Trades Per Day</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                value="fixedStop"
                checked={mode === "fixedStop"}
                onChange={(e) => setMode(e.target.value)}
              />
              <span className="ml-2">Fixed Stop Loss Amount</span>
            </label>
          </div>
        </div>

        {mode === "trades" && (
          <div className="mb-4">
            <label className="block font-medium mb-1">Trades Per Day</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={tradesPerDay}
              onChange={(e) => setTradesPerDay(Number(e.target.value))}
            />
          </div>
        )}

        {mode === "fixedStop" && (
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Daily Loss Amount ($)
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={fixedStopLoss}
              onChange={(e) => setFixedStopLoss(Number(e.target.value))}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block font-medium mb-1">Win Rate (%)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={winRate}
            onChange={(e) => setWinRate(Number(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Risk % (of Account)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={riskPercent}
            onChange={(e) => setRiskPercent(Number(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Stop Loss Points</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={stopLossPoints}
            onChange={(e) => setStopLossPoints(Number(e.target.value))}
          />
        </div>
         {/* NEW: B/E Trigger Points */}
         <div className="mb-4">
          <label className="block font-medium mb-1">B/E Trigger Points</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={beTriggerPoints}
            onChange={(e) => setBeTriggerPoints(Number(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Target (Points)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Dollar Value of Points</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={dollarValueOfPoints}
            onChange={(e) => setDollarValueOfPoints(Number(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Initial Account Balance</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={initialBalance}
            onChange={(e) => setInitialBalance(Number(e.target.value))}
          />
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
