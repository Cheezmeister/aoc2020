const fs = require('fs');

const stringInput = dayNumber =>
  fs.readFileSync(`input.${dayNumber}.txt`).
    toString()

const lineInput = dayNumber =>
  stringInput(dayNumber).
    trim().
    split("\n")


// TODO: Fancy colorized answer

const day1 = () => {
  const numbers = lineInput(1)

  for (let i = 0; i < numbers.length; ++i) {
    for (let j = i; j < numbers.length; ++j) {
      const a = +numbers[i];
      const b = +numbers[j];

      if (a + b === 2020) {
        console.log('Your solution for part 1 is: ' + (a * b));
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
          console.log('Your solution for part 2 is: ' + (a * b * c));
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
  let numValid = lines.map(isValid(1)).
    filter(isTrue).
    length;
  console.log('Your solution for part 1 is: ', numValid, ' valid passwords');

  // Day 2
  numValid = lines.map(isValid(2)).
    filter(isTrue).
    length;
  console.log('Your solution for part 2 is: ', numValid, ' valid passwords');
}

const solveDay = (number) => {
  console.log(`❄️ Day ${number} ❄️`);
  switch (number) {
    case 1: return day1();
    default: return day2();
  }
}

solveDay(1);
solveDay(2);
