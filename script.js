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

  closeModal();

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

  closeModal();

  document.getElementById("expenseAmount").value = "";
  document.getElementById("expenseNote").value = "";

}

function quickAdd(amount) {

  data.expenses.push({
    category: "Makan",
    amount: amount,
    note: "Quick Add",
    date: new Date().toISOString()
  });

  saveData();

  render();

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

  openModal();

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

function openModal() {

  document
    .getElementById("modal")
    .classList.remove("hidden");

}

function closeModal() {

  document
    .getElementById("modal")
    .classList.add("hidden");

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

  const totalRemaining =
    foodRemaining +
    snackRemaining +
    otherRemaining;

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

  // HERO

  document.getElementById("heroLimit").innerHTML =
    formatRupiah(dailyLimit);

  document.getElementById("heroRemaining").innerHTML =
    formatRupiah(totalRemaining);

  document.getElementById("heroDays").innerHTML =
    remainingDays + " Hari";

  // STATUS

  const heroStatus =
    document.getElementById("heroStatus");

  if (dailyLimit >= 40000) {

    heroStatus.innerHTML =
      "🟢 AMAN";

    heroStatus.className =
      "mt-4 inline-block px-4 py-2 rounded-full bg-green-500 text-sm font-bold";

  } else if (dailyLimit >= 20000) {

    heroStatus.innerHTML =
      "🟡 HEMAT DIKIT";

    heroStatus.className =
      "mt-4 inline-block px-4 py-2 rounded-full bg-yellow-400 text-black text-sm font-bold";

  } else {

    heroStatus.innerHTML =
      "🔴 BOROS";

    heroStatus.className =
      "mt-4 inline-block px-4 py-2 rounded-full bg-red-500 text-sm font-bold";

  }

  // SUMMARY

  document.getElementById("foodSummary").innerHTML =
    formatRupiah(foodRemaining);

  document.getElementById("snackSummary").innerHTML =
    formatRupiah(snackRemaining);

  document.getElementById("otherSummary").innerHTML =
    formatRupiah(otherRemaining);

  // HISTORY

  const history =
    document.getElementById("history");

  history.innerHTML = "";

  const reversedExpenses =
    data.expenses.slice().reverse();

  reversedExpenses.forEach((item, reversedIndex) => {

    const originalIndex =
      data.expenses.length - 1 - reversedIndex;

    history.innerHTML += `

      <div class="bg-white rounded-2xl p-4 shadow-sm">

        <div class="flex justify-between items-center">

          <div>

            <div class="font-bold">
              ${item.category}
            </div>

            <div class="text-sm text-gray-500">
              ${item.note || "-"}
            </div>

          </div>

          <div class="text-right">

            <div class="font-bold">
              ${formatRupiah(item.amount)}
            </div>

            <div class="flex gap-2 mt-2">

              <button
                onclick="editExpense(${originalIndex})"
                class="text-blue-500 text-sm"
              >
                Edit
              </button>

              <button
                onclick="deleteExpense(${originalIndex})"
                class="text-red-500 text-sm"
              >
                Hapus
              </button>

            </div>

          </div>

        </div>

      </div>

    `;

  });

}

render();