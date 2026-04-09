import { open, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { readFiles } from "./utils/read-directory";

export default function Command() {
  const dir = getPreferenceValues<Preferences.MostRecent>().downloadsdir;
  const { entries, error } = readFiles(dir);

  if (error) {
    return showToast({ style: Toast.Style.Failure, title: "Cannot read directory", message: error });
  }

  if (entries.length === 0) {
    return showToast({ style: Toast.Style.Failure, title: "No files found", message: dir });
  }

  return open(entries[0].fullPath);
}
