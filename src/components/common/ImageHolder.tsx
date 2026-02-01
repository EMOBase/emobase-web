import { twMerge } from "tailwind-merge";

import { imageUrl } from "@/utils/services/imageService";

type ImageHolderProps = {
  imageId: string;
  status: "PENDING" | "APPROVED";
  height?: number;
  className?: string;
  imgClassName?: string;
};

const ImageHolder: React.FC<ImageHolderProps> = ({
  imageId,
  status,
  height = 250,
  className,
  imgClassName,
}) => {
  const imgSrc = imageUrl(imageId, height);

  return (
    <div className={twMerge("w-full aspect-4/3", className)}>
      {status === "APPROVED" ? (
        <a
          key={imageId}
          href={imageUrl(imageId)}
          target="_blank"
          className={
            "shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-zoom-in"
          }
        >
          <img
            src={imgSrc}
            alt="Phenotype evidence"
            loading="lazy"
            className={twMerge(
              "w-full h-full object-cover rounded-lg border border-slate-200",
              imgClassName,
            )}
          />
        </a>
      ) : (
        <div
          className={twMerge(
            "w-full h-full flex items-center justify-center text-center rounded-lg bg-neutral-100 text-sm text-neutral-500 p-6",
            imgClassName,
          )}
        >
          Image not reviewed yet
        </div>
      )}
    </div>
  );
};

export default ImageHolder;
