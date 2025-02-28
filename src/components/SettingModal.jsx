// src/components/dashboard/SettingsModal.jsx

import React, { useState } from "react";

function SettingsModal({ settings, onSave, onCancel }) {
  const [formData, setFormData] = useState({ ...settings });
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Trading Settings</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Balance
                </label>
                <input
                  type="number"
                  name="initialBalance"
                  value={formData.initialBalance}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contracts Per Trade
                </label>
                <input
                  type="number"
                  name="contractsPerTrade"
                  value={formData.contractsPerTrade}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trades Per Day
                </label>
                <input
                  type="number"
                  name="tradesPerDay"
                  value={formData.tradesPerDay}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  max="20"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stop Loss Type
                </label>
                <select
                  name="stopLossType"
                  value={formData.stopLossType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="fixed">Fixed Dollar Amount</option>
                  <option value="trades">Max Number of Trades</option>
                </select>
              </div>
              
              {formData.stopLossType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Stop Loss Amount ($)
                  </label>
                  <input
                    type="number"
                    name="stopLossAmount"
                    value={formData.stopLossAmount}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    step="50"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Win Amount Per Contract ($)
                </label>
                <input
                  type="number"
                  name="winAmount"
                  value={formData.winAmount}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="10"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loss Amount Per Contract ($)
                </label>
                <input
                  type="number"
                  name="lossAmount"
                  value={formData.lossAmount}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="10"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Per Contract ($)
                </label>
                <input
                  type="number"
                  name="commissionPerContract"
                  value={formData.commissionPerContract}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  step="0.5"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
