import React, {useState, useEffect, useRef} from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Grid } from '@mui/material'
import TimelineChart from "../timeline/main";
import testItems from "./testItems.json"

const MainDisplay = (props) => {
  // const ref = useRef(0)

  const formatAppointments = (aptsArr) => {
    for (let i = 0; i < aptsArr.length; i++) {
      let apt = aptsArr[i];
      // console.log('start: ', new Date(apt.appointmentStart).toISOString(), ' end: ', new Date(apt.appointmentEnd).toISOString())
      apt.label = [
        {
          text: [`${apt.visitReason}`],
          styles: [{fontWeight: 'bold'}]
        }
      ]
    }
    return aptsArr
  }

  // TODO // simplify starting chart (add more default options, enable more types for css options)
  // TODO // make it so label has a default using text from label property
  // TODO // fix chartWidth to use pixels or % instead of a number

  return (
    <Grid container item xs={12}>
      <TimelineChart
        items={formatAppointments(testItems)}
        // Nov 29 2022 00:00:00
        timelineDate={1669705200000}
        // timelineStart={6}
        // timelineEnd={14}
        showCurrentTime={true}
        dateItemsLoc={['appointmentStart', 'appointmentEnd']}
        vAxisProp={'name'}
        chartHeight={'600px'}
        chartWidth={1500}
        itemOptions={
          {
            defaultColor: '#9fc5e9',
            // itemStyle: {height: '64px', top: '25%', fontFamily: 'Helvetica'}
            // colorIf: getItemColor,
            // hover: 'hoverHtml'
          }
        }
        labelOptions={
          {
            label: 'label'
          }
        }
        // itemModal = {
        //   {
        //     component: <TestModal />
        //   }
        // }
      />
    </Grid>
  )
}

export default MainDisplay