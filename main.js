let spendings;
let monthlySpendingHistory;
let startingBalance;

fetchExpensesData().then(() => displayCurrentBalance());

async function fetchExpensesData() {
  const response = await fetch('matt-coding-challenge-data.json');
  const expensesData = await response.json();
  startingBalance = expensesData['starting_balance'];
  spendings = expensesData['spendings'];
  monthlySpendingHistory = expensesData['monthly_spending_history_in_reverse_order'];
}

function displayCurrentBalance() {
  const totalSpent = monthlySpendingHistory.reduce((sum, currentAmount) => sum + currentAmount);
  const currentBalanceSpan = document.querySelector('.current-balance');
  currentBalanceSpan.textContent = startingBalance - totalSpent;
}
