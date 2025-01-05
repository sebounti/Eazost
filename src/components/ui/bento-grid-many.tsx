import { clx } from "@/lib/utils/clx/clx-merge";

export const CELLS_4 = [1, 2, 3, 4] as const;
export const CELLS_5 = [1, 2, 3, 4, 5] as const;
export const CELLS_6 = [1, 2, 3, 4, 5, 6] as const;

export const Cell = ({ i = 0 }) => {
  return <CellPattern>{i}</CellPattern>;
};

export const BentoGrid = clx.div("grid md:grid-cols-4 gap-2");
export const Bento6 = clx.div("grid sm:grid-cols-2 md:grid-cols-4 gap-2");

export const CellPattern = clx.div(
  "size-full rounded-lg center bg-zinc-200 dark:bg-zinc-700 text-xl",
);

export const GRID_STYLES = "p-1 rounded-lg h-32";
