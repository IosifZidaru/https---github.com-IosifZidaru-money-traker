const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const addButton = document.getElementById("add-btn");

const balanceText = document.getElementById("balance");
const incometext = document.getElementById("income");
const expensesText = document.getElementById("expenses");
const transactionList = document.getElementById("transaction-list");

const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const allBtn = document.getElementById("all-btn");
const incomeBtn = document.getElementById("income-btn");
const expenseBtn = document.getElementById("expense-btn");
const monthFilter = document.getElementById("month-filter");
const searchFilter = document.getElementById("search-filter");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let income = 0;
let expenses = 0;

transactions.forEach(function (transaction) {
    if (transaction.type  === "income") {
        income = income + transaction.amount;
    } else {
        expenses = expenses + transaction.amount;
    }

    const li = document.createElement("li");
    li.dataset.date = transaction.date || "";
    li.dataset.description = transaction.description || "";
    li.dataset.category = transaction.category || "";
   

    const descriptionSpan = document.createElement("span");
    descriptionSpan.textContent = transaction.description;

    const amountSpan = document.createElement("span");
    
    const dateSpan = document.createElement("span")
    const categorySpan = document.createElement("span");
    const category = transaction.category || "";
    categorySpan.textContent = 
    category.charAt(0).toUpperCase() +
    category.slice(1);

    const formattedDate = transaction.date 
    ? transaction.date.split("-").reverse().join("/"): "";
    dateSpan.textContent = formattedDate;

   

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    
    deleteButton.addEventListener("click", function() {
        const index = transactions.indexOf(transaction);

        if ( index !== -1) {
            transactions.splice(index, 1);
            localStorage.setItem("transactions", JSON.stringify(transactions));
            location.reload();
        }
    })

    if (transaction.type === "income") {
        amountSpan.textContent = "+$" + transaction.amount.toFixed(2);
        amountSpan.classList.add("income");
    } else {
        amountSpan.textContent = "-$" + transaction.amount.toFixed(2);
        amountSpan.classList.add("expense");
    
    }

    li.appendChild(descriptionSpan);
    li.appendChild(categorySpan)
    li.appendChild(amountSpan);
    li.appendChild(dateSpan);
    li.appendChild(deleteButton);
   

    transactionList.appendChild(li);
});

const startingBalance = income - expenses;

incometext.textContent = "$" + income.toFixed(2);
expensesText.textContent = "$" + expenses.toFixed(2);
balanceText.textContent = "$" + startingBalance.toFixed(2);

allBtn.addEventListener("click", function() {
    const items = transactionList.querySelectorAll("li")

    items.forEach(function (item) {
        item.style.display = "grid";
    });
});

incomeBtn.addEventListener("click", function() {
    const items = transactionList.querySelectorAll("li");

    items.forEach(function (item, index) {
        if (transactions[index].type === "income") {
            item.style.display = "grid";
        } else {
            item.style.display = "none";
        }
    });
});


expenseBtn.addEventListener("click", function () {
    const items = transactionList.querySelectorAll("li");

    items.forEach(function (item, index) {
        if (transactions[index].type === "expense") {
            item.style.display = "grind";
        
        } else {
            item.style.display = "none";
        }
    });
});

 

addButton.addEventListener("click", function() {
    const description = descriptionInput.value;
    const amount = amountInput.value;
    const type = typeInput.value;
    const value = Number(amount);
    const category = categoryInput.value;
    const date = dateInput.value;

    const transaction = {
        description: description,
        amount: value,
        type: type,
        category: category,
        date: date
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));


    if( type === "income") {
        income = income + value
    } else {
        expenses = expenses + value;
    }

    const balance = income - expenses;

    const li = document.createElement("li");

    const descriptionSpan = document.createElement("span");
    descriptionSpan.textContent = description;

    const amountSpan = document.createElement("span");

    const categorySpan = document.createElement("span");
    categorySpan.textContent = 
    category.charAt(0).toUpperCase() +
    category.slice(1);
 
    const dateSpan = document.createElement("span");
    const formattedDate = date 
    ? date.split("-").reverse().join("/"): "";
    dateSpan.textContent = formattedDate;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete"
    deleteButton.classList.add("delete-btn");

    if (type === "income") {
        amountSpan.textContent = "+$" + value.toFixed(2);
        amountSpan.classList.add("income");
    } else {
        amountSpan.textContent = "-$" + value.toFixed(2);
        amountSpan.classList.add("expense");
    }

    li.appendChild(descriptionSpan);
    li.appendChild(categorySpan);
    li.appendChild(amountSpan);
    li.appendChild(dateSpan);
    li.appendChild(deleteButton);

    transactionList.appendChild(li);

    descriptionInput.value = "";
    amountInput.value = "";

    incometext.textContent = "$" + income.toFixed(2);
    expensesText.textContent = "$" + expenses.toFixed(2);
    balanceText.textContent = "$" + balance.toFixed(2);
    
});

function applyFilters() {
    const selectedMonth = monthFilter.value;
    const searchText = searchFilter.value.toLowerCase();
    const items = transactionList.querySelectorAll("li");


    items.forEach(function (item) {
        const itemDate = item.dataset.date || "";
        const description = (item.dataset.description || "").toLowerCase();
        const category = (item.dataset.category || "").toLowerCase();

        const matchesMonth = 
        !selectedMonth || itemDate.startsWith(selectedMonth);

        const matchesSearch = 
        !searchText || 
        description.includes(searchText) ||
        category.includes(searchText);
        
        if (matchesMonth && matchesSearch) {
            item.style.display = "grid"
        } else {
            item.style.display = "none"
        }
    });
}

monthFilter.addEventListener("change", applyFilters);
searchFilter.addEventListener("input", applyFilters);