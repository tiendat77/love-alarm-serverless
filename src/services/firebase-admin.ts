import admin from 'firebase-admin';
import { getMessaging, Messaging } from 'firebase-admin/messaging';
import { Message } from '../interfaces';

class FirebaseAdmin {

  private app: admin.app.App;
  private messaging: Messaging;

  constructor() {
    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      })
    });

    this.messaging = getMessaging(this.app);

    console.log('🔥 [FirebaseAdmin] Initialized Firebase Admin');
  }

  sendMessageTo(token: string, message: Message) {
    this.messaging.sendToDevice([token], {
      data: {...message.data},
      notification: {
        title: message.title,
        body: message.body,
      }
    });
  }

}

export default new FirebaseAdmin();