import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Ensure we're using the project_management_tool database
const MONGODB_URI = process.env.MONGODB_URI?.replace('/?', '/project_management_tool?');

const testConnection = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(MONGODB_URI as string);
    console.log(`MongoDB Connected Successfully!`);
    console.log(`Host: ${conn.connection.host}`);

    // Create a test collection in our project database
    const testCollection = conn.connection.db.collection('test_collection');
    
    // Insert a test document
    await testCollection.insertOne({
      message: 'Database initialization test',
      createdAt: new Date()
    });

    // Verify the document was inserted
    const result = await testCollection.findOne({ message: 'Database initialization test' });
    console.log('Test document created:', result);
    
    // List all collections in the database
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Close the connection after successful test
    await mongoose.connection.close();
    console.log('\nConnection closed successfully');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testConnection();
