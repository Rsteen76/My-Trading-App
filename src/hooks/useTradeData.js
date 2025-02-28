import { useState, useEffect } from "react";

const useTradeData = () => {
  const [tradesToday, setTradesToday] = useState([]);
  const [stats, setStats] = useState({
    totalTrades: 0,
    wins: 0,
    losses: 0,
    breakEvens: 0,
    totalProfit: 0,
    totalLoss: 0,
  });

  useEffect(() => {
    // Fetch or calculate trade data here
    // Example: setTradesToday(fetchedData);

    // Calculate trade statistics
    const totalTrades = tradesToday.length;
    const wins = tradesToday.filter(trade => trade?.outcome === "win").length;
    const losses = tradesToday.filter(trade => trade?.outcome === "loss").length;
    const breakEvens = tradesToday.filter(trade => trade?.outcome === "breakEven").length;
    const totalProfit = tradesToday.reduce((acc, trade) => acc + (trade?.profit || 0), 0);
    const totalLoss = tradesToday.reduce((acc, trade) => acc + (trade?.loss || 0), 0);

    setStats({
      totalTrades,
      wins,
      losses,
      breakEvens,
      totalProfit,
      totalLoss,
    });
  }, [tradesToday]);

  return { tradesToday, stats, setTradesToday };
};

export default useTradeData;
