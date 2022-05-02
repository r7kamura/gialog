import type { NextPage } from "next";
import Link from "next/link";
import { getIssue, listIssues } from "../../lib/issue";
import Time from "../../components/Time";

type Props = {
  issue: Issue;
};

type Issue = any;

const ShowArticle: NextPage<Props> = ({ issue }) => {
  return (
    <article>
      <header>
        <Time dateTime={issue.created_at} />
        <h1>{issue.title}</h1>
      </header>
      <footer>
        <p>
          Posted by&nbsp;
          <Link href={issue.user.html_url}>{issue.user.login}</Link>
          &nbsp;at&nbsp;
          <Link href={issue.html_url}>{`#${issue.number}`}</Link>.
        </p>
      </footer>
      <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }}></div>
    </article>
  );
};

export default ShowArticle;

export async function getStaticPaths() {
  const paths = listIssues().map((issue) => {
    return {
      params: {
        issueNumber: issue.number.toString(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const issueNumber = parseInt(params.issueNumber, 10);
  const issue = getIssue({ issueNumber });
  return {
    props: {
      issue,
    },
  };
}
