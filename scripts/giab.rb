require 'json'
require 'pathname'
require 'octokit'

# Note: In this code, we believe the payload is correctly passed.
module Giab
  class Sync
    class << self
      def call
        new.call
      end
    end

    def call
      case github_event_name
      when 'issues'
        UpdateIssue.call(payload['issue'])
      when 'issue_comment'
        case github_action_name
        when 'created', 'edited'
          UpdateIssueComment.call(
            issue: payload['issue'],
            issue_comment: payload['comment']
          )
        else
          raise ::NotImplementedError, "Unknown action name: #{github_action_name.inspect}"
        end
      else
        raise ::NotImplementedError, "Unknown event name: #{github_event_name.inspect}"
      end
    end

    private

    # @return [String]
    def github_action_name
      payload['action']
    end

    # @return [String]
    def github_event_name
      ::ENV['GITHUB_EVENT_NAME']
    end

    # @return [Hash]
    def payload
      @payload ||= GetGitHubPayload.call
    end
  end

  class GetGitHubPayload
    class << self
      # @return [Hash]
      def call
        new.call
      end
    end

    # @return [Hash]
    def call
      ::JSON.parse(content)
    end

    private

    # @return [String]
    def content
      pathname.read
    end

    # @return [String]
    def path
      ::ENV['GITHUB_EVENT_PATH']
    end

    # @return [Pathname]
    def pathname
      ::Pathname.new(path)
    end
  end

  class Database
    DEFAULT_VALUE = {}

    class << self
      # @return [Hash]
      def read
        new.read
      end

      # @param [Hash] data
      def write(data)
        new.write(data)
      end
    end

    # @return [Hash]
    def read
      if pathname.exist?
        ::JSON.parse(pathname.read)
      else
        DEFAULT_VALUE
      end
    end

    # @param [Hash] data
    def write(data)
      pathname.parent.mkpath
      pathname.write(
        ::JSON.dump(data)
      )
    end

    private

    # @return [Pathname]
    def pathname
      ::Pathname.new(path)
    end

    # @return [String]
    def path
      raise ::NotImplementedError
    end
  end

  class IssuesDatabase < Database
    # @return [String]
    def path
      'data/issues.json'
    end
  end

  class IssueCommentsDatabase < Database
    # @return [String]
    def path
      'data/issue_comments.json'
    end
  end

  class UpdateIssue
    class << self
      # @param [Hash] issue
      def call(issue)
        new(issue).call
      end
    end

    # @param [Hash] issue
    def initialize(issue)
      @issue = issue
    end

    def call
      body_html = GetIssueBodyHtml.call(issue_number: @issue['number'])

      data = IssuesDatabase.read
      data['issues'] ||= {}
      data['issues'][@issue['id']] = @issue.merge('bodyHTML' => body_html)
      IssuesDatabase.write(data)
    end
  end

  class GetIssueBodyHtml
    class << self
      # @param [Integer] issue_number
      # @return [String]
      def call(issue_number:)
        new(issue_number: issue_number).call
      end
    end

    # @param [Integer] issue_number
    def initialize(issue_number:)
      @issue_number = issue_number
    end

    # @return [String]
    def call
      client = ::Octokit::Client.new(access_token: ::ENV['GITHUB_TOKEN'])
      owner, name = ::ENV['GITHUB_REPOSITORY'].split('/', 2)
      query = <<-GRAPHQL
      query {
        repository(owner: "#{owner}", name: "#{name}") {
          issue(number: #{@issue_number}) {
            bodyHTML
          }
        }
      }
      GRAPHQL
      response = client.post(
        '/graphql',
        {
          query: query
        }.to_json
      )
      response.data.repository.issue.bodyHTML
    end
  end

  class UpdateIssueComment
    class << self
      # @param [Hash] issue
      # @param [Hash] issue_comment
      def call(
        issue:,
        issue_comment:
      )
        new(
          issue: issue,
          issue_comment: issue_comment
        ).call
      end
    end

    # @param [Hash] issue_comment
    # @param [Hash] issue
    # @param [Hash] issue_comment
    def initialize(
      issue:,
      issue_comment:
    )
      @issue = issue
      @issue_comment = issue_comment
    end

    def call
      data = IssueCommentsDatabase.read

      data['issue_comments'] ||= {}
      data['issue_comments'][issue_number_string] ||= {}
      data['issue_comments'][issue_number_string][@issue_comment.id.to_s] = @issue_comment

      IssueCommentsDatabase.write(data)
    end

    private

    # @return [String]
    def issue_comment_id_string
      @issue_comment['id'].to_s
    end

    # @return [String]
    def issue_number_string
      @issue['number'].to_s
    end
  end
end
