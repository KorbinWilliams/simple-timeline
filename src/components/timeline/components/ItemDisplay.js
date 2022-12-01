import { Grid } from '@mui/material'
import HoverDisplay from "./HoverDisplay"

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

export default ItemDisplay