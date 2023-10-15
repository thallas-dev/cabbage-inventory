import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";


const CategorySchema = z.object({
  name: z.string(),
  filterBy: z.string(),
  startQty: z.number(),
  endQty: z.number(),
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
      const { name, filterBy, startQty, endQty, collectionId } = CategorySchema.parse(req.body);

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

      const categoryExist = await prisma.category.count({
        where: {
         name : name, collectionId: collectionId
        },
      });
      if (categoryExist) {
        res
          .status(409)
          .json({ message: "Category already exist in the collection." });
        return;
      }

        const newCategory = await prisma.category.create({
          data: {
            name,
            filterBy,
            startQty,
            endQty,
            collectionId
          },
        });
        res
          .status(201)
          .json({ category: newCategory, message: "Category successfully created" });

    } catch (err) {
      res.status(500).json({ err, error: "failed to fetch data" });
    }
}
