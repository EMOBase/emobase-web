import { twMerge } from "tailwind-merge";

import type { Penetrance } from "@/utils/constants/phenotype";

const PenetranceBadge = ({
  value,
  className,
}: {
  value: Penetrance | undefined;
  className?: string;
}) => {
  if (!value) return null;

  const colorClassName = [
    "bg-red-50 text-red-600 border-red-100",
    "bg-orange-50 text-orange-600 border-orange-100",
    "bg-amber-50 text-amber-600 border-amber-100",
    "bg-yellow-50 text-yellow-600 border-yellow-100",
    "bg-lime-50 text-lime-600 border-lime-100",
    "bg-green-50 text-green-600 border-green-100",
  ][Math.floor(value * 5)];

  return (
    <span
      className={twMerge(
        "text-[10px] px-1.5 py-0.5 rounded border",
        colorClassName,
        className,
      )}
    >
      {value * 100}%
    </span>
  );
};

export default PenetranceBadge;
