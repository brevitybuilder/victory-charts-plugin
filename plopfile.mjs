export default function (plop) {
  plop.setGenerator("block", {
    description: "scaffold a new block",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "block name please",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/blocks/{{dashCase name}}/index.tsx",
        templateFile: "templates/index.tsx.hbs",
      },
      {
        type: "add",
        path: "src/blocks/{{dashCase name}}/styles.module.css",
        templateFile: "templates/styles.module.css.hbs",
      },
      {
        type: "add",
        path: "src/blocks/{{dashCase name}}/{{pascalCase name}}.stories.tsx",
        templateFile: "templates/Block.stories.tsx.hbs",
      },
      {
        type: "add",
        path: "src/blocks/{{dashCase name}}/{{pascalCase name}}.test.tsx",
        templateFile: "templates/Block.test.tsx.hbs",
      },
    ],
  });

  plop.setGenerator("action", {
    description: "scaffold a new action",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "action name please",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/actions/{{dashCase name}}.ts",
        templateFile: "templates/action.ts.hbs",
      },
    ],
  });
}
