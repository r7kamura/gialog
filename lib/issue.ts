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
  const data = loadData("./data/issues.json");
  return Object.keys(data.issues || {})
    .map((issueNumberString) => {
      return data.issues[issueNumberString];
    })
    .sort(byCreatedAt)
    .reverse();
}

export function listIssueComments({
  issueNumber,
}: {
  issueNumber: number;
}): Array<IssueComment> {
  const data = loadData("./data/issue_comments.json");
  const issueCommentsMap =
    (data.issue_comments || {})[issueNumber.toString()] || {};
  return Object.keys(issueCommentsMap)
    .map((issueNumberString) => {
      return issueCommentsMap[issueNumberString];
    })
    .sort(byCreatedAt);
}

function loadData(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, { encoding: "utf-8" });
    return JSON.parse(content);
  } catch (_error) {
    return {};
  }
}

type SortableByCreatedAt = {
  created_at: any;
};

function byCreatedAt(a: SortableByCreatedAt, b: SortableByCreatedAt) {
  if (a.created_at < b.created_at) {
    return -1;
  } else if (a.created_at > b.created_at) {
    return 1;
  } else {
    return 0;
  }
}
