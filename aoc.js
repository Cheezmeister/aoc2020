const fs = require('fs');
const Node = {
  fs: require('fs'),
  util: require('util'),
}

const stringInput = dayNumber =>
  fs.readFileSync(`input.${dayNumber}.txt`).
    toString()

const lineInput = dayNumber =>
  stringInput(dayNumber).
    trim().
    split("\n")

const paragraphInput = dayNumber =>
  stringInput(dayNumber).
    trim().
    split("\n\n")


// TODO: Maybe transpose to index by (x, y)
const gridInput = dayNumber =>
  lineInput(dayNumber).map(s => s.split(''))

const color = (name) => (str) => {
  const termcode = (v) => `\x1b[${v}m`
  const [on, off] = Node.util.inspect.colors[name].map(termcode)
  return `${on}${str}${off}`
}

const answer = color('green')

const answerPart1 = (...a) => console.log('Your solution for part 1 is: ' + answer(a[0]), '!', a.slice(1).join(' '))
const answerPart2 = (...a) => console.log('Your solution for part 2 is: ' + answer(a[0]), '!', a.slice(1).join(' '))

const day1 = () => {
  const numbers = lineInput(1)

  for (let i = 0; i < numbers.length; ++i) {
    for (let j = i; j < numbers.length; ++j) {
      const a = +numbers[i];
      const b = +numbers[j];

      if (a + b === 2020) {
        answerPart1(a * b);
        break;
      }
    }
  }

  for (let i = 0; i < numbers.length; ++i) {
    for (let j = i; j < numbers.length; ++j) {
      for (let k = j; k < numbers.length; ++k) {
        const a = +numbers[i];
        const b = +numbers[j];
        const c = +numbers[k];

        if (a + b + c === 2020) {
          answerPart2(a * b * c);
          break;
        }
      }
    }
  }
}

const day2 = () => {

  const lines = lineInput(2)

  // check passwords
  const isValid = (part) => (line) => {
    const re = /(\d+)-(\d+) (\w): (\w+)/;
    const result = line.match(re);
    if (!result) return false;

    const low = result[1];
    const high = result[2];
    const letter = result[3];
    const password = result[4];

    if (part === 1) {
      const count = password
        .split('')
        .filter(s => s === letter)
        .length;
      return count <= high && count >= low;
    }

    // part 2
    const letters = password.split('');
    return (letters[low - 1] === letter) ^ (letters[high - 1] === letter);
  };

  const isTrue = someBool => someBool;

  // Day 1
  answerPart1(
    lines.map(isValid(1)).
      filter(isTrue).
      length,
    'valid passwords'
  );

  // Day 2
  answerPart2(
    lines.map(isValid(2)).
      filter(isTrue).
      length,
    'valid passwords'
  );
}

const day3 = () => {
  const grid = gridInput(3)
  const checkSlope = (dx, dy) => {
    let trees = 0
    let x = 0
    let y = 0

    while (y < grid.length) {
      const val = grid[y][x]
      if (val === '#') ++trees
      y += dy
      x += dx
      x %= grid[0].length
    }
    return trees
  }

  answerPart1(checkSlope(3, 1))
  answerPart2(
    checkSlope(1, 1) *
    checkSlope(3, 1) *
    checkSlope(5, 1) *
    checkSlope(7, 1) *
    checkSlope(1, 2)
  )
}

const day4 = () => {
  const fields = [
    'byr', 'iyr', 'eyr', 'hgt',
    'hcl', 'ecl', 'pid', // 'cid',
  ]
  // const sortedFields = fields.sort().join()
  const sortedFields = /byr,(cid,)?ecl,eyr,hcl,hgt,iyr,pid/

  const passports = paragraphInput(4).map(p => p.split(/\s+/))

  const validPassports = passports.
    filter(p => !!p.
      map(kvp => kvp.split(':')[0]).
      sort().
      join().
      match(sortedFields))

  answerPart1(validPassports.length)

  console.log(validPassports.map(v => v.join(' & ')).join("\n---\n"))

  /// 
  // byr (Birth Year) - four digits; at least 1920 and at most 2002.
  // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
  // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
  // hgt (Height) - a number followed by either cm or in:
  // If cm, the number must be at least 150 and at most 193.
  // If in, the number must be at least 59 and at most 76.
  // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
  // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
  // pid (Passport ID) - a nine-digit number, including leading zeroes.
  // cid (Country ID) - ignored, missing or not.

  


}

const solveDay = (number) => {
  console.log(`❄️ Day ${number} ❄️`);
  switch (number) {
    case 1: return day1();
    case 2: return day2();
    case 3: return day3();
    case 4: return day4();
    default: console.log(`No such solver for day ${number}, man`);
  }
}

solveDay(1);
solveDay(2);
solveDay(3);
solveDay(4);
