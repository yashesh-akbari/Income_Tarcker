let incomeData = JSON.parse(localStorage.getItem('incomeData')) || [];
let incomeTarget = localStorage.getItem('incomeTarget') || 0;
let targetDate = localStorage.getItem('targetDate') || '';

document.getElementById('income-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value);
  const source = document.getElementById('source').value;
  const date = document.getElementById('date').value;

  const entry = { id: Date.now(), amount, source, date };
  incomeData.push(entry);
  localStorage.setItem('incomeData', JSON.stringify(incomeData));

  this.reset();
  renderList();
  updateMonthlyTotal();
  updateRemainingAmount();
  updateDaysLeft();
});

function renderList() {
  const list = document.getElementById('income-list');
  list.innerHTML = '';
  incomeData.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${entry.date} - ₹${entry.amount} from ${entry.source}</span>
      <button onclick="editEntry(${entry.id})">Edit</button>
      <button onclick="deleteEntry(${entry.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteEntry(id) {
  incomeData = incomeData.filter(entry => entry.id !== id);
  localStorage.setItem('incomeData', JSON.stringify(incomeData));
  renderList();
  updateMonthlyTotal();
  updateRemainingAmount();
  updateDaysLeft();
}

function editEntry(id) {
  const entry = incomeData.find(e => e.id === id);
  const newAmount = prompt("Edit Amount:", entry.amount);
  const newSource = prompt("Edit Source:", entry.source);
  const newDate = prompt("Edit Date:", entry.date);

  if (newAmount && newSource && newDate) {
    entry.amount = parseFloat(newAmount);
    entry.source = newSource;
    entry.date = newDate;
    localStorage.setItem('incomeData', JSON.stringify(incomeData));
    renderList();
    updateMonthlyTotal();
    updateRemainingAmount();
    updateDaysLeft();
  }
}

function updateMonthlyTotal() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const total = incomeData
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    })
    .reduce((sum, entry) => sum + entry.amount, 0);

  document.getElementById('total-monthly').textContent = total.toFixed(2);
}

function setTarget() {
  const target = document.getElementById('target').value;
  const targetDateInput = document.getElementById('target-date').value;
  
  incomeTarget = target;
  targetDate = targetDateInput;
  localStorage.setItem('incomeTarget', target);
  localStorage.setItem('targetDate', targetDate);
  
  displayTarget();
  updateRemainingAmount();
  updateDaysLeft();
}

function displayTarget() {
  document.getElementById('target-display').textContent = `Your target: ₹${incomeTarget}`;
}

function updateRemainingAmount() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalThisMonth = incomeData
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    })
    .reduce((sum, entry) => sum + entry.amount, 0);

  const remainingAmount = incomeTarget - totalThisMonth;
  document.getElementById('remaining-display').textContent = `Remaining Amount: ₹${remainingAmount.toFixed(2)}`;
}

function updateDaysLeft() {
  const now = new Date();
  const targetDateObj = new Date(targetDate);

  const timeDifference = targetDateObj - now;
  const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days

  if (daysLeft >= 0) {
    document.getElementById('days-left-display').textContent = `Days left to target: ${daysLeft} days`;
  } else {
    document.getElementById('days-left-display').textContent = 'Target date has passed!';
  }
}

// On Load
renderList();
updateMonthlyTotal();
displayTarget();
updateRemainingAmount();
updateDaysLeft();
