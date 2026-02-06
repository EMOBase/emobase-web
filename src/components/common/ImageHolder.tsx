import { twMerge } from "tailwind-merge";

import imageService from "@/utils/services/imageService";
import useService from "@/hooks/useService";
import useAsyncData from "@/hooks/useAsyncData";
import { useSession } from "@/hooks/session/useSession";

const ImageHolderApiFetch = ({
  imageId,
  height,
  className,
}: {
  imageId: string;
  height?: number;
  className?: string;
}) => {
  const { fetchImage } = useService(imageService);
  const { data, error } = useAsyncData(
    () => fetchImage(imageId, height),
    [imageId, height],
  );

  const imageSrc = data ? URL.createObjectURL(data) : undefined;

  if (error) {
    return (
      <div
        className={twMerge(
          "w-full h-full flex items-center justify-center text-center rounded-lg bg-neutral-100 text-sm text-neutral-500 p-6",
          className,
        )}
      >
        Failed to fetch image
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      loading="lazy"
      className={twMerge(
        "w-full h-full object-cover rounded-lg border border-slate-200",
        className,
      )}
    />
  );
};

type ImageHolderProps = {
  imageId: string;
  status: "PENDING" | "APPROVED";
  height?: number;
  alt?: string;
  className?: string;
  imgClassName?: string;
};

const ImageHolder: React.FC<ImageHolderProps> = ({
  imageId,
  status,
  height = 250,
  alt,
  className,
  imgClassName,
}) => {
  const { imageUrl } = useService(imageService);
  const imgSrc = imageUrl(imageId, height);

  const { isLoggedIn } = useSession();
  const shouldFetchByAPI = status !== "APPROVED" && isLoggedIn;

  return (
    <div className={twMerge("w-full aspect-4/3", className)}>
      {shouldFetchByAPI ? (
        <ImageHolderApiFetch
          imageId={imageId}
          height={height}
          className={imgClassName}
        />
      ) : status === "APPROVED" ? (
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
            alt={alt}
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
