# mini-mock

>This Project is initialized by [saber-cli](https://www.npmjs.com/package/@zenghj/saber-cli) using ["ts-lib"](https://github.com/saber-cli-templates/ts-lib) scaffold template. Get more information from [saber-cli](https://www.npmjs.com/package/@zenghj/saber-cli).

## Features

* Light weight mock tool with local mock files;
* Automaticly refresh config without restart devServer;

## Usage

```
yarn add @zenghj/mini-mock
```

```js

const { mock } = require('@zenghj/mini-mock')
const mockOptionFile = path.resolve(__dirname, '../mock/index')
// webpack.dev.conf.js
{
  devServer: {
    before: function(app, server, compiler) {
      app.use(mock({
        entry: mockOptionFile
      }));
    }
  }
}

```

```js
// mock/index.js
const path = require("path");
const absolute = relative => path.resolve(__dirname, relative);

module.exports = {
  off: false,
  routes: {
    "GET:/test": absolute("test.json"),
    "GET:/test/:id": absolute("test2.json")
  }
};

```

For more detail see [example](./example)

##