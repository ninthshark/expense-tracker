const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const radioIncome = document.getElementById("income");
const radioExpense = document.getElementById("expense");
const radioError = document.getElementById("radio-error");
const transactionError = document.getElementById("transaction-error");
const emptyTransaction = document.querySelector(".empty-transaction");
const expensePercent = document.querySelector(".expense-pc");

let dummyTransactions = [
  // { id: 1, text: "Flower", amount: -20 },
  // { id: 2, text: "Salary", amount: 300 },
  // { id: 3, text: "Book", amount: -10 },
  // { id: 4, text: "Camera", amount: 150 },
];

const errors = {
  radioChecked: false,
  transactionEntry: false,
};

const localStarageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStarageTransactions : [];

const addTransactionDOM = (transaction) => {
  const sign = transaction.amount < 0 ? "-" : "+";
  const itemClassName = transaction.amount < 0 ? "minus" : "plus";
  const item = document.createElement("li");

  item.classList.add(itemClassName);

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeItem(${
    transaction.id
  })">x</button>
  `;

  list.appendChild(item);
};

const transactionUpdate = () => {
  list.innerHTML = "";
  // transactions.forEach((transaction) => {
  //   addTransactionDOM(transaction);
  // });

  transactions.forEach(addTransactionDOM);
  // updateLocalStorage();
  emptyTransactionDispaly(list);
  updateValue();
};

const emptyTransactionDispaly = (list) => {
  if (list.children.length === 0) {
    emptyTransaction.classList.add("active");
  } else {
    emptyTransaction.classList.remove("active");
  }
};

const removeItem = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  transactionUpdate();
};

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

const addTransaction = (e) => {
  e.preventDefault();

  // check if imcome or expense radio button checked
  if (!radioIncome.checked && !radioExpense.checked) {
    errors.radioChecked = true;
    errorDisplay();
    return;
  } else {
    errors.radioChecked = false;
    errorDisplay();
  }

  if (text.value.trim() === "" || amount.value.trim() === "") {
    errors.transactionEntry = true;
    errorDisplay();

    return;
  } else {
    errors.radioChecked = false;
    errors.transactionEntry = false;

    const transaction = {
      id: generateId(),
      text: text.value,
      amount: +(radioExpense.checked ? -1 * amount.value : amount.value),
    };
    transactions.push(transaction);

    //   addTransactionDOM(transaction);
    updateLocalStorage();
    transactionUpdate();
    updateValue();
    errorDisplay();

    // reset value to default
    text.value = "";
    amount.value = "";
    text.focus();
  }
};

const updateValue = () => {
  const amountValues = transactions.map((transaction) => transaction.amount);
  const total = amountValues.reduce((acc, cur) => (acc += cur), 0).toFixed(2);
  const income = transactions
    .filter((transaction) => transaction.amount >= 0)
    .reduce((acc, { amount }) => (acc += amount), 0)
    .toFixed(2);

  const expense = (
    -1 *
    amountValues
      .filter((value) => value < 0)
      .reduce((acc, value) => (acc += value), 0)
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
  expensePercent.innerText =
    income > 0 ? `${Math.round((expense / income) * 100)}%` : `100%`;
};

const errorDisplay = () => {
  errors.radioChecked
    ? (radioError.innerText = "* Income or Expense")
    : (radioError.innerText = "");
  errors.transactionEntry
    ? (transactionError.innerText = "* Transaction needs both entries")
    : (transactionError.innerText = "");
};

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

transactionUpdate();

form.addEventListener("submit", addTransaction);
