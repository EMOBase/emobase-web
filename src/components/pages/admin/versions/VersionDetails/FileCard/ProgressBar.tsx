import { twMerge } from "tailwind-merge";

export const ProgressBar = ({
  progress,
  title,
  theme = "orange",
  showComplete = false,
}: {
  progress: number;
  title: string;
  theme?: "orange" | "blue";
  showComplete?: boolean;
}) => {
  const barColor = theme === "blue" ? "bg-blue-600" : "bg-[#c2410c]";
  const textColor = theme === "blue" ? "text-blue-600" : "text-[#c2410c]";

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-[11px] font-bold tracking-wider uppercase">
        <span className={textColor}>{title}</span>
        <span className="text-slate-400">
          {showComplete && progress === 100 ? "COMPLETE" : `${progress}%`}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={twMerge("h-full transition-all duration-500", barColor)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
