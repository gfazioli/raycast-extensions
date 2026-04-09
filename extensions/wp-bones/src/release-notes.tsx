import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import { useFetch } from "@raycast/utils";

const RELEASE_NOTES_URL = "https://api.github.com/repos/wpbones/WPBones/releases/latest";

interface GithubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
}

export default function Command() {
  const { data, isLoading } = useFetch<GithubRelease>(RELEASE_NOTES_URL, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  const markdown = data
    ? `#### ${data.name || data.tag_name}\n\n*Released: ${new Date(data.published_at).toLocaleDateString()}*\n\n---\n\n${data.body}`
    : "Loading release notes...";

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      actions={
        <ActionPanel>
          {data && <Action.OpenInBrowser title="View on GitHub" url={data.html_url} icon={Icon.Globe} />}
          {data && <Action.CopyToClipboard title="Copy Release Notes" content={data.body} />}
        </ActionPanel>
      }
    />
  );
}
