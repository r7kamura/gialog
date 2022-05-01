import fs from "fs"

export function getIssue({ issueNumber }: { issueNumber: number }) {
  const content = fs.readFileSync("./issues.json", { encoding: "utf-8" })
  const data = JSON.parse(content);
  let result;
  listIssues().find((issue) => {
    if (issue.number === issueNumber) {
      result = issue;
      return true;
    }
  })
  return result;
}

export function listIssues() {
  const content = fs.readFileSync("./issues.json", { encoding: "utf-8" })
  const data = JSON.parse(content);
  return Object.keys(data.issues).map((key) => {
    return data.issues[key];
  });
}
