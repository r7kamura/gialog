import fs from "fs"

export function listIssues() {
  const content = fs.readFileSync("./issues.json", { encoding: "utf-8" })
  const data = JSON.parse(content);
  return Object.keys(data.issues).map((key) => {
    return data.issues[key];
  });
}
