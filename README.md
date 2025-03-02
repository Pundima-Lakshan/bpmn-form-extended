# Acknowledgments

This is a fork from [EinArlyn/bpmn-form-extended](https://github.com/EinArlyn/bpmn-form-extended) library to be used in my own [project](https://github.com/Pundima-Lakshan/kinetiqBP)

# bpmn-form-extended

The library is intended to expand the bpmn-js component base. Allows you to add custom components to the bpmn-js model.

## Project structure

### assets

- `css` - folder with css files
- `fonts` - font folder
- `js` - folder with js files
- `svg` - folder with svg files

### custom components

- `components` - folder with custom components
- `properties-panel` - folder with custom property panels
- `index.js` - file for importing all custom components

### form-js - overriding form-js library functions

- `base-form.js` - overriding the basic functions of the form-js library
- `form-editor.js` - description and configuration of the form editor
- `form-viewer.js` - description and settings for viewing forms

## How to add your own component

1. Create a component folder in the `components` folder
2. Create a file `index.js` in the component folder
3. Implement the component in the `index.js` file
4. Import the component into the `index.js` file in the `custom/components` folder
5. Add a component class and register it
6. Add a new component to `RenderExtension`

## How to add your own properties panel

1. Create a properties panel folder in the `properties-panel` folder
2. Create a file `index.js` in the properties panel folder
3. Implement the properties panel in the `index.js` file
4. Import the properties panel into the `index.js` file in the `custom/properties-panel` folder
5. Add a property panel class and register it
6. Add a new property panel to `PropertiesPanelExtension`

## How to add a library to a React + Vite project

1. Install the library using npm

```bash
npm install @einarlyn/bpmn-form-extended
```

2. Importing css styles in a folder of your choice (example: main.js)

```javascript
import "@einarlyn/bpmn-form-extended/dist/assets/css/styles.css";
```

3. Along the path `src/plugins` we create a file `minifyBundles.ts` and place the following code in it

```typescript
import { minify } from "terser";

const minifyBundles = () => {
  return {
    name: "minifyBundles",
    async generateBundle(_options: any, bundle: any) {
      for (const key in bundle) {
        if (bundle[key].type === "chunk" && !key.includes("customFormEditor")) {
          const minifyCode = await minify(bundle[key].code, {
            sourceMap: false,
          });
          bundle[key].code = minifyCode.code;
        } else if (
          bundle[key].type === "chunk" &&
          key.includes("customFormEditor")
        ) {
          bundle[key].code = bundle[key].code.replaceAll(
            "formFields2",
            "formFields"
          );

          const minifyCode = await minify(bundle[key].code, {
            mangle: {
              reserved: ["RangeField", "formFields.register", "formFields"],
            },
            sourceMap: false,
          });
          bundle[key].code = minifyCode.code;
        }
      }
      return bundle;
    },
  };
};

export default minifyBundles;
```

4. In the `vite.config.ts` file we add the property `optimizeDeps`

```typescript
optimizeDeps: {
    exclude: [
      '@einarlyn/bpmn-form-extended',
    ],
  },
```

5. In the `vite.config.ts` file add the `minifyBundles` plugin

```typescript
build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('bpmn-form-extended')) {
            return 'customFormEditor';
          }

          return 'app';
        },
      },
      plugins: [minifyBundles()],
    },
    minify: false,
  },
```

6. Create type declarations in `decs.d.ts` to stop typescript from complaining

```typescript
declare module "@einarlyn/bpmn-form-extended";
```

7. Usage in React project

```typescript
...
 const formEditor = new FormEditor({
      container: editorContainerRef.current,
      // additionalModules: [RangeField, FileEditorField, RangeFieldPropertiesProvider],
    }).customForm;
...
```

## Extended components

### Range

New range component

### File Editor

Extend file input enabling to view uploaded files

_Events_

`fileEditor.open` - click on file editor icon
