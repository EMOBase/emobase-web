import { cn } from "@/utils/classname";

type IconProps = {
  name: string;
  fill?: boolean;
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, fill, className }) => {
  return (
    <span className={cn("flex", className)}>
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: "unset",
          fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        {name}
      </span>
    </span>
  );
};

export { Icon };
