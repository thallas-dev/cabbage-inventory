import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';
import * as z from 'zod';

const UserSchema = z.object({
    username: z.string().min(5, {
        message: "Username must be at least 5 characters.",
    }),
    name: z.string(),
    password: z.string(),
})


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        // Process a POST request
        try {
            const { username, name, password } = UserSchema.parse(req.body);

            const usernameExist = await prisma.user.findUnique({
                where: { username: username }
            })
            if (usernameExist) {
                res.status(409).json({ user: null, message: "Username already exists." })
            }

            const encryptedPassword = await hash(password, 10)

            const newUser = await prisma.user.create({
                data: {
                    username,
                    name,
                    password: encryptedPassword
                }
            })
            const { password: newPassword, ...objWithoutPw } = newUser;

            res.status(201).json({ user: objWithoutPw, message: "User successfully created" })
        } catch (err) {
            res.status(500).json({ error: 'failed to fetch data' })
        }
    } else {
        // Handle any other HTTP method
        res.status(405).json("Invalid method");
    }
}