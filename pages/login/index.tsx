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
import Link from "next/link";
import AppTitle from "@/components/ui/app-title";
import { SignInResponse, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, SyntheticEvent } from "react";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string(),
});

export default function Login() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const signInData = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (signInData?.ok) {
      router.push("/items");
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Invalid username or password.",
      })
    }
  }

  return (
    <Form {...form}>
      <section className="w-1/2 mx-auto">
        <AppTitle />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full  grid gap-y-3"
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
          <Button className="w-full mt-6" type="submit">
            Login
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
          Don&apos;t have an account?
          <Link className="text-link ml-1 hover:underline" href="/sign-up">
            Create one
          </Link>
        </p>
      </section>
    </Form>
  );
}
