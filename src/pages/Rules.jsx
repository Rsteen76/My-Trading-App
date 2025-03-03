// src/pages/Rules.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase"; // Import auth and db
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions

function Rules() {
  // State for the trading rules - an array of strings
  const [rules, setRules] = useState([""]); // Start with one empty rule
  const [savedMessage, setSavedMessage] = useState("");

  // Load rules from localStorage or Firebase on mount
  useEffect(() => {
    const fetchRules = async () => {
      if (auth.currentUser) {
        // User is logged in, load from Firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.tradingRules) {
            setRules(userData.tradingRules); // Load rules from Firestore
          } else {
            setRules([""]); // Ensure one empty rule if there are none
          }
        }
      } else {
        // Not logged in, load from localStorage
        const storedRules = JSON.parse(localStorage.getItem("tradingRules"));
        if (storedRules) {
          setRules(storedRules); // Load rules from localStorage
        } else {
          setRules([""]); // Ensure one empty rule if there are none
        }
      }
    };

    fetchRules();
  }, []);

  // Save rules to localStorage and Firebase
  const handleSave = async () => {
    // Filter out empty rules before saving
    const filteredRules = rules.filter(rule => rule.trim() !== "");
    
    if (auth.currentUser) {
      // User is logged in, save to Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { tradingRules: filteredRules }, { merge: true });
    }

    localStorage.setItem("tradingRules", JSON.stringify(filteredRules));
    setSavedMessage("Rules saved!");
    setTimeout(() => setSavedMessage(""), 2000);
  };

  // Handle changes to a rule's text
  const handleRuleChange = (index, value) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  // Add a new empty rule
  const handleAddRule = () => {
    if (rules.length < 5) {
      setRules([...rules, ""]);
    }
  };

  // Remove a rule
  const handleRemoveRule = (index) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
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
        
        {/* Display the rules */}
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={index} className="mb-4 flex items-center">
              <textarea
                className="w-full p-2 border border-gray-300 rounded resize-none"
                rows="2"
                value={rule}
                onChange={(e) => handleRuleChange(index, e.target.value)}
                placeholder={`Enter rule ${index + 1}`}
              />
              {rules.length > 1 && (
                <button
                  onClick={() => handleRemoveRule(index)}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Button to add a new rule */}
        {rules.length < 5 && (
          <button
            onClick={handleAddRule}
            className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Add Rule
          </button>
        )}

        {/* Save button */}
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
