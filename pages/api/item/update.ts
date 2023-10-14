import { prisma } from "@/lib/prisma";
import { data } from 'autoprefixer';
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";


const ItemSchema = z.object({
  oldItemName: z.string(),
  newItemName: z.string().optional(),
  quantity: z.number().optional(),
  description: z.string().optional(),
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
  
    // Process a POST request
    try {
      const { oldItemName, newItemName, quantity, description, collectionId } = ItemSchema.parse(req.body);

      const itemExist = await prisma.item.count({
        where: {
         name : oldItemName, collectionId: collectionId
        },
      });
      if (!itemExist) {
        res
          .status(409)
          .json({ message: "Item does not exist in the collection." });
        return;
      }

      let itemUpdate = {};
      itemUpdate = updateIfValueExists(itemUpdate, 'name', newItemName);
      itemUpdate = updateIfValueExists(itemUpdate, 'quantity', quantity);
      itemUpdate = updateIfValueExists(itemUpdate, 'description', description);

      const updateItem = await prisma.item.updateMany({
        where: {
          name: oldItemName,
          collectionId: collectionId
        },
        data: {
          ...itemUpdate
        },
      })

      res
        .status(200)
        .json({ category: updateItem, message: "Item successfully updated." });
    } catch (err) {
      res.status(500).json({ err, error: "failed to fetch data" });
    }
}

function updateIfValueExists(obj: Record<string, any>, key: string, value: any) {
  return value ? { ...obj, [key]: value } : obj;
}