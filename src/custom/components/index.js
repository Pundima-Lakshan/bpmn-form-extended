import { FileEditorRender, fileEditorType } from "./file-editor";
import { PlotterRenderer, plotterType } from "./plotter";
import { RangeRenderer, rangeType } from "./range";

class RangeField {
  constructor(formFields) {
    formFields.register(rangeType, RangeRenderer);
  }
}

class PlotterField {
  constructor(formFields) {
    formFields.register(plotterType, PlotterRenderer);
  }
}

class FileEditorFormFields {
  constructor(formFields) {
    formFields.register(fileEditorType, FileEditorRender);
  }
}

export const RenderExtension = {
  __init__: ["rangeField", "plotterField", "fileEditorField"],
  rangeField: ["type", RangeField],
  plotterField: ["type", PlotterField],
  fileEditorField: ["type", FileEditorFormFields],
};
