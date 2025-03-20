import { Errors, FilePicker, FormContext, Label } from "@bpmn-io/form-js";
import { html, useContext, useEffect, useRef } from "diagram-js/lib/ui";
import { formFieldClasses } from "../../utils";

import { PdfTemplateIcon, PdfTemplateEditIcon } from "./pdf-template-svg.js";

import "../../../assets/css/file-editor.css";
import { Template } from "webpack";

const EMPTY_ARRAY = [];

export const pdfTemplateType = "pdf-template";

export function PdfTemplateRender(props) {
  const fileInputRef = useRef(null);
  const { getService } = useContext(FormContext);
  const fileRegistry = getService("fileRegistry", false);
  const eventBus = getService("eventBus", false);
  const {
    field,
    onChange,
    domId,
    errors = [],
    disabled,
    readonly,
    value = "",
  } = props;
  const { label, multiple = false, validate = {} } = field;

  const errorMessageId = `${domId}-error-message`;

  const _selectedFiles =
    fileRegistry === null
      ? EMPTY_ARRAY
      : fileRegistry.getFiles(value instanceof Array ? "" : value);
  const selectedFilesRef = useRef(_selectedFiles);

  useEffect(() => {
    // If a change result in empting the files
    if (
      value &&
      fileRegistry !== null &&
      !fileRegistry.hasKey(value instanceof Array ? "" : value)
    ) {
      onChange({ value: null });
    }
  }, [fileRegistry, value, onChange, selectedFilesRef.length]);

  useEffect(() => {
    if ((!value) instanceof Array) {
      return;
    }
    selectedFilesRef.current = value;
  }, [value]);

  useEffect(() => {
    const data = new DataTransfer();
    selectedFilesRef.forEach((file) => data.items.add(file));
    fileInputRef.current.files = data.files;
  }, [selectedFilesRef]);

  const onFileChange = (event) => {
    const input = event.target;

    // If we have an associated file key but no files are selected, clear the file key and associated files
    if (
      (input.files === null || input.files.length === 0) &&
      value !== "" &&
      (!value) instanceof Array
    ) {
      selectedFilesRef.current = [];
      return;
    }

    const files = Array.from(input.files);

    selectedFilesRef.current = files;

    eventBus.fire("pdfTemplate.new", {
      files: selectedFilesRef,
      index,
      field,
    });
  };

  const onFilesClick = (index) => {
    eventBus.fire("pdfTemplate.edit", {
      files: selectedFilesRef,
      index,
      field,
    });
  };

  const isInputDisabled = disabled || readonly || fileRegistry === null;

  return html`<div
    class=${formFieldClasses(pdfTemplateType, { errors, disabled, readonly })}
  >
    <${Label} htmlFor=${domId} label=${label} required=${validate.required} />
    <input
      type="file"
      className="fjs-hidden"
      ref=${fileInputRef}
      id=${domId}
      name=${domId}
      disabled=${isInputDisabled}
      multiple=${multiple}
      onChange=${onFileChange}
      required=${validate.required}
      accept="application/json, application/pdf"
    />
    <div className="fjs-filepicker-container">
      <button
        type="button"
        disabled=${isInputDisabled}
        readOnly=${readonly}
        class="fjs-button fjs-filepicker-button"
        onClick=${() => {
          fileInputRef.current.click();
        }}
      >
        Browse
      </button>
      <span class="fjs-form-field-label file-editor-files-links">
        ${getSelectedFilesLabel(selectedFilesRef, onFilesClick)}
      </span>
    </div>
    <${Errors} id=${errorMessageId} errors=${errors} />
  </div>`;
}

FileEditorRender.config = {
  ...FilePicker.config,
  type: pdfTemplateType,
  label: "PDF Template",
  name: "PDF Template",
  iconUrl: `data:image/png;base64,${encodeURIComponent(PdfTemplateIcon)}`,
  propertiesPanelEntries: [
    "key",
    "label",
    "description",
    "disabled",
    "readonly",
  ],
};

// helper //////////

/**
 * @param {File[] | Template[]} files
 * @returns {string}
 */
function getSelectedFilesLabel(files, clickHandler) {
  if (files.length === 0) {
    return "No template selected";
  }

  return files.map((file, index) => {
    const name =
      file instanceof File ? file.name : (file.schema.name ?? `file ${index}`);

    return html`<span
      class="fjs-file-editor-file file-editor-files-open-link"
      onClick=${() => clickHandler(index)}
    >
      <span>${name}</span> <span>${PdfTemplateEditIcon}</span>
    </span>`;
  });
}
