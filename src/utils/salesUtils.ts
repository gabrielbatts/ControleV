export const calculateTotalSales = (sales) => {
    return sales.reduce((total, sale) => total + sale.amount, 0);
  };
  
  export const calculateProfit = (totalSales, totalCosts) => {
    return totalSales - totalCosts;
  };
  