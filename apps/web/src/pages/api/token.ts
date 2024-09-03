import ky from 'ky';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

type Data = {
  accessToken: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions);
  const tokenResponse: Data = await ky
    .post(
      `${process.env.NEXT_PUBLIC_PLATFORM_API_BASE_URL}/platform/auth/token`,
      {
        json: {
          email: session?.user?.email,
        },
      }
    )
    .json();

  res.status(200).json(tokenResponse);
}
