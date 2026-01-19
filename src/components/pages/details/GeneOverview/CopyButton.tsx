import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type CopyButtonProps = {
  content: string;
} & Omit<React.ComponentProps<typeof Button>, "children" | "onClick">;

const CopyButton: React.FC<CopyButtonProps> = ({ content, ...props }) => {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      onClick={() => {
        if (copied) return;
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      {...props}
    >
      <Icon name={copied ? "check" : "content_copy"} className="text-lg" />
      {copied ? "Copied" : "Copy"}
    </Button>
  );
};

export default CopyButton;
