import React, {cloneElement, useState} from 'react';
import { Grid } from '@mui/material'
import _ from 'lodash';
import HAxis from "./components/HAxis";
import VAxis from "./components/VAxis";
import Rows from "./components/Rows";
import ItemModal from "./components/ItemModal";
import { configureDefaults, formatItems, getChartHeight } from "./processFunctions"

// SECTION TimelineChart
const TimelineChart = (props) => {
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
  let updatedProps = configureDefaults(props)
  console.log(props)
  // NOTE // formatItems contains the bulk of the logic
  let results = formatItems(updatedProps)
  let formattedItems = results[0]
  let baseRowHeight = results[1]
  // NOTE // adjust the height of the internal components if there are less than 4 rows
  let adjustedChartHeight = getChartHeight(formattedItems)
  const itemModal = updatedProps.itemModal && updatedProps.itemModal.component ? updatedProps.itemModal.component : ''
  const modalProps = updatedProps.itemModal && updatedProps.itemModal.modalProps ? updatedProps.itemModal.modalProps : ''

  const chartHeight = updatedProps.chartHeight ? updatedProps.chartHeight : '100%'
  const chartWidth = updatedProps.chartWidth ? updatedProps.chartWidth : '100%'

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
            props={updatedProps}
            formattedItems={_.cloneDeep(formattedItems)}
            baseRowHeight={baseRowHeight}
            hover={{html: hoverHtml, setHover: setHtmlString, hoverKey: hoverKey, setHoverKey: setItemKey}}
            modal={{toggle: modalToggle, setToggle: toggleModal, setItem: setModalItem}}
          />
        </Grid>
        <Grid item style={{height: '10%', borderTop: '1px solid black', width: '5%'}}></Grid>
        <Grid item style={{height: '10%', width: '95%'}}>
          <HAxis props={updatedProps} />
        </Grid>
      </Grid>
      {/* {props.legendItems ? <Legend legendItems={legendItems}/> : <div></div>} */}
    </Grid>
  )
}

export default TimelineChart
// !SECTION