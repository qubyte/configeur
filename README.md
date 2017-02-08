# configeur

This module is inspired by and borrows much of its behaviour from the excellent
Konfiga module. This module removes the commandline parsing abilities of its
ancestor, adds required variables, and simplifies some internal logic around
custom parsers by slightly altering that part of the options API.

configeur reads in the environment and uses a spec to parse and the values
found to appropriate types. It supports:

 - Type casting, with some types parsers included and API to add or replace
   parsers.
 - Default values when environment variables should be optional.
 - Required values when environment variables are not optional.

For compatibility with babel and TypeScript, this module re-exports itself as
default and provides a TypeScript definition file.

### Usage

Configeur accepts an object which defines config variables names and how to
derive them from the environment (or a default).

For example:

```js
// Module config.js

const configeur = require('configeur');

const config = configeur({
    PORT: {
        defaultValue: '8000',
        type: 'number'
    }
});

module.exports = config; // An instance of Map.
```

The above, assuming no values are read from the environment, will assign to
config.js:

```javascript
{
  PORT: 8000
}
```

Fields used to configure a config variable are:

| field               | required | description |
| ------------------- | -------- | ----------- |
| `'defaultValue'`    | `false`  | The value used when the variable is not found in the environment. Must always be a string, as if it has come from the environment. |
| `'required'`        | `false`  | Defaults to false. When true, a corresponding environment variable is required. A default will be ignored and an error thrown when the environment variable is not found.
| `'type'`            | `false`  | The type to cast to. Defaults to `'string'`.

Default types are:

* `'string'`
* `'number'`
* `'boolean'`

Additional types can be specified as parsers.

### Options

configeur accepts a second parameter consisting of an options object.

#### `parsers`

configeur comes with default parsers. To add more parsers, or override
existing parsers, this array can be used. For example, to add an `'integer'`
type:

```js
const config = configeur(schema, {
    parsers: [
        ['integer', value => parseInt(value, 10)]
    ]
});
```
