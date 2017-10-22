function Project_item() {
    this.id = 0;
    this.project_item_name = '';
    this.description = '';
    this.image = '';
    this.date_created = new Date();
    this.project_id = 0;
}

Project_item.prototype.isSuccess = false;
Project_item.prototype.errorMessage = '';

module.exports = Project_item;
