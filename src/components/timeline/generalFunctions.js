import _ from 'lodash';

// NOTE // takes in an object, an array of strings (i.e. getNested({a: {b: '=)'}}, ['a', 'b'])), and a replacement prop (optional)
// NOTE // replacement example: 'startDate' (base-level props only)
export const getNested = (obj, itemLoc, replacement) => {
  let curProp
  if (typeof itemLoc === 'string') {
    itemLoc = itemLoc.split('.')
  }

  for (let i = 0; i < itemLoc.length; i++) {
    const itemProp = itemLoc[i];
    if (i === 0) {
      // NOTE // will either return the next level down, or undefined
      curProp = obj[itemProp]
    }
    else {
      curProp = curProp && curProp[itemProp] ? curProp[itemProp] : ''
    }
  }
  // NOTE // replacement is an option to add a prop with the nested props value at base level
  if (replacement && curProp) {
    obj[replacement] = curProp
    return {item: obj, prop: curProp}
  }
  else {
    // NOTE // returns something useful or undefined
    return curProp
  }
}

export const isDate = (date) => {
  if (typeof date === 'object') {
    if (!isNaN(new Date(date))) {
      return true
    }
    return false
  }
  return false
}

// NOTE // returns false on a bad date, otherwise returns a date object
export const getDate = (date) => {
  let output = new Date(date)
  // NOTE // if the item is already a date object return it
  if (isDate(date)) {
    return date
  }
  else if (!output || output === 'Invalid Date') {
    console.warn('one or more of the designated date items is an invalid date')
    return false
  }
  else {
    let year = output.getUTCFullYear()
    let month = output.getUTCMonth()
    let day = output.getUTCDate()
    // NOTE // this seems a little sphagetti-like, but idk a better way to check (won't work if you put in the start of UTC time lol)
    // NOTE // if you put a number into a date constructor like new Date(12), you'll get the start of UTC time (1/1/1970)
    if (year <= 1970) {
      if (day === 1 && month === 0) {
        return false
      }
    }
    return output
  }
}

// NOTE // transforms a percent string and gets percentage of number
export const getPercentOf = (percentStr, num) => {
  let percentLoc = percentStr.indexOf('%')
  let percentNum = Number(percentStr.slice(0, percentLoc))
  if (percentNum >= 100) {
    percentNum = 1
  }
  else {
    percentNum = Number('.' + percentStr.slice(0, percentLoc))
  }

  return percentNum * num
}