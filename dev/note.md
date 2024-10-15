# Notes on implementation

## Path alias for import custom modules

References:

- [Modules: Packages](https://nodejs.org/api/packages.html#modules-packages)
  1. [Determing module system](https://nodejs.org/api/packages.html#determining-module-system)
  2. [Determing module manager](https://nodejs.org/api/packages.html#determining-package-manager)
  3. [Package entry points](https://nodejs.org/api/packages.html#package-entry-points)

In this project, we use both [subpath exports](https://nodejs.org/api/packages.html#subpath-exports) and [subpath imports](https://nodejs.org/api/packages.html#subpath-imports). For example, in `package.json`, we define the common module as

```json
{
  "name": "qi",
  "type": "module",
  "exports": {
    "./common/*": "./modules/*.js",
    "./common/*.js": "./modules/*.js"
  },
  "imports": {
    "#common/*": "./modules/*.js",
    "#common/*.js": "./modules/*.js"
  }
  ...
}
```
In `examples/cli_example.js`, we can either use
```js
import ParameterRunInterface from "qi/common/cli";
```
or equivalently,
```js
import ParameterRunInterface from "#common/cli";
```
In the above example, we have used the following features or concepts from module package:
1. [subpath exports](https://nodejs.org/api/packages.html#subpath-exports) and [subpath imports](https://nodejs.org/api/packages.html#subpath-imports)
2. [module system](https://nodejs.org/api/packages.html#determining-module-system): in `package.json`, we define `"type": "module"` which means that we use the ES-module system
3. default export and no name default export: `cli.js` uses no name default export, in this way, the module user can define its own name when import the module.


## Handling constants

### Summary

<div style="overflow:auto">
<table>
  <caption style="text-align:center">Structuring Constants in JavaScript: Approach Comparison</caption>
  <thead>
    <tr>
      <th><strong>Aspect</strong></th>
      <th><strong>Single file approach</strong></th>
      <th><strong>Multiple file approach</strong></th>
      <th><strong>Environment variable approach</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Description</strong></td>
      <td>Store all constants in a single file</td>
      <td>Organize constants into dedicated files</td>
      <td>Read constants from environment variables</td>
    </tr>
    <tr>
      <td><strong>Number of Files</strong></td>
      <td>1 (<code>constants.js</code>)</td>
      <td>Multiple files (one per logical category of constants, such as&nbsp;<code>APIConstants.js</code>,&nbsp;<code>TranslationConstants.js</code>, etc.)</td>
      <td>– 0 (when using system environment variables)&nbsp;<br>– 1 or more (when relying on&nbsp;<code>.env</code>&nbsp;files)</td>
    </tr>
    <tr>
      <td><strong>Implementation difficulty</strong></td>
      <td>Easy to implement</td>
      <td>Easy to implement but hard to define the right categories</td>
      <td>Easy to implement</td></tr><tr><td><strong>Scalability</strong></td>
      <td>Limited</td>
      <td>Highly scalable</td>
      <td>Limited</td>
    </tr>
    <tr>
      <td><strong>Maintainability</strong></td>
      <td>Great</td><td>Great</td>
      <td>Limited if not integrated with the other two approaches</td>
    </tr>
    <tr>
      <td><strong>Constants organization</strong></td>
      <td>Becomes messy with a large number of constants</td>
      <td>Always highly organized</td>
      <td>Becomes messy with a large number of constants</td>
    </tr>
    <tr>
      <td><strong>Use cases</strong></td>
      <td>Small projects with few constants</td>
      <td>Medium to large projects with dozens of constants</td>
      <td>To protect secret and deployment environment-dependent constants.</td>
    </tr>
  </tbody>
</table>
</div>

### Techniques used in the project

In `data_sources/app/cryptocompare/table_ops.js`, we use constant file `config.js` to define the path to env files, and we use env files to define various parameters for the programs. This is the pattern we use in the project to manage a possible different set of parameters setting.

## Parsing command line options

References:

- [Parsing command line arguments with util.parseArgs() in Node.js](https://2ality.com/2022/08/node-util-parseargs.html)
- [nodejs realine](https://nodejs.org/api/readline.html)

### Technique used in the project

In `data_sources/app/cryptocompare/table_cli.js`, we rely on `parseArgs` to process the command line options and their arguments; `readline` module (from nodejs) to interact with user inputs.

## Caching with redis

References:

- [Using Redis as a Cache for Node.js Applications](https://dev.to/limaleandro1999/using-redis-as-a-cache-for-nodejs-applications-22c1)

## Adding new fields to sequelize migration

References:

- [How to Add New Fields to Existing Sequelize Migration](https://dev.to/nedsoft/add-new-fields-to-existing-sequelize-migration-3527)

## Building a graphql server

References:

- [Build API with GraphQL, Node.js, and Sequelize](https://dev.to/nedsoft/build-api-with-graphql-node-js-and-sequelize-5e8e)

## Building a UDF server

## Integration with slack

References:

- [Integrate Slack to your Nodejs app in Ten Minutes](https://dev.to/nedsoft/integrate-slack-to-your-nodejs-app-in-ten-minutes-22gc)

## Encoding in PostgreSQL

References:

- [ERROR: invalid byte sequence - Fix bad encoding in PostgreSQL](https://www.cybertec-postgresql.com/en/fix-bad-encoding-postgresql/)

This is still an unsolved problem...

## Websocket with cryptocompare

References:

- [CryptoCompare Socket.IO Streaming API Migrates to WebSockets](https://blog.ccdata.io/cryptocompare-socket-io-streaming-api-migrates-to-websockets-fe6120f6a94)

## [`module.exports` vs. `exports`](https://www.builder.io/blog/nodejs-module-exports-vs-exports)

### Import export patterns

#### Modifying module.exports properties

```js
// math.js
const add = (a, b) => {
  return a + b;
};

const subtract = (a, b) => {
  return a - b;
};

module.exports.add = add;
module.exports.subtract = subtract;

//index.js
const math = require("./math");

console.log(math.add(2, 3)); // 5
console.log(math.subtract(2, 3)); // -1
```

In the first pattern, functions are attached to properties on the `module.exports` object. We can see the correct values logged in `index.js`.

#### Modifying exports properties

```js
// math.js
const add = (a, b) => {
  return a + b;
};

const subtract = (a, b) => {
  return a - b;
};

exports.add = add;
exports.subtract = subtract;

//index.js
const math = require("./math");

console.log(math.add(2, 3)); // 5
console.log(math.subtract(2, 3)); // -1
```

In the second pattern, you attach functions to properties on the `exports` object. The correct values are still logged in `index.js`.

Now, this raises the question: why use module.exports`when`exports` seems to achieve the same result with fewer keystrokes? To answer that, let's take a look at the following two patterns.

#### Assigning new object to module.exports

```js
// math.js
const add = (a, b) => {
  return a + b;
};

const subtract = (a, b) => {
  return a - b;
};

module.exports = {
  add,
  subtract,
};

//index.js
const math = require("./math");

console.log(math.add(2, 3)); // 5
console.log(math.subtract(2, 3)); // -1
```

In the third pattern, a new object is assigned to `module.exports`. The correct values are then logged in `index.js`.

#### Assigning new object to exports

```js
// math.js
const add = (a, b) => {
  return a + b;
};

const subtract = (a, b) => {
  return a - b;
};

exports = {
  add,
  subtract,
};

//index.js
const math = require("./math");

console.log(math.add(2, 3)); // TypeError: math.add is not a function
console.log(math.subtract(2, 3)); // TypeError: math.subtract is not a function
console.log(math); // {}
```

In the fourth pattern, a new object is assigned to `exports`. However, this pattern does not seem to work, as `math` appears to be an empty object. Let's understand why.

### Object references in JavaScript

Let's revisit how object references work in JavaScript. When you assign one object to another, both objects point to the same memory address. Modifying one will modify the other as well. Let's see this in action.

```js
const superhero1 = {
  name: "Bruce Wayne",
};

const superhero2 = superhero1; // Create a reference to superhero1

superhero2.name = "Clark Kent"; // Modify superhero2 name

console.log(superhero1); // { name: 'Clark Kent' } superhero1 name is updated
```

In this example, both `superhero1` and `superhero2` reference the same superhero. Modifying `superhero2` also modifies `superhero1`.

However, assigning a new object will break the reference.

```js
const superhero1 = {
  name: "Bruce Wayne",
};

let superhero2 = superhero1; // Create a reference to superhero 1

superhero2 = { name: "Clark Kent" }; // Assignment breaks the reference

superhero2.name = "Barry Allen"; // Only superhero2 is modified

console.log(superhero1); // { name: 'Bruce Wayne' } superhero1 is unaffected
```

In this case, the assignment breaks the reference and modifying `superhero2` no longer affects `superHero1`.

### `module.exports` vs. `exports`

Now that we understand how objects work in JavaScript, let's relate it to `module.exports` and `exports`. In `Node.js`, module is a plain JavaScript object with an `exports` property. `exports` is a plain JavaScript variable that happens to be set to `module.exports`. When you require a module in another file, the code within that module is executed, and only `module.exports` is returned.

```js
var module = { exports: {} };

var exports = module.exports;

// Assigning exports to module.exports via object reference...

exports.add = add; // ...results in module.exports.add = add
exports.subtract = subtract; // ...results in module.exports.subtract = subtract

// The module.exports object contains both add and subtract properties

return module.exports;
```

However, if you assign a new object to `exports`, the reference is broken and updating `exports` no longer updates `module.exports`.

```js
var module = { exports: {} };

var exports = module.exports;

// Below assignment breaks the object reference

exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};

return module.exports; // module.exports = {}
```

If you try to access `add` or `subtract` on the exported object, an error is thrown because `module.exports` is empty. So, while `module.exports` and `exports` may seem interchangeable in the first import export pattern, they are not the same.

#### Conclusion

When should you choose `exports` over `module.exports`? The short answer is that you probably shouldn't. While `exports` may be shorter and seem more convenient, the confusion it can cause is not worth it. Remember that `exports` is just a reference to `module.exports`, and assigning a new object to `exports` breaks that reference.

## Misc
1. [Why is (0,obj.prop)() not a method call?](https://2ality.com/2015/12/references.html)
2. immutable
   - [Four Ways to Immutability in JavaScript](https://dev.to/glebec/four-ways-to-immutability-in-javascript-3b3l)
3. fp
   - [Ramda](https://ramdajs.com/)
   - [A Functional Love Affair: Why I Chose Haskell Over JavaScript](https://medium.com/@kerronp/a-functional-love-affair-why-i-chose-haskell-over-javascript-fe9b2c619c42)
   - native javascript (see below)
4. rxjs
   - [Introduction to rxjs](https://www.learnrxjs.io/)

## Functional programming in javascript
### list comprehension
This has been removed from the standard!
