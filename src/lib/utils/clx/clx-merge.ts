import { twMerge } from "tailwind-merge";
import { createClassed } from "./classed";

//----- clx-merge -----//
// clx-merge est une bibliothèque pour fusionner les classes CSS //

const { classed } = createClassed({ merger: twMerge });

export { classed as clx };
