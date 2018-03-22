const {
    expect,
} = require('chai');

const UserController = require('../../app/controllers/user-controller');
const UserError = require('../../app/controllers/exceptions');
let userArray = [];

const fakeData = {
    users: {
        findByUsername(username) {
            return userArray.find((user) => user.username === username);
        },
        getAllUsernames() {
            return userArray.map((user) => user.username);
        },
        getAllEmails() {
            return userArray;
        },
        getAll() {
            return userArray;
        },
        getById(id) {
            return userArray.find((user) => user.id === id);
        },
        create(user) {
            return user;
        },
    },
};

describe('UserController', () => {
    describe('validateUserEmail', () => {
        describe('when data is valid', () => {
            it('expect to return the passed email', async () => {
                const email = 'user@domain.com';

                const controller = new UserController(fakeData);

                const validatedEmail = await controller.validateUserEmail(email);

                expect(validatedEmail).to.eq(email);
            });
        });
        describe('when data is invalid', () => {
            it('expect to throw ExistingEmail exception', () => {
                const existingEmail = 'user@domain.com';

                const controller = new UserController(fakeData);

                userArray = [{
                    email: 'user@domain.com',
                }];

                controller.validateUserEmail(existingEmail).catch((rej) => {
                    expect(rej.message)
                        .to
                        .eq(new UserError.ExistingEmail().message);
                });

                // const func = () => {
                //     expect(func).to.throw(UserError.ExistingEmail);
                // };
            });
            it('expect to throw InvalidEmail exception', async () => {
                const existingEmail = 'userdomain.com';

                const controller = new UserController(fakeData);

                try {
                    await controller.validateUserEmail(existingEmail);
                } catch (err) {
                    expect(err.message)
                        .to
                        .eq(new UserError.InvalidEmail().message);
                }
            });
            it('expect to throw EmptyEmail exception', async () => {

                const existingEmail = '';

                const controller = new UserController(fakeData);

                try {
                    await controller.validateUserEmail(existingEmail);
                } catch (err) {
                    expect(err.message)
                        .to
                        .eq(new UserError.EmptyEmail().message);
                }
            });
        });
    });
    describe('validatePasswords', () => {
        describe('when data is valid', () => {
            it('expect to return the given password', () => {
                const pass = '123456';
                const confirmationPass = '123456';

                const controller = new UserController(fakeData);

                const validatedPassword =
                    controller.validatePasswords(pass, confirmationPass);

                expect(validatedPassword).to.be.eq(pass);
            });
        });
        describe('when data is invalid', () => {
            it('expect to throw NotMatchingPasswords exception', () => {
                const pass = '123456';
                const confirmationPass = '123';

                const controller = new UserController(fakeData);

                try {
                    controller.validatePasswords(pass, confirmationPass);
                } catch (err) {
                    expect(err.message)
                        .to
                        .eq(new UserError.NotMatchingPasswords().message);
                }
            });
            it('expect to throw ShortPassword exception', () => {
                const pass = '123';
                const confirmationPass = '123';

                const controller = new UserController(fakeData);

                try {
                    controller.validatePasswords(pass, confirmationPass);
                } catch (err) {
                    expect(err.message)
                        .to
                        .eq(new UserError.ShortPassword().message);
                }
            });
        });
    });
    describe('createUser', () => {
        describe('when data is valid', () => {
            it('expects to return the user we just created', async () => {
                const controller = new UserController(fakeData);
                userArray = [{
                    username: 'user1',
                    email: 'user1@domain.com',
                    password: '123456',
                    rePassword: '123456',
                    firstName: 'fName',
                    lastName: 'lName',
                }];
                const object = {
                    username: 'user',
                    password: '123456',
                    rePassword: '123456',
                    firstName: 'fName',
                    lastName: 'lName',
                    email: 'users@domain.com',
                };

                try {
                    const result = await controller.createUser(object);

                    delete object.rePassword;
                    object.password = result.password;

                    expect(result).to.deep.equal(object);
                } catch (err) {
                    console.log(err);
                }
            });
        });
    });
});
