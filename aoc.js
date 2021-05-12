const Node = {
  fs: require('fs'),
  util: require('util'),
  crypto: require('crypto'),
}

const stringInput = dayNumber =>
  Node.fs.readFileSync(`input.${dayNumber}.txt`).
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

const theAlphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

const sum = (a, b) => a + b

const set = (...list) => new Set(list)

const cartesian = (a1, a2) => a1.flatMap(i => a2.map(j => [i, j]))

// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
const intersection = (setA, setB) => {
  let _intersection = new Set()
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}

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

  const isStrictlyValid = rawPassport => {
    const passport = rawPassport.map(kvp => {
      const [k, v] = kvp.split(':')
      return { [k]: v }
    }).reduce((acc, val) => ({
      ...acc,
      ...val
    }), {})

    const heightValid = (p) => {
      const match = passport.hgt.match(/^(\d+)(cm|in)$/)
      if (match) {
        const [_, hgt, unit] = match
        if (unit === 'in' && hgt >= 59  && hgt <= 76) return true
        if (unit === 'cm' && hgt >= 150 && hgt <= 193) return true
      }
      return false
    }

    if (passport.byr < 1920 || passport.byr > 2002) return false
    if (passport.iyr < 2010 || passport.iyr > 2020) return false
    if (passport.eyr < 2020 || passport.eyr > 2030) return false
    if (!heightValid(passport)) return false
    if (!passport.hcl.match(/^#[0-9a-f]{6}$/)) return false
    if (!'amb blu brn gry grn hzl oth'.split(' ').includes(passport.ecl)) return false
    if (!passport.pid.match(/^\d{9}$/)) return false

    return true
  }

  answerPart2(validPassports.filter(isStrictlyValid).length)
}

const day5 = () => {
  const seats = lineInput(5)

  const seatIds = seats.map(seat => {
    const s = seat.replaceAll('F', 0).replaceAll('B', 1).replaceAll('L', 0).replaceAll('R', 1)
    const[row, col] = [s.slice(0, 7), s.slice(7, 10)].map(n => parseInt(n, 2))
    return row * 8 + col
  })

  answerPart1(
    seatIds.reduce(
      (a, b) => Math.max(a, b)
    )
  )

  seatIds.sort((a, b) => a - b)
  for (let i = 0; i < seatIds.length; ++i) {
    if (seatIds[i] < seatIds[i+1] - 1) {
      return answerPart2(seatIds[i+1] - 1)
    }
  }
}

const day6 = () => {
  const answers = paragraphInput(6)
  answerPart1(
    answers.map(group => (
      new Set(
        group.
          replace(/\s/g, '').
          split('')
      ).size
    )).reduce(sum, 0)
  )

  answerPart2(
    answers.
      map(group => group.split("\n")).
      map(people =>
        people.
          map(person => new Set(person.split(''))).
          reduce(intersection, new Set(theAlphabet))
      ).
      map(s => s.size).
      reduce(sum, 0)
  )
}

const day7 = () => {
  const input = lineInput(7)
  let possible = {}
  const my_colors = ['shiny gold']
  while (true) {
    const prev_count = Object.keys(possible).length
    input.forEach(line => {
      const [ignored, color, rest] = line.match(/(.*) bags contain (.*)\./)

      if (rest === 'no other bags') return

      const contained = rest
        .split(', ')
        .map(bag => bag.match(/(\d+) (.*) bags?/))
        .map(bag => bag[2])

      if (contained.filter(b => my_colors.includes(b)).length) {
        possible[color] = true
        my_colors.push(color)
      }
    })
    if (Object.keys(possible).length === prev_count) break
  }
  answerPart1(Object.keys(possible).length, 'bag colors')

  weights = {}
  input.forEach(line => {
    const [ignored, color, rest] = line.match(/(.*) bags contain (.*)\./)

    if (rest === 'no other bags') {
      weights[color] = 1
    } else {
      weights[color] = rest
        .split(', ')
        .map(bag => bag.match(/(\d+) (.*) bags?/))
    }
  })

  const computeWeight = weight => {
    if (typeof weight === 'number') return weight
    return 1 + weight
      .map(contained => contained[1] * computeWeight(weights[contained[2]]))
      .reduce(sum, 0)
  }

  answerPart2(computeWeight(weights['shiny gold']) - 1, 'bags')
}

// Day 8
const day8 = () => {
  const instructions = lineInput(8)
  let ip = 0
  let acc = 0
  let visited = []
  while (true) {
    if (visited[ip]) break

    const instruction = instructions[ip]
    if (instruction === undefined) breaK

    const [operation, argument] = instruction.split(' ')
    const arg = Number(argument);
    switch (operation) {
      case 'nop': break;
      case 'acc': acc += arg; break;
      case 'jmp': ip += arg; continue;
    }
    visited[ip] = true
    ip++;
  }
  answerPart1(acc)

  // Part 2
  for (let i in instructions) {

    if (instructions[i].includes('acc')) continue

    const ourInstructions = [...instructions]
    if (ourInstructions[i].includes('nop'))
      ourInstructions[i] = ourInstructions[i].replace('nop', 'jmp')
    else if (ourInstructions[i].includes('jmp'))
      ourInstructions[i] = ourInstructions[i].replace('jmp', 'nop')

    ip = 0
    acc = 0
    visited = []

    while (true) {
      if (visited[ip]) break
      visited[ip] = true

      if (ip >= instructions.length) {
        answerPart2(acc)
        return
      }

      const instruction = ourInstructions[ip]
      if (instruction === undefined) {
        console.log(`undef instruction at ${ip} which is not ${instructions.length} ? This should never happen.`)
        break
      }

      const [operation, argument] = instruction.split(' ')
      const arg = Number(argument);
      switch (operation) {
        case 'acc':
          acc += arg;
          break;
        case 'jmp':
          ip += arg;
          continue;
      }
      ip++;

    }
  }
}

const day9 = () => {
  const preambleLength = 25
  const sequence = lineInput(9).map(Number)
  const preamble = sequence.slice(0, preambleLength)

  const isValid = idx => {
    const slice = sequence.slice(idx - preambleLength, idx)
    return cartesian(slice, slice).
      filter(p => p[1] !== p[0]).
      some(pair => sum(...pair) === sequence[idx])
  }

  for (let i = preambleLength; i < sequence.length; ++i) {
    if (!isValid(i)) {
      return answerPart1(sequence[i])
      // TODO: For part 2:
      //       find a contiguous set of at least two numbers in your list which sum to the invalid number
      //       add together the smallest and largest number in this contiguous range
    }
  }
}

const solveDay = (number) => {
  console.log(`❄️ Day ${number} ❄️`);
  switch (number) {
    case 1: return day1();
    case 2: return day2();
    case 3: return day3();
    case 4: return day4();
    case 5: return day5();
    case 6: return day6();
    case 7: return day7();
    case 8: return day8();
    case 9: return day9();
    case 10: return day10();
    case 11: return day11();
    case 12: return day12();
    case 13: return day13();
    case 14: return day14();
    case 15: return day15();
    case 16: return day16();
    case 17: return day17();
    case 18: return day18();
    case 19: return day19();
    case 20: return day20();
    case 21: return day21();
    case 22: return day22();
    case 23: return day23();
    case 24: return day24();
    case 25: return day25();
    default: console.log(`No such solver for day ${number}, man`);
  }
}

solveDay(1);
solveDay(2);
solveDay(3);
solveDay(4);
solveDay(5);
solveDay(6);
solveDay(7);
solveDay(8);
solveDay(9);
