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
  const ALLOWED_METHODS = ['POST'] as const;
  if (!ALLOWED_METHODS.includes(req.method as 'POST')) {
      res.status(405).json({ error: "Invalid method" });
      return;
  } 
  
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
        return;
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
}
