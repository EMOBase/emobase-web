import { type GOAnnotation } from "@/utils/constants/goannotation";

export type Homolog = {
  id: string;
  symbol: string;
  fullname: string;
  source: string[];
  annotations: GOAnnotation[];
};
