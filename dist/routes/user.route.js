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
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const supabase_1 = __importDefault(require("../services/supabase"));
const firebase_admin_1 = __importDefault(require("../services/firebase-admin"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.post('/ring', middlewares_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const targetUser = req.body;
    if (!(targetUser === null || targetUser === void 0 ? void 0 : targetUser.id)) {
        return res.status(400).json({
            message: 'Missing profile id',
        });
    }
    const sourceUser = (0, utils_1.getUserFromRequest)(req);
    if (!sourceUser || !(sourceUser === null || sourceUser === void 0 ? void 0 : sourceUser.id)) {
        return res.status(400).json({
            message: 'Token is invalid',
        });
    }
    try {
        supabase_1.default.ring(targetUser.id, sourceUser.id);
        const token = yield supabase_1.default.getToken(targetUser.id);
        if (!token || !(token === null || token === void 0 ? void 0 : token.notification)) {
            return res.status(200).json({
                message: 'Successfully ring him/her alarm. But can not send notification',
            });
        }
        firebase_admin_1.default.sendMessageTo(token.notification, {
            title: `💓 ${(sourceUser === null || sourceUser === void 0 ? void 0 : sourceUser.name) || 'Someone'} is ringing you!`,
            body: `🎊 Click to view their profile 🎉 `,
            data: {
                type: 'ring',
                profileId: sourceUser === null || sourceUser === void 0 ? void 0 : sourceUser.id,
                profileName: sourceUser === null || sourceUser === void 0 ? void 0 : sourceUser.name,
                url: `com.dathuynh.lovealarm://profile/${sourceUser === null || sourceUser === void 0 ? void 0 : sourceUser.id}`,
            },
        });
        res.status(200).json({
            message: 'Successfully ring him/her alarm.',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to ring him/her alarm.',
        });
    }
}));
router.post('/unring', middlewares_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const targetUser = req.body;
    if (!(targetUser === null || targetUser === void 0 ? void 0 : targetUser.id)) {
        return res.status(400).json({
            message: 'Missing profile id',
        });
    }
    const sourceUser = (0, utils_1.getUserFromRequest)(req);
    if (!sourceUser || !(sourceUser === null || sourceUser === void 0 ? void 0 : sourceUser.id)) {
        return res.status(400).json({
            message: 'Token is invalid',
        });
    }
    try {
        supabase_1.default.unring(targetUser.id, sourceUser.id);
        res.status(200).json({
            message: 'Successfully un-ring him/her alarm.',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to un-ring him/her alarm.',
        });
    }
}));
exports.default = router;
