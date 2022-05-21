"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const messaging_1 = require("firebase-admin/messaging");
class FirebaseAdmin {
    constructor() {
        this.app = firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY,
            })
        });
        this.messaging = (0, messaging_1.getMessaging)(this.app);
        console.log('🔥 [FirebaseAdmin] Initialized Firebase Admin');
    }
    sendMessageTo(token, message) {
        this.messaging.sendToDevice([token], {
            data: Object.assign({}, message.data),
            notification: {
                title: message.title,
                body: message.body,
            }
        });
    }
}
exports.default = new FirebaseAdmin();
