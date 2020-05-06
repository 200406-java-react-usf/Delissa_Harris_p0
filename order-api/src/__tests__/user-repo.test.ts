import { UserRepository } from '../repos/user-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { User } from '../models/user';
import {  BadRequestError, 
    ResourceNotFoundError,
    InternalServerError
} from '../errors/errors';

/*
    We need to mock the connectionPool exported from the main module
    of our application. At this time, we only use one exposed method
    of the pg Pool API: connect. So we will provide a mock function 
    in its place so that we can mock it in our tests.
*/
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    };
});

// The result-set-mapper module also needs to be mocked
jest.mock('../util/result-set-mapper', () => {
    return {
        mapUserResultSet: jest.fn()
    };
});

describe('userRepo', () => {

    let sut = new UserRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        /*
            We can provide a successful retrieval as the default mock implementation
            since it is very verbose. We can provide alternative implementations for
            the query and release methods in specific tests if needed.
        */
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                username: 'aanderson',
                                password: 'password',
                                first_name: 'Alice',
                                last_name: 'Anderson',
                                email: 'aanderson@revature.com',
                                role_id: 1
                            }
                        ]
                    };
                }), 
                release: jest.fn()
            };
        });
        (mockMapper.mapUserResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Users when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to a User object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);
    });


    test('should throw BadRequestError when getById is given an invalid id', async () => {

        // Arrange
        let mockUser = new User(-1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        try {
            await sut.getById(-1);
        //Assert
        } catch (e){
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    });
    test('should throw BadRequestError when getById is given an invalid id', async () => {

        // Arrange
        let mockUser = new User(-1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        try {
            await sut.getById(-1);
        //Assert
        } catch (e){
            expect(e instanceof BadRequestError).toBeTruthy();
        }

    });   test('should throw BadRequestError when getById is given an empty', async () => {

        // Arrange
        let mockUser = new User(null, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        try {
            await sut.getById(null);
        //Assert
        } catch (e){
            expect(e instanceof ResourceNotFoundError).toBeTruthy();
        }
    });

    test('should throw InternalServerError when getAll is not returned', async () => {

        // Arrange
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { }), 
                release: jest.fn()
            }
        });

        // Act
        try{
        let result = await sut.getAll();
        }
        // Assert
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should throw InternalServerError for getByUserCredentials is invalid', async () => {

        // Arrange
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { }), 
                release: jest.fn()
            }
        });

        // Act
        try{
        let result = await sut.getUserByCredentials("aanderson", "password");
        }
        // Assert
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should throw InternalServerError for getByID is invalid', async () => {

        // Arrange
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { }), 
                release: jest.fn()
            }
        });

        // Act
        try{
        let result = await sut.getById(-1);
        }
        // Assert
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should throw InternalServerError when add is invalid', async () => {

        // Arrange
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { }), 
                release: jest.fn()
            }
        });

        // Act
        try{
        let result = await sut.add(mockUser);
        }
        // Assert
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should throw InternalServerError when delete is invalid', async () => {

        // Arrange
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { }), 
                release: jest.fn()
            }
        });

        // Act
        try{
        let result = await sut.deleteById(9);
        }
        // Assert
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
    });
    
    test('should throw InternalServerError when update is invalid', async () => {

        // Arrange
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { }), 
                release: jest.fn()
            }
        });

        // Act
        try{
        let result = await sut.update(mockUser);
        }
        // Assert
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
    });
    test('should throw InternalServerError when getUserByUniqueKey is invalid', async () => {

        // Arrange
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { }), 
                release: jest.fn()
            }
        });

        // Act
        try{
        let result = await sut.getUserByUniqueKey("hhdhhsd", "hshshhdgs");
        }
        // Assert
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
    });


    test('Should return successfully saved used', async () => {

        //Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        //Act
        let result = await sut.getUserByCredentials('aanderson', 'password');

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof User).toBeTruthy();        
    });
});