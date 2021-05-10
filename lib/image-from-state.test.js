const { imageFromState } = require("./util");

describe.each([
  [1, "gruen.jpg"],
  [2, "gruen_a.jpg"],
  [3, "gelb.jpg"],
  [4, "gelb_a.jpg"],
  [5, "rot.jpg"],
  [6, "rot_a.jpg"],
  [11, "gruen_prog.jpg"],
  [12, "gruen_a_prog.jpg"],
  [13, "gelb_prog.jpg"],
  [14, "gelb_a_prog.jpg"],
  [15, "rot_prog.jpg"],
  [16, "rot_a_prog.jpg"],
])(".imageFromState(%s)", (colId, expected) => {
  test(`imageFromState(${colId}) should return ${expected}`, () => {
    expect(imageFromState(colId)).toBe(expected);
  });
});
