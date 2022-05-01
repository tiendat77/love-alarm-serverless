import express from 'express';
import { Request, Response } from 'express';
import { authenticate } from '../middlewares';

import Supabase from '../services/supabase';
import FirebaseAdmin from '../services/firebase-admin';

import { Message } from '../interfaces';
import { getUserFromRequest } from '../utils';

const router = express.Router();

router.post('/ring', authenticate, async (req: Request, res: Response) => {
  const targetUser = req.body;
  if (!targetUser?.id) {
    return res.status(400).json({
      message: 'Missing profile id',
    });
  }

  const sourceUser = getUserFromRequest(req);

  try {
    const token = await Supabase.getToken(targetUser.id);
    if (!token || !token?.notification) {
      return res.status(400).json({
        message: 'No token found for target profile.',
      });
    }

    const message: Message = {
      title: `💓 ${sourceUser?.name || 'Someone'} is ringing you!`,
      body: `🎊 Click to view their profile 🎉 `,
      data: {
        type: 'ring',
        profileId: sourceUser?.id,
        profileName: sourceUser?.name,
        url: `com.dathuynh.lovealarm://profile/${sourceUser?.id}`,
      },
    };

    FirebaseAdmin.sendMessageTo(token.notification, message);

    return res.status(200).json({
      message: 'Successfully ring him/her alarm.',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Failed to ring him/her alarm.',
    });
  }
});

export default router;