"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Category = {
  name: string;
  selected: boolean;
};

type Item = {
  name: string;
  description: string;
  qty: number;
  unit: string;
};

export default function Items() {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session === null) {
      router.push('/login')
    }
  }, [session, router])
  const [categoriesList, setCategoriesList] = useState<Category[]>(
    Array(5)
      .fill({
        name: "Item Filter",
        selected: false,
      })
      .map((cat, i) => ({ ...cat, name: `${cat.name} ${i + 1}` }))
  );
  const itemsList: Item[] = Array<Item>(50)
    .fill({
      name: "My Item",
      description: "The Item Description is a very important part of an item",
      qty: 5,
      unit: "pcs.",
    })
    .map((item, i) => {
      const qty = i % 2 === 0 ? 5 + i : 5 - i;
      return { ...item, qty, unit: qty > 1 ? "pcs." : "pc." };
    });

  const onCategorySelect = (i: number, category: Category) => {
    categoriesList[i] = { ...category, selected: !category.selected };
    setCategoriesList([...categoriesList]);
  };

  return (
    <section className="h-full grid grid-cols-5 gap-4">
      <div>
        <h3 className="font-semibold">Categories</h3>
        <ul>
          {categoriesList.map((category, i) => (
            <li key={i} className="pt-1">
              <Button
                className="h-15 w-full py-1 justify-start"
                variant={category.selected ? "default" : "secondary"}
                onClick={() => onCategorySelect(i, category)}
              >
                {category.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <section className="col-span-4">
        <h3 className="pb-1 font-semibold">Items</h3>
        <div className="h-full grid grid-cols-4 gap-4">
          {itemsList.map((item, i) => (
            <div className="bg-slate-50 h-96" key={i}>
              <Image
                src={"/rickroll_4k.jpg"}
                height={0}
                width={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                alt={"rickrolls"}
              />
              <h5 className="px-2 mt-2">
                {item.name}
                <span
                  className={`ml-2 ${item.qty > 5 ? "text-slate-600" : "text-red-500"
                    } text-xs`}
                >
                  {item.qty}
                  {item.unit}
                </span>
                {item.qty <= 5 && (
                  <span className="ml-1 text-red-500 text-xs">left</span>
                )}
              </h5>
              <p className="px-2 mt-2 text-xs">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
