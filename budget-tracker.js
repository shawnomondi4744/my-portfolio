console.log("MurkxWeb Budget Tracker is running!");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let expenseCategoryChart = null;
let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
let savingsGoals = JSON.parse(localStorage.getItem("savingsGoals")) || [];

const transactionList = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");

const budgetForm = document.getElementById("budget-form");
const budgetCategory = document.getElementById("budget-category");
const budgetAmount = document.getElementById("budget-amount");

const categoryFilter = document.getElementById("category-filter");
const transactionSearch = document.getElementById("transaction-search");
const typeFilter = document.getElementById("type-filter");

const startDate = document.getElementById("start-date");
const endDate = document.getElementById("end-date");
const filterDatesButton = document.getElementById("filter-dates");
const clearDateFilterButton = document.getElementById("clear-date-filter");

const reportMonth = document.getElementById("report-month");
let financeChart = null;
transactionForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (description === "" || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a description and a valid amount.");
        return;
    }


    const transaction = {
        description: description,
        category: category,
        amount: amount,
        type: type,
        date: new Date().toLocaleDateString("en-GB")
    };

    transactions.push(transaction);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateSummary();
    displayTransactions();

    transactionForm.reset();
});



function updateSummary() {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(function(transaction) {
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }
    });

    const balance = totalIncome - totalExpenses;

    document.getElementById("income").textContent =
        "KSh " + totalIncome.toFixed(2);

    document.getElementById("expenses").textContent =
        "KSh " + totalExpenses.toFixed(2);

    document.getElementById("balance").textContent =
        "KSh " + balance.toFixed(2);
      updateFinanceChart(totalIncome, totalExpenses);  
      updateMonthlyReport();
      updateSpendingInsights();
      displayBudgets();
      updateExpenseCategoryChart();
}


function displayTransactions() {
    transactionList.innerHTML = "";

const selectedCategory = categoryFilter.value;
const selectedType = typeFilter.value;
const searchText = transactionSearch.value.toLowerCase().trim();

const selectedStartDate = startDate.value;
const selectedEndDate = endDate.value;

const filteredTransactions = transactions.filter(function(transaction) {
    const matchesCategory =
        selectedCategory === "all" ||
        transaction.category === selectedCategory;

    const matchesSearch =
        transaction.description.toLowerCase().includes(searchText);
const matchesType =
    selectedType === "all" ||
    transaction.type === selectedType;
    const dateParts = transaction.date.split("/");
    let transactionDate = "";

    if (dateParts.length === 3) {
        const day = dateParts[0].padStart(2, "0");
        const month = dateParts[1].padStart(2, "0");
        const year = dateParts[2];

        transactionDate = year + "-" + month + "-" + day;
    }

    const matchesStartDate =
        selectedStartDate === "" ||
        (transactionDate !== "" &&
         transactionDate >= selectedStartDate);

    const matchesEndDate =
        selectedEndDate === "" ||
        (transactionDate !== "" &&
         transactionDate <= selectedEndDate);

 return matchesCategory &&
       matchesSearch &&
       matchesStartDate &&
       matchesEndDate &&
       matchesType;
});

    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = "<li>No transactions found.</li>";
        return;
    }

    filteredTransactions.forEach(function(transaction) {




        const listItem = document.createElement("li");
        
        
if (transaction.type === "income") {
    listItem.style.borderLeft = "5px solid #16a34a";

    if (document.body.classList.contains("dark-mode")) {
        listItem.style.backgroundColor = "#1b3a2a";
        listItem.style.color = "#dcfce7";
    } else {
        listItem.style.backgroundColor = "#f0fdf4";
        listItem.style.color = "#166534";
    }

} else {
    listItem.style.borderLeft = "5px solid #dc2626";

    if (document.body.classList.contains("dark-mode")) {
        listItem.style.backgroundColor = "#452020";
        listItem.style.color = "#fee2e2";
    } else {
        listItem.style.backgroundColor = "#fef2f2";
        listItem.style.color = "#991b1b";
    }
}


        const transactionDetails = document.createElement("span");
       
const transactionInfo = document.createElement("div");
transactionInfo.style.marginBottom = "10px";

const description = document.createElement("strong");
description.textContent = transaction.description;

const category = document.createElement("span");
category.textContent = " • " + (transaction.category || "Uncategorized");

transactionInfo.appendChild(description);
transactionInfo.appendChild(category);

const typeBadge = document.createElement("span");
typeBadge.textContent = transaction.type.toUpperCase();

typeBadge.style.display = "inline-block";
typeBadge.style.padding = "5px 10px";
typeBadge.style.margin = "8px 8px 8px 0";
typeBadge.style.borderRadius = "20px";
typeBadge.style.fontSize = "12px";
typeBadge.style.fontWeight = "700";

if (transaction.type === "income") {
    typeBadge.style.backgroundColor = "#dcfce7";
    typeBadge.style.color = "#166534";
} else {
    typeBadge.style.backgroundColor = "#fee2e2";
    typeBadge.style.color = "#991b1b";
}

const amountAndDate = document.createElement("div");

amountAndDate.textContent =
    "KSh " + Number(transaction.amount).toFixed(2) +
    " • " + (transaction.date || "Date unavailable");

amountAndDate.style.fontSize = "14px";
amountAndDate.style.marginTop = "5px";

transactionDetails.textContent = "";
transactionDetails.appendChild(transactionInfo);
transactionDetails.appendChild(typeBadge);
transactionDetails.appendChild(amountAndDate);



        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.style.backgroundColor = "#2563eb";
        editButton.style.color = "#ffffff";

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.style.backgroundColor = "#dc2626";
        deleteButton.style.color = "#ffffff";

        editButton.addEventListener("click", function() {
    const newDescription = prompt(
        "Enter the new description:",
        transaction.description
    );

    if (newDescription === null) {
        return;
    }

    const newAmount = prompt(
        "Enter the new amount:",
        transaction.amount
    );

    if (newAmount === null) {
        return;
    }

    const newType = prompt(
        "Enter income or expense:",
        transaction.type
    );

    if (newType === null) {
        return;
    }

    const amountValue = Number(newAmount);
    const typeValue = newType.trim().toLowerCase();

    if (
        newDescription.trim() === "" ||
        !Number.isFinite(amountValue) ||
        amountValue <= 0 ||
        !["income", "expense"].includes(typeValue)
    ) {
        alert("Please enter valid transaction details.");
        return;
    }

    transaction.description = newDescription.trim();
    transaction.amount = amountValue;
    transaction.type = typeValue;

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    updateSummary();
    displayTransactions();

    alert("Transaction updated successfully!");
});
        deleteButton.addEventListener("click", function() {
            const confirmed = confirm(
                "Are you sure you want to delete this transaction?"
            );

            if (confirmed) {
                const index = transactions.indexOf(transaction);

                if (index !== -1) {
                    transactions.splice(index, 1);

                    localStorage.setItem(
                        "transactions",
                        JSON.stringify(transactions)
                    );

                    updateSummary();
                    displayTransactions();
                }
            }
        });

       listItem.appendChild(transactionDetails);
       listItem.appendChild(editButton);
       listItem.appendChild(deleteButton); 
       transactionList.appendChild(listItem);
    });
}

updateSummary();
displayTransactions();

categoryFilter.addEventListener("change", displayTransactions);
transactionSearch.addEventListener("input", displayTransactions);
typeFilter.addEventListener("change", displayTransactions);

filterDatesButton.addEventListener("click", function() {
if (startDate.value && endDate.value &&
startDate.value > endDate.value) {
alert("Start date cannot be later than end date!");
return;
}


displayTransactions();


});

clearDateFilterButton.addEventListener("click", function() {
startDate.value = "";
endDate.value = "";


displayTransactions();


});

function updateFinanceChart(totalIncome, totalExpenses) {
    const chartCanvas = document.getElementById("financeChart");

    if (!chartCanvas || typeof Chart === "undefined") {
        return;
    }

    if (financeChart) {
        financeChart.destroy();
    }

    financeChart = new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                label: "Amount (KSh)",
                data: [totalIncome, totalExpenses],
                backgroundColor: ["#16a34a", "#dc2626"],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateMonthlyReport() {
    const selectedMonth = reportMonth.value;

    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    transactions.forEach(function(transaction) {
        if (!transaction.date) {
            return;
        }

        const dateParts = transaction.date.split("/");

        if (dateParts.length !== 3) {
            return;
        }

        const day = dateParts[0];
        const month = dateParts[1].padStart(2, "0");
        const year = dateParts[2];

        const transactionMonth = year + "-" + month;

        if (transactionMonth !== selectedMonth) {
            return;
        }

        if (transaction.type === "income") {
            monthlyIncome += Number(transaction.amount);
        } else {
            monthlyExpenses += Number(transaction.amount);
        }
    });

    const monthlyBalance = monthlyIncome - monthlyExpenses;

    document.getElementById("monthly-income").textContent =
        "KSh " + monthlyIncome.toFixed(2);

    document.getElementById("monthly-expenses").textContent =
        "KSh " + monthlyExpenses.toFixed(2);

    document.getElementById("monthly-balance").textContent =
        "KSh " + monthlyBalance.toFixed(2);
}
    
function updateSpendingInsights() {
    const today = new Date();

    const currentMonth =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0");

    let monthlyExpenses = 0;
    let expenseCount = 0;
    const categorySpending = {};

    transactions.forEach(function(transaction) {
        if (transaction.type !== "expense" || !transaction.date) {
            return;
        }

        const dateParts = transaction.date.split("/");

        if (dateParts.length !== 3) {
            return;
        }

        const month = dateParts[1].padStart(2, "0");
        const year = dateParts[2];
        const transactionMonth = year + "-" + month;

        if (transactionMonth !== currentMonth) {
            return;
        }

        const amount = Number(transaction.amount);

        monthlyExpenses += amount;
        expenseCount++;

        const category = transaction.category || "Other";

        if (!categorySpending[category]) {
            categorySpending[category] = 0;
        }

        categorySpending[category] += amount;
    });

    let highestCategory = "No expenses yet";
    let highestAmount = 0;

    for (const category in categorySpending) {
        if (categorySpending[category] > highestAmount) {
            highestAmount = categorySpending[category];
            highestCategory = category;
        }
    }

    document.getElementById("highest-spending-category").textContent =
        highestAmount > 0
            ? highestCategory + " (KSh " + highestAmount.toFixed(2) + ")"
            : "No expenses yet";

    document.getElementById("insights-monthly-expenses").textContent =
        "KSh " + monthlyExpenses.toFixed(2);

    document.getElementById("monthly-expense-count").textContent =
        expenseCount;

    let advice = "";

    if (expenseCount === 0) {
        advice = "Add an expense this month to receive spending insights.";
    } else if (highestAmount >= monthlyExpenses * 0.5) {
        advice = "You spend a large share of your money on " +
            highestCategory + ". Review this category for possible savings.";
    } else {
        advice = "Your spending is spread across different categories. " +
            "Keep tracking your expenses to stay in control.";
    }

    document.getElementById("spending-advice-message").textContent = advice;
}


const today = new Date();

reportMonth.value =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0");

reportMonth.addEventListener("change", updateMonthlyReport);

updateMonthlyReport();
document.getElementById("export-transactions").addEventListener("click", function () {


if (transactions.length === 0) {
    alert("No transactions available to export!");
    return;
}

let csv = "Date,Description,Category,Type,Amount\n";

transactions.forEach(function (transaction) {

    const description = String(transaction.description).replace(/"/g, '""');
    const category = String(transaction.category || "Uncategorized").replace(/"/g, '""');

    csv += `"${transaction.date}","${description}","${category}","${transaction.type}",${transaction.amount}\n`;
});

const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
});

const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = "MurkxWeb-Transactions.csv";

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

URL.revokeObjectURL(url);

alert("Your transactions have been exported successfully!");

});
budgetForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const category = budgetCategory.value;
    const amount = Number(budgetAmount.value);

    if (category === "" || amount <= 0 || !Number.isFinite(amount)) {
        alert("Please enter a valid category and budget amount.");
        return;
    }

    const existingBudget = budgets.find(function(budget) {
        return budget.category === category;
    });

    if (existingBudget) {
        existingBudget.amount = amount;
    } else {
        budgets.push({
            category: category,
            amount: amount
        });
    }

    localStorage.setItem("budgets", JSON.stringify(budgets));
    displayBudgets();
    alert("Budget saved successfully!");

    budgetForm.reset();
});
function displayBudgets() {

const budgetList = document.getElementById("budget-list");

let totalBudgetAmount = 0;
let totalSpentAmount = 0;
let exceededBudgets = 0;

if (budgets.length === 0) {
    budgetList.innerHTML = "<p>No budgets have been set yet.</p>";

    document.getElementById("total-budget").textContent = "KSh 0.00";
    document.getElementById("total-spent").textContent = "KSh 0.00";
    document.getElementById("total-remaining").textContent = "KSh 0.00";
    document.getElementById("budgets-exceeded").textContent = "0";

    return;
}

budgetList.innerHTML = "";


    const today = new Date();

    const currentMonth =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0");

    budgets.forEach(function(budget) {

        let amountSpent = 0;

        transactions.forEach(function(transaction) {

            if (transaction.type !== "expense") {
                return;
            }

            if (transaction.category !== budget.category) {
                return;
            }

            if (!transaction.date) {
                return;
            }

            const dateParts = transaction.date.split("/");

            if (dateParts.length !== 3) {
                return;
            }

            const month = dateParts[1].padStart(2, "0");
            const year = dateParts[2];

            const transactionMonth = year + "-" + month;

            if (transactionMonth === currentMonth) {
                amountSpent += Number(transaction.amount);
            }
        });
const budgetAmount = Number(budget.amount);
const remaining = budgetAmount - amountSpent;

const percentage = budgetAmount > 0
    ? (amountSpent / budgetAmount) * 100
    : 0;
       
let budgetAlert = "";

if (percentage >= 100) {
    budgetAlert = "🔴 Budget exceeded! Stop and review your spending.";
} else if (percentage >= 75) {
    budgetAlert = "🟠 Warning! You are approaching your budget limit.";
} else {
    budgetAlert = "🟢 Your budget is under control.";
}


totalBudgetAmount += budgetAmount;
totalSpentAmount += amountSpent;

if (percentage >= 100) {
    exceededBudgets++;
}

      

        const progressWidth = Math.min(percentage, 100);

        let status = "Within budget";

        if (percentage >= 100) {
            status = "Budget exceeded or fully used!";
        } else if (percentage >= 80) {
            status = "Warning: approaching your limit!";
        }

        const budgetCard = document.createElement("div");

        budgetCard.className = "budget-card";

        budgetCard.innerHTML = `
            <h4>${budget.category}</h4>

            <p>Monthly Limit: KSh ${budgetAmount.toFixed(2)}</p>

            <p>Amount Spent: KSh ${amountSpent.toFixed(2)}</p>

            <p>Remaining:
                KSh ${remaining.toFixed(2)}
            </p>

            <p>Budget Used: ${percentage.toFixed(1)}%</p>

            <div style="
                background: #e2e8f0;
                height: 12px;
                border-radius: 6px;
                overflow: hidden;
            ">
                <div style="
                    background: ${percentage >= 100 ? '#dc2626' : percentage >= 80 ? '#f59e0b' : '#16a34a'};
                    height: 100%;
                    width: ${progressWidth}%;
                    transition: width 0.3s ease;
                "></div>
            </div>

  
<p><strong>${status}</strong></p>

<p style="
    padding: 10px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    background: ${percentage >= 100 ? '#fee2e2' : percentage >= 75 ? '#fef3c7' : '#dcfce7'};
    color: ${percentage >= 100 ? '#b91c1c' : percentage >= 75 ? '#92400e' : '#166534'};
">
    ${budgetAlert}
</p>

<div class="budget-actions">


    <button type="button" class="edit-budget"
        data-category="${budget.category}">
        Edit Budget
    </button>

    <button type="button" class="delete-budget"
        data-category="${budget.category}">
        Delete Budget
    </button>
</div>
        `;

        budgetList.appendChild(budgetCard);
    });
const totalRemainingAmount = totalBudgetAmount - totalSpentAmount;

document.getElementById("total-budget").textContent =
    "KSh " + totalBudgetAmount.toFixed(2);

document.getElementById("total-spent").textContent =
    "KSh " + totalSpentAmount.toFixed(2);

document.getElementById("total-remaining").textContent =
    "KSh " + totalRemainingAmount.toFixed(2);

document.getElementById("budgets-exceeded").textContent =
    exceededBudgets;
}

displayBudgets();
document.getElementById("budget-list").addEventListener("click", function(event) {


const editButton = event.target.closest(".edit-budget");

if (editButton) {
    const category = editButton.dataset.category;

    const budget = budgets.find(function(item) {
        return item.category === category;
    });

    if (!budget) {
        return;
    }

    const newAmount = prompt(
        "Enter the new monthly budget for " + category + ":",
        budget.amount
    );

    if (newAmount === null) {
        return;
    }

    const amount = Number(newAmount);

    if (newAmount.trim() === "" || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid budget amount greater than zero.");
        return;
    }

    budget.amount = amount;

    localStorage.setItem("budgets", JSON.stringify(budgets));

    displayBudgets();

    alert("Budget updated successfully!");
    return;
}

const deleteButton = event.target.closest(".delete-budget");

if (deleteButton) {
    const category = deleteButton.dataset.category;

    const confirmed = confirm(
        "Are you sure you want to delete the " + category + " budget?"
    );

    if (!confirmed) {
        return;
    }

    budgets = budgets.filter(function(item) {
        return item.category !== category;
    });

    localStorage.setItem("budgets", JSON.stringify(budgets));

    displayBudgets();

    alert("Budget deleted successfully!");
}


});



const savingsGoalForm = document.getElementById("savings-goal-form");
const savingsGoalsList = document.getElementById("savings-goals-list");

function displaySavingsGoals() {
    savingsGoalsList.innerHTML = "";

    if (savingsGoals.length === 0) {
        savingsGoalsList.textContent = "No savings goals created yet.";
        return;
    }

    savingsGoals.forEach(function(goal, index) {
        const target = Number(goal.target);
        const saved = Number(goal.saved);
        const remaining = Math.max(0, target - saved);

        const percentage = target > 0
            ? Math.min((saved / target) * 100, 100)
            : 0;

        const card = document.createElement("div");
        card.className = "savings-goal-card";

        const title = document.createElement("h4");
        title.textContent = goal.name;
        card.appendChild(title);

        const details = document.createElement("p");
        details.textContent =
            "Target: KSh " + target.toFixed(2) +
            " | Saved: KSh " + saved.toFixed(2) +
            " | Remaining: KSh " + remaining.toFixed(2);
        card.appendChild(details);

        const progressText = document.createElement("p");
        progressText.textContent = "Progress: " + percentage.toFixed(1) + "%";
        card.appendChild(progressText);

        const progressTrack = document.createElement("div");
        progressTrack.style.background = "#e2e8f0";
        progressTrack.style.height = "12px";
        progressTrack.style.borderRadius = "6px";
        progressTrack.style.overflow = "hidden";

        const progressBar = document.createElement("div");
        progressBar.style.background = "#16a34a";
        progressBar.style.height = "100%";
        progressBar.style.width = percentage + "%";

        progressTrack.appendChild(progressBar);
        card.appendChild(progressTrack);

        if (saved >= target) {
            const successMessage = document.createElement("p");
            successMessage.textContent = "🎉 Savings goal achieved!";
            successMessage.style.color = "#16a34a";
            successMessage.style.fontWeight = "bold";
            card.appendChild(successMessage);
        }

        const updateButton = document.createElement("button");
        updateButton.type = "button";
        updateButton.textContent = "Update Savings";
        updateButton.className = "update-savings";
        updateButton.dataset.index = index;
        card.appendChild(updateButton);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete Goal";
        deleteButton.className = "delete-savings-goal";
        deleteButton.dataset.index = index;
        card.appendChild(deleteButton);

        savingsGoalsList.appendChild(card);
    });
}

savingsGoalForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("goal-name").value.trim();
    const target = Number(document.getElementById("goal-target").value);
    const saved = Number(document.getElementById("goal-saved").value);

    if (
        name === "" ||
        !Number.isFinite(target) ||
        !Number.isFinite(saved) ||
        target <= 0 ||
        saved < 0 ||
        saved > target
    ) {
        alert("Enter a goal name, a valid target, and savings between zero and the target.");
        return;
    }

    savingsGoals.push({
        name: name,
        target: target,
        saved: saved
    });

    localStorage.setItem("savingsGoals", JSON.stringify(savingsGoals));

    displaySavingsGoals();
    savingsGoalForm.reset();

    alert("Savings goal created successfully!");
});

savingsGoalsList.addEventListener("click", function(event) {
    const updateButton = event.target.closest(".update-savings");
    const deleteButton = event.target.closest(".delete-savings-goal");

    if (updateButton) {
        const index = Number(updateButton.dataset.index);
        const goal = savingsGoals[index];

        if (!goal) return;

        const answer = prompt(
            "Enter the new amount saved for " + goal.name + ":",
            goal.saved
        );

        if (answer === null) return;

        if (answer.trim() === "") {
            alert("Please enter a valid amount.");
            return;
        }

        const newSaved = Number(answer);

        if (
            !Number.isFinite(newSaved) ||
            newSaved < 0 ||
            newSaved > Number(goal.target)
        ) {
            alert("Savings must be between zero and the target amount.");
            return;
        }

        goal.saved = newSaved;

        localStorage.setItem("savingsGoals", JSON.stringify(savingsGoals));
        displaySavingsGoals();

        alert("Savings updated successfully!");
        return;
    }

    if (deleteButton) {
        const index = Number(deleteButton.dataset.index);
        const goal = savingsGoals[index];

        if (!goal) return;

        const confirmed = confirm(
            "Are you sure you want to delete the goal: " + goal.name + "?"
        );

        if (!confirmed) return;

        savingsGoals.splice(index, 1);

        localStorage.setItem("savingsGoals", JSON.stringify(savingsGoals));
        displaySavingsGoals();

        alert("Savings goal deleted successfully!");
    }
});

displaySavingsGoals();

const darkModeToggle = document.getElementById("dark-mode-toggle");

if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️ Light Mode";
}

darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        darkModeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("darkMode", "disabled");
        darkModeToggle.textContent = "🌙 Dark Mode";
    }
});

const exportBackupButton = document.getElementById("export-backup");

exportBackupButton.addEventListener("click", function () {
    const backupData = {
        transactions: transactions,
        budgets: budgets,
        savingsGoals: savingsGoals,
        backupDate: new Date().toISOString(),
        appName: "MurkxWeb Budget Tracker"
    };

    const backupFile = new Blob(
        [JSON.stringify(backupData, null, 4)],
        { type: "application/json" }
    );

    const downloadLink = document.createElement("a");

    downloadLink.href = URL.createObjectURL(backupFile);

    downloadLink.download = "MurkxWeb-Backup-" +
        new Date().toISOString().slice(0, 10) + ".json";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(downloadLink.href);

    document.getElementById("backup-message").textContent =
        "✅ Backup downloaded successfully!";
});

const restoreBackupButton = document.getElementById("restore-backup");
const restoreFileInput = document.getElementById("restore-file");
const backupMessage = document.getElementById("backup-message");

restoreBackupButton.addEventListener("click", function () {
    const file = restoreFileInput.files[0];

    if (!file) {
        backupMessage.textContent = "⚠️ Please select a backup file first.";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const backupData = JSON.parse(event.target.result);

            if (
                !backupData ||
                !Array.isArray(backupData.transactions) ||
                !Array.isArray(backupData.budgets) ||
                !Array.isArray(backupData.savingsGoals)
            ) {
                throw new Error("Invalid backup file.");
            }

            const confirmed = confirm(
                "Restoring this backup will replace your current transactions, budgets, and savings goals. Continue?"
            );

            if (!confirmed) {
                backupMessage.textContent = "Restore cancelled.";
                return;
            }

            const previousData = {
                transactions: localStorage.getItem("transactions"),
                budgets: localStorage.getItem("budgets"),
                savingsGoals: localStorage.getItem("savingsGoals")
            };

            try {
                localStorage.setItem(
                    "transactions",
                    JSON.stringify(backupData.transactions)
                );

                localStorage.setItem(
                    "budgets",
                    JSON.stringify(backupData.budgets)
                );

                localStorage.setItem(
                    "savingsGoals",
                    JSON.stringify(backupData.savingsGoals)
                );
            } catch (saveError) {
                Object.entries(previousData).forEach(function ([key, value]) {
                    if (value === null) {
                        localStorage.removeItem(key);
                    } else {
                        localStorage.setItem(key, value);
                    }
                });

                throw saveError;
            }

            backupMessage.textContent =
                "✅ Backup restored! Reloading your tracker...";

            setTimeout(function () {
                window.location.reload();
            }, 1000);

        } catch (error) {
            backupMessage.textContent =
                "❌ Could not restore this file. Please select a valid MurkxWeb backup.";
        }
    };

    reader.readAsText(file);
});


function updateExpenseCategoryChart() {
    const canvas = document.getElementById("expense-category-chart");
    const message = document.getElementById("pie-chart-message");


    const monthSelector = document.getElementById("pie-chart-month");
    const selectedDate = monthSelector.value
    ? new Date(monthSelector.value + "-01T00:00:00")
    : new Date();

    const currentMonth = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const currentYear = String(selectedDate.getFullYear());



    const categoryTotals = {};

    transactions.forEach(function (transaction) {
        if (transaction.type !== "expense" || !transaction.date) {
            return;
        }

        const dateParts = transaction.date.split("/");

        if (dateParts.length !== 3) {
            return;
        }

        const month = dateParts[1].padStart(2, "0");
        const year = dateParts[2];

        if (month !== currentMonth || year !== currentYear) {
            return;
        }

        const category = transaction.category || "Other";
        const amount = Number(transaction.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return;
        }

        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    if (expenseCategoryChart) {
        expenseCategoryChart.destroy();
        expenseCategoryChart = null;
    }

    if (categories.length === 0) {
        message.textContent =
            "No expenses recorded this month. Add an expense to see your spending breakdown.";

        return;
    }

    message.textContent = "Your spending breakdown for this month.";

    expenseCategoryChart = new Chart(canvas, {
        type: "pie",

        data: {
            labels: categories,

            datasets: [{
                data: amounts,
                backgroundColor: [
                    "#2563eb",
                    "#16a34a",
                    "#f59e0b",
                    "#dc2626",
                    "#9333ea",
                    "#0891b2",
                    "#ec4899",
                    "#64748b"
                ],
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const amount = Number(context.raw);
                            return context.label + ": KSh " + amount.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}
updateExpenseCategoryChart();

document.getElementById("pie-chart-month").addEventListener("change", function () {
    updateExpenseCategoryChart();
});

const dashboardDate = document.getElementById("dashboard-date");

if (dashboardDate) {
    dashboardDate.textContent = new Date().toLocaleDateString("en-KE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}










