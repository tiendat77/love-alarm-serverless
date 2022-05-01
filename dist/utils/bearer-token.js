"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromRequest = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.SUPABASE_JWT_SECRET || 'secret';
function getUserFromRequest(request) {
    var _a;
    const authorization = ((_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authorization) || 'Bearer ';
    const token = authorization.split(' ')[1];
    if (!token) {
        return null;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded) {
            return null;
        }
        const id = decoded.sub || '';
        const meta = decoded['user_metadata'];
        const user = {
            id: id,
            name: (meta === null || meta === void 0 ? void 0 : meta.name) || (meta === null || meta === void 0 ? void 0 : meta.full_name) || '',
        };
        return user;
    }
    catch (error) {
        return null;
    }
}
exports.getUserFromRequest = getUserFromRequest;
