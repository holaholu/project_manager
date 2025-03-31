"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .get(authMiddleware_1.protect, teamController_1.getTeamMembers)
    .post(authMiddleware_1.protect, teamController_1.addTeamMember);
router.route('/:id')
    .put(authMiddleware_1.protect, teamController_1.updateTeamMember)
    .delete(authMiddleware_1.protect, teamController_1.deleteTeamMember);
exports.default = router;
