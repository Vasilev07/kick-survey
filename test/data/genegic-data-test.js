const {
    expect,
} = require('chai');

const sinon = require('sinon');

const GenericData = require('../../app/data/data-generic');


describe('Test Generic data', () => {
    describe('when valid', () => {
        let data = null;
        let Model = null;

        beforeEach(() => {
            Model = {
                findAll: () => {},
            };
            data = new GenericData(Model);
        });
        it('with getAll() expect to return empty array',
            async () => {
                sinon.stub(Model, 'findAll').returns([]);

                const objects = await data.getAll();
            /*eslint-disable*/
                expect(objects).to.be.empty;
            });

        it('with objects in model,expect getAll() to return objects',
            async () => {
                const objects = [1, 2, 3, 4, 5, 6];

                sinon.stub(Model, 'findAll').returns(objects);

                const resultObjects = await data.getAll();

                expect(resultObjects).deep.equal(objects);
            });
    });
});
