import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="overflow-hidden">
      <Head>
        <meta name="theme-color" content="#F2F2F3" id="theme-color-meta" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
