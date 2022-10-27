/* ------------- Modal ------------- */
const Modal = {
    open(){
        //Abrir modal e adicionar classe 'active' ao modal
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },
    close(){
        //Fechar modal e remover classe 'active' do modal
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
}

/* ------------- Storage ------------- */
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transations")) || []
    },

    set(transactions){
        localStorage.setItem("dev.finances:transations", JSON.stringify(transactions))
    }
}

/* ------------- Transactions ------------- */
const Transaction = { //Função que faz o calculo do total de entradas e saídas
    all: Storage.get(),

    add(transaction){ //Adiciona transação
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){ //Remove transação
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0

        Transaction.all.forEach((transaction) => {
            if(transaction.amount > 0){
                income += transaction.amount
            }
        })

        return income
    },
    expenses() {
        let expense = 0

        Transaction.all.forEach((transaction) => {
            if(transaction.amount < 0){
                expense += transaction.amount
            }
        })

        return expense
    },
    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'), //Seleciona a tabela
    
    addTransaction(transaction, index){
        const tr = document.createElement('tr') //Cria a tag tr no HTML
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) //Insere a constante html dentro da tag tr
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index){ // Cria a estrutura a ser inserida na função addTransaction
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `

        return html
    },

    updateBalance(){ // Atualiza o balanço pelo DOM, localizando os ids e inserindo os valores no HTML
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){ //Limpa a tabela
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = { //Função formata os valores inseridos, transformando em formato de dinheiro
    formatAmount(value){
        value = Number(value) * 100
        
        return Math.round(value)
    },

    formatDate(date){
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/, "") //Onde houver digito transformará em nada, ficando só números
        value = Number(value)/100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

/* ------------- Form ------------- */
const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    
    validateFields(){
        const {description, amount, date} = Form.getValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos.")
        }
    },

    formatValues(){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    
    submit(event){
        event.preventDefault() //Previne que retorne default

        try{
            Form.validateFields() //Verifica se todas as informações foram preenchidas
            const transaction = Form.formatValues() //Formata os dados
            Transaction.add(transaction) //Salva a transação
            Form.clearFields() //Apaga os dados do formulário
            Modal.close() //Fecha o formulário
        }

        catch(error){
            alert(error.message)
        }
    }
}

/* ------------- App ------------- */
const App = {
    init() {        
        Transaction.all.forEach(function(transaction, index) {
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()
