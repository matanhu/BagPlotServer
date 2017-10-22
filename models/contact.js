function Contact() {
        this.id = 0;
        this.firstName = '';
        this.lastName = '';
        this.phoneOffice = '';
        this.faxNumber = '';
        this.cellular = '';
        this.email = '';
        this.date_created = new Date();
        this.project_id = 0;
}

Contact.prototype.isSuccess = false;
Contact.prototype.errorMessage = '';

module.exports = Contact;
