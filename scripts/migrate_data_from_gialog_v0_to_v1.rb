# This is a migration script from gialog v0 (JSON data version) from v1 (Markdown data version).
#
# Run this script like this:
#
# ```
# git pull
# git checkout -t origin/data
# ruby /path/to/migrate_data_from_gialog_v0_to_v1.rb
# git add issues
# git commit -m "Migrate data from v0 format to v1 format"
# git push
#````
#
# Then switch gialog-sync@v0 to gialog-sync@v1 by modifying .github/workflows/sync.yml as follows:
#
# ```
# diff --git a/.github/workflows/sync.yml b/.github/workflows/sync.yml
# index 07c99a2..7339de2 100644
# --- a/.github/workflows/sync.yml
# +++ b/.github/workflows/sync.yml
# @@ -31,7 +31,7 @@ jobs:
#            path: data
#            ref: data
#          continue-on-error: true
# -      - uses: r7kamura/gialog-sync@v0
# +      - uses: r7kamura/gialog-sync@v1
#          env:
#            GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
#        - uses: peaceiris/actions-gh-pages@v3
# ```

require 'json'
require 'pathname'
require 'yaml'

data_path = '.'

issues_data_path = "#{data_path}/issues.json"
issues_data_pathname = Pathname.new(issues_data_path)
issues_data_content = issues_data_pathname.read
issues_data = JSON.parse(issues_data_content)

issues_data['issues'].each do |issue_number, issue|
  issue.delete('bodyHTML')
  body = issue.delete('body')
  issue_file_content = [
    issue.to_yaml,
    body
  ].join("\n---\n")
  issue_file_path = "#{data_path}/issues/#{issue_number}/issue.md"
  issue_file_pathname = Pathname.new(issue_file_path)
  issue_file_pathname.parent.mkpath
  issue_file_pathname.write(issue_file_content)
end

issue_comments_data_path = "#{data_path}/issue_comments.json"
issue_comments_data_pathname = Pathname.new(issue_comments_data_path)
issue_comments_data_content = issue_comments_data_pathname.read
issue_comments_data = JSON.parse(issue_comments_data_content)

issue_comments_data['issue_comments'].each do |issue_number, hash|
  hash.each do |issue_comment_id, issue_comment|
    issue_comment.delete('bodyHTML')
    body = issue_comment.delete('body')
    issue_comment_file_content = [
      issue_comment.to_yaml,
      body
    ].join("\n---\n")
    issue_comment_file_path = "#{data_path}/issues/#{issue_number}/issue_comments/#{issue_comment_id}.md"
    issue_comment_file_pathname = Pathname.new(issue_comment_file_path)
    issue_comment_file_pathname.parent.mkpath
    issue_comment_file_pathname.write(issue_comment_file_content)
  end
end
