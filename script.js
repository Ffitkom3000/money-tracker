function createDefaultData() {

  return {

    budgets: {
      food: 0,
      snack: 0,
      rent: 0,
      other: 0
    },

    expenses: []

  };

}

let data;
let editIndex = null;

try {

  const savedData =
    JSON.parse(localStorage.getItem("moneyTracker"));

  if (
    !savedData ||
    !savedData.budgets
  ) {

    data = createDefaultData();

  } else {

    data = savedData;

  }

} catch {

  data = createDefaultData();

}

function saveData() {

  localStorage.setItem(
    "moneyTracker",
    JSON.stringify(data)
  );

}

function formatRupiah(number) {

  return "Rp " +
    Number(number).toLocaleString("id-ID");

}

function saveBudget() {

  data.budgets.food =
    Number(document.getElementById("foodBudget").value);

  data.budgets.snack =
    Number(document.getElementById("snackBudget").value);

  data.budgets.rent =
    Number(document.getElementById("rentBudget").value);

  data.budgets.other =
    Number(document.getElementById("otherBudget").value);

  saveData();

  render();

  alert("✅ Budget berhasil disimpan");

}

function addExpense() {

  const category =
    document.getElementById("expenseCategory").value;

  const amount =
    Number(document.getElementById("expenseAmount").value);

  const note =
    document.getElementById("expenseNote").value;

  if (!amount || amount <= 0) {

    alert("Masukkan nominal!");

    return;

  }

  const expenseData = {
    category,
    amount,
    note,
    date: new Date().toISOString()
  };

  if (editIndex !== null) {

    data.expenses[editIndex] =
      expenseData;

    editIndex = null;

    alert("✏️ Pengeluaran berhasil diupdate");

  } else {

    data.expenses.push(expenseData);

  }

  saveData();

  render();

  document.getElementById("expenseAmount").value = "";
  document.getElementById("expenseNote").value = "";

}

function editExpense(index) {

  const item =
    data.expenses[index];

  document.getElementById("expenseCategory").value =
    item.category;

  document.getElementById("expenseAmount").value =
    item.amount;

  document.getElementById("expenseNote").value =
    item.note;

  editIndex = index;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}

function deleteExpense(index) {

  const confirmDelete =
    confirm("Hapus pengeluaran ini?");

  if (!confirmDelete) return;

  data.expenses.splice(index, 1);

  saveData();

  render();

}

function deleteAllData() {

  const confirmDelete =
    confirm(
      "Hapus semua data? Tindakan ini tidak bisa dibatalkan."
    );

  if (!confirmDelete) return;

  localStorage.removeItem("moneyTracker");

  data = createDefaultData();

  render();

  alert("🗑 Semua data berhasil dihapus");

}

function getTotal(category) {

  return data.expenses
    .filter(item => item.category === category)
    .reduce((sum, item) => sum + item.amount, 0);

}

function render() {

  const foodSpent =
    getTotal("Makan");

  const snackSpent =
    getTotal("Jajan");

  const otherSpent =
    getTotal("Lain-lain");

  const foodRemaining =
    data.budgets.food - foodSpent;

  const snackRemaining =
    data.budgets.snack - snackSpent;

  const otherRemaining =
    data.budgets.other - otherSpent;

  const today = new Date();

  const lastDay =
    new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

  const remainingDays =
    lastDay - today.getDate() + 1;

  const dailyLimit =
    Math.floor(foodRemaining / remainingDays);

  document.getElementById("foodSummary").innerHTML = `

    <div class="font-bold text-lg">
      🍜 Sisa Makan
    </div>

    <div class="text-2xl font-bold mt-2">
      ${formatRupiah(foodRemaining)}
    </div>

    <div class="text-sm text-gray-500 mt-2">
      Maksimal per hari:
      ${formatRupiah(dailyLimit)}
    </div>

  `;

  document.getElementById("snackSummary").innerHTML = `

    <div class="font-bold text-lg">
      🍟 Sisa Jajan
    </div>

    <div class="text-2xl font-bold mt-2">
      ${formatRupiah(snackRemaining)}
    </div>

  `;

  document.getElementById("otherSummary").innerHTML = `

    <div class="font-bold text-lg">
      📦 Sisa Lain-lain
    </div>

    <div class="text-2xl font-bold mt-2">
      ${formatRupiah(otherRemaining)}
    </div>

  `;

  const history =
    document.getElementById("history");

  history.innerHTML = "";

  const reversedExpenses =
    data.expenses.slice().reverse();

  reversedExpenses.forEach((item, reversedIndex) => {

    const originalIndex =
      data.expenses.length - 1 - reversedIndex;

    history.innerHTML += `

      <div class="border p-3 rounded-2xl">

        <div class="flex justify-between items-center">

          <div>

            <div class="font-bold">
              ${item.category}
            </div>

            <div class="text-sm text-gray-500">
              ${item.note || "-"}
            </div>

          </div>

          <div class="font-bold">
            ${formatRupiah(item.amount)}
          </div>

        </div>

        <div class="flex gap-2 mt-3">

          <button
            onclick="editExpense(${originalIndex})"
            class="flex-1 bg-blue-500 text-white p-2 rounded-xl"
          >
            Edit
          </button>

          <button
            onclick="deleteExpense(${originalIndex})"
            class="flex-1 bg-red-500 text-white p-2 rounded-xl"
          >
            Hapus
          </button>

        </div>

      </div>

    `;

  });

}

render();