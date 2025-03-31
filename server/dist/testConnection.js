"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Ensure we're using the project_management_tool database
const MONGODB_URI = (_a = process.env.MONGODB_URI) === null || _a === void 0 ? void 0 : _a.replace('/?', '/project_management_tool?');
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        const conn = yield mongoose_1.default.connect(MONGODB_URI);
        console.log(`MongoDB Connected Successfully!`);
        console.log(`Host: ${conn.connection.host}`);
        // Create a test collection in our project database
        const testCollection = conn.connection.db.collection('test_collection');
        // Insert a test document
        yield testCollection.insertOne({
            message: 'Database initialization test',
            createdAt: new Date()
        });
        // Verify the document was inserted
        const result = yield testCollection.findOne({ message: 'Database initialization test' });
        console.log('Test document created:', result);
        // List all collections in the database
        const collections = yield conn.connection.db.listCollections().toArray();
        console.log('\nCollections in database:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });
        // Close the connection after successful test
        yield mongoose_1.default.connection.close();
        console.log('\nConnection closed successfully');
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
});
testConnection();
