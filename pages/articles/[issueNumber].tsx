import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  getIssue,
  listIssues,
  listIssueComments,
  type Issue,
  type IssueComment,
} from "../../lib/issue";
import Time from "../../components/Time";

type Props = {
  issue: Issue;
  issueComments: Array<IssueComment>;
};

const ShowArticle: NextPage<Props> = ({ issue, issueComments }) => {
  return (
    <div className="divide-y divide-gray-300 dark:divide-gray-700">
      <Head>
        <title>{issue.title}</title>
      </Head>
      <article className="markdown">
        <header>
          <Time dateTime={issue.created_at} />
          <h1>{issue.title}</h1>
        </header>
        <aside className="block text-[.8rem] text-gray-500 dark:text-gray-400">
          <p>
            Posted by&nbsp;
            <Link href={issue.user.html_url}>{issue.user.login}</Link>
            &nbsp;at&nbsp;
            <Link href={issue.html_url}>{`#${issue.number}`}</Link>.
          </p>
        </aside>
        <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }}></div>
      </article>
      {issueComments.map((issueComment) => (
        <article key={issueComment.id} className="markdown">
          <div dangerouslySetInnerHTML={{ __html: issueComment.bodyHTML }} />
        </article>
      ))}
    </div>
  );
};

export default ShowArticle;

export async function getStaticPaths() {
  const issues = await listIssues();
  const paths = issues.map((issue: any) => {
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
  const issue = await getIssue({ issueNumber });
  const issueComments = await listIssueComments({ issueNumber });
  return {
    props: {
      issue,
      issueComments,
    },
  };
}
