/* ========================================
   1. DADOS DA APLICAÇÃO
======================================== */

let transactions =
  JSON.parse(
    localStorage.getItem("transactions")
  ) || [];


/* ========================================
   2. ELEMENTOS DO HTML
======================================== */

const transactionForm =
  document.querySelector("#transaction-form");

const descriptionInput =
  document.querySelector("#description");

const amountInput =
  document.querySelector("#amount");

const categoryInput =
  document.querySelector("#category");

const dateInput =
  document.querySelector("#date");

const transactionsList =
  document.querySelector(".transactions-list");

const balanceValue =
  document.querySelector(".card.balance strong");

const incomeValue =
  document.querySelector(".card.income strong");

const expenseValue =
  document.querySelector(".card.expense strong");

const categoryFilter =
  document.querySelector("#category-filter");

const newTransactionButton =
  document.querySelector("#btn-new-transaction");

const modal =
  document.querySelector(".modal");

const closeModalButton =
  document.querySelector(".btn-close");

const searchInput =
  document.querySelector("#search-input");
  
  


/* ========================================
   MENSAGENS DE ERRO
======================================== */

const descriptionError =
  document.querySelector("#description-error");

const amountError =
  document.querySelector("#amount-error");

const categoryError =
  document.querySelector("#category-error");

const dateError =
  document.querySelector("#date-error");


/* ========================================
   TOAST
======================================== */

const toast =
  document.querySelector("#toast");


/* ========================================
   DARK MODE
======================================== */

const themeToggle =
  document.querySelector("#theme-toggle");


/* ========================================
   MODAL DE EXCLUSÃO
======================================== */

const deleteModal =
  document.querySelector("#delete-modal");

const deleteModalClose =
  document.querySelector("#delete-modal-close");

const cancelDeleteButton =
  document.querySelector("#cancel-delete");

const confirmDeleteButton =
  document.querySelector("#confirm-delete");


/* ========================================
   VARIÁVEIS
======================================== */

let expenseChart = null;

let transactionToDelete = null;


/* ========================================
   3. ABRIR E FECHAR MODAL
======================================== */

function openModal() {

  transactionForm.reset();

  clearValidation();

  setTodayDate();

  modal.classList.add("active");
}


function closeModal() {

  modal.classList.remove("active");
}


/* Abrir modal */

newTransactionButton.addEventListener(
  "click",
  function() {

    openModal();

  }
);


/* Fechar modal */

closeModalButton.addEventListener(
  "click",
  function() {

    closeModal();

  }
);


/* Fechar clicando fora */

modal.addEventListener(
  "click",
  function(event) {

    if (event.target === modal) {

      closeModal();

    }

  }
);


/* ========================================
   4. DATA ATUAL
======================================== */

function setTodayDate() {

  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");

  dateInput.value =
    `${year}-${month}-${day}`;
}


/* ========================================
   5. FORMATAÇÃO
======================================== */

function formatCurrency(value) {

  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  ).format(value);

}


function formatDate(date) {

  if (!date) {

    return "Data não informada";

  }

  const [
    year,
    month,
    day
  ] = date.split("-");

  return `${day}/${month}/${year}`;
}


/* ========================================
   6. TOAST
======================================== */

function showToast(message) {

  toast.textContent =
    message;

  toast.classList.add("show");

  setTimeout(
    function() {

      toast.classList.remove("show");

    },
    3000
  );
}


/* ========================================
   7. ATUALIZAR DASHBOARD
======================================== */

function updateDashboard() {

  let income = 0;

  let expense = 0;


  transactions.forEach(
    function(transaction) {

      if (
        transaction.type === "income"
      ) {

        income +=
          transaction.amount;

      } else {

        expense +=
          transaction.amount;

      }

    }
  );


  const balance =
    income - expense;


  incomeValue.textContent =
    formatCurrency(income);

  expenseValue.textContent =
    formatCurrency(expense);

  balanceValue.textContent =
    formatCurrency(balance);
}


/* ========================================
   8. MOSTRAR TRANSAÇÕES
======================================== */

function renderTransactions() {

  transactionsList.innerHTML =
    "";


  const filter =
    categoryFilter.value;
    
  const search =
     searchInput.value
      .trim()
      .toLowerCase();   

const filteredTransactions =
  transactions
    .filter(
      function(transaction) {

        const matchesCategory =
          filter === "all" ||
          transaction.category === filter;

        const matchesSearch =
          transaction.description
            .toLowerCase()
            .includes(search);

        return (
          matchesCategory &&
          matchesSearch
        );
      }
    )
    .sort(
      function(a, b) {

        return (
          b.date || ""
        ).localeCompare(
          a.date || ""
        );

      }
    );

  /* Estado vazio */

  if (
    filteredTransactions.length === 0
  ) {

    transactionsList.innerHTML = `
      <div class="empty-state">

        <p>
          Nenhuma transação encontrada.
        </p>

        <span>
          Adicione uma nova transação para começar.
        </span>

      </div>
    `;

    return;
  }


  /* Criar transações */

  filteredTransactions.forEach(
    function(transaction) {

      const transactionElement =
        document.createElement("div");


      transactionElement.classList.add(
        "transaction-item"
      );


      transactionElement.classList.add(
        transaction.type
      );


      /* ==========================
         INFORMAÇÕES
      ========================== */

      const transactionInfo =
        document.createElement("div");


      transactionInfo.classList.add(
        "transaction-info"
      );


      /* Descrição */

      const description =
        document.createElement("strong");

      description.textContent =
        transaction.description;


      /* Categoria */

      const category =
        document.createElement("span");

       category.classList.add(
         "transaction-category"
       );

       category.textContent =
       `${getCategoryIcon(transaction.category)} ${transaction.category}`;


       /*Entrada e saída*/
      
      const type =
        document.createElement("span");
        
        type.classList.add(
          "transaction-type-label"
        );

        type.textContext =
        transaction.type === "income"
          ? "Entrada"
          : "Saída";

        transactionInfo.appendChild(
          type
        );  


      /* Data */

      const date =
        document.createElement("span");

      date.textContent =
        formatDate(
          transaction.date
        );


      transactionInfo.appendChild(
        description
      );

      transactionInfo.appendChild(
        category
      );

      transactionInfo.appendChild(
        date
      );


      /* ==========================
         VALOR E AÇÕES
      ========================== */

      const transactionActions =
        document.createElement("div");


      transactionActions.classList.add(
        "transaction-actions"
      );


      /* Sinal */

      const signal =
        transaction.type === "income"
          ? "+"
          : "-";


      /* Valor */

      const amount =
        document.createElement("strong");


      amount.classList.add(
        "transaction-amount"
      );


      amount.textContent =
        `${signal} ${formatCurrency(
          transaction.amount
        )}`;


      /* Botão excluir */

      const deleteButton =
        document.createElement("button");


      deleteButton.classList.add(
        "btn-delete"
      );


      deleteButton.type =
        "button";


      deleteButton.textContent =
        "Excluir";


      /* Abrir modal de exclusão */

      deleteButton.addEventListener(
        "click",
        function() {

          openDeleteModal(
            transaction.id
          );

        }
      );


      transactionActions.appendChild(
        amount
      );

      transactionActions.appendChild(
        deleteButton
      );


      /* Junta tudo */

      transactionElement.appendChild(
        transactionInfo
      );

      transactionElement.appendChild(
        transactionActions
      );


      transactionsList.appendChild(
        transactionElement
      );

    }
  );
}


/* ========================================
   9. MODAL DE EXCLUSÃO
======================================== */

function openDeleteModal(id) {

  transactionToDelete =
    id;

  deleteModal.classList.add(
    "active"
  );
}


function closeDeleteModal() {

  transactionToDelete =
    null;

  deleteModal.classList.remove(
    "active"
  );
}


/* Fechar pelo X */

deleteModalClose.addEventListener(
  "click",
  function() {

    closeDeleteModal();

  }
);


/* Cancelar */

cancelDeleteButton.addEventListener(
  "click",
  function() {

    closeDeleteModal();

  }
);


/* Clicar fora */

deleteModal.addEventListener(
  "click",
  function(event) {

    if (
      event.target === deleteModal
    ) {

      closeDeleteModal();

    }

  }
);


/* Confirmar exclusão */

confirmDeleteButton.addEventListener(
  "click",
  function() {

    if (
      transactionToDelete === null
    ) {

      return;

    }


    deleteTransaction(
      transactionToDelete
    );


    closeDeleteModal();

  }
);


/* ========================================
   10. EXCLUIR TRANSAÇÃO
======================================== */

function deleteTransaction(id) {

  transactions =
    transactions.filter(
      function(transaction) {

        return (
          transaction.id !== id
        );

      }
    );


  saveTransactions();


  renderTransactions();

  updateDashboard();

  updateExpenseChart();


  showToast(
    "Transação excluída com sucesso!"
  );
}


/* ========================================
   11. LOCAL STORAGE
======================================== */

function saveTransactions() {

  localStorage.setItem(
    "transactions",
    JSON.stringify(
      transactions
    )
  );
}


/* ========================================
   12. LIMPAR VALIDAÇÃO
======================================== */

function clearValidation() {

  descriptionError.textContent =
    "";

  amountError.textContent =
    "";

  categoryError.textContent =
    "";

  dateError.textContent =
    "";


  descriptionInput.classList.remove(
    "input-error"
  );

  amountInput.classList.remove(
    "input-error"
  );

  categoryInput.classList.remove(
    "input-error"
  );

  dateInput.classList.remove(
    "input-error"
  );
}


/* ========================================
   13. VALIDAR FORMULÁRIO
======================================== */

function validateForm() {

  let isValid = true;


  const description =
    descriptionInput.value.trim();


  const amount =
    Number(
      amountInput.value
    );


  const category =
    categoryInput.value;


  const date =
    dateInput.value;


  clearValidation();


  /* Descrição */

  if (
    description.length < 3
  ) {

    descriptionError.textContent =
      "Digite pelo menos 3 caracteres.";


    descriptionInput.classList.add(
      "input-error"
    );


    isValid = false;
  }


  /* Valor */

  if (
    amountInput.value.trim() === "" ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {

    amountError.textContent =
      "Digite um valor maior que zero.";


    amountInput.classList.add(
      "input-error"
    );


    isValid = false;
  }


  /* Categoria */

  if (
    category === ""
  ) {

    categoryError.textContent =
      "Selecione uma categoria.";


    categoryInput.classList.add(
      "input-error"
    );


    isValid = false;
  }


  /* Data */

  if (
    date === ""
  ) {

    dateError.textContent =
      "Selecione uma data.";


    dateInput.classList.add(
      "input-error"
    );


    isValid = false;
  }


  return isValid;
}


/* ========================================
   14. REMOVER ERROS AO DIGITAR
======================================== */

descriptionInput.addEventListener(
  "input",
  function() {

    if (
      descriptionInput.value
        .trim()
        .length >= 3
    ) {

      descriptionInput.classList.remove(
        "input-error"
      );

      descriptionError.textContent =
        "";

    }

  }
);


amountInput.addEventListener(
  "input",
  function() {

    if (
      Number(amountInput.value) > 0
    ) {

      amountInput.classList.remove(
        "input-error"
      );

      amountError.textContent =
        "";

    }

  }
);


categoryInput.addEventListener(
  "change",
  function() {

    if (
      categoryInput.value !== ""
    ) {

      categoryInput.classList.remove(
        "input-error"
      );

      categoryError.textContent =
        "";

    }

  }
);


dateInput.addEventListener(
  "change",
  function() {

    if (
      dateInput.value !== ""
    ) {

      dateInput.classList.remove(
        "input-error"
      );

      dateError.textContent =
        "";

    }

  }
);


/* ========================================
   15. CADASTRAR TRANSAÇÃO
======================================== */

transactionForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    /* Validação */

    if (
      !validateForm()
    ) {

      return;

    }


    /* Valores */

    const description =
      descriptionInput.value.trim();


    const amount =
      Number(
        amountInput.value
      );


    const category =
      categoryInput.value;


    const date =
      dateInput.value;


    const type =
      document.querySelector(
        'input[name="type"]:checked'
      ).value;


    /* Criar transação */

    const transaction = {

      id:
        Date.now(),

      description:
        description,

      amount:
        amount,

      category:
        category,

      type:
        type,

      date:
        date

    };


    /* Adicionar */

    transactions.push(
      transaction
    );


    /* Salvar */

    saveTransactions();


    /* Atualizar */

    renderTransactions();

    updateDashboard();

    updateExpenseChart();


    /* Toast */

    showToast(
      "Transação adicionada com sucesso!"
    );


    /* Finalizar */

    transactionForm.reset();

    closeModal();

  }
);


/* ========================================
   16. FILTRO POR CATEGORIA
======================================== */

categoryFilter.addEventListener(
  "change",
  function() {

    renderTransactions();

  }
);

searchInput.addEventListener(
  "input",
  function(){
    renderTransactions()
  }
);

/* ========================================
   17. GRÁFICO
======================================== */

function updateExpenseChart() {

  const categories = {};


  transactions.forEach(
    function(transaction) {

      if (
        transaction.type === "expense"
      ) {

        if (
          !categories[
            transaction.category
          ]
        ) {
          categories[
            transaction.category
          ] = 0;

        }
        categories[
          transaction.category
        ] += transaction.amount;

      }

    }
  );
 
  const labels =
    Object.keys(
      categories
    );


  const values =
    Object.values(
      categories
    );


  const chartContainer =
    document.querySelector(
      ".chart-container"
    );


  /* Destruir gráfico anterior */

  if (expenseChart) {

    expenseChart.destroy();

    expenseChart = null;

  }


  chartContainer.innerHTML =
    "";


  /* Nenhuma despesa */

  if (
    values.length === 0
  ) {

    chartContainer.innerHTML = `
      <div class="empty-chart">

        <p>
          Nenhuma despesa registrada.
        </p>

        <span>
          Adicione uma saída para visualizar o gráfico.
        </span>

      </div>
    `;

    return;
  }


  /* Criar canvas */

  const chartCanvas =
    document.createElement(
      "canvas"
    );


  chartCanvas.id =
    "expense-chart";


  chartContainer.appendChild(
    chartCanvas
  );


  /* Criar gráfico */

  expenseChart =
    new Chart(
      chartCanvas,
      {

        type:
          "doughnut",


        data: {

          labels:
            labels,
datasets: [
  {
    data: values,

    backgroundColor: [
      "#16a34a",
      "#2563eb",
      "#d97706",
      "#dc2626",
      "#7c3aed",
      "#db2777"
    ],

    borderWidth: 3,

    borderColor: "#ffffff"
  }
]
         

        },


        options: {

          responsive:
            true,

          maintainAspectRatio:
            false,
           cutout: "65%",

          plugins: {

            legend: {

             position: "bottom",

                labels: {

             padding: 20,
             
                 usePointStyle: true,

             pointStyle: "circle",
          
              color: "#374151",
    font: {
      size: 13,
      weight:"600"
    },

   

  }

},


            tooltip: {

              callbacks: {

                label:
                  function(context) {

                    const value =
                      context.raw;
                     
                      const total =
                      values.reduce(
                        function(
                          total,
                          current
                        ){
                          return( 
                            total + current
                          );
                        },
                        0
                      );
                      const percentage =
                      (
                        value / total
                      ) * 100;



                     return `${context.label}: ${formatCurrency(value)} (${percentage.toFixed(1)}%)`;

                  }

              }

            }

          }

        }

      }
    );
}


/* ========================================
   18. DARK MODE
======================================== */

function toggleTheme() {

  document.body.classList.toggle(
    "dark-mode"
  );


  const isDarkMode =
    document.body.classList.contains(
      "dark-mode"
    );


  localStorage.setItem(
    "darkMode",
    isDarkMode
  );


  themeToggle.textContent =
    isDarkMode
      ? "☀️"
      : "🌙";


  themeToggle.setAttribute(
    "aria-label",
    isDarkMode
      ? "Ativar modo claro"
      : "Ativar modo escuro"
  );
}


function loadTheme() {

  const darkMode =
    localStorage.getItem(
      "darkMode"
    ) === "true";


  if (darkMode) {

    document.body.classList.add(
      "dark-mode"
    );

    themeToggle.textContent =
      "☀️";

    themeToggle.setAttribute(
      "aria-label",
      "Ativar modo claro"
    );

  }

}


themeToggle.addEventListener(
  "click",
  toggleTheme
);


/* ========================================
   ÍCONES DAS CATEGORIAS
======================================== */

function getCategoryIcon(category) {

  const icons = {

    alimentação: "🍔",

    transporte: "🚗",

    moradia: "🏠",

    lazer: "🎮",

    salario: "💰",

    outros: "📦"

  };


  return icons[category] || "📌";
}


/* ========================================
   19. INICIALIZAÇÃO
======================================== */

setTodayDate();

renderTransactions();

updateDashboard();

updateExpenseChart();

loadTheme();