import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type DownloadButtonProps = {
  content: string;
  filename: string;
} & Omit<React.ComponentProps<typeof Button>, "children" | "onClick">;

export const download = ({
  content,
  filename = "download.txt",
}: {
  content: string;
  filename?: string;
}) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename,
  ...props
}) => {
  return (
    <Button onClick={() => download({ content, filename })} {...props}>
      <Icon name="download" className="text-lg" />
      Download
    </Button>
  );
};

export default DownloadButton;
