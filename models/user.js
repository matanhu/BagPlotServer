function User() {
    this.uid = '';
    this.firstName = '';
    this.lastName = '';
    this.cellular = '';
    this.email = '';
    this.date_created = new Date();
}

User.prototype.isSuccess = false;
User.prototype.errorMessage = '';

module.exports = User;