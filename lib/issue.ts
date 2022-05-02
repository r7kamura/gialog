import fs from "fs";

export type Issue = any;

export type IssueComment = any;


export function getIssue({ issueNumber }: { issueNumber: number }): Issue {
  let result;
  listIssues().find((issue) => {
    if (issue.number === issueNumber) {
      result = issue;
      return true;
    }
  });
  return result;
}

export function listIssues(): Array<Issue> {
  const content = fs.readFileSync("./data/issues.json", { encoding: "utf-8" });
  const data = JSON.parse(content);
  return Object.keys(data.issues).map((key) => {
    return data.issues[key];
  });
}

export function listIssueComments({ issueNumber }: { issueNumber: number }): Array<IssueComment> {
  return [];
}
