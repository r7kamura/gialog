import Head from "next/head";
import Link from "next/link";

const siteTitle = "My blog";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <header>
        <nav>
          <p>
            <Link href="/">
              <a>{siteTitle}</a>
            </Link>
          </p>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <nav>
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
}
