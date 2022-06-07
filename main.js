let spendings;
let monthlySpendingHistory;
let startingBalance;

const currentDay = '2022-06-01';

fetchExpensesData().then(() => render());

async function fetchExpensesData() {
  const response = await fetch('matt-coding-challenge-data.json');
  const expensesData = await response.json();
  startingBalance = expensesData['starting_balance'];
  spendings = expensesData['spendings'];
  monthlySpendingHistory = expensesData['monthly_spending_history_in_reverse_order'];
}

function getDeviation(amount, controlAmount) {
  const deviation = ((amount - controlAmount) / controlAmount) * 100;
  const sign = deviation >= 0 ? '+' : '-';
  return [Number.parseFloat(deviation).toFixed(1), sign];
}

function getSpendingHTML(spending, maxSpending) {
  const [date, amount] = spending;
  const spendingTemplate = document.querySelector('template');
  const spendingHTML = spendingTemplate.content.cloneNode(true);

  const tooltip = spendingHTML.querySelector('.spending-tooltip');
  tooltip.innerText = `$${amount.toFixed(2)}`;

  const bar = spendingHTML.querySelector('.bar');
  bar.style.height = `${(amount / maxSpending) * 100}%`;
  bar.addEventListener('pointerenter', () => (tooltip.style.display = 'flex'));
  bar.addEventListener('pointerleave', () => (tooltip.style.display = 'none'));

  if (date === currentDay) {
    bar.classList.add('current-day');
  }

  const weekday = spendingHTML.querySelector('.weekday');
  weekday.textContent = getWeekday(date);

  return spendingHTML;
}

function getWeekday(dateString) {
  const weekdayFormat = new Intl.DateTimeFormat('en', { weekday: 'short' });
  const date = new Date(dateString);
  return weekdayFormat.format(date).toLowerCase();
}

function render() {
  const totalSpent = monthlySpendingHistory.reduce((sum, currentAmount) => sum + currentAmount);
  const currentMonthTotal = monthlySpendingHistory[0];
  const lastMonthTotal = monthlySpendingHistory[1];
  const [deviation, sign] = getDeviation(currentMonthTotal, lastMonthTotal);

  document.querySelector('.current-balance').textContent = `$${startingBalance - totalSpent}`;
  document.querySelector('.total-spent-this-month').textContent = `$${currentMonthTotal}`;
  document.querySelector('.deviation-from-last-month').textContent = `${sign}${deviation}%`;
  renderBarChart();
}

function renderBarChart() {
  const spendingEntries = Object.entries(spendings);
  const maxSpending = Math.max(...Object.values(spendings));
  spendingEntries.forEach((spending) => {
    const html = getSpendingHTML(spending, maxSpending);
    document.querySelector('.bar-chart').appendChild(html);
  });
}
