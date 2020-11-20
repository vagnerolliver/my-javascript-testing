class Transaction { 
    constructor({ custumer, car, amount, dueDate }) {
        this.customer = custumer
        this.car = car,
        this.amount = amount 
        this.dueDate = dueDate
    }
}


module.exports = Transaction