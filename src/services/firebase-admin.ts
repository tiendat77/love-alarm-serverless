import admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';
import { Message } from '../interfaces';

class FirebaseAdmin {

  private app: admin.app.App;
  private messaging;

  constructor() {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(require('../../firebase-admin.json'))
    });

    this.messaging = getMessaging(this.app);

    console.log('🔥 [FirebaseAdmin] Initialized Firebase Admin');
  }

  sendMessageTo(token: string, message: Message) {
    this.messaging.sendToDevice(token, {
      data: {...message.data},
      notification: {
        title: message.title,
        body: message.body,
      }
    });
  }

}

export default new FirebaseAdmin();