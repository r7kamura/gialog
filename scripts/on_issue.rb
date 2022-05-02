require_relative 'giab'

payload = Giab::GetGitHubPayload.call

Giab::UpdateIssue.call(payload['issue'])
