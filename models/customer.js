// var method = Customer.prototype;

function Customer() {
    this.id = 0;
    this.customer_name = '';
    this.date_created = new Date();
}

Customer.prototype.isSuccess = false;
Customer.prototype.errorMessage = '';

module.exports = Customer;