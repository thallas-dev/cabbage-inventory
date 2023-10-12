import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";


const CollectionSchema = z.object({
  ownerId: z.number(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Process a POST request
    try {
      const { ownerId } = CollectionSchema.parse(req.body);

      const collection = await prisma.collection.findMany({
        where: { 
          ownerId: ownerId
        },
      });
      
      res
      .status(200)
      .json({ collection : collection });


    } catch (err) {
      res.status(500).json({ err, error: "failed to fetch data" });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Invalid method" });
  }
}
