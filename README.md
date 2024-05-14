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

## AST Parser

The AST parser used in this plugin is mainly forked from [@creditkarma/thrift-parser](https://github.com/creditkarma/thrift-parser), with some modifications to better suit the specific needs of this project. I would like to express my sincere appreciation to the original authors for his excellent work.

## License

This project is licensed under the MIT License.