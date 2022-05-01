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

payload = GetGitHubPayload.call

pp payload
