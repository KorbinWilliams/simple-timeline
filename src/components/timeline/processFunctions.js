import _ from 'lodash';

// NOTE // assigning a row to each item in a group
const sortGroupItems = (props, group) => {
  // NOTE // Make a copy of the group
  let sortedGroup = _.cloneDeep(group)
  // NOTE // sort the items in the group by start time
  sortedGroup.items.sort((a, b) => a.start.getTime() - b.start.getTime())
  let rowTotal = sortedGroup.overlaps

  // NOTE // loop over the items to assign rows
  for (let i = 0; i < sortedGroup.items.length; i++) {
    const curItem = sortedGroup.items[i];
    let itemOverlaps = curItem.overlaps
    // NOTE // if it's the first item, or has no overlaps, assign it to row 0
    if (i === 0 || itemOverlaps.length === 0) {
      sortedGroup.items[i].row = 0
    }
    else {
      let prevItem = sortedGroup.items[i-1]
      let itemKeys = itemOverlaps.map((item) => item.key)
      let prevKey = prevItem.key
      // NOTE // idk why the code below didn't work for the if statement. Had to add itemKeys and prevKey for some reason
      // itemOverlaps.includes(item => item.key === prevItem.key)
      // NOTE // if the previous item overlaps with the current item, and it does not exceed the total row amount, the current row is one after the previous
      if (itemKeys.includes(prevKey)) {
        sortedGroup.items[i].row = ((prevItem.row + 1) < rowTotal ? (prevItem.row + 1) : (prevItem.row - 1))
        continue
      }
      // NOTE // if the previous item doesn't overlap, then the current item is in row 0
      else {
        sortedGroup.items[i].row = 0
      }
    }
  }

  return sortedGroup
}

// NOTE // gets hAxisItems, and filters out items that aren't within the current date-selection
const formatHAxisDates = (props, formattedItems) => {
  let groups = formattedItems
  // NOTE // dateItemsLoc is an array with the strings of the location for the horizontail-axis using dot formatting (i.e. ['start', 'end'] or ['prop1.prop2', 'prop3.prop4'] or ['test.contents.start', 'test.contents.end'])
  let dateItemsLoc = props.dateItemsLoc
  // NOTE // timelineDate is a required date object, will start at 00:00 unless specified with timelineStart/timelineEnd
  let timelineDate = getDate(props.timelineDate)
  // NOTE // a number for the hours, so 0 for 00:00, and 24 for 12:00 p.m.
  let timelineStart = props.timelineStart ? (props.timelineStart - .5) : 0
  let timelineEnd = props.timelineEnd ? (props.timelineEnd + .5) : 24

  if (Array.isArray(dateItemsLoc) && timelineDate) {
    // NOTE // dateItemsLoc[0] should be the start, and dateItemsLoc[1] should be the end. They are split on '.' to access nested properties (i.e. dateLocStartProp = ['flight', 'departure', 'time'])
    const dateLocStartProp = dateItemsLoc[0].split('.')
    const dateLocEndProp = dateItemsLoc[1].split('.')
    // NOTE // finding all occurences of the prop name
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i]
      for (let j = 0; j < group.items.length; j++) {
        const item = group.items[j];
        let itemStartDate = getDate(getNested(item, dateLocStartProp))
        let itemEndDate = getDate(getNested(item, dateLocEndProp))
        // NOTE // we are changing the items in formattedItems. formattedItems e.g. [{groupName: string, items: array, rowHeight: number, overlaps: number, duration: number}]
        // NOTE // Only keep items that are proper dates and fit in the timeline
        if (itemStartDate && itemEndDate) {
          let startYear = itemStartDate.getFullYear()
          let startMonth = itemStartDate.getMonth() + 1
          let startDay = itemStartDate.getDate()
          let startHours = itemStartDate.getHours()
          let endYear = itemEndDate.getFullYear()
          let endMonth = itemEndDate.getMonth() + 1
          let endDay = itemEndDate.getDate()
          let endHours = itemEndDate.getHours()
          let tYear = timelineDate.getFullYear()
          let tMonth = timelineDate.getMonth() + 1
          let tDay = timelineDate.getDate()
          let isUseableStart = (tYear === startYear) && (tMonth === startMonth) && (tDay === startDay)
          let isUseableEnd = (tYear === endYear) && (tMonth === endMonth) && (tDay === endDay)
          let isUseableHour = (startHours >= timelineStart) && (endHours <= timelineEnd)
          // NOTE // if the item fits the timeline
          if (isUseableStart && isUseableEnd && isUseableHour) {
            groups[i].items[j] = {key: item.key, item: item, start: itemStartDate, end: itemEndDate, duration: ((itemEndDate.getTime() - itemStartDate.getTime())/60000/60), overlaps: []}
          }
          // NOTE // get rid of the item if it doesn't fit the timeline
          else {
            groups[i].items.splice(j, 1)
            j--
            continue
          }
        }
      }
    }
    return groups
  }
}

const configureItemOptions = (props, item) => {
  const labelOptions = props.labelOptions
  const itemOptions = props.itemOptions
  let output = {label: '', color: itemOptions.defaultColor || '', hover: '', itemStyle: ''}
  // {label: label, color: color, hover: hover}

  try {
    // SECTION // itemOptions
    if (itemOptions) {
      // NOTE // colorIf should be a function that takes in an item and returns a color
      if (itemOptions.colorIf && typeof itemOptions.colorIf === 'function') {
        // NOTE // the top level of item is the properties we have written in, while item.item is the original item
        // FIXME // if used in any other project change the item param to item.item
        output.color = itemOptions.colorIf(item)
      }
      // NOTE // hover can be an html string or a function that takes in an item and returns an html string
      if (itemOptions.hover && typeof itemOptions.hover === 'function') {
        output.hover = itemOptions.hover(item.item)
      }
      else if (itemOptions.hover && typeof itemOptions.hover === 'string') {
        output.hover = getNested(item.item, itemOptions.hover)
      }
      if (itemOptions.itemStyle && typeof itemOptions.itemStyle === 'object') {
        output.itemStyle = itemOptions.itemStyle
      }
    }
    // !SECTION
    // SECTION // labelOptions
    if (labelOptions && labelOptions.label) {
      // NOTE // labelOptions.label should be an array of objects (see docs) or a string denoting the location of the label in an item
      if (Array.isArray(labelOptions.label)) {
        output.label = getNested(item.item, labelOptions.label)
      }
      else if(typeof labelOptions.label === 'string') {
        output.label = getNested(item.item, labelOptions.label)
        // NOTE // if the curOff option is used and is a number, only use cutOff chars of the string
        if (labelOptions.cutOff && typeof labelOptions.cutOff === 'number') {
          output.label = (output.label.slice(0, labelOptions.cutOff) + '...')
        }
      }
      else {
        console.warn('something went wrong with an items label')
      }
    }
    // !SECTION

    return output
  }
  catch (error) {
    console.error('configureItemOptions Err: ' + error)
  }
}

// NOTE // gets the position based on time for each item
const configureItemPositions = (props, items, hourWidth) => {
  // NOTE // timeline technically starts 30 mins prior to timelineStart
  let timelineStart = props.timelineStart - .5

  // NOTE // to get the items position, we are looping over each item in a row
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // NOTE // itemWidth is the width of an item relative to the time-scale
    let itemWidth = hourWidth * item.duration
    let startHour = item.start.getHours()
    let startMinutes = item.start.getMinutes()
    let start = startHour + (startMinutes/60)
    // NOTE // offset is the distance from the start of the timeline
    let offset = (hourWidth * (start - timelineStart))
    items[i].offset = Math.round(offset)
    items[i].itemWidth = Math.round(itemWidth)
  }

  return items
}

// NOTE // get each groups rowHeight based on the total number of overlaps
const getRowHeights = (props, formattedItems) => {
  let groups = _.cloneDeep(formattedItems)
  let totalRows = 0

  // NOTE // get the highest amount of overlapping items by row (so for the test cases it would be 3)
  for (let h = 0; h < groups.length; h++) {
    const group = groups[h];
    // NOTE // loop over each item in the group
    for (let i = 0; i < group.items.length; i++) {
      const curRowItem = groups[h].items[i]
      // NOTE // loop over all other items to look for overlaps
      for (let j = 0; j < group.items.length; j++) {
        // NOTE // don't compare the item to itself
        if (j === i) {
          continue
        }
        const rowItem = groups[h].items[j]
        let endsBefore = curRowItem.end.getTime() < rowItem.start.getTime()
        let startsAfter = curRowItem.start.getTime() > rowItem.end.getTime()
        // NOTE // if these don't overlap go to the next one
        if (startsAfter || endsBefore) {
          continue
        }
        else {
          // NOTE // if the item already has overlaps add this one to the array
          if (curRowItem.overlaps && Array.isArray(curRowItem.overlaps)) {
            groups[h].items[i].overlaps.push(rowItem)
          }
          // NOTE // if the item doesn't have overlaps, create an array for it
          else {
            groups[h].items[i].overlaps = [rowItem]
          }
        }
      }

      // NOTE // replace the groups overlaps if the item has the most
      if (curRowItem.overlaps && (curRowItem.overlaps.length + 1) > group.overlaps) {
        // NOTE // overlaps is the highest amount of overlaps any item in a group has, so we need to add 1 to account for the item itself
        // NOTE // e.g. #2 from the test cases would get chosen for its' overlap length of 2, and then we include itself
        groups[h].overlaps = (curRowItem.overlaps.length + 1)
      }
    }

    // NOTE // now that we have the overlaps for this group, we can add that to totalRows
    totalRows += groups[h].overlaps
  }

  // NOTE // rowHeightBase is the percentage of space a single row (not a group) will have for display
  let rowHeightBase = 100/totalRows

  // NOTE // loop over groups to create rows, and assign items
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    // NOTE // assign each item in a group to a row, then replace the group
    groups[i] = sortGroupItems(props, group)
  }

  return [groups, rowHeightBase]
}

// NOTE // grouping items as/by vAxisProp for the vertical axis
const formatVAxisItems = (props) => {
  const items = props.items
  // NOTE // if no vAxisProp is provided, try using the key instead
  const vAxisProp = props.vAxisProp ? props.vAxisProp : 'key'
  // NOTE // groupedItems example [{groupName: 'TN1001', items: [], rowHeight: 5, overlaps: 0}, ...]
  let groupedItems = []

  // NOTE // sort all items into groups
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // NOTE // grouping items using the vAxisProp (i.e. 'Tailnumber')
    const groupName = getNested(item, vAxisProp)
    let groupLoc = groupedItems.findIndex(group => group.groupName === groupName)
    if (groupName && groupLoc !== -1) {
      groupedItems[groupLoc].items.push(item)
    }
    else if (groupName) {
      // NOTE // we add overlaps in getRowHeights
      groupedItems.push({groupName: groupName, items: [item], rowHeight: 0, overlaps: 0})
    }
  }

  return groupedItems
}

// NOTE // the bulk of the logic, returns an array [formattedItems, baseRowHeight]
const formatItems = (props) => {
  let formatVAxisResults = formatVAxisItems(props)
  let formatHAxisDatesResults = formatHAxisDates(props, formatVAxisResults)
  return getRowHeights(props, formatHAxisDatesResults)
}

// NOTE // adjust the height of the internal components if there are less than 4 rows
const getChartHeight = (items) =>  {
  let totalRows = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    totalRows += item.overlaps
  }

  if (totalRows < 4) {
    return (100 - ((4 - totalRows) * 25)) + '%'
  }
  return '100%'
}