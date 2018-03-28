const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const UserController = require('../../app/controllers/user-controller');
const UserError = require('../../app/controllers/exceptions/data-exceptions');
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
    describe('validateUsername', () => {
        describe('when data is valid', () => {
            it('expect to return the passed username', async () => {
                const username = 'Goshko';

                const controller = new UserController(fakeData);

                const validatedUsername =
                await controller.validateUsername(username);

                expect(validatedUsername).to.eq(username);
            });
        });
        describe('when data is invalid', () => {
            it('expect to throw ExistingUsername', async () => {
                const existingUsername = 'Gosho';

                const controller = new UserController(fakeData);

                userArray = [{
                    username: 'Gosho',
                }];

                const func = async () => {
                    return await controller.validateUse-rname(existingUsername);
                };

                expect(func())
                    .to.eventually
                    .be.rejectedWith('This username already exists')
                    .and.be.an.instanceOf(UserError.ExistingUsername);
            });
        });
        describe('validateUserEmail', () => {
            describe('when data is valid', () => {
                it('expect to return the passed email', async () => {
                    const email = 'user@domain.com';

                    const controller = new UserController(fakeData);

                    const validatedEmail =
                        await controller.validateUserEmail(email);

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

                    const func = async () => {
                        return await controller.validateUserEmail(existingEmail);
                    };

                    expect(func())
                        .to.eventually
                        .be.rejectedWith('This email already exists')
                        .and.be.an.instanceOf(UserError.ExistingEmail);
                });
                it('expect to throw InvalidEmail exception', async () => {
                    const existingEmail = 'userdomain.com';

                    const controller = new UserController(fakeData);

                    const func = async () => {
                        return await controller.validateUserEmail(existingEmail);
                    };

                    expect(func())
                        .to.eventually
                        .be.rejectedWith('This is not valid email')
                        .and.be.an.instanceOf(UserError.InvalidEmail);
                });
                it('expect to throw EmptyEmail exception', async () => {
                    const existingEmail = '';

                    const controller = new UserController(fakeData);

                    const func = async () => {
                        return await controller.validateUserEmail(existingEmail);
                    };

                    expect(func())
                        .to.eventually
                        .be.rejectedWith('Email cannot be empty')
                        .and.be.an.instanceOf(UserError.EmptyEmail);
                });
                it('expect to throw NullEmail exception', async () => {
                    userArray = null;
                    const email = null;

                    const controller = new UserController(fakeData);

                    const func = async () => {
                        return await controller.validateUserEmail(email);
                    };

                    expect(func())
                        .to.eventually
                        .be.rejectedWith('getAllEmails returns null')
                        .and.be.an.instanceOf(UserError.NullEmail);
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

                    const func = async () => {
                        return await controller
                            .validatePasswords(pass, confirmationPass);
                    };

                    expect(func())
                        .to.eventually
                        .be.rejectedWith('Passwords do not match')
                        .and.be.an.instanceOf(UserError.NotMatchingPasswords);
                });
                it('expect to throw ShortPassword exception', () => {
                    const pass = '123';
                    const confirmationPass = '123';

                    const controller = new UserController(fakeData);

                    const func = async () => {
                        return await controller
                            .validatePasswords(pass, confirmationPass);
                    };

                    expect(func())
                        .to.eventually
                        .be.rejectedWith('Password must be at least 5 symbols')
                        .and.be.an.instanceOf(UserError.ShortPassword);
                });
            });
        });
        describe('createUser', () => {
            describe('when data is valid', () => {
                it('expects to return the user we just created', async () => {
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

                    const controller = new UserController(fakeData);

                    try {
                        const result = await controller.createUser(object);

                        // changing the properties cuz createUser returns object
                        // with properties names as the table columns
                        object.password = result.password;
                        object.first_name = object.firstName;
                        object.last_name = object.lastName;

                        delete object.rePassword;
                        delete object.firstName;
                        delete object.lastName;

                        expect(result).to.deep.eq(object);
                    } catch (err) {
                        console.log(err);
                    }
                });
            });
            describe('when data is invalid', () => {
                describe('when validateUsername() throws exception', () => {
                    it('expect to throw any exception', async () => {
                        userArray = [{
                            username: 'name',
                        }];
                        const object = {
                            username: '',
                        };

                        const controller = new UserController(fakeData);

                        const func = async () => {
                            return await controller.createUser(object);
                        };

                        expect(func())
                            .to.eventually
                            .be.rejectedWith('Username cannot be empty')
                            .and.be.an.instanceOf(UserError.EmptyUsername);
                    });
                });
                describe('when validatePassword() throws exception', () => {
                    it('expect to throw any exception', async () => {
                        userArray = [{
                            username: 'name',
                        }];
                        const object = {
                            username: 'user',
                            password: '123456',
                            rePassword: '123',
                        };

                        const controller = new UserController(fakeData);

                        const func = async () => {
                            return await controller.createUser(object);
                        };

                        expect(func())
                            .to.eventually
                            .be.rejectedWith('Passwords do not match')
                            .and.be.an.instanceOf(UserError.NotMatchingPasswords);
                    });
                });
                describe('when validateUserEmail() throws exception', () => {
                    it('expect to throw any exception', async () => {
                        const object = {
                            username: 'user',
                            password: '123456',
                            rePassword: '123456',
                            email: 'domain', // the wrong data
                        };

                        const controller = new UserController(fakeData);

                        const func = () => {
                            return controller.createUser(object);
                        };

                        expect(func())
                            .to.eventually
                            .be.rejectedWith('This is not valid email')
                            .and.be.an.instanceOf(UserError.InvalidEmail);
                    });
                });
            });
        });
    });
});
