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

### Usage

Configeur accepts an object which defines config variables names and how to
derive them from the environment (or a default). Import as an ES module.

For example:

```js
// Module config.js

import configeur from 'configeur';

export default configeur({
  PORT: {
    defaultValue: '8000',
    type: 'number'
  }
});
```

The above, assuming no values are read from the environment, will assign to
config.js as a default export:

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

#### `mutable`

By default, the object returned by configuer is frozen. Since it is also flat,
the object is completely immutable. The `mutable` option makes configeur return
an unfrozen object. This is not recommended in general, but may be useful for
testing purposes.
