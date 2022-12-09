import cleanHtml from '../htmlSanitizer'

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
      <div style={{border: '2px solid black', backgroundColor: `white`, minHeight: '100%'}} dangerouslySetInnerHTML={{__html:cleanHtml(hover.html)}} />
    </div>
  )
}

export default HoverDisplay