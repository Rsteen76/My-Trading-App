// src/components/dashboard/RulesCard.jsx
import React, { useState, useEffect } from "react";

function RulesCard() {
  const [rules, setRules] = useState([]);
  const [checkedStatus, setCheckedStatus] = useState({});

  useEffect(() => {
    const storedRules = JSON.parse(localStorage.getItem("tradingRules")) || [];
    setRules(storedRules);

    const storedStatus = JSON.parse(localStorage.getItem("rulesCheckedStatus")) || {};
    const initialStatus = storedRules.reduce((acc, rule, index) => {
      acc[index] = storedStatus[index] || false;
      return acc;
    }, {});
    setCheckedStatus(initialStatus);
  }, []);

  const handleCheckRule = (index) => {
    const newStatus = { ...checkedStatus, [index]: !checkedStatus[index] };
    setCheckedStatus(newStatus);
    localStorage.setItem("rulesCheckedStatus", JSON.stringify(newStatus));
  };

  const handleReset = () => {
    const resetStatus = Object.keys(checkedStatus).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setCheckedStatus(resetStatus);
    localStorage.setItem("rulesCheckedStatus", JSON.stringify(resetStatus));
  };

  const allRulesChecked = rules.length > 0 && 
    Object.values(checkedStatus).every(status => status);

  if (!rules || rules.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md transition-colors duration-300 mb-6 pb-2${
      allRulesChecked ? 'bg-green-50 border border-green-200' : ''
    }`}>
      <div className="p-4">
        <div className="relative mb-4">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Pre-Trade Checklist</h2>
          <button
            onClick={handleReset}
            className="absolute right-0 top-0 text-sm px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Reset
          </button>
        </div>
        
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 hover:bg-gray-50 rounded"
            >
              <input
                type="checkbox"
                checked={checkedStatus[index] || false}
                onChange={() => handleCheckRule(index)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 
                  focus:ring-blue-500 cursor-pointer"
              />
              <label className={`flex-1 cursor-pointer text-sm ${
                checkedStatus[index] ? 'text-gray-400 line-through' : 'text-gray-700'
              }`}>
                {rule}
              </label>
            </div>
          ))}
        </div>

        {allRulesChecked && (
          <div className="mt-3 text-center text-green-600 text-sm font-medium">
            ✓ Ready to trade
          </div>
        )}
      </div>
    </div>
  );
}

export default RulesCard;
