import fileSaver from "file-saver";
import { read, write } from "xlsx";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

// Convert string to ArrayBuffer
const s2ab = (s: string) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

export const download = ({
  content,
  filetype,
  filename = filetype === "xlsx" ? "download.xlsx" : "download.txt",
}: {
  content: string;
  filename?: string;
  filetype?: "xlsx";
}) => {
  let blob;
  if (filetype === "xlsx") {
    const wb = read(content, { type: "string" });
    const xlsxFile = write(wb, { bookType: "xlsx", type: "binary" });
    blob = new Blob([s2ab(xlsxFile)], {
      type: "application/octet-stream",
    });
  } else {
    blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
  }
  fileSaver.saveAs(blob, filename);
};

type DownloadButtonProps = {
  content: string;
  filename: string;
  filetype?: "xlsx";
} & Omit<React.ComponentProps<typeof Button>, "children" | "onClick">;

const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename,
  filetype,
  ...props
}) => {
  return (
    <Button
      onClick={() => download({ content, filename, filetype })}
      {...props}
    >
      <Icon name="download" className="text-lg" />
      Download
    </Button>
  );
};

export default DownloadButton;
