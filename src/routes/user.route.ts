import express from 'express';
import { Request, Response } from 'express';
import { authenticate } from '../middlewares';

import Supabase from '../services/supabase';
import FirebaseAdmin from '../services/firebase-admin';

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

  if (!sourceUser || !sourceUser?.id) {
    return res.status(400).json({
      message: 'Token is invalid',
    });
  }

  try {
    Supabase.ring(targetUser.id, sourceUser.id);

    const token = await Supabase.getToken(targetUser.id);
    if (!token || !token?.notification) {
      return res.status(200).json({
        message: 'Successfully ring him/her alarm. But can not send notification',
      });
    }

    FirebaseAdmin.sendMessageTo(token.notification, {
      title: `💓 ${sourceUser?.name || 'Someone'} is ringing you!`,
      body: `🎊 Click to view their profile 🎉 `,
      data: {
        type: 'ring',
        profileId: sourceUser?.id,
        profileName: sourceUser?.name,
        url: `com.dathuynh.lovealarm://profile/${sourceUser?.id}`,
      },
    });

    res.status(200).json({
      message: 'Successfully ring him/her alarm.',
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to ring him/her alarm.',
    });
  }
});

router.post('/unring', authenticate, async (req: Request, res: Response) => {
  const targetUser = req.body;
  if (!targetUser?.id) {
    return res.status(400).json({
      message: 'Missing profile id',
    });
  }

  const sourceUser = getUserFromRequest(req);

  if (!sourceUser || !sourceUser?.id) {
    return res.status(400).json({
      message: 'Token is invalid',
    });
  }

  try {
    Supabase.unring(targetUser.id, sourceUser.id);

    res.status(200).json({
      message: 'Successfully un-ring him/her alarm.',
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to un-ring him/her alarm.',
    });
  }
});

export default router;