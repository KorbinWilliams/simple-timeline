import { Grid } from '@mui/material'

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

export default HAxis