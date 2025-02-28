// src/pages/Rules.jsx
import React, { useState, useEffect } from "react";

function Rules() {
  const [rules, setRules] = useState([""]);
  const [savedMessage, setSavedMessage] = useState("");

  // Load rules from localStorage on mount
  useEffect(() => {
    const storedRules = JSON.parse(localStorage.getItem("tradingRules"));
    if (storedRules) {
      setRules(storedRules);
    }
  }, []);

  const handleRuleChange = (index, value) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  const handleAddRule = () => {
    if (rules.length < 5) {
      setRules([...rules, ""]);
    }
  };

  const handleSave = () => {
    // Filter out empty rules before saving
    const filteredRules = rules.filter(rule => rule.trim() !== "");
    localStorage.setItem("tradingRules", JSON.stringify(filteredRules));
    setSavedMessage("Rules saved!");
    setTimeout(() => setSavedMessage(""), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-6">Trading Rules</h1>
      <div className="bg-white text-gray-900 max-w-md w-full p-6 rounded shadow">
        {savedMessage && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
            {savedMessage}
          </div>
        )}
        
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={index} className="mb-4">
              <label className="block font-medium mb-1">
                Rule {index + 1}
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded resize-none"
                rows="2"
                value={rule}
                onChange={(e) => handleRuleChange(index, e.target.value)}
                placeholder={`Enter rule ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {rules.length < 5 && (
          <button
            onClick={handleAddRule}
            className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Add Rule
          </button>
        )}

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Save Rules
        </button>
      </div>
    </div>
  );
}

export default Rules;
