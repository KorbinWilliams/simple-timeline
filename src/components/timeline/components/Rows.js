import { Grid } from '@mui/material'
import { configureItemPositions, configureItemOptions } from "../processFunctions"
import ItemDisplay from "./ItemDisplay"

// NOTE // renders rows for each group
// TODO // set min-height for rows
const Rows = (props) => {
  let hover = props.hover
  let modal = props.modal
  // NOTE // the calculated height of each row
  const baseRowHeight = props.baseRowHeight
  console.log('Rows brh: ', baseRowHeight)
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

    // NOTE // loop over each row, grab items for the row, and configure their positions
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

  return (
    <Grid container item xs={12} id='rows-container' style={{height: `100%`, position: 'relative'}}>
      {
        showCurTime ?
        <div id='time-marker-line' style={{position: 'absolute', left: `${overlayPos}px`, height: '100%', width: '1px', backgroundColor: 'black', zIndex: -1}}></div> :
        <div></div>
      }
      {
        formattedItems.map((group, index) => {
          let rows = group.rows
          if (group && group.rows) {
            return (
              // NOTE // height used to be {baseRowHeight * rows.length * .9} and I have no idea why the .9 was there
              <Grid container style={{height: `${baseRowHeight * rows.length}%`, backgroundColor: (index % 2 == 0 ? 'white' : '#e6e6e6'), border: '1px solid #c1c1c1'}} id={group.groupName} index={index}>
                {
                  rows.map((row, index) => {
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
                  })
                }
              </Grid>
            )
          }
        })
      }
    </Grid>
  )
}

export default Rows