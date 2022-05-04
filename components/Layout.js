import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <header>
        <nav>
          <p>
            <Link href="/">
              <a>My blog</a>
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
