import { SelectEntry, TextFieldEntry } from "@bpmn-io/properties-panel";
import { html } from "diagram-js/lib/ui";
import { get, set } from "min-dash";

export class AutoInitializeValuesPropertiesProvider {
  constructor(propertiesPanel) {
    propertiesPanel.registerProvider(this, 500);
  }

  //#region Function
  getGroups(field, editField) {
    return (groups) => {
      if (field.type !== "textfield") {
        return groups;
      }

      groups.splice(groups.length - 2, 0, {
        id: "auto-initialize",
        label: "Auto Initialization",
        name: "auto-initialize",
        entries: AutoInitializeEntries(field, editField),
      });

      return groups;
    };
  }
  //#endregion
}

AutoInitializeValuesPropertiesProvider.$inject = ["propertiesPanel"];

// #region Function
function AutoInitializeEntries(field, editField) {
  const setValue = (key) => {
    return (value) => {
      const range = get(field, ["auto-initialize"], {});

      editField(field, ["auto-initialize"], set(range, [key], value));
    };
  };

  const getValue = (key) => {
    return () => {
      return get(field, ["auto-initialize", key]);
    };
  };

  // Hard coding the entries is the best I can do due to time constraints
  const getOptions = (key) => {
    return () => {
      if (key === "predef") {
        return [
          {
            value: "initiator-fullname",
            label: "Initiator Fullname",
          },
          {
            value: "initiator-emp-no",
            label: "Initiator Emp No",
          },
          {
            value: "initiator-faculty",
            label: "Initiator Faculty",
          },
          {
            value: "initiator-department",
            label: "Initiator Department",
          },
          {
            value: "assignee-fullname",
            label: "Assignee Fullname",
          },
          {
            value: "assignee-emp-no",
            label: "Assignee Emp No",
          },
          {
            value: "assignee-faculty",
            label: "Assignee Faculty",
          },
          {
            value: "assignee-department",
            label: "Assignee Department",
          },
        ];
      }
    };
  };

  return [
    {
      id: "auto-initialize-predefined-entry",
      component: AutoInitializeEntryPreDef,
      getValue,
      setValue,
      getOptions,
      field,
    },
    {
      id: "auto-initialize-custom-entry",
      component: AutoInitializeEntryCustom,
      getValue,
      setValue,
      field,
    },
  ];
}

function AutoInitializeEntryPreDef(props) {
  const { field, id, getValue, getOptions, setValue } = props;

  const debounce = (fn) => fn;

  return html`<${SelectEntry}
    element=${field}
    id=${id}
    label="Entry to initialize"
    debounce=${debounce}
    getValue=${getValue("predef")}
    setValue=${setValue("predef")}
    getOptions=${getOptions("predef")}
  />`;
}

function AutoInitializeEntryCustom(props) {
  const { field, id, getValue, setValue } = props;

  const debounce = (fn) => fn;

  return html`<${TextFieldEntry}
    element=${field}
    id=${id}
    label="Custom entry to initialize"
    description="The value should be a form key of any field in any form attached to the workflow"
    debounce=${debounce}
    getValue=${getValue("custom")}
    setValue=${setValue("custom")}
  />`;
}
// #endregion
