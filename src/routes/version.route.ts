import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    description: 'Love Alarm Serverless Functions',
    version: '0.0.1'
  });
});

export default router;