import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <main className="h-screen w-screen pt-20 pb-5">
          <Main />
          <NextScript />
        </main>
      </body>
    </Html>
  );
}
