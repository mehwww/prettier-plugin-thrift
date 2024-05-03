A [Prettier v3+](https://prettier.io/) plugin for formatting thrift files.

## Installation

First, install Prettier (v3+) and this plugin:

```bash
npm install --save-dev prettier @mehwww/prettier-plugin-thrift
```

Then, create a [`.prettierrc.js`](https://prettier.io/docs/en/configuration.html) file in the root of your project, and add the plugin to the `plugins` array:

```js
// .prettierrc.js
module.exports = {
  plugins: ["@mehwww/prettier-plugin-thrift"],
};
```
