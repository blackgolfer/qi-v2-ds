import * as R from "ramda";

const {
  compose,
  drop,
  filter,
  head,
  last,
  map,
  range,
  repeat,
  reverse,
  tail,
  take,
  zip,
} = R;

// An introduction to list, in javascript corresponding to array
console.log("reverse [5, 4, 3, 2, 1]: ", reverse([5, 4, 3, 2, 1]));
console.log(
  'zip [1, 2, 3, 4] ["apple", "orange", "cherry", "mango"]: ',
  zip([1, 2, 3, 4], ["apple", "orange", "cherry", "mango"])
);
console.log("take 3 [5, 4, 3, 2, 1]: ", take(3, [5, 4, 3, 2, 1]));
console.log("tail [5, 4, 3, 2, 1]: ", tail([5, 4, 3, 2, 1]));
console.log("head [5, 4, 3, 2, 1]: ", head([5, 4, 3, 2, 1]));
console.log('last [5,4,3,2,1]: ',last([5, 4, 3, 2, 1]));
console.log("4 `elem` [3,4,5,6]: need to define the 'elem' operator"); // 4 `elem` [3,4,5,6]
const hi = repeat("hi"); // repeat 'hi', but can only be finite number
console.log("take 5 repeat 'hi' (faked): ", take(5,hi(10)));
// take 10 [2,4..] // no infinite list in ramda.js
console.log("'take 10 [2,4..]' is not possible")
//cycle([3, 4, 5, 6]) // yet for find cycle in ramda.js
console.log("'cycle [3, 4, 5, 6]' yet to be found...")
// list comprehension
console.log(
  "[x*2 | x <- [1..10]]: ",
  map((x) => x * 2, range(1, 11))
); // [x*2 | x <- [1..10]]
console.log('[x*2 | x <- [1..10], x*2 >= 12]: ',compose(
  map((x) => x * 2),
  filter((x) => x * 2 >= 12)
)(range(1, 11))); // [x*2 | x <- [1..10], x*2 >= 12]


