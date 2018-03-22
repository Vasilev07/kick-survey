const {
    expect,
} = require('chai');

const GenericData = require('../../app/data/data-generic');


describe('Testing class GenericData', () => {
    describe('getAll()', () => {
        it('expect to return empty array', async () => {
            const Model = {
                findAll: () => [],
            };
            const data = new GenericData(Model);
            const realData = await data.getAll();

            expect(realData).to.deep.equal([]);
        });
        it('expect to return given objects', async () => {
            const Model = {
                findAll: () => [1, 2, 3, 4],
            };
            const data = new GenericData(Model);
            const realData = await data.getAll();

            expect(realData).to.deep.equal([1, 2, 3, 4]);
        });
    });

    describe('getById()', () => {
        it('with valid data', async () => {
            const obj = {
                id: 1,
            };
            const Model = {
                findById: () => obj,
            };
            const data = new GenericData(Model);
            const returnedData = await data.getById(1);
            const expected = {
                id: 1,
            };

            expect(returnedData).to.deep.equal(expected);
        });
        it('without id', async () => {
            const Model = {
                findById: () => null,
            };
            const data = new GenericData(Model);
            const returnedData = await data.getById();

            expect(returnedData).to.equal(null);
        });
    });
    describe('create()', () => {
        
    });
});


