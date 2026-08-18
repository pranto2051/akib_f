import type { ProductKind } from "@/types";

export const PRODUCT_KINDS: ProductKind[] = ["SOFTWARE", "HARDWARE", "MOBILE_APP", "WEB_APP"];

export const KIND_LABEL: Record<ProductKind, string> = {
  SOFTWARE: "Software",
  HARDWARE: "Hardware",
  MOBILE_APP: "Mobile app",
  WEB_APP: "Web platform",
};
