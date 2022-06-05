let spendings;
let monthlySpendingHistory;
let startingBalance;
let currentMonthTotal;

fetchExpensesData().then(() => {
  displayCurrentBalance();
  displayTotalSpentThisMonth();
  displayDeviationFromLastMonth();
});

async function fetchExpensesData() {
  const response = await fetch('matt-coding-challenge-data.json');
  const expensesData = await response.json();
  startingBalance = expensesData['starting_balance'];
  spendings = expensesData['spendings'];
  monthlySpendingHistory = expensesData['monthly_spending_history_in_reverse_order'];
  currentMonthTotal = monthlySpendingHistory[0];
}

function displayCurrentBalance() {
  const totalSpent = monthlySpendingHistory.reduce((sum, currentAmount) => sum + currentAmount);
  const el = document.querySelector('.current-balance');
  el.textContent = `$${startingBalance - totalSpent}`;
}

function displayTotalSpentThisMonth() {
  const el = document.querySelector('.total-spent-this-month');
  el.textContent = `$${currentMonthTotal}`;
}

function displayDeviationFromLastMonth() {
  const lastMonthTotal = monthlySpendingHistory[1];
  const deviation = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
  const el = document.querySelector('.deviation-from-last-month');
  const sign = deviation >= 0 ? '+' : '-';
  el.textContent = `${sign} ${Number.parseFloat(deviation).toFixed(1)}%`;
}

function getWeekday(dateString) {
  const weekdayFormat = new Intl.DateTimeFormat('en', { weekday: 'short' });
  const date = new Date(dateString);
  return weekdayFormat.format(date).toLowerCase();
}
