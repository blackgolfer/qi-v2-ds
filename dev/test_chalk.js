import chalk from 'chalk';

/**
 * Format a JSON object as a string with color
 * @param {Object} obj The JSON object to format
 * @returns {string} The formatted string
 */
const formatJsonWithColor = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    return json
        .replace(/(".*?")(?=\s*:)/g, chalk.blue('$1')) // Color string keys in red
        .replace(/:\s*(".*?")/g, (match, p1) => {
            return `: ${chalk.green(p1)}`; // Color string values in blue
        }) 
        .replace(/:\s*(\d+|true|false|null)/g, (_, p1) => {
            return `: ${chalk.yellow(p1)}`; // Color numbers, boolean, and null in yellow
        });
};

const exampleObject = {
    name: "Alice",
    age: 30,
    isMember: true,
    preferences: {
        colors: ["red", "blue"],
        foods: null
    }
};

console.log(formatJsonWithColor(exampleObject));