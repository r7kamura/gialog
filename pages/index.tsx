import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { listIssues } from "../lib/issue"

type Props = {
  issues: Array<Issue>;
}

type Issue = {
  id: number;
}

const Home: NextPage<Props> = ({ issues }) => {
  return (
    <ol>
      {issues.map((issue) => (
        <li>
          {issue.id}
        </li>
      ))}
    </ol>
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
