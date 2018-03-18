class Data {
    constructor(Model) {
        this.Model = Model;
    }

    getAll() {
        this.Model.findAll();
    }
    getById(id) {
        this.Model.findById(id);
    }
}

module.exports = Data;
