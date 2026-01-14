const IMAGE_STATUSES = ["APPROVED", "PENDING"] as const;

export type ImageStatus = (typeof IMAGE_STATUSES)[number];

export interface ImageMetadata {
  id: string;
  status: ImageStatus;
}
