class Data {
    constructor(Model) {
        this.Model = Model;
    }
    getAll() {
        return this.Model.findAll();
    }
    getById(id) {
       return this.Model.findById(id);
    }
    create(obj) {
        if (this._isObjectValid && !this._isObjectValid(obj)) {
            throw new Error('Invalid object');
        }
        return this.Model.create(obj);
    }
}

module.exports = Data;
