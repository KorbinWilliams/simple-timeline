import { Grid } from '@mui/material'

const VAxis = (props)  => {
  let formattedItems = props.formattedItems
  let baseRowHeight = props.baseRowHeight

  return (
    <div style={{height: '100%', borderRight: '2px solid #c1c1c1'}}>
      {formattedItems.map((group, index) => (
        <Grid container alignContent='center' justify='center' style={{width: '100%', height: `${group.overlaps * baseRowHeight}%`, borderTop: '2px solid #c1c1c1'}} key={group.groupName} index={index}>
          {/* TODO // different tag or style for ipad */}
          <div style={{width: '100%', fontSize: '100%', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>{group.groupName}</div>
        </Grid>
      ))}
    </div>
  )
}

export default VAxis