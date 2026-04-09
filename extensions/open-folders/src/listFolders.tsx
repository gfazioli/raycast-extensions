import { getPreferenceValues } from "@raycast/api";
import { readFolders } from "./utils/read-directory";
import { FileList } from "./utils/file-list";

export default function Command() {
  const prefs = getPreferenceValues<Preferences.ListFolders>();
  const folders = readFolders(prefs.homedir);

  return <FileList items={folders} layout={prefs.layout} showPins navigable />;
}
