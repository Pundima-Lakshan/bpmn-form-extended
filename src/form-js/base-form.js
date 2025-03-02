import { PropertiesPanelExtension, RenderExtension } from "../custom";

class BaseForm {
  constructor(FormClass, options, type, isAdditionalModules = true) {
    if (isAdditionalModules) {
      options.additionalModules = [
        ...(options.additionalModules || []),
        RenderExtension,
      ];
      if (type !== "Form") {
        options.additionalModules.push(PropertiesPanelExtension);
      }
    }
    this.extendedForm = new FormClass(options);
  }

  importSchema(schema, data) {
    return this.extendedForm.importSchema(schema, data);
  }

  saveSchema() {
    console.info("Saving schema...");
    const result = this.extendedForm.saveSchema
      ? this.extendedForm.saveSchema()
      : null;
    return result;
  }

  on(event, ...args) {
    // Let's unify the on method to handle possible overload
    if (typeof args[0] === "function") {
      this.extendedForm.on(event, args[0]); // Callback only
    } else {
      this.extendedForm.on(event, args[0], args[1]); // Priority and callback
    }
  }
}

export default BaseForm;
