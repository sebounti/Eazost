import { createClassed } from "./classed";
import { ClassedFunctionProxy } from "./types";

//----- proxy -----//
// proxy est une bibliothèque pour générer des composants polymorphes //

export const classedProxy = createClassed().classed as ClassedFunctionProxy;
