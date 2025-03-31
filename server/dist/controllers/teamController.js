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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamMember = exports.updateTeamMember = exports.addTeamMember = exports.getTeamMembers = void 0;
const Team_1 = __importDefault(require("../models/Team"));
// Get all team members
const getTeamMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const members = yield Team_1.default.find({ createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        res.json(members);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching team members', error });
    }
});
exports.getTeamMembers = getTeamMembers;
// Add team member
const addTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const { name, email, role } = req.body;
        // Check if member already exists
        const memberExists = yield Team_1.default.findOne({ email, createdBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id });
        if (memberExists) {
            res.status(400).json({ message: 'Team member already exists' });
            return;
        }
        const member = yield Team_1.default.create({
            name,
            email,
            role,
            createdBy: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
        });
        res.status(201).json(member);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding team member', error });
    }
});
exports.addTeamMember = addTeamMember;
// Update team member
const updateTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { name, email, role } = req.body;
        const member = yield Team_1.default.findOne({
            _id: req.params.id,
            createdBy: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
        });
        if (!member) {
            res.status(404).json({ message: 'Team member not found' });
            return;
        }
        member.name = name;
        member.email = email;
        member.role = role;
        const updatedMember = yield member.save();
        res.json(updatedMember);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating team member', error });
    }
});
exports.updateTeamMember = updateTeamMember;
// Delete team member
const deleteTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const member = yield Team_1.default.findOneAndDelete({
            _id: req.params.id,
            createdBy: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id,
        });
        if (!member) {
            res.status(404).json({ message: 'Team member not found' });
            return;
        }
        res.json({ message: 'Team member removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting team member', error });
    }
});
exports.deleteTeamMember = deleteTeamMember;
