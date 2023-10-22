import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";
import { RequestMethods } from "@/lib/helpers";

const ItemSchema = z.object({
  collectionId: z.number(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const ALLOWED_METHODS: RequestMethods[] = ["GET"];
  if (!ALLOWED_METHODS.includes(req.method as RequestMethods)) {
    res.status(405).json({ error: "Invalid method" });
    return;
  }

  try {
    const { collectionId } = ItemSchema.parse(req.body);

    const item = await prisma.item.findMany({
      where: {
        collectionId: collectionId,
      },
    });

    res.status(200).json({ item: item });
  } catch (err) {
    res.status(500).json({ err, error: "failed to fetch data" });
  }
}
