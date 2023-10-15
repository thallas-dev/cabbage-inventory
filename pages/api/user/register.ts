import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import * as z from "zod";
import { RequestMethods } from '@/lib/helpers';

const UserSchema = z.object({
  username: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  name: z.string(),
  password: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const ALLOWED_METHODS: RequestMethods[] = ['POST'];
  if (!ALLOWED_METHODS.includes(req.method as RequestMethods)) {
      res.status(405).json({ error: "Invalid method" });
      return;
  } 

    // Process a POST request
    try {
      const { username, name, password } = UserSchema.parse(req.body);

      const usernameExist = await prisma.user.findUnique({
        where: { username: username },
      });
      if (usernameExist) {
        // TODO : standardize handling API response
        res
          .status(409)
          .json({ user: null, message: "Username already exists." });
        return;
      }

      const encryptedPassword = await hash(
        password,
        Number(process.env.SALT_ROUND),
      );
      const newUser = await prisma.user.create({
        data: {
          username,
          name,
          password: encryptedPassword,
        },
      });
      const { password: newPassword, ...objWithoutPw } = newUser;

      res
        .status(201)
        .json({ user: objWithoutPw, message: "User successfully created" });
    } catch (err) {
      res.status(500).json({ error: "failed to fetch data" });
    }

}
