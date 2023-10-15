import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";


const ItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  description: z.string(),
  collectionId: z.number(),
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

    try {
      const { name, quantity, description, collectionId } = ItemSchema.parse(req.body);

      const collectionExist = await prisma.collection.count({
        where: {
        id: collectionId
        },
      });
      if (!collectionExist) {
        res
          .status(409)
          .json({ message: "Collection does not exist." });
        return;
      }

      const itemExist = await prisma.item.count({
        where: {
         name : name, collectionId: collectionId
        },
      });
      if (itemExist) {
        res
          .status(409)
          .json({ message: "Item already exist in the collection." });
        return;
      }

        const newItem = await prisma.item.create({
          data: {
            name,
            quantity,
            description,
            collectionId
          },
        });
        res
          .status(201)
          .json({ item: newItem, message: "Item successfully created" });

    } catch (err) {
      res.status(500).json({ err, error: "failed to fetch data" });
    }
}
