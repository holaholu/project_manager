"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Project Management Tool API' });
});
app.use('/api/users', userRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
app.use('/api/teams', teamRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
// Ensure we're using the project_management_tool database
const MONGODB_URI = (_a = process.env.MONGODB_URI) === null || _a === void 0 ? void 0 : _a.replace('/?', '/project_management_tool?');
// Connect to MongoDB and start server
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB successfully');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        //console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});
