// pages/api/setToken.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function setToken(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  if (token) {
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);
    res.status(200).json({ message: 'Token set successfully' });
  } else {
    res.status(400).json({ message: 'Token not provided' });
  }
}
