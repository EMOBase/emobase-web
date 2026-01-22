import { cn } from "@/utils/classname";

type IconProps = {
  name: string;
  fill?: boolean;
  weight?: 400 | 500 | 600 | 700;
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, fill, weight = 400, className }) => {
  const fillSetting = fill ? "'FILL' 1" : "'FILL' 0";
  const weightSetting = `'wght' ${weight}`;

  return (
    <span className={cn("inline-flex", className)}>
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: "unset",

          fontVariationSettings: [fillSetting, weightSetting].join(", "),
        }}
      >
        {name}
      </span>
    </span>
  );
};

export { Icon };
