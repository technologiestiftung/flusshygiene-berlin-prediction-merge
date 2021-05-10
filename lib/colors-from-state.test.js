const { colorFromState } = require("./util");

describe.each([
  ["1", "green"],
  ["2", "green"],
  ["3", "orange"],
  ["4", "orange"],
  ["5", "red"],
  ["6", "red"],
  ["7", "grey"],
  ["8", "grey"],
  ["9", "grey"],
  ["10", "orange"],
  ["11", "green"],
  ["12", "green"],
  ["13", "orange"],
  ["14", "orange"],
  ["15", "red"],
  ["16", "red"],

  [1, "green"],
  [2, "green"],
  [3, "orange"],
  [4, "orange"],
  [5, "red"],
  [6, "red"],
  [7, "grey"],
  [8, "grey"],
  [9, "grey"],
  [10, "orange"],
  [11, "green"],
  [12, "green"],
  [13, "orange"],
  [14, "orange"],
  [15, "red"],
  [16, "red"],
  ["", "grey"],
  [99, "grey"],
  [Math.floor(Math.random() * 10000) + 17, "grey"],
  [(Math.floor(Math.random() * 10000) + 17).toString(), "grey"],
])(".colorFromState(%s)", (colId, expected) => {
  test(`colorFromState(${colId}) should return ${expected}`, () => {
    expect(colorFromState(colId)).toBe(expected);
  });
});
