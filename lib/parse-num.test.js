const { parseNum } = require("./util");
describe.each([
  ["100", 100],
  [">100", 100],
  ["<100", 100],
  ["<100,00", 100],
  ["<100.00", 100],
  ["<>100.00", 100],
  ["<<100.00", 100],
  [">>100.00", 100],
  [">>1,00,00", 1],
  [">>1,0,0,0,0", 1],
  ["0,0,0,0,1", 0],
])(".parseNum(%s) returns %i", (str, expected) => {
  test(`should parse ${expected} from ${str} `, () => {
    expect(parseNum(str)).toBe(expected);
  });
});
