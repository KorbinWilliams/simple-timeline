# Timeline Readme

## About
  This component was made because google's chart for React was a royal pain in the ass for making timelines. It is a timeline chart that takes items, groups them based on a shared property, and displays items that match the current date. It is meant to be simple to set up, but still have good options for customization

## Required Props

- `items`: an array of items to be used in the timeline
- `timelineDate`: a date object (or date in milliseconds) to use for the timeline. Used for the year, month, and day (will exclude items not matching the day of timelineDate)
- `dateItemsLoc`: an array with the strings of the location for the date items using dot formatting (i.e. ['item.end.time', 'item.start.time'] or ['start', 'end']). the first item in the array should be the start, and the second the end
- `vAxisProp`: a string used to indicate the location of the prop (using dot notation) to use to group items (defaults to trying item.key if omitted)

## Other Props

- `chartHeight`: the height of the chart (can use px or percentage, defaults to 100%)
- `chartWidth`: the width of the chart (can use px or percentage, defaults to 100%)
- `timelineStart` & `timelineEnd`: these are numbers to indicate the start and end of the timeline measured in hours
- `showCurTime`: a boolean that controls whether to show the current time on the timeline (default is false)
- `labelOptions`: an object containing options for if and how the label should be displayed
    - `label`: a string that denotes the location of the label in the item
      - `label (in item)`: a string OR an array of objects with a text property and a styles property (each text entry matches the styles entry with the same index)
        (label in item example: [{text: ['line1 text1'], styles: [{fontWeight: 'bold'}]}, {text: ['line2 text1', 'line2 text2'], styles: [{fontweight: 'bold'}, {color: 'blue'}]}, ...])
    - `cutoff`: a number defining the amount of characters to display (only applies if label is a string in the item)
- `itemOptions`: an object containing options for how each item looks and behaves
    - `defaultColor`: a string that designates the default color of items (if you want all items to be the same color)
    - `colorIf`: a function that takes in an item and returns a color string
    - `hover`: a function that returns a string of html, or a string denoting a property on an item containing an html string (styling is ignored)
    - `itemStyle`: an object containing styling for each item (any styles set that conflict with the defaults will overwrite the default)
- `rowOptions`: an object containing options for how each row looks and behaves
    - ``: 
- `itemModal`: an object containing options for a modal that's brought up on clicking an item
    - `component`: a JSX component that will take in props
      - `props.item`: the original item
      - `props.modal`: a prop passed to the itemModal component
        - `component`: the JSX component used
        - `modalItem`: the item, but with internal props used in the timeline
        - `setItem`: a function that can be used to set the current modal item
        - `setToggle`: a function that can be used to open/close the modal
        - `toggle`: the toggle for whether the modal is open/closed (don't directly edit, use setToggle)

## Other Defaults
Any of the listed props not specified by the user will have the stated default

- `timelineStart` & `timelineEnd`: the hour of the earliest & latest items start and end time
- `itemOptions.defaultColor`: color #9fc5e9 (light blue)
- `labelOptions.label`: if a label property is not specified, it will be left blank and not have a label

### Basic Example Chart (simplest possible)
```
  <TimelineChart
    items={testItems}
    timelineDate={1631733189520}
    dateItemsLoc={['start', 'end']}
    vAxisProp={'name'}
  />
```

### Complex Example Chart
```
  <TimelineChart
    items={formatAppointments(testItems)}
    timelineDate={1669705200000}
    showCurrentTime={true}
    dateItemsLoc={['appointmentStart', 'appointmentEnd']}
    vAxisProp={'name'}
    chartHeight={'100%'}
    chartWidth={'1500px'}
    itemOptions={
      {
        defaultColor: '#9fc5e9',
        itemStyle: {height: '64px', top: '25%', fontFamily: 'Helvetica'}
        colorIf: getItemColor,
        hover: 'hoverHtml'
      }
    }
    labelOptions={
      {
        label: 'label'
      }
    }
    itemModal = {
      {
        component: <TestModal />
      }
    }
  />
```