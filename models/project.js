function Project() {
    this.id = 0;
    this.project_name = '';
    this.description = '';
    this.date_created = new Date();
    this.customer_id = 0;
    this.itemsProject = null;
    this.contacts = null;
}

Project.prototype.isSuccess = false;
Project.prototype.errorMessage = '';

module.exports = Project;
