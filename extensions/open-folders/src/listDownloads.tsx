import { getPreferenceValues } from "@raycast/api";
import { readFiles } from "./utils/read-directory";
import { FileList } from "./utils/file-list";

export default function Command() {
  const prefs = getPreferenceValues<Preferences.ListDownloads>();
  const files = readFiles(prefs.downloadedFilesdir);

  return <FileList items={files} layout={prefs.layout} />;
}
