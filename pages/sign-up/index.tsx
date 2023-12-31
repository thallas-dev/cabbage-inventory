"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import AppTitle from "@/components/ui/app-title";
import Link from "next/link";

const FormSchema = z
  .object({
    username: z.string().min(5, {
      message: "Username must be at least 5 characters.",
    }),
    name: z.string(),
    password: z.string(),
    confirmPass: z.string(),
  })
  .refine((data) => data.password === data.confirmPass, {
    path: ["confirmPass"],
    message: "Password do not match",
  });

export default function Signup() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // TODO : standardize handling API call
      body: JSON.stringify({
        username: data.username,
        name: data.name,
        password: data.password,
      }),
    });

    if (response.ok) {
      router.push("/login");
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }

  return (
    <Form {...form}>
      <AppTitle />
      <section className="w-1/2 mx-auto">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full grid gap-y-3"
        >
          <div></div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter your password again</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Re-enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full mt-6" type="submit">
            Create account
          </Button>
        </form>
        <div
          className="mx-auto my-4 flex w-full items-center justify-evenly
             before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow
             after:bg-stone-400"
        >
          or
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          Already have an account?
          <Link className="text-link hover:underline ml-1" href="/login">
            Log in
          </Link>
        </p>
      </section>
    </Form>
  );
}
