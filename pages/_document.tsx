import Nav from '@/components/Nav'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <main className='h-screen flex flex-col justify-center items-center'>
          <Nav />
          <Main />
          <NextScript />
        </main>
      </body>
    </Html>
  )
}
