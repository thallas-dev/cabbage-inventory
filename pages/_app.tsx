import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Nav from "@/components/Nav";
import { SessionProvider } from "next-auth/react";
import { Toaster } from '@/components/ui/toaster';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Nav />
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  );
}
