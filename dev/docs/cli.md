# The cli Implementation
## Helper functions
### `getParamProp`
```js
const getParamProp = ({ cmd: { param_cmd = [] } }, p = "option") =>
  param_cmd.reduce((result, { name, params = [] }) => {
    let v = Object.fromEntries(params.map((a) => [a.name, a[p]]));
    if (v === undefined) return result;
    result[name] = v;
    return result;
  }, {});
```
The JavaScript function `getParamProp` is designed to extract certain properties from a complex nested object structure. Let’s break down how this function works step by step, explaining each part clearly.

Step-by-Step Breakdown

1. Function Definition:
   ```js
   const getParamProp = ({ cmd: { param_cmd = [] } }, p = "option") => { ... }
   ```
   This function takes two parameters: 
   
   The first parameter is an object that is destructured to directly extract `param_cmd` from `cmd`. If `param_cmd` is not provided, it defaults to an empty array `[]`.
   
   The second parameter `p` is set to default to the string "option".

2. Using `reduce` method:
   ```js
   param_cmd.reduce((result, { name, params = [] }) => { ... }, {})
   ```
   The reduce method is used to transform the `param_cmd` array into a single object (`result`).
   
   The `result` starts as an empty object (`{}`).

   For each item in `param_cmd`, we're deconstructing it to get `name` and `params`, with `params` defaulting to an empty array if not provided.

3. Creating an object from `params`:
   ```js
   let v = Object.fromEntries(params.map((a) => [a.name, a[p]]));
   ```
   This line converts each item in params into an object where the key is `a.name` and the value is the property `p` of `a` (defaulting to `a.option)`.
   
   Object.fromEntries is a method that takes an array of key-value pairs and turns them into an object.

4. Conditionally Adding to Result:
   ```js
   if (v === undefined) return result;
   result[name] = v;
   return result;
   ```
   This checks if `v` is `undefined`. If it is, the function simply returns the result without adding anything.

   If `v` is valid, it adds a new property to result with the key as name and the value as `v`.

   Return the Result: At the end, the `reduce` function returns the `result`, which now contains a new object built up from `param_cmd`.

5. Example Usage
   Suppose you have the following input structure:
   ```js
   const data = {
    cmd: {
      param_cmd: [
      {
        name: "command1",
        params: [
          { name: "param1", option: "value1" },
          { name: "param2", option: "value2" }
        ]
      },
      {
        name: "command2",
        params: [
          { name: "param3", option: "value3" }
        ]
      }
      ]
    }
   };

   const result = getParamProp(data);
   console.log(result);
   ```
   The output would be:
   ```js
   {
    command1: { param1: "value1", param2: "value2" },
    command2: { param3: "value3" }
   }
   ```

6. Key Points
   
   The function extracts command parameters from a nested structure.

   It creates a mapping of names to their specified properties (defaulting to option).
   
   The use of reduce allows efficient building of the final result object.
   
   This function is useful for organizing complex data structures into simpler key-value pair representations, making it easier to work with in applications.