import { apiFetch as utilApiFetch, getApiBaseUrl } from "@/utils/apiFetch";

export interface ImageMetadata {
  id: string;
  status: "PENDING" | "APPROVED";
  comment?: string;
}

const imageService = (apiFetch: typeof utilApiFetch = utilApiFetch) => {
  const imageUrl = (id: string, height?: number) => {
    if (!height) {
      return `${getApiBaseUrl("imageservice")}/images/${id}`;
    }
    return `${getApiBaseUrl("imageservice")}/images/${id}?h=${height}`;
  };

  const fetchImage = async (id: string, height?: number) => {
    let url;
    if (!height) {
      url = `/images/${id}`;
    } else {
      url = `/images/${id}?h=${height}`;
    }
    return await apiFetch<Blob>("imageservice", url, {
      responseType: "blob",
    });
  };

  const fetchPendingImageMetadata = async () => {
    return (
      (await apiFetch<ImageMetadata[]>(
        "imageservice",
        `/image-metadata/pending?size=10000`,
      )) || []
    );
  };

  const approve = async (ids: string[]) => {
    await apiFetch("imageservice", "/image-metadata/approve", {
      method: "POST",
      body: ids,
    });
  };

  const reject = async (ids: string[]) => {
    await apiFetch("imageservice", "/image-metadata/reject", {
      method: "POST",
      body: ids,
    });
  };

  return { fetchPendingImageMetadata, approve, reject, fetchImage, imageUrl };
};

export default imageService;
