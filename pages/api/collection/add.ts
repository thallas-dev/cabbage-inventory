import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";


const CollectionSchema = z.object({
  name: z.string(),
  ownerId: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    try {
      const { name, ownerId } = CollectionSchema.parse(req.body);

      // const idExist = await prisma.user.findFirst({
      //   where: { id: ownerId },
      // });
      // res
      // .status(200)
      // .json({ name, ownerId });


      // console.log(idExist)
      // if (!idExist){
      //   res
      //   .status(409)
      //   .json({ user: null, message: "UserId you provided does not exist." });
      // }
      const collectionExist = await prisma.item.count({
        where: {
         name : name
        },
      });
      
      res
        .status(200)
        .json({ collectionExist });


      // if (collectionExist) {
      //   res
      //     .status(409)
      //     .json({ user: null, message: "Collection already exist." });
      // }

      // const newCollection = await prisma.collection.create({
      //   data: {
      //     name,
      //     ownerId
      //   },
      // });

      // res
      //   .status(201)
      //   .json({ collection: newCollection, message: "Collection successfully created" });
    } catch (err) {
      res.status(500).json({ err, error: "failed to fetch data" });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Invalid method" });
  }
}
