require_relative 'giab'

payload = Giab::GetGitHubPayload.call

case payload['action']
when 'created', 'edited'
  Giab::UpdateIssueComment.call(
    issue: payload['issue'],
    issue_comment: payload['comment']
  )
when 'deleted'
  raise NotImplementedError
end
