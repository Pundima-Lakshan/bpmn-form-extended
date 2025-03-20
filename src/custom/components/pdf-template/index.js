import { Errors, FilePicker, FormContext, Label } from "@bpmn-io/form-js";
import {
  html,
  useContext,
  useEffect,
  useRef,
  useState,
} from "diagram-js/lib/ui";
import { formFieldClasses } from "../../utils";

import { PdfTemplateIcon, PdfTemplateEditIcon } from "./pdf-template-svg.js";

import "../../../assets/css/file-editor.css";

const EMPTY_ARRAY = [];

export const pdfTemplateType = "pdf-template";

export function PdfTemplateRender(props) {
  const fileInputRef = useRef(null);
  const { getService } = useContext(FormContext);
  const eventBus = getService("eventBus", false);
  const { field, domId, errors = [], disabled, readonly, value = "" } = props;
  const { label, multiple = false, validate = {} } = field;

  const errorMessageId = `${domId}-error-message`;

  const selectedFilesRef = useRef([]);
  const [, setFilesChangedTrigger] = useState({
    changed: true,
  });

  useEffect(() => {
    if (!value || value === "") return;
    selectedFilesRef.current = [value];
  }, [value]);

  const onFileChange = (event) => {
    const input = event.target;

    setFilesChangedTrigger({ changed: true });

    // If we have an associated file key but no files are selected, clear the file key and associated files
    if (input.files === null || input.files.length === 0) {
      selectedFilesRef.current = [];
      return;
    }

    // Allow only one file
    readFile(input.files[0], "dataURL").then(async (basePdf) => {
      selectedFilesRef.current = [basePdf];

      eventBus.fire("pdfTemplate.new", {
        files: selectedFilesRef.current,
        index: -1,
        field,
      });
    });

    event.target.value = "";
  };

  const onFilesClick = (index) => {
    eventBus.fire("pdfTemplate.edit", {
      files: selectedFilesRef.current,
      index,
      field,
    });
  };

  const isInputDisabled = disabled || readonly;

  return html`<div
    class=${formFieldClasses(pdfTemplateType, { errors, disabled, readonly })}
  >
    <${Label} htmlFor=${domId} label=${label} required=${validate.required} />
    <input
      type="file"
      className="fjs-hidden"
      ref=${fileInputRef}
      name=${`file-${domId}`}
      disabled=${isInputDisabled}
      multiple=${multiple}
      onChange=${onFileChange}
      required=${validate.required}
      accept="application/json, application/pdf"
    />
    <input
      className="fjs-hidden"
      id=${domId}
      name=${domId}
      disabled=${isInputDisabled}
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
        ${getSelectedFilesLabel(selectedFilesRef.current, onFilesClick)}
      </span>
    </div>
    <${Errors} id=${errorMessageId} errors=${errors} />
  </div>`;
}

PdfTemplateRender.config = {
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

function getSelectedFilesLabel(files, clickHandler) {
  if (files.length === 0) {
    return "No template selected";
  }

  return files.map((file, index) => {
    const name = file instanceof File ? file.name : `file ${index}`;

    return html`<span
      class="fjs-file-editor-file file-editor-files-open-link"
      onClick=${() => clickHandler(index)}
    >
      <span>${name}</span> <span>${PdfTemplateEditIcon}</span>
    </span>`;
  });
}

export const readFile = (file, type) => {
  return new Promise((r) => {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
      if (e && e.target && e.target.result && file !== null) {
        r(e.target.result);
      }
    });
    if (file !== null) {
      if (type === "text") {
        fileReader.readAsText(file);
      } else if (type === "dataURL") {
        fileReader.readAsDataURL(file);
      } else if (type === "arrayBuffer") {
        fileReader.readAsArrayBuffer(file);
      }
    }
  });
};
