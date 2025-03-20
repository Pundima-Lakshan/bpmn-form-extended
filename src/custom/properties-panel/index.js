import { AutoInitializeValuesPropertiesProvider } from "./auto-initialize-values";
import { DictionaryAttributesPropertiesProvider } from "./dictionary-attributes";
import { PlotterPropertiesProvider } from "./plotter";
import { RangePropertiesProvider } from "./range";

export const PropertiesPanelExtension = {
  __init__: [
    // "rangePropertiesProvider",
    // "dictionaryAttributesPropertiesProvider",
    // "plotterPropertiesProvider",
    "autoInitializeValuesPropertiesProvider",
  ],
  // rangePropertiesProvider: ["type", RangePropertiesProvider],
  // dictionaryAttributesPropertiesProvider: [
  //   "type",
  //   DictionaryAttributesPropertiesProvider,
  // ],
  // plotterPropertiesProvider: ["type", PlotterPropertiesProvider],
  autoInitializeValuesPropertiesProvider: [
    "type",
    AutoInitializeValuesPropertiesProvider,
  ],
};
