import { RequestMethods } from '@/lib/helpers';
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";
import { updateIfValueExists } from '@/lib/helpers';


const CategorySchema = z.object({
  oldCategoryName: z.string(),
  newCategoryName: z.string().optional(),
  filterBy: z.string().optional(),
  startQty: z.number().optional(),
  endQty: z.number().optional(),
  collectionId: z.number(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ALLOWED_METHODS: RequestMethods[] = ['POST'];
  if (!ALLOWED_METHODS.includes(req.method as RequestMethods)) {
      res.status(405).json({ error: "Invalid method" });
      return;
  } 
  
    // Process a POST request
    try {
      const { oldCategoryName, newCategoryName, filterBy, startQty, endQty, collectionId } = CategorySchema.parse(req.body);

      const categoryExist = await prisma.category.count({
        where: {
         name : oldCategoryName, collectionId: collectionId
        },
      });
      if (!categoryExist) {
        res
          .status(409)
          .json({ message: "Category does not exist in the collection." });
        return;
      }

      let categoryUpdate = {};
      categoryUpdate = updateIfValueExists(categoryUpdate, 'name', newCategoryName);
      categoryUpdate = updateIfValueExists(categoryUpdate, 'filterBy', filterBy);
      categoryUpdate = updateIfValueExists(categoryUpdate, 'startQty', startQty);
      categoryUpdate = updateIfValueExists(categoryUpdate, 'endQty', endQty);

      const updateCategory = await prisma.category.updateMany({
        where: {
          name: oldCategoryName,
          collectionId: collectionId
        },
        data: {
          ...categoryUpdate
        },
      })

      res
        .status(200)
        .json({ category: updateCategory, message: "Collection successfully updated." });
    } catch (err) {
      res.status(500).json({ err, error: "failed to fetch data" });
    }
}