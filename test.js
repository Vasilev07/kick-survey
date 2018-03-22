class Data {
    constructor(val) {
        this.val = val;
    }
    create(obj) {
        if (this._isObjectValid && !this._isObjectValid(obj)) {
            console.log('no');
        }
        console.log('yes');
    }
}

const obj = new Data(null);
obj.create();
