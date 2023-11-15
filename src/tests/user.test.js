import mongoose from "mongoose"
import User from "../models/User";

const userData = {
    email: 'testuser@example.com',
    username: 'testuser',
    password: 'testpassword',
}



describe('User Model', () => {
    // Connect to the MongoDB test database before running tests
    beforeAll(async () => {
        // Connecting to a testing database or use a separate collection
        await mongoose.connect('mongodb://127.0.0.1:27017/testdb')
    });

    // Disconnect from the MongoDB test database after running tests    
    afterAll(async () => {
        // disconnect from the testing database
        await mongoose.connection.close();
    });

    // Jest test case for creating a new user
    it('should create a new user', async () => {

        // Create a new user using the User model
        const newUser = new User(userData);

        // Save the user to the database
        const savedUser = await newUser.save();

        // Assertions to check if the user was saved successfully
        expect(savedUser).toHaveProperty('_id');
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.username).toBe(userData.username);
    });

    // Add more test cases as needed
});
