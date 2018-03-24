const {
    expect,
    should,
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
        describe('with valid', () => {
            it('data to return desired object', async () => {
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
        });
        describe('with invalid data', () => {
            it('without id to return null', async () => {
                const Model = {
                    findById: () => null,
                };
                const data = new GenericData(Model);
                const returnedData = await data.getById();

                expect(returnedData).to.deep.equal(null);
            });
        });
    });
    describe('create()', () => {
        describe('when valid', () => {
            it('obj is passed expect to return an object', () => {
                const obj = {};
                const Model = {
                    create: () => obj,
                };
                const data = new GenericData(Model);
                const res = data.create(obj);
                expect(typeof res).to.be.equal('object');
            });
        });
        describe('when not valid', () => {
            it('without pass an object expect to throw Error - Invalid object', () => {
                const Model = {
                    findById: () => null,
                    findAll: () => {},
                };
                const data = new GenericData(Model);
                const createErr = () => {
                    data.create();
                };
                expect(createErr).to.throw('Invalid object');
            });
        });
    });
});
