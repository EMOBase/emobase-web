import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type DownloadButtonProps = {
  content: string;
  filename: string;
} & Omit<React.ComponentProps<typeof Button>, "children" | "onClick">;

const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename,
  ...props
}) => {
  const download = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Button onClick={download} {...props}>
      <Icon name="download" className="text-lg" />
      Download
    </Button>
  );
};

export default DownloadButton;
