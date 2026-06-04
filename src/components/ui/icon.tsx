import { cn } from "@/utils/classname";

const iconModules = import.meta.glob(
  "/node_modules/@material-symbols/svg-*/outlined/*.svg",
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>;

type IconEntry = { viewBox: string; paths: string };

function parseSvgKey(key: string) {
  const match = key.match(/svg-(\d+)\/outlined\/(.+)\.svg$/);
  if (!match) return null;
  return `${match[2]}-${match[1]}`;
}

function parseSvgContent(raw: string) {
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? "0 -960 960 960";
  const inner = raw
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")
    .trim();
  return { viewBox, paths: inner };
}

const iconCache: Record<string, IconEntry> = {};
for (const [filePath, raw] of Object.entries(iconModules)) {
  const key = parseSvgKey(filePath);
  if (key) {
    iconCache[key] = parseSvgContent(raw);
  }
}

type IconProps = {
  name: string;
  fill?: boolean;
  weight?: 400 | 500 | 600 | 700;
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, fill, weight = 500, className }) => {
  const key = `${name}${fill ? "-fill" : ""}-${weight}`;
  const data = iconCache[key];

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
