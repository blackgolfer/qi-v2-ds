# Getting data from `spec`
## Schemas

## `getParamProp`
```js
const getParamProp = (p, { cmd: { param_cmd = [] } }) =>
  param_cmd.reduce((result, { name, params = [] }) => {
    const props = params
      .filter(R.has(p))
      .map(({ name, [p]: value }) => [name, value]);
    return props.length
      ? { ...result, [name]: Object.fromEntries(props) }
      : result;
  }, {});
const getParamOption = (spec) => getParamProp("option", spec);
const getCmdLineOptions = R.compose(R.mergeAll, R.values, getParamOption);
```

`getParamProp` is a functional JavaScript implementation that processes a command structure to extract specific properties. Let's break it down step by step to understand what each part does.

### Overview

The main purpose of this code is to extract certain parameters (specifically those named "option") from a commands specification object. It does this in a functional style using functions from the Ramda library (denoted by `R`). 

### Key Functions

1. **`getParamProp` Function**
   - **Parameters**: 
     - `p`: A string indicating the parameter type to look for (in your case, "option").
     - An object that contains a `cmd` property, which has a `param_cmd` array.
   - **Returns**: An object where the keys are command names and the values are objects containing relevant parameter values.
   - **How it Works**:
     - It uses the `reduce` method on `param_cmd` to accumulate a result object.
     - For each command object in `param_cmd`, it filters its parameters to find those which include the property specified by `p`.
     - If found, it maps them to a key-value format where the key is the parameter name and the value is the corresponding parameter value.
     - It then constructs and returns the final result object.

   ```javascript
   const getParamProp = (p, { cmd: { param_cmd = [] } }) =>
     param_cmd.reduce((result, { name, params = [] }) => {
       const props = params
         .filter(R.has(p))
         .map(({ name, [p]: value }) => [name, value]);
       return props.length
         ? { ...result, [name]: Object.fromEntries(props) }
         : result;
     }, {});
   ```

2. **`getParamOption` Function**
   - This function is a simple wrapper around `getParamProp`, specifically calling it with "option" as the parameter type to look for.
   - It takes a command specification and returns the relevant "option" parameters.

   ```javascript
   const getParamOption = (spec) => getParamProp("option", spec);
   ```

3. **`getCmdLineOptions` Function**
   - This function combines results from `getParamOption` and merges them into a single object.
   - It uses `R.compose` to chain several functions together: 
     - `getParamOption` to extract the "option" parameters.
     - `R.values` to get the values from the resulting object.
     - `R.mergeAll` to merge all those values into a single object.

   ```javascript
   const getCmdLineOptions = R.compose(R.mergeAll, R.values, getParamOption);
   ```

### Example Usage

Assuming the following structure of a command specification:

```javascript
const spec = {
  cmd: {
    param_cmd: [
      {
        name: 'command1',
        params: [
          { name: 'param1', option: 'value1' },
          { name: 'param2', option: 'value2' },
        ],
      },
      {
        name: 'command2',
        params: [
          { name: 'param3' }, // no 'option' property
          { name: 'param4', option: 'value3' },
        ],
      },
    ],
  },
};

const options = getCmdLineOptions(spec);
console.log(options);
```

### Explanation of Example Output
- The output of `console.log(options);` will be:
```javascript
{
  command1: { param1: 'value1', param2: 'value2' },
  command2: { param4: 'value3' }
}
```
- This is because `command1` contained two parameters with the "option" property, and `command2` had one.

### Summary
- This code allows you to extract and merge command-line options from a structured specification object in a functional style.
- Understanding each function's role helps in customizing or extending the functionality based on your needs.
