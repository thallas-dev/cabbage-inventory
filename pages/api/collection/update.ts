import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";


const CollectionSchema = z.object({
  oldCollectionName: z.string(),
  newCollectionName: z.string(),
  ownerId: z.number(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    try {
      const { oldCollectionName, newCollectionName, ownerId } = CollectionSchema.parse(req.body);

      const collectionExist = await prisma.collection.count({
        where: {
         name : oldCollectionName, ownerId: ownerId
        },
      });
      if (!collectionExist) {
        res
          .status(409)
          .json({ message: "You do not have this collection." });
      }

      const updateCollection = await prisma.collection.updateMany({
        where: {
          name: oldCollectionName,
          ownerId: ownerId
        },
        data: {
          name: newCollectionName,
        },
      })

      res
        .status(200)
        .json({ collection: updateCollection, message: "Collection successfully updated." });
    } catch (err) {
      res.status(500).json({ err, error: "failed to fetch data" });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Invalid method" });
  }
}
