import { twMerge } from "tailwind-merge";

import { imageUrl } from "@/utils/services/imageService";

type ImageHolderProps = {
  imageId: string;
  status: "PENDING" | "APPROVED";
  className?: string;
};

const ImageHolder: React.FC<ImageHolderProps> = ({
  imageId,
  status,
  className,
}) => {
  const imgSrc = imageUrl(imageId);

  return (
    <div className={twMerge("w-full aspect-4/3", className)}>
      {status === "APPROVED" ? (
        <a
          key={imageId}
          href={imgSrc}
          target="_blank"
          className={
            "shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-zoom-in"
          }
        >
          <img
            src={imgSrc}
            alt="Phenotype evidence"
            loading="lazy"
            className="w-full h-full object-cover rounded-lg border border-slate-200"
          />
        </a>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-center rounded-lg bg-neutral-100 text-sm text-neutral-500 p-6">
          Image not reviewed yet
        </div>
      )}
    </div>
  );
};

export default ImageHolder;
