import jwt from 'jsonwebtoken';
import { UserProfile } from '../interfaces';

const secret: string = process.env.SUPABASE_JWT_SECRET || 'secret';

export function getUserFromRequest(request: any): UserProfile | null {
  const authorization: string = request?.headers?.authorization || 'Bearer ';
  const token: string = authorization.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (!decoded) {
      return null;
    }

    const id: string = (decoded as jwt.JwtPayload).sub || '';
    const meta = (decoded as jwt.JwtPayload)['user_metadata'];

    const user: UserProfile = {
      id: id,
      name: meta?.name || meta?.full_name || '',
    };

    return user;

  } catch (error) {
    return null;
  }
}