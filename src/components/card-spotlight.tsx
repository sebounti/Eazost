import { clx } from "@/lib/utils/clx/clx-merge";

export const CardSpotlightTrigger = clx.div(
  "group relative max-w-md rounded-xl border border-white/10 bg-neutral-800 px-8 py-16 shadow-2xl",
);
export const CardSpotlightContent = clx.div();
export const CardSpotlightHeading = clx.h3(
  "text-base font-semibold leading-7 text-muted-foreground",
);
export const CardSpotlightTitle = clx.span(
  "text-5xl font-bold tracking-tight text-white",
);
export const CardSpotlightDescription = clx.p(
  "mt-6 text-base leading-7 text-neutral-300",
);
