import { open, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { readFiles } from "./utils/read-directory";

export default function Command() {
  const dir = getPreferenceValues<Preferences.MostRecent>().downloadsdir;
  const files = readFiles(dir);

  if (files.length === 0) {
    return showToast({ style: Toast.Style.Failure, title: "No files found", message: dir });
  }

  return open(files[0].fullPath);
}
