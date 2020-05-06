import { UserService } from '../services/user-service';
import { UserRepository } from '../repos/user-repo';
import { User } from '../models/user';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError,  NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError  } from '../errors/errors';

jest.mock('../repos/user-repo', () => {
    
    return new class UserRepository {
            getAll = jest.fn();
            getById = jest.fn();
            getUserByUniqueKey = jest.fn();
            getUserByCredentials = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
    };

});
describe('userService', () => {

    let sut: UserService;
    let mockRepo;
    let mockUsers = [
        new User(1, 'aanderson', 'password', 'Alice', 'Anderson', 'aanderson@revature.com', 'Admin'),
        new User(2, 'bbailey', 'password', 'Bob', 'Bailey', 'bbailey@revature.com', 'User'),
        new User(3, 'ccountryman', 'password', 'Charlie', 'Countryman', 'ccountryman@revature.com', 'User'),
        new User(4, 'ddavis', 'password', 'Daniel', 'Davis', 'ddavis@revature.com', 'User'),
        new User(5, 'eeinstein', 'password', 'Emily', 'Einstein', 'eeinstein@revature.com', 'User')
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getUserByUniqueKey: jest.fn(),
                getUserByCredentials: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            };
        });

        // @ts-ignore
        sut = new UserService(mockRepo);
    
    });

    test('should resolve to User[] (without passwords) when getAllUsers() successfully retrieves users from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockUsers);

        // Act
        let result = await sut.getAllUsers();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        result.forEach(val => expect(val.password).toBeUndefined());

    });

    test('should reject with ResourceNotFoundError when getAllUsers fails to get any users from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllUsers();
        } catch (e) {
            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when getUserById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(3);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<User>((resolve) => resolve(mockUsers[id - 1]));
        });


        // Act
        let result = await sut.getUserById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);
        // Act
        try {
            await sut.getUserById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getUserById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    test('Should add a New User', async () => {
        expect.assertions(1);

        // Arrange
        let mockUser =  new User(5, 'nnoboby', 'password', 'Nobody', 'NobodyLast', 'nnobody@revature.com', 'Customer')
        mockRepo.add = jest.fn().mockReturnValue(true);

        // Act
        let result = await sut.addNewUser(mockUser);
        expect(result).toBeTruthy();

    });

    test('should reject to BadRequestError when addNewUser is given an invalid User', async () => {
        // Arrange
        expect.assertions(1);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.addNewUser = jest.fn().mockImplementation((user: User) => {
            return new Promise<User>((resolve) => {
                resolve(user);
            });
        });
        // Act
        try{
            await sut.addNewUser(new User(1, '', 'x', 'y', 'z', 'a','f'));
        }
        // Assert
        catch(e){
            expect(e instanceof BadRequestError).toBe(true);
        }
    });
    
    test('Should reject with AuthenticationError with invalid password', async () => {

        // Arrange
      
        mockRepo.getUserByCredentials = jest.fn().mockReturnValue({});

        // Act
        try {
            await sut.authenticateUser("aanderson", "forever");
        } catch (e) {
            // Assert
            expect(e instanceof AuthenticationError).toBe(true);
        }

    });
   
    test('should throw NotImplementedError when deletebyId is invalid', async () => {

        // Act
        try{
        let result = await sut.deleteById(9999);
        }
        // Assert
        catch(e){
            expect(e instanceof NotImplementedError).toBe(true);
        }

    });
    test('should throw ResourcePersistenceError when sending a username that is Users', async () => {
        
        //Arrange
        expect.hasAssertions();
        sut.isUsernameAvailable= jest.fn().mockReturnValue(false);

        //Act
        try {
            await sut.addNewUser(mockUsers[0]);
        } catch (e) {

            //Assert
            expect(e instanceof ResourcePersistenceError).toBe(true);
        }
    });

    test('should throw ResourcePersistenceError when sending a email that is Users', async () => {
        
        //Arrange
        expect.hasAssertions();
        sut.isEmailAvailable= jest.fn().mockReturnValue(false);

        //Act
        try {
            await sut.addNewUser(mockUsers[0]);
        } catch (e) {

            //Assert
            expect(e instanceof ResourcePersistenceError).toBe(true);
        }
    });


    test('should throw BadRequestError when sending a bad value to updateUser', async () => {
        
        //Arrange
        expect.hasAssertions();

        //Act
        try {
            await sut.updateUser(null);
        } catch (e) {

            //Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });
});
