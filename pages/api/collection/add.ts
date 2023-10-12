import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";


const CollectionSchema = z.object({
  name: z.string(),
  ownerId: z.number(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    try {
      const { name, ownerId } = CollectionSchema.parse(req.body);

      const collectionExist = await prisma.collection.count({
        where: {
         name : name, ownerId: ownerId
        },
      });
      if (collectionExist) {
        res
          .status(409)
          .json({ message: "You already own this collection." });
      }

      else{
        const newCollection = await prisma.collection.create({
          data: {
            name,
            ownerId
          },
        });
        res
          .status(201)
          .json({ collection: newCollection, message: "Collection successfully created" });
      }
    } catch (err) {
      res.status(500).json({ err, error: "failed to fetch data" });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Invalid method" });
  }
}
