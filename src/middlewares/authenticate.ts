import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const secret: string = process.env.SUPABASE_JWT_SECRET || 'secret';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization: string = req.headers.authorization || 'Bearer ';
    const token: string = authorization.split(' ')[1];

    if (!token) {
      return res.status(401).send({
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, secret);

    if (!decoded) {
      return res.status(401).send({
        message: 'Access denied. Invalid token.',
      });
    }

    // user id is in decoded.sub
    next();
  } catch (err) {
    res.status(403).send({
      message: 'Access denied. Invalid token.',
    });
  }
}
