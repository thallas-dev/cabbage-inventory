"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Badge } from "../../components/ui/badge";
import { LeafyGreen } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../../components/ui/input";

type Category = {
  name: string;
  selected: boolean;
  qty: number;
};

type Item = {
  name: string;
  description: string;
  qty: number;
  unit: string;
  tags: string[];
};

const AddItemSchema = z.object({
  name: z.string(),
});

type AddItemForm = z.infer<typeof AddItemSchema>;

export default function Items() {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [session, router]);
  const [categoriesList, setCategoriesList] = useState<Category[]>(
    Array(15)
      .fill({
        name: "Item Filter",
        selected: false,
        qty: 0,
      })
      .map((cat, i) => ({ ...cat, name: `${cat.name} ${i + 1}`, qty: i }))
  );
  const itemsList: Item[] = Array<Item>(50)
    .fill({
      name: "My Item",
      description: "The Item Description is a very important part of an item",
      qty: 5,
      unit: "pcs.",
      tags: ["Tag 1", "Tag 2", "Tag 2", "Tag 2", "Tag 2"],
    })
    .map((item, i) => {
      const qty = Math.max(0, i % 2 === 0 ? 5 + i : 10 - i);
      return {
        ...item,
        qty,
        unit: qty > 1 ? "pcs." : "pc.",
        tags: item.tags.slice(0, 4),
      };
    });
  const [filteredItemsList, setFilteredList] = useState<Item[]>(itemsList);

  const onCategorySelect = (i: number, category: Category) => {
    categoriesList[i] = { ...category, selected: !category.selected };
    const selectedCategories = categoriesList.filter((cat) => cat.selected);
    setFilteredList(
      selectedCategories.length === 0
        ? [...itemsList]
        : itemsList
            .filter((item) =>
              selectedCategories.some((cat) => item.qty <= cat.qty)
            )
            .sort((a, b) => {
              if (a.qty === 0) return 2;
              if (a.qty > b.qty) return 1;
              if (a.qty < b.qty) return -1;
              return 0;
            })
    );

    setCategoriesList([...categoriesList]);
  };

  //TODO: reorganize
  const form = useForm<AddItemForm>({
    resolver: zodResolver(AddItemSchema),
  });

  return (
    <section>
      <div className="flex justify-between mb-2">
        <h1 className="flex items-end text-lg font-bold m-0">Items Display</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <LeafyGreen
                color="#99F0CA"
                strokeWidth={3}
                size={18}
                className="inline mr-2"
              />{" "}
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new item</DialogTitle>
              <DialogDescription>
                Need a new item to track? Just fill up the form then press save.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(() => console.log("Hey"))}
                className="w-full grid gap-y-3"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name:</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Categories Filter */}
      <div className="h-full grid grid-cols-5 gap-4">
        <section className="bg-slate-50 p-3">
          <h3 className="font-semibold mb-2">Categories Filter</h3>
          <ul>
            {categoriesList.map((category, i) => (
              <li key={i} className="pt-1">
                <Button
                  className="h-15 py-1 justify-start"
                  variant={category.selected ? "default" : "secondary"}
                  onClick={() => onCategorySelect(i, category)}
                >
                  {category.name}
                </Button>
              </li>
            ))}
          </ul>
        </section>
        {/* Items List */}
        <section className="col-span-4">
          <div className="h-full grid grid-cols-4 gap-4">
            {filteredItemsList.length > 0 ? (
              filteredItemsList.map((item, i) => (
                <div className="rounded bg-slate-200 pb-3" key={i}>
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
                    {item.qty === 0 ? (
                      <span className="ml-2 text-red-500 text-xs font-semibold">
                        Out of Stock
                      </span>
                    ) : (
                      <span
                        className={`ml-2 ${
                          item.qty > 5 ? "text-slate-600" : "text-red-500"
                        } text-xs`}
                      >
                        {item.qty}
                        {item.unit}
                      </span>
                    )}

                    {item.qty > 0 && item.qty <= 5 && (
                      <span className="ml-1 text-red-500 text-xs">left</span>
                    )}
                  </h5>
                  <p className="px-2 mt-2 text-xs">{item.description}</p>
                  <div className="px-2 mt-2">
                    {item.tags.map((t, i) => (
                      <Badge
                        className="mr-1 rounded"
                        key={i}
                        variant={"secondary"}
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <>Hmmm... Seems empty.</>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
