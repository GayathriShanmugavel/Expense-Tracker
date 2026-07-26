
async function apiCall(payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

function getUser() {
  const raw = localStorage.getItem('ef_user');
  return raw ? JSON.parse(raw) : null;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function fmtMoney(n) {
  const num = Number(n) || 0;
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

const CATEGORY_ICON = {
  Food: '🍔',
  Travel: '🚗',
  Shopping: '🛒',
  Bills: '💡',
  Entertainment: '🎉',
  Health: '🏥',
  Education: '📚',
  Income: '💼'
};


/* ---------------- Dashboard page ---------------- */
function initDashboard() {
  const user = getUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('greeting').textContent = `Hi ${user.name.split(' ')[0]}, here's your overview`;
  document.getElementById('userLabel').textContent = user.email;

  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('ef_user');
    window.location.href = 'index.html';
  });

  const backdrop = document.getElementById('modalBackdrop');
  const form = document.getElementById('txForm');
  const modalTitle = document.getElementById('modalTitle');
  const categorySelect = document.getElementById('txCategory');
const customCategoryBox = document.getElementById('customCategoryBox');
const customCategoryInput = document.getElementById('customCategory');

categorySelect.addEventListener('change', () => {
  if (categorySelect.value === 'Others') {
    customCategoryBox.style.display = 'block';
  } else {
    customCategoryBox.style.display = 'none';
    customCategoryInput.value = '';
  }
});

function openModal(type, existing) {
  form.reset();

  document.getElementById('txType').value = type;
  document.getElementById('txId').value = existing ? existing.id : '';
  document.getElementById('txDate').value = existing
    ? existing.date
    : new Date().toISOString().slice(0, 10);

  const predefined = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Income"
  ];

  if (existing) {
    if (predefined.includes(existing.category)) {
      categorySelect.value = existing.category;
      customCategoryBox.style.display = 'none';
      customCategoryInput.value = '';
    } else {
      categorySelect.value = 'Others';
      customCategoryBox.style.display = 'block';
      customCategoryInput.value = existing.category;
    }
  } else {
    categorySelect.value = type === 'income' ? 'Income' : 'Food';
    customCategoryBox.style.display = 'none';
    customCategoryInput.value = '';
  }

  document.getElementById('txAmount').value = existing ? existing.amount : '';
  document.getElementById('txNote').value = existing ? existing.note : '';

  modalTitle.textContent = existing
    ? 'Edit Transaction'
    : (type === 'income' ? 'Add Income' : 'Add Expense');

  backdrop.classList.add('open');
}
  function closeModal() { backdrop.classList.remove('open'); }

  document.getElementById('openIncome').addEventListener('click', () => openModal('income', null));
  document.getElementById('openExpense').addEventListener('click', () => openModal('expense', null));
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

  let transactions = [];

  async function loadTransactions() {
    const res = await apiCall({ action: 'getTransactions', email: user.email });
    transactions = (res.status === 'ok' && res.transactions) ? res.transactions : [];
    render();
  }

  function render() {
    const body = document.getElementById('txBody');
    const empty = document.getElementById('emptyState');
    body.innerHTML = '';

    if (transactions.length === 0) {
      empty.style.display = 'block';
    } else {
      empty.style.display = 'none';
      transactions
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(tx => {
          const isIncome = tx.type === 'income';
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${tx.date}</td>
            <td><span class="cat-pill">${CATEGORY_ICON[tx.category] || '📦'} ${tx.category}</span></td>
            <td class="amt ${isIncome ? 'in' : 'out'}">${isIncome ? '+' : '−'}${fmtMoney(tx.amount)}</td>
            <td class="row-actions">
              <button data-edit="${tx.id}">Edit</button>
              <button data-del="${tx.id}">Delete</button>
            </td>`;
          body.appendChild(tr);
        });
    }

    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    document.getElementById('statIncome').textContent = fmtMoney(income);
    document.getElementById('statExpenses').textContent = fmtMoney(expenses);
    document.getElementById('statBalance').textContent = fmtMoney(income - expenses);
    document.getElementById('statSavings').textContent = fmtMoney(Math.max(income - expenses, 0));

    body.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tx = transactions.find(t => String(t.id) === btn.dataset.edit);
        if (tx) openModal(tx.type, tx);
      });
    });
    body.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this transaction?')) return;
        await apiCall({ action: 'deleteTransaction', email: user.email, id: btn.dataset.del });
        showToast('Transaction deleted');
        loadTransactions();
      });
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('txId').value;
    const payload = {
      action: id ? 'editTransaction' : 'addTransaction',
      email: user.email,
      id: id || undefined,
      type: document.getElementById('txType').value,
      date: document.getElementById('txDate').value,
      category: categorySelect.value === 'Others'
        ? customCategoryInput.value.trim()
        : categorySelect.value,
      amount: document.getElementById('txAmount').value,
      note: document.getElementById('txNote').value
    };
    await apiCall(payload);
    closeModal();
    showToast(id ? 'Transaction updated' : 'Transaction added');
    loadTransactions();
  });

  loadTransactions();
}
