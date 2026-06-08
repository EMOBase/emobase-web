import { cn } from "@/utils/classname";
import { iconData, type IconName } from "@/utils/constants/icon";

type IconProps = {
  name: IconName;
  fill?: boolean;
  weight?: 400 | 500 | 600 | 700;
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, fill, weight = 500, className }) => {
  const key = `${name}${fill ? "-fill" : ""}-${weight}`;
  const data = iconData[key];

  if (!data) return null;

  return (
    <span className={cn("inline-flex", className)}>
      <svg
        viewBox={data.viewBox}
        className="size-[0.9em]"
        fill="currentColor"
        focusable="false"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: data.paths }}
      />
    </span>
  );
};

export { Icon };
