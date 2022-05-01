require 'json'
require 'pathname'

# Note: In this code, we believe the payload is correctly passed.
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
      ::JSON.parse(content)
    else
      DEFAULT_VALUE
    end
  end

  # @param [Hash] data
  def write(data)
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
    'issues.json'
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
    data = ::Database.read
    data['issues'][@issue['id']] = @issue
    ::Database.write(data)
  end
end

payload = GetGitHubPayload.call

UpdateIssue.call(payload['issue'])
