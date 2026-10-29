import { useState, useEffect } from "react";

import type { ImageMetadata } from "@/utils/constants/image";
import imageService from "@/utils/services/imageService";
import useService from "@/hooks/useService";

const usePendingImages = () => {
  const [loading, setLoading] = useState(true);
  const [pendingImages, setPendingImages] = useState<ImageMetadata[]>([]);
  const { fetchPendingImageMetadata, reject, approve } =
    useService(imageService);

  useEffect(() => {
    fetchPendingImageMetadata().then((images) => {
      setPendingImages(images);
      setLoading(false);
    });
  }, []);

  const removePendingImages = (ids: string[]) => {
    setPendingImages((current) =>
      current.filter((item) => !ids.includes(item.id)),
    );
  };

  const approveImages = async (ids: string[]) => {
    return approve(ids).then(() => removePendingImages(ids));
  };

  const rejectImages = async (ids: string[]) => {
    return reject(ids).then(() => removePendingImages(ids));
  };

  return {
    data: pendingImages,
    loading,
    accept: approveImages,
    discard: rejectImages,
  };
};

export default usePendingImages;
