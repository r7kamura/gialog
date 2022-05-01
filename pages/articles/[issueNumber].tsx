import type { NextPage } from "next";
import { getIssue, listIssues } from "../../lib/issue";

type Props = {
  issue: Issue;
};

type Issue = any;

const ShowArticle: NextPage<Props> = ({ issue }) => {
  console.log(issue);

  return (
    <article>
      <header>
        <h1>{issue.title}</h1>
      </header>
      <div>{issue.body}</div>
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
  console.log(issueNumber);
  return {
    props: {
      issue,
    },
  };
}
