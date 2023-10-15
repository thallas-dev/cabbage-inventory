import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";

const CollectionSchema = z.object({
  name: z.string(),
  ownerId: z.number(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const ALLOWED_METHODS = ["POST"] as const;
  if (!ALLOWED_METHODS.includes(req.method as "POST")) {
    res.status(405).json({ error: "Invalid method" });
    return;
  }

  try {
    const { name, ownerId } = CollectionSchema.parse(req.body);

    const collectionExist = await prisma.collection.count({
      where: {
        name: name,
        ownerId: ownerId,
      },
    });
    if (collectionExist) {
      res.status(409).json({ message: "You already own this collection." });
      return;
    }

    const newCollection = await prisma.collection.create({
      data: {
        name,
        ownerId,
      },
    });
    res
      .status(201)
      .json({
        collection: newCollection,
        message: "Collection successfully created",
      });
  } catch (err) {
    res.status(500).json({ err, error: "failed to fetch data" });
  }
}
