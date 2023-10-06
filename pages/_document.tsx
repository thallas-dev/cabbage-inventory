import Nav from "@/components/Nav";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Nav />
        <main className="h-screen w-screen pt-20 px-5 pb-5">
          <Main />
          <NextScript />
        </main>
      </body>
    </Html>
  );
}
