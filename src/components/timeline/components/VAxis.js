import { Grid } from '@mui/material'

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

export default VAxis