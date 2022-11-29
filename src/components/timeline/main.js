import React, {cloneElement, useState} from 'react';
import cleanHtml from './htmlSanitizer'
import { Grid, Modal } from '@material-ui/core'
import _ from 'lodash';

// TODO // add prop type validation

// NOTE // configures any default props the user didn't use that the timeline needs
const configureDefaultProps = (props) => {
  props.labelOptions.label = props?.labelOptions?.label ? props.labelOptions.label : ''
  props.itemOptions.defaultColor = props?.itemOptions?.defaultColor ? props.itemOptions.defaultColor : 'rgb(159, 197, 233)'
}

// NOTE // takes in an object, an array of strings (i.e. getNested({a: {b: '=)'}}, ['a', 'b'])), and a replacement prop (optional)
// NOTE // replacement example: 'startDate' (base-level props only)
const getNested = (obj, itemLoc, replacement) => {
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

const isDate = (date) => {
  if (typeof date === 'object') {
    if (!isNaN(new Date(date))) {
      return true
    }
    return false
  }
  return false
}

// NOTE // returns false on a bad date, otherwise returns a date object
const getDate = (date) => {
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

// TODO // clear out redundant props, because all parts/methods get the same props passed, OR pass specific props and group them better (i.e. 'labelOptions')
// TODO // date-scale?

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

// SECTION VAxis
// NOTE // vertical axis. Used to display groupings of items (i.e. names of people who took test)
const VAxis = (props)  => {
  let formattedItems = props.formattedItems
  let baseRowHeight = props.baseRowHeight

  return (
    <div style={{height: '100%', borderRight: '1px solid black'}}>
      {formattedItems.map((group, index) => (
        <Grid container alignContent='center' justify='center' style={{width: '100%', height: `${group.overlaps * baseRowHeight}%`, borderTop: '1px solid black'}} key={group.groupName} index={index}>
          {/* TODO // different tag or style for ipad */}
          <div style={{fontSize: '100%', fontWeight: 'bold'}}>{group.groupName}</div>
        </Grid>
      ))}
    </div>
  )
}
// !SECTION

// SECTION HAxis
// NOTE // displays the hour markings on the chart
const HAxis = (props) => {
  let originalProps = props.props
  let rowWidth = (originalProps.chartWidth/12) * 11
  // NOTE // a number for the hours, so 0 for 00:00, and 24 for 24:00
  let timelineStart = originalProps.timelineStart ? originalProps.timelineStart : 0
  let timelineEnd = originalProps.timelineEnd ? originalProps.timelineEnd : 24
  let hours = (timelineEnd - timelineStart)
  let hoursArr = []

  for (let i = 0; i < (hours + 1); i++) {
    const hour = timelineStart + i;
    hoursArr.push(hour)
  }

  return (
    <Grid container id='hAxis' style={{width: '100%', borderTop: '1px solid black'}}>
      {hoursArr.map((hour, index) => (
        // NOTE // hour mark width is essentially the width of allocated grid divided by the amount of hours in the chart (the '+ 2' is to include the first and last hour)
        <div key={(index + 'hourMark')} index={index} style={{width: `${Math.round((rowWidth/(hours + 2)))}px`, margin: '0px'}}>
          <h4 style={{marginTop: '5px'}}>{hour}</h4>
        </div>
      ))}
    </Grid>
  )
}
// !SECTION

// const Legend = (props) => {
//   const legendItems = props.legendItems

//   return (
//     <div></div>
//   )
// }

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
  } catch (error) {
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

// SECTION Item components
const ItemModal = (props) => {
  // NOTE // modal: {toggle: modalToggle, modalItem: modalItem, component: itemModal, modalProps: modalProps, setToggle: toggleModal, setItem: setModalItem}
  let modal = props.modal
  let modalToggle = modal.toggle
  let item = modal.modalItem

  if (modal.component) {
    return (
      <Modal 
      open={modalToggle}
      onClose={() => {modal.setToggle(false)}}
      aria-labelledby="item-modal"
      aria-describedby="modal to display an item"
      >
        <Grid container alignContent="center" justify="center" item xs={12} style={{marginTop: '15%'}}>
          {cloneElement(modal.component, { modal: modal, item: item.item })}
        </Grid>
      </Modal>
    )
  }
  else {
    return <div></div>
  }
}

const HoverDisplay = (props) => {
  let hover = props.hover
  let item  = props.item
  let modal = props.modal

  return (
    <div 
    onClick={() => {modal.setItem(item); modal.setToggle(true);}}
    onMouseLeave={() => {hover.setHover(''); hover.setHoverKey('')}}
    style={{
      position: 'absolute',
      width: `${item.itemWidth * 1.5}px`,
      height:'70%',
      fontSize: 'smaller',
      top: `15%`,
      left: `${item.offset}px`,
      zIndex: 2
    }}
    >
      <div style={{border: '1px solid black', backgroundColor: `white`, minHeight: '100%'}} dangerouslySetInnerHTML={{__html:cleanHtml(hover.html)}} />
    </div>
  )
}

const ItemDisplay = (props) => {
  let options = props.options
  let item = props.item
  let hover = props.hover
  let modal = props.modal


  // NOTE // if an item is being hovered over, the item has hover html, and the item key matches the hoverKey, show the HoverDisplay
  if (hover && hover.html && hover.hoverKey === item.key) {
    return (
      <HoverDisplay hover={hover} item={item} modal={modal}/>
    )
  }

  else {
    if (typeof options.label === 'string') {
      return (
        <div
          // NOTE // this should be fine as is because hover.html is required to display HoverDisplay
          onMouseEnter={() => {hover.setHover(options.hover); hover.setHoverKey(item.key)}}
          onMouseLeave={() => {hover.setHover(''); hover.setHoverKey('')}}
          style={{
            width: `${item.itemWidth}px`,
            height:'70%',
            backgroundColor: `${options.color}`,
            fontSize: `smaller`,
            top: `15%`,
            left: `${item.offset}px`,
            position: 'absolute',
            overflow: 'visible'
          }}
        >
          {options.label}
        </div>
      )
    }
    else {
      let defaultStyle = {
        width: `${item.itemWidth}px`,
        height:'60%',
        backgroundColor: `${options.color}`,
        fontSize: `smaller`,
        top: `20%`,
        left: `${item.offset}px`,
        position: 'absolute',
        overflow: 'hidden'
      }
      let itemStyle = options.itemStyle ? options.itemStyle : {}
      let combinedStyles = {
        ...defaultStyle,
        ...itemStyle
      }

      return (
        <div
          id={item.key + 'label'}
          // NOTE // this should be fine as is because hover.html is required to display HoverDisplay
          onMouseEnter={() => {hover.setHover(options.hover); hover.setHoverKey(item.key)}}
          onMouseLeave={() => {hover.setHover(''); hover.setHoverKey('')}}
          style={combinedStyles}
        >
          {options.label.map((label, index) => {
            // NOTE // if there is one more style than there are lines for the label, it will apply that style to the line instead of the single string
            let lineStyle = label.styles && label.text && label.styles.length && label.text.length && label.styles.length > label.text.length ? label.styles[label.styles.length - 1] : {}

            return (
              <Grid container justifyContent="flex-start" alignContent="flex-start" item xs={12} key={item.key + 'label' + index} style={lineStyle} >
                {label.text.map((text, index) => {
                  let style = label.styles[index]
                  return <Grid key={item.key + 'text' + index} style={style}>{text}</Grid>
                })}
              </Grid>
            )
          })}
        </div>
      )
    }

  }
}
// !SECTION

// SECTION Rows
// NOTE // renders rows for each group
// TODO // set min-height for rows
const Rows = (props) => {
  let hover = props.hover
  let modal = props.modal
  // NOTE // the calculated height of each row
  const baseRowHeight = props.baseRowHeight
  let formattedItems = props.formattedItems
  let originalProps = props.props
  let rowWidth = (originalProps.chartWidth / 12) * 11
  let timelineStart = originalProps.timelineStart ? originalProps.timelineStart : 0
  let timelineEnd = originalProps.timelineEnd ? originalProps.timelineEnd : 24
  const hours = (timelineEnd - timelineStart)
  // NOTE // the amount of space in a row an hour takes up
  let hourWidth = Math.round(rowWidth/(hours + 2))
  // NOTE // boolean that toggles display of current time
  let showCurTime = originalProps.showCurTime
  // NOTE // current time measured in hours (i.e. 5:12 p.m. curTime is 17.2)
  let curTime = new Date().getHours() + (new Date().getMinutes()/60)
  // NOTE // position of current time
  let overlayPos = (hourWidth * (curTime - (timelineStart - .5)))

  // NOTE // create an object for each row
  for (let i = 0; i < formattedItems.length; i++) {
    const group = formattedItems[i];
    let rowAmount = group.overlaps

    for (let j = 0; j < rowAmount; j++) {
      let rowId = (group.groupName + 'Row' + j)
      let rowItems = group.items.filter(item => item.row === j)
      let formattedRowItems = configureItemPositions(originalProps, rowItems, hourWidth, hover)
      if (group.rows && Array.isArray(group.rows) && !group.rows.includes(r => r.rowId === rowId)) {
        formattedItems[i].rows.push({rowId: rowId, rowItems: formattedRowItems})
      }
      else {
        formattedItems[i].rows = [{rowId: rowId, rowItems: formattedRowItems}]
      }
    }
  }

  // TODO // better adaptivity for item-size, font-size, and row size
  return (
    <Grid container item xs={12} id='rows-container' style={{height: `100%`, position: 'relative'}}>
      {
        showCurTime ?
        <div id='time-marker-line' style={{position: 'absolute', left: `${overlayPos}px`, height: '100%', width: '1px', backgroundColor: 'black', zIndex: -1}}></div> :
        <div></div>
      }
      {formattedItems.map((group, index) => {
        let rows = group.rows
        if (group && group.rows) {
          return (
            <Grid container style={{height: `${Math.round(baseRowHeight * rows.length * .9)}%`}} id={group.groupName} index={index}>
              {rows.map((row, index) => {
                return (
                  <Grid container item xs={12} id={row.rowId} key={row.rowId} style={{height: `${100/rows.length}%`, position: 'relative'}} index={index}>
                    {row.rowItems.map((item, index) => {
                      let options = configureItemOptions(originalProps, item)
                      return (
                        <ItemDisplay key={item.key} index={index} options={options} item={item} hover={hover} modal={modal} />
                      )
                    })}
                  </Grid>
                )
              })}
            </Grid>
          )
        }
      })}
    </Grid>
  )
}
// !SECTION


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


// SECTION TimelineChart
export const TimelineChart = (props) => {
  // NOTE // using local state here so that the on-hover re-renders what is shown
  const [hoverHtml, setHoverHtml] = useState('')
  const [hoverKey, setHoverKey] = useState('')
  const [modalToggle, toggleModal] = useState(false)
  const [modalItem, setModalItem] = useState('')
  const setHtmlString = (htmlString) => {
    if (htmlString !== hoverHtml) {
      setHoverHtml(htmlString)
    }
  }
  const setItemKey = (itemKey) => {
    if (itemKey !== hoverKey) {
      setHoverKey(itemKey)
    }
  }
  // NOTE // ensure all required props exist
  // checkProps(props)
  // NOTE // configure any props that have defaults
  configureDefaultProps(props)
  // NOTE // formatItems contains the bulk of the logic
  let results = formatItems(props)
  let formattedItems = results[0]
  let baseRowHeight = results[1]
  // NOTE // adjust the height of the internal components if there are less than 4 rows
  let adjustedChartHeight = getChartHeight(formattedItems)
  const itemModal = props.itemModal && props.itemModal.component ? props.itemModal.component : ''
  const modalProps = props.itemModal && props.itemModal.modalProps ? props.itemModal.modalProps : ''

  const chartHeight = props.chartHeight ? props.chartHeight : '100%'
  const chartWidth = props.chartWidth ? props.chartWidth : '100%'

  return (
    <Grid container id='main-chart' style={{height: chartHeight, width: (chartWidth + 'px')}}>
      {
        itemModal ?
        <ItemModal modal={{toggle: modalToggle, modalItem: modalItem, component: itemModal, modalProps: modalProps, setToggle: toggleModal, setItem: setModalItem}}/> :
        <div></div>
      }
      <Grid container id='chart-contents' style={{height: adjustedChartHeight}}>
        <Grid style={{height: '90%', width: '5%'}}>
          <VAxis formattedItems={_.cloneDeep(formattedItems)} baseRowHeight={baseRowHeight} />
        </Grid>
        <Grid item style={{width: '95%'}}>
          <Rows
            props={props}
            formattedItems={_.cloneDeep(formattedItems)}
            baseRowHeight={baseRowHeight}
            hover={{html: hoverHtml, setHover: setHtmlString, hoverKey: hoverKey, setHoverKey: setItemKey}}
            modal={{toggle: modalToggle, setToggle: toggleModal, setItem: setModalItem}}
          />
        </Grid>
        <Grid item style={{height: '10%', borderTop: '1px solid black', width: '5%'}}></Grid>
        <Grid item style={{height: '10%', width: '95%'}}>
          <HAxis props={props} />
        </Grid>
      </Grid>
      {/* {props.legendItems ? <Legend legendItems={legendItems}/> : <div></div>} */}
    </Grid>
  )
}
// !SECTION