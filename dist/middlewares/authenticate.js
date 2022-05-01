"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.SUPABASE_JWT_SECRET || 'secret';
function authenticate(req, res, next) {
    try {
        const authorization = req.headers.authorization || 'Bearer ';
        const token = authorization.split(' ')[1];
        if (!token) {
            return res.status(401).send({
                message: 'Access denied. No token provided.',
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded) {
            return res.status(401).send({
                message: 'Access denied. Invalid token.',
            });
        }
        // user id is in decoded.sub
        next();
    }
    catch (err) {
        res.status(403).send({
            message: 'Access denied. Invalid token.',
        });
    }
}
exports.authenticate = authenticate;
