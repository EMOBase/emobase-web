import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type CopyButtonProps = {
  icon: boolean;
  content: string;
} & Omit<React.ComponentProps<typeof Button>, "children" | "onClick">;

const CopyButton: React.FC<CopyButtonProps> = ({ icon, content, ...props }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (copied) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttonIcon = copied ? "check" : "content_copy";
  const buttonText = copied ? "Copied" : "Copy";

  if (icon) {
    return (
      <Tooltip>
        <TooltipTrigger
          onClick={(e) => {
            e.preventDefault();
            copyToClipboard();
          }}
          onPointerDown={(e) => e.preventDefault()}
          className="text-neutral-400 hover:text-primary transition-colors cursor-pointer"
        >
          <Icon name={buttonIcon} className="text-base" />
        </TooltipTrigger>
        <TooltipContent onPointerDownOutside={(e) => e.preventDefault()}>
          {buttonText}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button onClick={copyToClipboard} {...props}>
      <Icon name={buttonIcon} className="text-lg" />
      {buttonText}
    </Button>
  );
};

export default CopyButton;
