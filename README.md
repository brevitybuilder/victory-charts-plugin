# Brevity Plugin Starter

This template provides a minimal setup to get a plugin added to Brevity. You can add blocks, server actions, and custom schemas.

Publish via CLI or use `pnpm run publish-plugin`.

## Usage

### Scaffold new block

-   `pnpm plop block`

### Scaffold new action

-   `pnpm plop action`

## Blocks

You can add new visual blocks users can include in the canvas and on their apps. You can create blocks in `src/blocks`.

Blocks require the following information in `src/plugin-config.json`:

-   `name` - User-facing name (string)
-   `entrypoint` - Path to component file (string, relative file path)
-   `acceptsChildren` - If you can nest block elements in the editor (boolean)
-   `category` - Type of block element to use (string)
-   `props` - List of prop objects (array of objects)
-   `events` - List (array)
-   `defaultStyles` - CSS properties written in JSON format (object)
-   `sources` - List (array)
-   `actions` - List (array)

## Actions

You can handle backend logic on the server, which is triggered in frontend workflows. You can create actions in `src/actions`.

Please note that these run on Cloudflare Workers, which use a runtime that is built on the V8 JavaScript and WebAssembly engine but is not Node. Some Node-specific features may not be supported.

Actions require the following information in `src/plugin-config.json`:

-   `name` - Label (string, can only use alphanumeric characters, and underscore and dashes)
-   `description` - Text to explain the plugin, appears in plugin list (string)
-   `entrypoint` - Path to component file (string, relative file path)
-   `props` - List of props (array of objects)
-   `outputType` - What is returned by the action (object)

## Schemas

You can add custom data types to your plugin in the `schemas` field in `src/plugin-config.json`. These data types are available to the user throughout the editor.

Each schema requires:

-   `id` - Unique user-facing ID (string)
-   `type` - Data type (string)
-   `properties` - List of properties included in data type (nested object with associated types)
-   `required` - List of names of required properties (string array)

## Plugin settings

You can let the user change plugin settings by adding them to "publicProps" and "privateProps" fields in `src/plugin-config.json`. Both sets of props are passed to actions in a single `env` object.

**`publicProps`** are client settings, and should only include data that the end user can view.
**`privateProps`** are server settings, and can include sensitive data like private keys.

Props require this data:

-   `label` - Label for the end user (string)
-   `name` - Key passed in the `env` property (string, alphanumeric with underscore and dash)
-   `type` - Data type to expect (object, including `kind`)
-   `default` - Value to display if data is null (string, not that this is not passed to the action unless edited by the user)
-   `placeholder` - What to display before a value is added (string)
-   `help` - Tooltip explaining what the data is for (string)

Please note that lists of data are not supported as props.
