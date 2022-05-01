import type { NextPage } from "next";
import Link from "next/link";
import { listIssues } from "../lib/issue";

type Props = {
  issues: Array<Issue>;
};

type Issue = any;

const Home: NextPage<Props> = ({ issues }) => {
  return (
    <>
      <section>
        <p>
          このウェブサイトは、GitHub IssuesをCMSとして利用するブログのデモサイトです。
          <a href="https://github.com/r7kamura/github-issues-as-blog">r7kamura/github-issues-as-blog</a>
          でGitHub Issueを書くことで、このブログに記事が投稿されています。</p>
      </section>
      <section>
        <ol>
          {issues.map((issue) => (
            <li key={issue.number}>
              <Link href={`/articles/${issue.number}`}>{issue.title}</Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  return {
    props: {
      issues: listIssues(),
    },
  };
}
